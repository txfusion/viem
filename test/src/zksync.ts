import { zkSyncLocalNode, zkSyncLocalNodeL1 } from '~viem/chains/index.js'
import { createClient } from '~viem/clients/createClient.js'
import {
  http,
  type Address,
  type FeeValuesEIP1559,
  type Hex,
  zeroAddress,
} from '~viem/index.js'
import type { GetProtocolVersionReturnType } from '~viem/zksync/actions/getProtocolVersion.js'
import type { GetL2GasLimitParameters } from '~viem/zksync/index.js'
import type {
  DepositTransactionExtended,
  Overrides,
} from '~viem/zksync/types/deposit.js'
import { accounts } from './constants.js'

export const zkSyncClientLocalNode = createClient({
  chain: zkSyncLocalNode,
  transport: http(),
})

export const zkSyncClientLocalNodeWithAccount = createClient({
  account: accounts[0].address,
  chain: zkSyncLocalNode,
  transport: http(),
})

export const zkSyncClientLocalNodeL1 = createClient({
  chain: zkSyncLocalNodeL1,
  transport: http(),
})

export const zkSyncClientLocalNodeWithAccountL1 = createClient({
  account: accounts[0].address,
  chain: zkSyncLocalNodeL1,
  transport: http(),
})

export function getZksyncMockProvider(
  request: ({
    method,
    params,
  }: { method: string; params?: unknown }) => Promise<any>,
) {
  return {
    on: () => null,
    removeListener: () => null,
    request: ({ method, params }: any) => request({ method, params }),
  }
}

export const mockedL1BatchNumber = '0x2012'

export const mockFeeValues = {
  gas_limit: '0x2803d',
  gas_per_pubdata_limit: '0x42',
  max_fee_per_gas: '0xee6b280',
  max_priority_fee_per_gas: '0x0',
}

export const mockAccountBalances = {
  '0x0000000000000000000000000000000000000000': '1000000000000000000',
  '0x0000000000000000000000000000000000000001': '2000000000000000000',
  '0x0000000000000000000000000000000000000002': '3500000000000000000',
}

export const mockHash =
  '0x46e8467700e3f3b96120864cdef76a01e50839434843a9e5d56d57a7f9460b53'

export const mockBaseTokenL1Address =
  '0x0000000000000000000000000000000000000000'

export const mockBlockDetails = {
  number: 0,
  timestamp: 1713435780,
  l1BatchNumber: 0,
  l1TxCount: 2,
  l2TxCount: 3,
  status: 'verified',
  baseSystemContractsHashes: {
    bootloader:
      '0x010008bb22aea1e22373cb8d807b15c67eedd65523e9cba4cc556adfa504f7b8',
    default_aa:
      '0x010008bb22aea1e22373cb8d807b15c67eedd65523e9cba4cc556adfa504f7b8',
  },
  operatorAddress: '0xde03a0b5963f75f1c8485b355ff6d30f3093bde7',
  protocolVersion: 'Version19',
}

export const getL2GasLimitMockData: GetL2GasLimitParameters = {
  depositTransaction: {
    token: '0x70a0F165d6f8054d0d0CF8dFd4DD2005f0AF6B55',
    amount: 5n,
    to: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049',
    refundRecipient: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049',
    approveERC20: true,
    approveOverrides: {} as Overrides,
    approveBaseOverrides: {} as Overrides,
    eRC20DefaultBridgeData:
      '0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000034441490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003444149000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000012',
    operatorTip: 0n,
    overrides: {
      from: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049',
      gasLimit: 2234103n,
    } as Overrides,
    gasPerPubdataByte: 800n,
    bridgehubContractAddress: '0x6ee1e6a16d5c93de0cc8ce803682082440f7c568',
    l2ChainId: 270n,
    bridgeAddresses: {
      erc20L1: '0x8080e7c8cf9713b767891a070744962e22fd3fbd',
      sharedL1: '0xdbedff7f37db0e03a77330b191a9873ca9ab2ddb',
      sharedL2: '0xb0f696622f7415b0415970ecd184bedd39ce50cc',
    },
  },
  erc20DefaultBridgeData:
    '0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000034441490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003444149000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000012',
}

