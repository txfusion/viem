import { chainConfig } from '~viem/zksync/chainConfig.js'
import { defineChain } from '../utils.js'

export const zkSyncLocalNodeL1 = /*#__PURE__*/ defineChain({
  ...chainConfig,
  id: 9,
  name: 'zkSync CLI Local Node L1',
  network: 'zksync-cli-local-node',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
  },
  testnet: true,
})
