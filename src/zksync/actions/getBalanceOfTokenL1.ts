import type { Address } from '../../accounts/index.js'
import { readContract } from '../../actions/index.js'
import type { Client } from '../../clients/createClient.js'
import type { Transport } from '../../clients/transports/createTransport.js'
import { erc20Abi } from '../../constants/abis.js'
import type { Account } from '../../types/account.js'
import type { Chain } from '../../types/chain.js'
import { parseAccount } from '../../utils/accounts.js'
import type { BalanceL1Parameters } from './getBalanceL1.js'

export type BalanceOfTokenL1Parameters<
  TAccount extends Account | undefined = Account | undefined,
  TToken extends Address | undefined = Address | undefined,
  TRequired extends boolean = true,
> = BalanceL1Parameters<TAccount, TToken, TRequired>

export async function getBalanceOfTokenL1<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TToken extends Address | undefined = Address | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  parameters: BalanceOfTokenL1Parameters<TAccount, TToken, true>,
): Promise<bigint> {
  const {
    token,
    blockTag,
    account: account_,
  } = parameters as BalanceOfTokenL1Parameters<TAccount>

  const account = account_ ? parseAccount(account_) : client.account

  return await readContract(client, {
    abi: erc20Abi,
    address: token!,
    functionName: 'balanceOf',
    args: [account!.address],
    blockTag: blockTag,
  })
}