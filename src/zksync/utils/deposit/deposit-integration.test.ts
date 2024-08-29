import type { Address } from 'abitype'
import { expect, test } from 'vitest'
import { privateKeyToAccount } from '../../../accounts/privateKeyToAccount.js'
import {
  getBalance,
  getTransactionReceipt,
  readContract,
  sendTransaction,
  waitForTransactionReceipt,
} from '../../../actions/index.js'

import { getBaseToken } from '~viem/zksync/bridge-utils/getBaseToken.js'
import { l2BridgeAbi } from '~viem/zksync/constants/abis.js'
import { zkSyncChainL2 } from '../../../chains/definitions/zkSyncChain:L2.js'
import { zkSyncChainL1 } from '../../../chains/definitions/zkSyncChainL1.js'
import { zkSyncChainL3 } from '../../../chains/definitions/zkSyncChainL3.js'
import { createClient } from '../../../clients/createClient.js'
import { http } from '../../../clients/transports/http.js'
import { getBalanceL1 } from '../../../zksync/bridge-utils/getBalanceL1.js'
import { getL2TokenAddress } from '../../../zksync/bridge-utils/l2TokenAddress.js'
import { getAllBalances } from '../../actions/getAllBalances.js'
import { getBaseTokenL1Address } from '../../actions/getBaseTokenL1Address.js'
import { getL1TokenBalance } from '../../actions/getL1TokenBalance.js'
import { ethAddressInContracts } from '../../constants/address.js'
import { publicActionsL1 } from '../../decorators/publicL1.js'
import { publicActionsL2 } from '../../decorators/publicL2.js'
import { deposit } from './buildDepositTransaction.js'
import { getL2TransactionFromPriorityOp } from './getL2TransactionFromPriorityOp.js'

const account = privateKeyToAccount(
  '0x7726827caac94a7f9e1b160f7ea819f172f7b6f9d2a97f992c38edeab82d4110',
)

const clientL1Hyperchain = createClient({
  chain: zkSyncChainL1,
  transport: http(),
  account,
}).extend(publicActionsL1())

const clientL3Hyperchain = createClient({
  chain: zkSyncChainL3,
  transport: http(),
  account,
}).extend(publicActionsL2())

const clientL1 = createClient({
  chain: zkSyncChainL1,
  transport: http(),
  account,
}).extend(publicActionsL1())

const clientL2 = createClient({
  chain: zkSyncChainL2,
  transport: http(),
  account,
}).extend(publicActionsL2())

test('deposit - BaseTokenToNonEthBasedChain', async () => {
  const baseTokenL1 = await getBaseTokenL1Address(clientL3Hyperchain)
  const amount = 1n
  const walletAddress = account.address

  const tx = {
    token: baseTokenL1,
    to: walletAddress,
    amount: amount,
    approveERC20: true,
    refundRecipient: walletAddress,
  }

  const sendTxParams = await deposit(clientL1Hyperchain, clientL3Hyperchain, tx)

  const l2BalanceBeforeDeposit = await getBalance(clientL3Hyperchain, {
    address: account.address,
  })
  const l1BalanceBeforeDeposit = await clientL1Hyperchain.getL1TokenBalance({
    token: baseTokenL1,
  })

  const hash = await sendTransaction(clientL1Hyperchain, sendTxParams)

  await waitForTransactionReceipt(clientL1Hyperchain, { hash })

  const l1TxReceipt = await getTransactionReceipt(clientL1Hyperchain, { hash })

  expect(
    await getL2TransactionFromPriorityOp(clientL3Hyperchain, {
      l1TransactionReceipt: l1TxReceipt,
    }),
  ).toBeDefined()

  const l2BalanceAfterDeposit = await getBalance(clientL3Hyperchain, {
    address: account.address,
  })
  const l1BalanceAfterDeposit = await clientL1Hyperchain.getL1TokenBalance({
    token: baseTokenL1,
  })

  expect(l2BalanceAfterDeposit - l2BalanceBeforeDeposit >= amount).to.be.true
  expect(l1BalanceBeforeDeposit - l1BalanceAfterDeposit >= 0n).to.be.true
})