export const mockAddress = '0x173999892363ba18c9dc60f8c57152fc914bce89'

export const mockIsWithdrawalFinalized = {
  chainId: 270n,
  logL1BatchNumber: 2n,
  proofId: 1n,
  l1BridgeAddress: mockAddress as Address,
}
export const mockWithdrawTx = {
  token: zeroAddress as Address,
  amount: 1n,
  to: mockAddress as Address,
  from: mockAddress as Address,
}

export const mockAddresses = {
  l1SharedDefaultBridge: '0x648afeaf09a3db988ac41b786001235bbdbc7640',
  l2SharedDefaultBridge: '0xfd61c893b903fa133908ce83dfef67c4c2350dd8',
  l1Erc20DefaultBridge: '0xbe270c78209cfda84310230aaa82e18936310b2e',
  l2Erc20DefaultBridge: '0xfc073319977e314f251eae6ae6be76b0b3baeecf',
  l1WethBridge: '0x5e6d086f5ec079adff4fb3774cdf3e8d6a34f7e9',
  l2WethBridge: '0x5e6d086f5ec079adff4fb3774cdf3e8d6a34f7e9',
}

export const mockRange = [0, 5]

export const mockDetails = {
  number: 0,
  timestamp: 0,
  l1TxCount: 0,
  l2TxCount: 0,
  l1BatchNumber: 0,
  status: 'verified',
  l1GasPrice: 0,
  l2FairGasPrice: 0,
  baseSystemContractsHashes: {
    bootloader:
      '0x010008bb22aea1e22373cb8d807b15c67eedd65523e9cba4cc556adfa504f7b8',
    default_aa:
      '0x01000563a7f32f1d97b4697f3bc996132433314b9b17351a7f7cd6073f618569',
  },
}

export const mockChainId = '0x9'

export const mockProofValues = {
  id: 112,
  proof: [
    '0x3d999d6a5bacdc5c8c01ad0917c1dca03c632fc486ac623a8857804374b0d1b1',
    '0xc3d03eebfd83049991ea3d3e358b6712e7aa2e2e63dc2d4b438987cec28ac8d0',
    '0xe3697c7f33c31a9b0f0aeb8542287d0d21e8c4cf82163d0c44c7a98aa11aa111',
    '0x199cc5812543ddceeddd0fc82807646a4899444240db2c0d2f20c3cceb5f51fa',
    '0xe4733f281f18ba3ea8775dd62d2fcd84011c8c938f16ea5790fd29a03bf8db89',
    '0x1798a1fd9c8fbb818c98cff190daa7cc10b6e5ac9716b4a2649f7c2ebcef2272',
    '0x66d7c5983afe44cf15ea8cf565b34c6c31ff0cb4dd744524f7842b942d08770d',
    '0xb04e5ee349086985f74b73971ce9dfe76bbed95c84906c5dffd96504e1e5396c',
    '0xac506ecb5465659b3a927143f6d724f91d8d9c4bdb2463aee111d9aa869874db',
    '0x124b05ec272cecd7538fdafe53b6628d31188ffb6f345139aac3c3c1fd2e470f',
    '0xc3be9cbd19304d84cca3d045e06b8db3acd68c304fc9cd4cbffe6d18036cb13f',
  ],
  root: '0x443ddd5b010069db588a5f21e9145f94a93dd8109c72cc70d79281f1c19db2c8',
}

export const mockMainContractAddress =
  '0x9fab5aec650f1ce6e35ec60a611af0a1345927c8'

