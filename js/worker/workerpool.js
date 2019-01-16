
class Workerpool {

  constructor () {
    this.workerPoolSize = this.workerCheckFrequency = navigator.hardwareConcurrency - 1 || 3;
    this.pool = [];

    for (let i = 0; i < this.workerPoolSize; i++) {
      this.addWorker();
    }

    this.currentWorker = 0;

  }

  postMessage(args){

    this.pool[this.currentWorker].worker.postMessage({tile:args, workernumber:1});
    this.currentWorker = this.currentWorker === this.workerPoolSize - 1 ? 0 : this.currentWorker + 1;

    // this checks in an interval of workerCheckFrequency if worker are dead. If so new worker are added otherwise it starts counting again
    // TODO: never really checked this
    this.workerCheckFrequency--;
    if(this.workerCheckFrequency<0){
      this.workerCheckFrequency = 3;
      while (this.pool.length < this.workerPoolSize) {
        console.log('add new Worker to pool')
        this.addWorker();
      }
    }

  }

  addWorker(){

    const workerObj = {worker: new Worker('./js/worker/worker.js'), isbusy:false};
    workerObj.worker.addEventListener('message', (e) => {
      if(map.get().tiles.pool.has(e.data.data.tile.id)){
        map.get().tiles.pool.get(e.data.data.tile.id).receiveData(e.data);
      }
      this.pool[e.data.data.workernumber].isbusy = false;
    }, false);

    this.pool.push(workerObj);

  }

}



