import { afterAll, expect, test, vi } from 'vitest'

import { accounts } from '~test/src/constants.js'
import { privateKeyToAccount } from '../../accounts/privateKeyToAccount.js'

import * as readContract from '../../actions/public/readContract.js'
import { sepolia } from '../../chains/index.js'
import { erc20Abi } from '../constants/abis.js'

import { createClient } from '../../clients/createClient.js'
import { createPublicClient } from '../../clients/createPublicClient.js'
import { createWalletClient } from '../../clients/createWalletClient.js'
import { http } from '../../clients/transports/http.js'
import { publicActionsL1 } from '../decorators/publicL1.js'
import { getAllowanceL1 } from './getAllowanceL1.js'

const sourceAccount = accounts[0]
const tokenL1 = '0x5C221E77624690fff6dd741493D735a17716c26B'
const account = privateKeyToAccount(sourceAccount.privateKey)
const spy = vi.spyOn(readContract, 'readContract').mockResolvedValue(170n)

afterAll(() => {
  spy.mockRestore()
})

test('default with account hoisting', async () => {
  const client = createWalletClient({
    chain: sepolia,
    transport: http(),
    account,
  }).extend(publicActionsL1())

  expect(
    await getAllowanceL1(client, {
      token: tokenL1,
      bridgeAddress: '0x84DbCC0B82124bee38e3Ce9a92CdE2f943bab60D',
    }),
  ).toBe(170n)

  expect(spy).toHaveBeenCalledWith(client, {
    abi: erc20Abi,
    address: tokenL1,
    functionName: 'allowance',
    args: [
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      '0x84DbCC0B82124bee38e3Ce9a92CdE2f943bab60D',
    ],
    blockTag: undefined,
  })
})

test('args: blockTag with account hoisting', async () => {
  const client = createClient({
    chain: sepolia,
    transport: http(),
    account,
  }).extend(publicActionsL1())

  expect(
    await getAllowanceL1(client, {
      token: tokenL1,
      bridgeAddress: '0x84DbCC0B82124bee38e3Ce9a92CdE2f943bab60D',
      blockTag: 'finalized',
    }),
  ).toBe(170n)

  expect(spy).toHaveBeenCalledWith(client, {
    abi: erc20Abi,
    address: tokenL1,
    functionName: 'allowance',
    args: [
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      '0x84DbCC0B82124bee38e3Ce9a92CdE2f943bab60D',
    ],
    blockTag: 'finalized',
  })
})

test('default with account provided to the method', async () => {
  const client = createPublicClient({
    chain: sepolia,
    transport: http(),
  }).extend(publicActionsL1())

  expect(
    await getAllowanceL1(client, {
      token: tokenL1,
      bridgeAddress: '0x84DbCC0B82124bee38e3Ce9a92CdE2f943bab60D',
      account,
    }),
  ).toBe(170n)

  expect(spy).toHaveBeenCalledWith(client, {
    abi: erc20Abi,
    address: tokenL1,
    functionName: 'allowance',
    args: [
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      '0x84DbCC0B82124bee38e3Ce9a92CdE2f943bab60D',
    ],
    blockTag: undefined,
  })
})

test('args: blockTag with account provided to the method', async () => {
  const client = createPublicClient({
    chain: sepolia,
    transport: http(),
  }).extend(publicActionsL1())

  expect(
    await getAllowanceL1(client, {
      token: tokenL1,
      bridgeAddress: '0x84DbCC0B82124bee38e3Ce9a92CdE2f943bab60D',
      account,
      blockTag: 'finalized',
    }),
  ).toBe(170n)

  expect(spy).toHaveBeenCalledWith(client, {
    abi: erc20Abi,
    address: tokenL1,
    functionName: 'allowance',
    args: [
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      '0x84DbCC0B82124bee38e3Ce9a92CdE2f943bab60D',
    ],
    blockTag: 'finalized',
  })
})