export const mockRawBlockTransaction = [
  {
    common_data: {
      L1: {
        sender: '0xde03a0b5963f75f1c8485b355ff6d30f3093bde7',
        serialId: 0,
        deadlineBlock: 0,
        layer2TipFee: '0x0',
        fullFee: '0x0',
        maxFeePerGas: '0x1dcd6500',
        gasLimit: '0x44aa200',
        gasPerPubdataLimit: '0x320',
        opProcessingType: 'Common',
        priorityQueueType: 'Deque',
        ethHash:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        ethBlock: 125,
        canonicalTxHash:
          '0x9376f805ccd40186a73672a4d0db064060956e70c4ae486ab205291986439343',
        toMint: '0x7fe5cf2bea0000',
        refundRecipient: '0xde03a0b5963f75f1c8485b355ff6d30f3093bde7',
      },
      L2: {
        nonce: 0,
        fee: {
          gas_limit: '0x2803d',
          gas_per_pubdata_limit: '0x42',
          max_fee_per_gas: '0xee6b280',
          max_priority_fee_per_gas: '0x0',
        },
        initiatorAddress: '0x000000000000000000000000000000000000800b',
        signature: new Uint8Array(),
        transactionType: 'ProtocolUpgrade',
        input: {
          hash: '0x',
          data: new Uint8Array(),
        },
        paymasterParams: {
          paymaster: '0x0a67078A35745947A37A552174aFe724D8180c25',
          paymasterInput: new Uint8Array(),
        },
      },
    },
    execute: {
      calldata:
        '0xef0e2ff4000000000000000000000000000000000000000000000000000000000000010e',
      contractAddress: '0x000000000000000000000000000000000000800b',
      factoryDeps: '0x',
      value: BigInt(0),
    },
    received_timestamp_ms: 1713436617435,
    raw_bytes: '',
  },
]

export const mockTestnetPaymasterAddress =
  '0x0a67078A35745947A37A552174aFe724D8180c25'

export const mockTransactionDetails = {
  isL1Originated: true,
  status: 'validated',
  fee: 10n,
  gasPerPubdata: 50000n,
  initiatorAddress: '0x000000000000000000000000000000000000800b',
  receivedAt: new Date(1713436617435),
}

export const mockDepositSpecification: DepositTransactionExtended & {
  fees: FeeValuesEIP1559
} = {
  bridgehubContractAddress: mockAddress,
  l2ChainId: 270n,
  token: '0x70a0F165d6f8054d0d0CF8dFd4DD2005f0AF6B55',
  amount: 5n,
  to: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049',
  refundRecipient: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049',
  approveERC20: true,
  approveOverrides: {} as Overrides,
  approveBaseOverrides: {} as Overrides,
  eRC20DefaultBridgeData:
    '0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000034441490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003444149000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000012',
  fees: {
    maxFeePerGas: 15000000100n,
    maxPriorityFeePerGas: 150000000000n,
  },
}

export const mockDepositTransactionExtended: DepositTransactionExtended = {
  token: '0x70a0F165d6f8054d0d0CF8dFd4DD2005f0AF6B55',
  amount: 5n,
  to: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049',
  refundRecipient: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049',
  approveERC20: true,
  approveOverrides: {} as Overrides,
  approveBaseOverrides: {} as Overrides,
  eRC20DefaultBridgeData:
    '0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000034441490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003444149000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000012',
  operatorTip: 0n,
  overrides: {
    from: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049',
    maxFeePerGas: 15000000100n,
    gasLimit: 223323223n,
    maxPriorityFeePerGas: 150000000000n,
  },
  gasPerPubdataByte: 800n,
  bridgehubContractAddress: '0x3c150b7a52cc2ede5fbf7bf7a2e1746776ffef21',
  l2ChainId: 270n,
  bridgeAddresses: {
    erc20L1: '0x36f0f627400fd4b688048dcc03b400323e2e0122',
    sharedL1: '0x85a70c1ea10e1e0aefdbf4dc846c022e160a3b30',
    sharedL2: '0x76b389fdc2234afc8be046a75c39f555e0d2ce50',
  },
  l2GasLimit: 233554123n,
}

export const mockedGasEstimation = 123456789n

