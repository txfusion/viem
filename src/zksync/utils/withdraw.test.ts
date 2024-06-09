import type { Address } from 'abitype'
import { expect, test } from 'vitest'
import {
  getBalance,
  getTransactionReceipt,
  waitForTransactionReceipt,
} from '~viem/actions/index.js'
import { zeroAddress } from '~viem/constants/address.js'
import { privateKeyToAccount } from '../../accounts/privateKeyToAccount.js'
import {
  zkSyncLocalHyperchain,
  zkSyncLocalHyperchainL1,
  zkSyncLocalHyperchainL3,
} from '../../chains/index.js'
import { createClient } from '../../clients/createClient.js'
import { http } from '../../clients/transports/http.js'
import { getAllBalances } from '../actions/getAllBalances.js'
import { getL1TokenBalance } from '../actions/getL1TokenBalance.js'
import { publicActionsL1 } from '../decorators/publicL1.js'
import { publicActionsL2 } from '../decorators/publicL2.js'
import type { WithdrawTransaction } from '../types/withdraw.js'
import { finalizeWithdrawal } from './finalizeWithdrawal.js'
import { initiateWithdrawal } from './initiateWithdrawal.js'
import { getL2TokenAddress } from './l2TokenAddress.js'
import { waitFinalize } from './waitFinalize.js'

const account = privateKeyToAccount(
  '0x11a886803cd3d49695b838f18ab9697feafd8465dc423c12eb6c3722727a4bba',
)

const clientL1 = createClient({
  chain: zkSyncLocalHyperchainL1,
  transport: http(),
  account,
}).extend(publicActionsL1())

const clientL2 = createClient({
  chain: zkSyncLocalHyperchain,
  transport: http(),
  account,
}).extend(publicActionsL2())

const clientL3 = createClient({
  chain: zkSyncLocalHyperchainL3,
  transport: http(),
  account,
}).extend(publicActionsL2())

test('withdraw - ETH to L1 Network', async () => {
  const amount = 1n

  const withdrawTx: WithdrawTransaction = {
    token: zeroAddress,
    amount: amount,
    to: account.address,
    from: account.address,
  }

  const balanceBefore = await getBalance(clientL2, { address: account.address })

  const hash = await initiateWithdrawal(clientL1, clientL2, withdrawTx)

  await waitFinalize(clientL2, { hash })

  const finalizeWithdrawalHash = await finalizeWithdrawal(clientL1, clientL2, {
    txHash: hash,
  })

  await waitForTransactionReceipt(clientL1, { hash: finalizeWithdrawalHash })

  expect(
    await getTransactionReceipt(clientL1, {
      hash: finalizeWithdrawalHash,
    }),
  ).toBeDefined()

  const balanceAfter = await getBalance(clientL2, { address: account.address })

  expect(balanceBefore - balanceAfter >= amount).to.be.true
})

test('withdraw - DAI to the L1 network', async () => {
  const amount = 5n
  const DAI_L1 = '0x70a0F165d6f8054d0d0CF8dFd4DD2005f0AF6B55' as Address
  const defaultBridges = await clientL3.getDefaultBridgeAddresses()
  const baseToken = await clientL3.getBaseTokenL1Address()

  const l2DaiAddress = await getL2TokenAddress(clientL3, {
    token: DAI_L1,
    sharedL2: defaultBridges.sharedL2,
    baseTokenAddress: baseToken,
  })

  const allBalances = await getAllBalances(clientL3, { account })
  const l2DaiBalance = allBalances[l2DaiAddress.toLowerCase() as Address]
  const l2BalanceBeforeWithdrawal = l2DaiBalance
  const l1BalanceBeforeWithdrawal = await getL1TokenBalance(clientL1, {
    token: DAI_L1,
  })
  const withdrawTx: WithdrawTransaction = {
    token: l2DaiAddress,
    amount: amount,
    to: account.address,
    from: account.address,
  }

  const hash = await initiateWithdrawal(clientL1, clientL3, withdrawTx)

  await waitFinalize(clientL3, { hash })

  const finalizeWithdrawalHash = await finalizeWithdrawal(clientL1, clientL3, {
    txHash: hash,
  })

  await waitForTransactionReceipt(clientL1, { hash: finalizeWithdrawalHash })

  expect(
    await getTransactionReceipt(clientL1, {
      hash: finalizeWithdrawalHash,
    }),
  ).toBeDefined()

  const allBalancesAfter = await getAllBalances(clientL3, { account })
  const l2DaiBalanceAfter =
    allBalancesAfter[l2DaiAddress.toLowerCase() as Address]
  const l2BalanceAfterWithdrawal = l2DaiBalanceAfter
  const l1BalanceAfterWithdrawal = await getL1TokenBalance(clientL1, {
    token: DAI_L1,
  })

  expect(l2BalanceBeforeWithdrawal - l2BalanceAfterWithdrawal).to.be.equal(
    amount,
  )
  expect(l1BalanceAfterWithdrawal - l1BalanceBeforeWithdrawal).to.be.equal(
    amount,
  )
})
