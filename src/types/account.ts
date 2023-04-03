import type { Address } from 'abitype'
import type { Account, JsonRpcAccount } from '../accounts'
import type { IsUndefined } from './utils'

export type {
  Account,
  AccountSource,
  CustomSource,
  HDAccount,
  HDKey,
  HDOptions,
  JsonRpcAccount,
  LocalAccount,
  PrivateKeyAccount,
} from '../accounts'

export type GetAccountParameter<
  TAccount extends Account | undefined = Account | undefined,
> = IsUndefined<TAccount> extends true
  ? { account: Account | Address }
  : { account?: Account | Address }

export type ParseAccount<TAccount extends Account | Address | undefined> =
  | (TAccount extends Account ? TAccount : never)
  | (TAccount extends Address ? JsonRpcAccount : never)
  | (TAccount extends undefined ? undefined : never)
