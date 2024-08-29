import { expect, test } from 'vitest'
import { mockAddress } from '~test/src/zksyncPublicActionsL2MockData.js'
import {
  mockClientPublicActionsL2,
  zksyncClientLocalNodeWithAccount,
} from '../../../../test/src/zksync.js'
import { isBaseToken } from './isBaseToken.js'

const client = { ...zksyncClientLocalNodeWithAccount }

mockClientPublicActionsL2(client)

test('default', async () => {
  const isBaseTokenResult = await isBaseToken(client, { token: mockAddress })
  expect(isBaseTokenResult).toBe(false)
})