export const mockTransactionReceipt = {
  transactionHash:
    '0xd6f3a9ddeb34ed805b1d04c75e95651cc8ebe4ce7d6f8d1e86191417fe578bae',
  transactionIndex: 0,
  blockHash:
    '0xae34f7e70d90342688299d2db834c28863ddfd27e66f01be4c5dcd61dcf18ef6',
  blockNumber: 7n,
  l1BatchTxIndex: 0n,
  l1BatchNumber: 4n,
  from: '0x36615cf349d7f6344891b1e7ca7c72883f5dc049',
  to: '0x000000000000000000000000000000000000800a',
  cumulativeGasUsed: 0n,
  gasUsed: 220407n,
  contractAddress: null,
  logs: [
    {
      address: '0x000000000000000000000000000000000000800a',
      topics: [Array],
      data: '0x00000000000000000000000000000000000000000000000000001cad2d9a3200',
      blockHash:
        '0xae34f7e70d90342688299d2db834c28863ddfd27e66f01be4c5dcd61dcf18ef6',
      blockNumber: 7n,
      l1BatchNumber: 4n,
      transactionHash:
        '0xd6f3a9ddeb34ed805b1d04c75e95651cc8ebe4ce7d6f8d1e86191417fe578bae',
      transactionIndex: 0,
      logIndex: 0,
      transactionLogIndex: 0,
      logType: null,
      removed: false,
    },
    {
      address: '0x000000000000000000000000000000000000800a',
      topics: [Array],
      data: '0x000000000000000000000000000000000000000000000000000004c78799b300',
      blockHash:
        '0xae34f7e70d90342688299d2db834c28863ddfd27e66f01be4c5dcd61dcf18ef6',
      blockNumber: 7n,
      l1BatchNumber: 4n,
      transactionHash:
        '0xd6f3a9ddeb34ed805b1d04c75e95651cc8ebe4ce7d6f8d1e86191417fe578bae',
      transactionIndex: 0,
      logIndex: 1,
      transactionLogIndex: 1,
      logType: null,
      removed: false,
    },
    {
      address: '0x000000000000000000000000000000000000800a',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000000000000000000001',
      blockHash:
        '0xae34f7e70d90342688299d2db834c28863ddfd27e66f01be4c5dcd61dcf18ef6',
      blockNumber: 7n,
      l1BatchNumber: 4n,
      transactionHash:
        '0xd6f3a9ddeb34ed805b1d04c75e95651cc8ebe4ce7d6f8d1e86191417fe578bae',
      transactionIndex: 0,
      logIndex: 2,
      transactionLogIndex: 2,
      logType: null,
      removed: false,
    },
    {
      address: '0x0000000000000000000000000000000000008008',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008008000000000000000000000000000000000000000000000000000000000000800a45dd73c9e5194b7eb37037beda4171fe761e85d4149a083acd48061ef1ea14ae',
      blockHash:
        '0xae34f7e70d90342688299d2db834c28863ddfd27e66f01be4c5dcd61dcf18ef6',
      blockNumber: 7n,
      l1BatchNumber: 4n,
      transactionHash:
        '0xd6f3a9ddeb34ed805b1d04c75e95651cc8ebe4ce7d6f8d1e86191417fe578bae',
      transactionIndex: 0,
      logIndex: 3,
      transactionLogIndex: 3,
      logType: null,
      removed: false,
    },
    {
      address: '0x0000000000000000000000000000000000008008',
      topics: [Array],
      data: '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000386c0960f936615cf349d7f6344891b1e7ca7c72883f5dc04900000000000000000000000000000000000000000000000000000000000000010000000000000000',
      blockHash:
        '0xae34f7e70d90342688299d2db834c28863ddfd27e66f01be4c5dcd61dcf18ef6',
      blockNumber: 7n,
      l1BatchNumber: 4n,
      transactionHash:
        '0xd6f3a9ddeb34ed805b1d04c75e95651cc8ebe4ce7d6f8d1e86191417fe578bae',
      transactionIndex: 0,
      logIndex: 4,
      transactionLogIndex: 4,
      logType: null,
      removed: false,
    },
    {
      address: '0x000000000000000000000000000000000000800a',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000000000000000000001',
      blockHash:
        '0xae34f7e70d90342688299d2db834c28863ddfd27e66f01be4c5dcd61dcf18ef6',
      blockNumber: 7n,
      l1BatchNumber: 4n,
      transactionHash:
        '0xd6f3a9ddeb34ed805b1d04c75e95651cc8ebe4ce7d6f8d1e86191417fe578bae',
      transactionIndex: 0,
      logIndex: 5,
      transactionLogIndex: 5,
      logType: null,
      removed: false,
    },
    {
      address: '0x000000000000000000000000000000000000800a',
      topics: [Array],
      data: '0x000000000000000000000000000000000000000000000000000003d9e5e86800',
      blockHash:
        '0xae34f7e70d90342688299d2db834c28863ddfd27e66f01be4c5dcd61dcf18ef6',
      blockNumber: 7n,
      l1BatchNumber: 4n,
      transactionHash:
        '0xd6f3a9ddeb34ed805b1d04c75e95651cc8ebe4ce7d6f8d1e86191417fe578bae',
      transactionIndex: 0,
      logIndex: 6,
      transactionLogIndex: 6,
      logType: null,
      removed: false,
    },
  ],
  l2ToL1Logs: [
    {
      blockNumber:
        78796022661380546701551694676929027283217048048233045390905312619491818049270n,
      blockHash:
        '0xae34f7e70d90342688299d2db834c28863ddfd27e66f01be4c5dcd61dcf18ef6',
      l1BatchNumber: 4n,
      transactionIndex: 0n,
      shardId: 0n,
      isService: true,
      sender: '0x0000000000000000000000000000000000008008',
      key: '0x000000000000000000000000000000000000000000000000000000000000800a',
      value:
        '0x45dd73c9e5194b7eb37037beda4171fe761e85d4149a083acd48061ef1ea14ae',
      transactionHash:
        '0xd6f3a9ddeb34ed805b1d04c75e95651cc8ebe4ce7d6f8d1e86191417fe578bae',
      logIndex: 0n,
    },
  ],
  status: 'success',
  root: '0xae34f7e70d90342688299d2db834c28863ddfd27e66f01be4c5dcd61dcf18ef6',
  logsBloom:
    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  type: 'eip1559',
  effectiveGasPrice: 100000000n,
}

