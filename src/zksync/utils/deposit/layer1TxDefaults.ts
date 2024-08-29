import {
  PriorityOpTree,
  PriorityQueueType,
} from '../../../zksync/types/priorityQueue.js'

export function layer1TxDefaults(): {
  queueType: PriorityQueueType.Deque
  opTree: PriorityOpTree.Full
} {
  return {
    queueType: PriorityQueueType.Deque,
    opTree: PriorityOpTree.Full,
  }
}
