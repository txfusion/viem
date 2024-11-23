import { defineChain } from '../../utils/chain/defineChain.js'
import { chainConfig } from '../../zksync/chainConfig.js'

export const zksyncLocalHyperchainL1 = /*#__PURE__*/ defineChain({
  ...chainConfig,
  id: 9,
  name: 'zkSync CLI Local Hyperchain L1',
  network: 'zksync-cli-local-hyperchain-l1',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://localhost:15045'],
    },
  },
  testnet: true,
})