export const mockBlock = {
  hash: '0xd2c6b75ab85605c61ca2de0cd7c670a53a6ccea6cf18e69701762d0c82754a10',
  parentHash:
    '0xe09bea35398b1fe0ba6bec1533ed3406e3c014c4f5a6a095475caa0a6a3e17bc',
  sha3Uncles:
    '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
  miner: '0x0000000000000000000000000000000000000000',
  stateRoot:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  transactionsRoot:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  receiptsRoot:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  number: 14n,
  l1BatchNumber: 7n,
  gasUsed: 0n,
  gasLimit: 1125899906842624n,
  baseFeePerGas: 100000000n,
  extraData: '0x',
  logsBloom:
    '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  timestamp: 1717510530n,
  l1BatchTimestamp: 1717510529n,
  difficulty: 0n,
  totalDifficulty: 0n,
  sealFields: [],
  uncles: [],
  transactions: [],
  size: 0n,
  mixHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
  nonce: '0x0000000000000000',
  blobGasUsed: undefined,
  excessBlobGas: undefined,
}

export const mockRequestDirectParameters = {
  contractAddress: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049' as Address,
  calldata: '0x' as Hex,
  mintValue: 1689594001422817n,
  l2Value: 1n,
  amount: 1n,
  refundRecipient: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049' as Address,
  token: '0x0000000000000000000000000000000000000001' as Address,
  approveOverrides: {
    gasLimit: 111n,
    from: mockAddress as Address,
  },
  approveBaseOverrides: {
    gasLimit: 111n,
    from: mockAddress as Address,
  },
  eRC20DefaultBridgeData:
    '0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000054574686572000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003455448000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000012',
  to: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049' as Address,
  operatorTip: 0n,
  overrides: {
    from: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049' as Address,
    maxFeePerGas: 150000000100n,
    maxPriorityFeePerGas: 150000000000n,
    value: 1689594001422817n,
    factoryDeps: [],
    gasLimit: 111n,
  },
  gasPerPubdataByte: 800n,
  bridgehubContractAddress:
    '0x2773932f30c98edf27a5f0b7089219fd80300d77' as Address,
  l2ChainId: 270n,
  bridgeAddresses: {
    erc20L1: '0x07c6c7c27408979c830232791ecd159922a01e06' as Address,
    sharedL1: '0x8900ff6d4a61889a04594887788ac3d17288bcbd' as Address,
    sharedL2: '0xbcd2d9977760ba5f419e0f2e9327bac3c13054b5' as Address,
  },
  l2GasLimit: 111112222n,
  baseCost: 1689594001422816n,
}

