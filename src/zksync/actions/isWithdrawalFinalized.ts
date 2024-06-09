import type { Address } from 'abitype'
import { readContract } from '../../actions/index.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import { l1SharedBridgeAbi } from '../constants/abis.js'

export type IsWithdrawalFinalizedParameters = {
  chainId: bigint
  logL1BatchNumber: bigint
  proofId: bigint
  l1BridgeAddress: Address
}

export async function isWithdrawalFinalized<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  clientL1: Client<Transport, TChain, TAccount>,
  parameters: IsWithdrawalFinalizedParameters,
): Promise<any> {
  return await readContract(clientL1, {
    abi: l1SharedBridgeAbi,
    functionName: 'isWithdrawalFinalized',
    args: [parameters.chainId, parameters.logL1BatchNumber, parameters.proofId],
    address: parameters.l1BridgeAddress,
  })
}
