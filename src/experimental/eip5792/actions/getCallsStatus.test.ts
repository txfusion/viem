import { expect, test } from 'vitest'
import { anvilMainnet } from '../../../../test/src/anvil.js'
import { accounts } from '../../../../test/src/constants.js'
import { mine } from '../../../actions/index.js'
import { mainnet } from '../../../chains/index.js'
import { createClient } from '../../../clients/createClient.js'
import { custom } from '../../../clients/transports/custom.js'
import { RpcRequestError } from '../../../errors/request.js'
import type { WalletCallReceipt } from '../../../types/eip1193.js'
import type { Hex } from '../../../types/misc.js'
import { getHttpRpcClient, parseEther } from '../../../utils/index.js'
import { uid } from '../../../utils/uid.js'
import { getCallsStatus } from './getCallsStatus.js'
import { sendCalls } from './sendCalls.js'

const testClient = anvilMainnet.getClient()

type Uid = string
type TxHashes = Hex[]
const calls = new Map<Uid, TxHashes[]>()

const getClient = ({
  onRequest,
}: { onRequest({ method, params }: any): void }) =>
  createClient({
    transport: custom({
      async request({ method, params }) {
        onRequest({ method, params })

        const rpcClient = getHttpRpcClient(anvilMainnet.rpcUrl.http)

        if (method === 'wallet_getCallsStatus') {
          const hashes = calls.get(params[0])
          if (!hashes) return null
          const receipts = await Promise.all(
            hashes.map(async (hash) => {
              const { result, error } = await rpcClient.request({
                body: {
                  method: 'eth_getTransactionReceipt',
                  params: [hash],
                  id: 0,
                },
              })
              if (error)
                throw new RpcRequestError({
                  body: { method, params },
                  error,
                  url: anvilMainnet.rpcUrl.http,
                })
              return {
                blockHash: result.blockHash,
                blockNumber: result.blockNumber,
                gasUsed: result.gasUsed,
                logs: result.logs,
                status: result.status,
                transactionHash: result.transactionHash,
              } satisfies WalletCallReceipt
            }),
          )
          return { status: 'CONFIRMED', receipts }
        }

        if (method === 'wallet_sendCalls') {
          const hashes = []
          for (const call of params[0].calls) {
            const { result, error } = await rpcClient.request({
              body: {
                method: 'eth_sendTransaction',
                params: [call],
                id: 0,
              },
            })
            if (error)
              throw new RpcRequestError({
                body: { method, params },
                error,
                url: anvilMainnet.rpcUrl.http,
              })
            hashes.push(result)
          }
          const uid_ = uid()
          calls.set(uid_, hashes)
          return uid_
        }

        return null
      },
    }),
  })

test('default', async () => {
  const requests: unknown[] = []

  const client = getClient({
    onRequest({ params }) {
      requests.push(params)
    },
  })

  const id = await sendCalls(client, {
    account: accounts[0].address,
    calls: [
      {
        to: accounts[1].address,
        value: parseEther('1'),
      },
      {
        to: accounts[2].address,
      },
      {
        data: '0xcafebabe',
        to: accounts[3].address,
        value: parseEther('100'),
      },
    ],
    chain: mainnet,
  })

  expect(id).toBeDefined()

  await mine(testClient, { blocks: 1 })

  const { status, receipts } = await getCallsStatus(client, { id })
  expect(status).toMatchInlineSnapshot(`"CONFIRMED"`)
  expect(receipts![0].blockHash).toBeDefined()
  expect(
    receipts?.map((x) => ({ ...x, blockHash: undefined })),
  ).toMatchInlineSnapshot(`
    [
      {
        "blockHash": undefined,
        "blockNumber": 19808251n,
        "gasUsed": 21000n,
        "logs": [],
        "status": "success",
        "transactionHash": "0x7d9298348068dfebaf342330ed23b514062eecd54a3fc099dee2ff02c1270a4f",
      },
      {
        "blockHash": undefined,
        "blockNumber": 19808251n,
        "gasUsed": 21000n,
        "logs": [],
        "status": "success",
        "transactionHash": "0x3d51245022fbdcd373b690fce6a2c6b24a9b1ef6f417402c0876a9d526d14b22",
      },
      {
        "blockHash": undefined,
        "blockNumber": 19808251n,
        "gasUsed": 21064n,
        "logs": [],
        "status": "success",
        "transactionHash": "0xa25ecff28ff38ba36fee9f63eee72a84551d1a502407c92b7f00fd76d071ff85",
      },
    ]
  `)
})