export const mockRequestTwoBridgesParamters = {
  contractAddress: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049' as Address,
  calldata: '0x' as Hex,
  mintValue: 1915732001613248n,
  l2Value: 0n,
  token: '0x70a0F165d6f8054d0d0CF8dFd4DD2005f0AF6B55' as Address,
  amount: 5n,
  to: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049' as Address,
  refundRecipient: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049' as Address,
  l2GasPerPubdataByteLimit: 800n,
  secondBridgeAddress: mockAddress as Address,
  secondBridgeValue: 0n,
  secondBridgeCalldata: '0x' as Hex,
  approveERC20: true,
  approveOverrides: {
    gasLimit: 111n,
    from: mockAddress as Address,
  },
  approveBaseOverrides: {
    gasLimit: 111n,
    from: mockAddress as Address,
  },
  eRC20DefaultBridgeData:
    '0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000034441490000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003444149000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000012',
  operatorTip: 0n,
  overrides: {
    from: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049' as Address,
    maxFeePerGas: 150000000100n,
    maxPriorityFeePerGas: 150000000000n,
    value: 1915732001613248n,
  },
  gasPerPubdataByte: 800n,
  bridgehubContractAddress:
    '0x2773932f30c98edf27a5f0b7089219fd80300d77' as Address,
  l2ChainId: 270n,
  bridgeAddresses: {
    erc20L1: '0x07c6c7c27408979c830232791ecd159922a01e06' as Address,
    sharedL1: '0x8900ff6d4a61889a04594887788ac3d17288bcbd' as Address,
    sharedL2: '0xbcd2d9977760ba5f419e0f2e9327bac3c13054b5' as Address,
  },
  l2GasLimit: 1111222n,
  baseCost: 1915732001613248n,
  secondBridgeEncodeData: {
    secondBridgeValue: 0n,
    token: '0x70a0F165d6f8054d0d0CF8dFd4DD2005f0AF6B55' as Address,
    amount: 5n,
    to: '0x36615Cf349d7F6344891B1e7CA7C72883F5dc049' as Address,
  },
  txValue: 1915732001613248n,
}

export const mockProtocolVersion: GetProtocolVersionReturnType = {
  version_id: 24,
  timestamp: 0,
  verification_keys_hashes: {
    params: {
      recursion_node_level_vk_hash:
        '0xf520cd5b37e74e19fdb369c8d676a04dce8a19457497ac6686d2bb95d94109c8',
      recursion_leaf_level_vk_hash:
        '0x435202d277dd06ef3c64ddd99fda043fc27c2bd8b7c66882966840202c27f4f6',
      recursion_circuits_set_vks_hash:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
    },
    recursion_scheduler_level_vk_hash:
      '0x1d485be42d712856dfe85b3cf7823f020fa5f83cb41c83f9da307fdc2089beee',
  },
  base_system_contracts: {
    bootloader:
      '0x010008e742608b21bf7eb23c1a9d0602047e3618b464c9b59c0fba3b3d7ab66e',
    default_aa:
      '0x01000563374c277a2c1e34659a2a1e87371bb6d852ce142022d497bfb50b9e32',
  },
  l2_system_upgrade_tx_hash:
    '0x0b198075f23eba8137d7c071e5b9e594a4acabb85dfbd59b4b5dd326a54671ed',
}

