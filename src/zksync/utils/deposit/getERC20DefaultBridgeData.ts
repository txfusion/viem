import type { Address } from 'abitype'
import type { Client } from '../../../clients/createClient.js'
import type { Transport } from '../../../clients/transports/createTransport.js'
import type { Account } from '../../../types/account.js'
import type { Chain } from '../../../types/chain.js'
import type { Hex } from '../../../types/misc.js'
import { isAddressEqualLite } from '../../../utils/address/isAddressEqualLite.js'
import { encodeAbiParameters } from '../../../utils/index.js'
import { getErc20ContractValue } from '../../actions/getErc20ContractValue.js'
import {
  ethAddressInContracts,
  legacyEthAddress,
} from '../../constants/address.js'

export type GetERC20DefaultBridgeDataParameters = {
  l1TokenAddress: Address
}

export type GetERC20DefaultBridgeDataReturnType = Hex

export async function getERC20DefaultBridgeData<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
>(
  clientL1: Client<Transport, TChain, TAccount>,
  parameters: GetERC20DefaultBridgeDataParameters,
): Promise<GetERC20DefaultBridgeDataReturnType> {
  let tokenAddress = parameters.l1TokenAddress

  if (isAddressEqualLite(tokenAddress, legacyEthAddress)) {
    tokenAddress = ethAddressInContracts
  }

  const name = isAddressEqualLite(tokenAddress, ethAddressInContracts)
    ? 'Ether'
    : await getErc20ContractValue(clientL1, {
        l1TokenAddress: tokenAddress,
        functionName: 'name',
      })

  const symbol = isAddressEqualLite(tokenAddress, ethAddressInContracts)
    ? 'ETH'
    : await getErc20ContractValue(clientL1, {
        l1TokenAddress: tokenAddress,
        functionName: 'symbol',
      })

  const decimals = isAddressEqualLite(tokenAddress, ethAddressInContracts)
    ? 18n
    : BigInt(
        await getErc20ContractValue(clientL1, {
          l1TokenAddress: tokenAddress,
          functionName: 'decimals',
        }),
      )

  const nameBytes = encodeAbiParameters([{ type: 'string' }], [name])
  const symbolBytes = encodeAbiParameters([{ type: 'string' }], [symbol])
  const decimalsBytes = encodeAbiParameters([{ type: 'uint256' }], [decimals])

  return encodeAbiParameters(
    [{ type: 'bytes' }, { type: 'bytes' }, { type: 'bytes' }],
    [nameBytes, symbolBytes, decimalsBytes],
  )
}