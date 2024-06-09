import type { Address } from 'abitype'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import type { Hash, Hex } from '../../types/misc.js'
import { decodeAbiParameters, slice } from '../../utils/index.js'
import type { ZkSyncLog } from '../types/log.js'
import type { MessageProof } from '../types/proof.js'
import { isBaseToken } from '../utils/isBaseToken.js'
import { getDefaultBridgeAddresses } from './getDefaultBridgeAddresses.js'
import { getLogProof } from './getLogProof.js'
import { getWithdrawalL2ToL1Log } from './getWithdrawalL2ToL1Log.js'
import { getWithdrawalLog } from './getWithdrawalLog.js'

export type IsWithdrawalFinalizedParameters = {
  hash: Hash
  index: number
  l1BridgeAddress: Address
}

export type IsWithdrawalFinalizedReturnType = {
  log: ZkSyncLog
  l2ToL1LogIndex: number
  proof: MessageProof
  sharedBridgeAddress: Address
  sender: Address
  message: Hex
  l1BatchTxId: bigint
}

export async function getL2WithdawalLogData<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  clientL2: Client<Transport, TChain, TAccount>,
  parameters: IsWithdrawalFinalizedParameters,
): Promise<IsWithdrawalFinalizedReturnType> {
  const { log, l1BatchTxId } = await getWithdrawalLog(clientL2, {
    withdrawalHash: parameters.hash,
    index: parameters.index,
  })
  const { l2ToL1LogIndex } = await getWithdrawalL2ToL1Log(clientL2, {
    withdrawalHash: parameters.hash,
    index: parameters.index,
  })

  const proof = await getLogProof(clientL2, {
    txHash: parameters.hash,
    index: l2ToL1LogIndex,
  })

  if (!proof) {
    throw new Error('Log proof not found!')
  }

  const sender = slice(log.topics[1]!, 12) as Address

  const isBase = await isBaseToken(clientL2, { token: sender })

  const bridgeAddresses = await getDefaultBridgeAddresses(clientL2)

  let sharedBridgeAddress: Address | undefined = undefined
  if (isBase) {
    sharedBridgeAddress = bridgeAddresses.sharedL1
  }

  const message = decodeAbiParameters([{ type: 'bytes' }], log.data)[0]

  return {
    log,
    l2ToL1LogIndex,
    proof,
    sharedBridgeAddress: sharedBridgeAddress ?? parameters.l1BridgeAddress,
    sender,
    message,
    l1BatchTxId,
  }
}