export const mockConfirmedTokens = [
  {
    l1Address: '0x0000000000000000000000000000000000000000',
    l2Address: '0x0000000000000000000000000000000000000000',
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
]

export const mockL2ChainId = 270

export const mockSendRawTransactionWithDetailsResult = {
  transactionHash:
    '0x0ed0bb0df12ce61d837eb06b601ac7fde916028eaa7c21d0be4720477fbad6bf',
  storageLogs: [
    {
      address: '0x000000000000000000000000000000000000800b',
      key: '0x7',
      writtenValue: '0x7000000000000000000000000667c10bc',
    },
    {
      address: '0x000000000000000000000000000000000000800b',
      key: '0x6',
      writtenValue: '0x47868c00',
    },
    {
      address: '0x000000000000000000000000000000000000800b',
      key: '0x9',
      writtenValue: '0x15000000000000000000000000667c10bc',
    },
    {
      address: '0x000000000000000000000000000000000000800b',
      key: '0x1f',
      writtenValue:
        '0x3db09803ba6f44c8eb9062daed715e3d1e68c9c4506f01c5c41ebe90083491a5',
    },
    {
      address: '0x000000000000000000000000000000000000800b',
      key: '0xa',
      writtenValue: '0x0',
    },
    {
      address: '0x000000000000000000000000000000000000800b',
      key: '0x10c',
      writtenValue: '0x15000000000000000000000000667c10bc',
    },
    {
      address: '0x000000000000000000000000000000000000800b',
      key: '0xa',
      writtenValue:
        '0xff63ae0bc199292e637cf0da10ddcfb0cc9cff78f825260a59394d006a76fa86',
    },
    {
      address: '0x000000000000000000000000000000000000800b',
      key: '0x110',
      writtenValue: '0x0',
    },
    {
      address: '0x000000000000000000000000000000000000800b',
      key: '0x10f',
      writtenValue: '0xc',
    },
    {
      address: '0x000000000000000000000000000000000000800b',
      key: '0x1',
      writtenValue: '0x8001',
    },
    {
      address: '0x000000000000000000000000000000000000800b',
      key: '0x2',
      writtenValue: '0x47868c00',
    },
    {
      address: '0x0000000000000000000000000000000000008003',
      key: '0xeaa2b2fbf0b42c559059e5e9510edc15755f1c1883f0e41d5ba5f9aea4ac201a',
      writtenValue: '0x20000000000000000000000000000000a',
    },
    {
      address: '0x000000000000000000000000000000000000800a',
      key: '0xeaa2b2fbf0b42c559059e5e9510edc15755f1c1883f0e41d5ba5f9aea4ac201a',
      writtenValue: '0x218ae183621b5f907c0',
    },
    {
      address: '0x000000000000000000000000000000000000800a',
      key: '0x31b66141c575a054316a84da9cf4aa6fe0abd373cab1bf4ac029ffc061aae0da',
      writtenValue: '0xbb0e9abcca00',
    },
    {
      address: '0x000000000000000000000000000000000000800b',
      key: '0x1',
      writtenValue: '0x36615cf349d7f6344891b1e7ca7c72883f5dc049',
    },
    {
      address: '0x000000000000000000000000000000000000800a',
      key: '0xeaa2b2fbf0b42c559059e5e9510edc15755f1c1883f0e41d5ba5f9aea4ac201a',
      writtenValue: '0x218ae18362014bd81c0',
    },
    {
      address: '0x000000000000000000000000000000000000800a',
      key: '0x5fa82dbdc961b74d16d1c6d50b77ffe075ff664e5952c1106c4fd5642349f538',
      writtenValue: '0x4e3b29200',
    },
    {
      address: '0x000000000000000000000000000000000000800b',
      key: '0x1',
      writtenValue: '0x8001',
    },
    {
      address: '0x000000000000000000000000000000000000800a',
      key: '0x31b66141c575a054316a84da9cf4aa6fe0abd373cab1bf4ac029ffc061aae0da',
      writtenValue: '0x19a2b447ca00',
    },
    {
      address: '0x000000000000000000000000000000000000800a',
      key: '0xeaa2b2fbf0b42c559059e5e9510edc15755f1c1883f0e41d5ba5f9aea4ac201a',
      writtenValue: '0x218ae18d78bfb3281c0',
    },
  ],
  events: [
    {
      address: '0x000000000000000000000000000000000000800a',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000000000ad72da479000',
      blockHash: null,
      blockNumber: null,
      l1BatchNumber: '0x7',
      transactionHash:
        '0x0ed0bb0df12ce61d837eb06b601ac7fde916028eaa7c21d0be4720477fbad6bf',
      transactionIndex: '0x0',
      logIndex: null,
      transactionLogIndex: null,
      logType: null,
      removed: false,
    },
    {
      address: '0x000000000000000000000000000000000000800a',
      topics: [Array],
      data: '0x00000000000000000000000000000000000000000000000000000001a13b8600',
      blockHash: null,
      blockNumber: null,
      l1BatchNumber: '0x7',
      transactionHash:
        '0x0ed0bb0df12ce61d837eb06b601ac7fde916028eaa7c21d0be4720477fbad6bf',
      transactionIndex: '0x0',
      logIndex: null,
      transactionLogIndex: null,
      logType: null,
      removed: false,
    },
    {
      address: '0x000000000000000000000000000000000000800a',
      topics: [Array],
      data: '0x0000000000000000000000000000000000000000000000000000a16be6750000',
      blockHash: null,
      blockNumber: null,
      l1BatchNumber: '0x7',
      transactionHash:
        '0x0ed0bb0df12ce61d837eb06b601ac7fde916028eaa7c21d0be4720477fbad6bf',
      transactionIndex: '0x0',
      logIndex: null,
      transactionLogIndex: null,
      logType: null,
      removed: false,
    },
  ],
}

export const mockRequestReturnData = async (method: string) => {
  if (method === 'eth_chainId') return mockL2ChainId
  if (method === 'eth_getTransactionReceipt') return mockTransactionReceipt
  if (method === 'eth_getTransactionReceipt') return mockTransactionReceipt
  if (method === 'eth_getBlockByHash') return mockBlock
  if (method === 'eth_getBlockByNumber') return mockBlock
  if (method === 'eth_sendRawTransaction') return mockHash
  if (method === 'zks_L1ChainId') return mockChainId
  if (method === 'zks_estimateFee') return mockFeeValues
  if (method === 'zks_getAllAccountBalances') return mockAccountBalances
  if (method === 'zks_getBaseTokenL1Address') return mockBaseTokenL1Address
  if (method === 'zks_getBlockDetails') return mockBlockDetails
  if (method === 'zks_getBridgehubContract') return mockAddress
  if (method === 'zks_getBridgeContracts') return mockAddresses
  if (method === 'zks_getL1BatchBlockRange') return mockRange
  if (method === 'zks_getL1BatchDetails') return mockDetails
  if (method === 'zks_getL2ToL1LogProof') return mockProofValues
  if (method === 'zks_getMainContract') return mockMainContractAddress
  if (method === 'zks_getRawBlockTransactions') return mockRawBlockTransaction
  if (method === 'zks_getTestnetPaymaster') return mockTestnetPaymasterAddress
  if (method === 'zks_getTransactionDetails') return mockTransactionDetails
  if (method === 'zks_L1BatchNumber') return mockedL1BatchNumber
  if (method === 'zks_estimateGasL1ToL2') return mockedGasEstimation
  if (method === 'zks_getProtocolVersion') return mockProtocolVersion
  if (method === 'zks_getConfirmedTokens') return mockConfirmedTokens
  if (method === 'zks_sendRawTransactionWithDetailedOutput')
    return mockSendRawTransactionWithDetailsResult
  return undefined
}

export function mockClientPublicActionsL2(client: any) {
  client.request = async ({ method }: any) => {
    return mockRequestReturnData(method)
  }
}
