class Workerpool {
  constructor () {
    this.workerPoolSize = navigator.hardwareConcurrency - 1 || 3
    this.pool = [];

  }

}


// let workerPool = []
// const workerPoolSize = navigator.hardwareConcurrency - 1 || 3


//
// for (let i = 0; i < workerPoolSize; i++) {
//   const worker = new Worker()
//   worker.onmessage = buildTileFromWorker
//   workerPool.push(worker)
// }
//
//
// let currentWorker = 0
//
//
// workerPool.postMessage = args => {
//   const worker = workerPool[currentWorker]
//   worker.postMessage(args)
//   currentWorker = currentWorker === workerPoolSize - 1 ? 0 : currentWorker + 1
// }