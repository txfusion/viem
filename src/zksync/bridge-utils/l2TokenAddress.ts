import type { Address } from 'abitype'
import { readContract } from '~viem/actions/index.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import { l2BridgeAbi } from '../constants/abis.js'
import {
  ethAddressInContracts,
  l2BaseTokenAddress,
  legacyEthAddress,
} from '../constants/address.js'
import { isAddressEqualLite } from './isAddressEqualLite.js'

export type GetL2TokenAddressParameters = {
  token: Address
  sharedL2: Address
  baseTokenAddress: Address
}

export type GetL2TokenAddressReturnType = Address

export async function getL2TokenAddress<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  clientL1: Client<Transport, TChain, TAccount>,
  parameters: GetL2TokenAddressParameters,
): Promise<GetL2TokenAddressReturnType> {
  if (isAddressEqualLite(parameters.token, legacyEthAddress)) {
    parameters.token = ethAddressInContracts
  }

  if (isAddressEqualLite(parameters.token, parameters.baseTokenAddress)) {
    return l2BaseTokenAddress
  }

  return (await readContract(clientL1, {
    abi: l2BridgeAbi,
    functionName: 'l2TokenAddress',
    address: parameters.sharedL2,
    args: [parameters.token],
  })) as Address
}
