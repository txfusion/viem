import { afterAll, expect, test, vi } from 'vitest'
import { zkSyncClientLocalNode } from '../../../test/src/zksync.js'
import * as readContract from '../../actions/public/readContract.js'
import { getERC20DefaultBridgeData } from './getERC20DefaultBridgeData.js'

const client = { ...zkSyncClientLocalNode }
const token = '0x5C221E77624690fff6dd741493D735a17716c26B'
const spy = vi.spyOn(readContract, 'readContract').mockResolvedValue(170n)

afterAll(() => {
  spy.mockRestore()
})
test('default', async () => {
  const data = await getERC20DefaultBridgeData(client, token)
  expect(data).toBeDefined()
})
