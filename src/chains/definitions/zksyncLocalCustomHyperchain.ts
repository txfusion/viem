import { defineChain } from '../../utils/chain/defineChain.js'
import { chainConfig } from '../../zksync/chainConfig.js'

export const zksyncLocalCustomHyperchain = /*#__PURE__*/ defineChain({
  ...chainConfig,
  id: 272,
  name: 'zkSync CLI Local Custom Hyperchain',
  network: 'zksync-cli-local-hyperchain',
  nativeCurrency: { name: 'BAT', symbol: 'BAT', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://localhost:15200'],
    },
  },
  testnet: true,
})
