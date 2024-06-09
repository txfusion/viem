import type { SendTransactionParameters } from '../../actions/index.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import type { Hash } from '../../types/misc.js'
import { encodeFunctionData } from '../../utils/index.js'
import { getDefaultBridgeAddresses } from '../actions/getDefaultBridgeAddresses.js'
import { getL2WithdawalLogData } from '../actions/getL2WithdrawalData.js'
import { l1Bridge } from '../actions/l1Bridge.js'
import { sendTransaction } from '../actions/sendTransaction.js'
import { l1SharedBridgeAbi } from '../constants/abis.js'

export type FinalizeWithdrawalParameters = {
  txHash: Hash
}

export type FinalizeWithdrawalReturnType = Hash

export async function finalizeWithdrawal<
  TChainL1 extends Chain | undefined,
  TChainL2 extends Chain | undefined,
>(
  clientL1: Client<Transport, TChainL1, Account>,
  clientL2: Client<Transport, TChainL2, Account>,
  parameters: FinalizeWithdrawalParameters,
): Promise<FinalizeWithdrawalReturnType> {
  const defaultBridges = await getDefaultBridgeAddresses(clientL2)

  const address = await l1Bridge(clientL2, {
    l2BridgeAddress: defaultBridges.sharedL2,
  })

  const logData = await getL2WithdawalLogData(clientL2, {
    hash: parameters.txHash,
    index: 0,
    l1BridgeAddress: address,
  })

  const data = encodeFunctionData({
    abi: l1SharedBridgeAbi,
    functionName: 'finalizeWithdrawal',
    args: [
      BigInt(clientL2.chain!.id),
      logData.log.l1BatchNumber!,
      BigInt(logData.proof.id), //l2MessageIndex
      Number(logData.l1BatchTxId), //l2TxNumberInBlock
      logData.message,
      logData.proof.proof,
    ],
  })

  const finalizeWithdrawalArgs = {
    value: 0n,
    to: defaultBridges.sharedL1!,
    data: data!,
  } as SendTransactionParameters

  return await sendTransaction(clientL1, finalizeWithdrawalArgs)
}