test('deposit - NonBaseTokenOnNonETHBasedChain', async () => {
  const DAI_L1 = '0x70a0F165d6f8054d0d0CF8dFd4DD2005f0AF6B55' as Address
  const token = DAI_L1
  const amount = 5n

  const depositParams = {
    token,
    amount,
    refundRecipient: account.address,
    approveBaseERC20: true,
    approveERC20: true,
  }

  const defaultBridges = await clientL3Hyperchain.getDefaultBridgeAddresses()
  const baseToken = await clientL3Hyperchain.getBaseTokenL1Address()

  const l2DaiAddress = await getL2TokenAddress(clientL3Hyperchain, {
    token: DAI_L1,
    sharedL2: defaultBridges.sharedL2,
    baseTokenAddress: baseToken,
  })
  const allBalances = await getAllBalances(clientL3Hyperchain, { account })
  const l2DaiBalance = allBalances[l2DaiAddress.toLowerCase() as Address]
  const l2BalanceBeforeDeposit = l2DaiBalance
  const l1BalanceBeforeDeposit = await getL1TokenBalance(clientL1Hyperchain, {
    token: DAI_L1,
  })

  const txSend = await deposit(
    clientL1Hyperchain,
    clientL3Hyperchain,
    depositParams,
  )

  const hash = await sendTransaction(clientL1Hyperchain, txSend)

  await waitForTransactionReceipt(clientL1Hyperchain, { hash })

  const l1TxReceipt = await getTransactionReceipt(clientL1Hyperchain, {
    hash,
  })

  expect(
    await getL2TransactionFromPriorityOp(clientL3Hyperchain, {
      l1TransactionReceipt: l1TxReceipt,
    }),
  ).toBeDefined()

  const allBalancesAfterDeposit = await getAllBalances(clientL3Hyperchain, {
    account,
  })
  const l2DaiBalanceAfterDeposit =
    allBalancesAfterDeposit[l2DaiAddress.toLowerCase() as Address]
  const l2BalanceAfterDeposit = l2DaiBalanceAfterDeposit
  const l1BalanceAfterDeposit = await getL1TokenBalance(clientL1Hyperchain, {
    token: DAI_L1,
  })

  expect(l2BalanceAfterDeposit - l2BalanceBeforeDeposit >= amount).to.be.true
  expect(l1BalanceBeforeDeposit - l1BalanceAfterDeposit >= amount).to.be.true
})

test('deposit - EthToNonEthBasedChain', async () => {
  const amount = 1n
  const depositParams = {
    token: '0x0000000000000000000000000000000000000000' as Address,
    amount,
    refundRecipient: account.address,
    approveBaseERC20: true,
  }

  const requestL2TransactionTwoBridgesParams = await deposit(
    clientL1Hyperchain,
    clientL3Hyperchain,
    depositParams,
  )

  const bridges = await clientL3Hyperchain.getDefaultBridgeAddresses()

  const l2EthAddress = (await readContract(clientL3Hyperchain, {
    abi: l2BridgeAbi,
    functionName: 'l2TokenAddress',
    address: bridges.sharedL2,
    args: [ethAddressInContracts],
  })) as Address

  const allBalances = await clientL3Hyperchain.getAllBalances({ account })
  const l2BalanceBeforeDeposit =
    allBalances[l2EthAddress.toLowerCase() as Address]
  const l1BalanceBeforeDeposit = await getBalanceL1(clientL1Hyperchain, {
    account,
  })

  const hash = await sendTransaction(
    clientL1Hyperchain,
    requestL2TransactionTwoBridgesParams,
  )

  await waitForTransactionReceipt(clientL1Hyperchain, { hash })

  const l1TxReceipt = await getTransactionReceipt(clientL1Hyperchain, { hash })

  expect(
    await getL2TransactionFromPriorityOp(clientL3Hyperchain, {
      l1TransactionReceipt: l1TxReceipt,
    }),
  ).toBeDefined()

  const allBalancesAfterDeposit = await clientL3Hyperchain.getAllBalances({
    account,
  })
  const l2BalanceAfterDeposit =
    allBalancesAfterDeposit[l2EthAddress.toLowerCase() as Address]
  const l1BalanceAfterDeposit = await getBalanceL1(clientL1Hyperchain, {
    account,
  })

  expect(l2BalanceAfterDeposit - l2BalanceBeforeDeposit >= amount).to.be.true
  expect(l1BalanceBeforeDeposit - l1BalanceAfterDeposit >= amount).to.be.true
})
test('deposit - TokenToETHBasedChain', async () => {
  const DAI_L1 = '0x70a0F165d6f8054d0d0CF8dFd4DD2005f0AF6B55'
  const token = DAI_L1
  const amount = 5n

  const depositTokenArgs = await deposit(clientL1, clientL2, {
    token,
    amount,
    approveERC20: true,
  })

  const hash = await sendTransaction(clientL1, depositTokenArgs)

  await waitForTransactionReceipt(clientL1, { hash })

  const l1TxReceipt = await getTransactionReceipt(clientL1, {
    hash,
  })

  expect(
    await getL2TransactionFromPriorityOp(clientL2, {
      l1TransactionReceipt: l1TxReceipt,
    }),
  ).toBeDefined()
})

test('deposit - ETHToETHBasedChain', async () => {
  const amount = 1n

  const depositArgs = await deposit(clientL1, clientL2, {
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
