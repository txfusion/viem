import { expect, test } from 'vitest'
import { zkSyncLocalNodeL1 } from '~viem/chains/definitions/zkSyncLocalNodeL1.js'
import { privateKeyToAccount } from '../../../accounts/privateKeyToAccount.js'
import {
  getTransactionReceipt,
  waitForTransactionReceipt,
} from '../../../actions/index.js'
import { zkSyncLocalNode } from '../../../chains/index.js'
import { createClient } from '../../../clients/createClient.js'
import { http } from '../../../clients/transports/http.js'
import { sendTransaction } from '../../actions/sendTransaction.js'
import { publicActionsL1 } from '../../decorators/publicL1.js'
import { publicActionsL2 } from '../../decorators/publicL2.js'
import { depositEthToEthBasedChain } from './buildDepositEthToEthBasedChainTransaction.js'
import { getL2TransactionFromPriorityOp } from './getL2TransactionFromPriorityOp.js'

const account = privateKeyToAccount(
  '0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110',
)

const clientL1 = createClient({
  chain: zkSyncLocalNodeL1,
  transport: http(),
  account,
}).extend(publicActionsL1())

const clientL2 = createClient({
  chain: zkSyncLocalNode,
  transport: http(),
  account,
}).extend(publicActionsL2())

test('depositETHToETHBasedChain', async () => {
  const amount = 1n

  const depositArgs = await depositEthToEthBasedChain(clientL1, clientL2, {
    amount,
    refundRecipient: account.address,
  })
  const hash = await sendTransaction(clientL1, depositArgs)

  await waitForTransactionReceipt(clientL1, { hash })

  const l1TxReceipt = await getTransactionReceipt(clientL1, { hash })

  expect(
    await getL2TransactionFromPriorityOp(clientL2, {
      l1TransactionReceipt: l1TxReceipt,
    }),
  ).toBeDefined()
})
