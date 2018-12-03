
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




    // let worker;
    // for(let i = 0; i < this.pool.length ; i++){
    //   worker = this.pool[i];
    //   if(!worker.isbusy){
    //     worker.isbusy = true;
    //     worker.worker.postMessage({tile:args, workernumber:i});
    //     return;
    //   }
    // }
    // setTimeout(() => this.postMessage(args), 100);
    //
    // // this checks in an interval of workerCheckFrequency if worker are dead. If so new worker are added otherwise it starts counting again
    // this.workerCheckFrequency--;
    // if(this.workerCheckFrequency<0){
    //   this.workerCheckFrequency = 3;
    //   while (this.pool.length < this.workerPoolSize) {
    //     console.log('add new Worker to pool')
    //     this.addWorker();
    //   }
    // }

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



/*

Queue.js

A function to represent a queue

Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */


// function Queue() {
//
//   // initialise the queue and offset
//   var queue = [];
//   var offset = 0;
//
//   // Returns the length of the queue.
//   this.getLength = function () {
//     return (queue.length - offset);
//   }
//
//   // Returns true if the queue is empty, and false otherwise.
//   this.isEmpty = function () {
//     return (queue.length == 0);
//   }
//
//   /* Enqueues the specified item. The parameter is:
//    *
//    * item - the item to enqueue
//    */
//   this.enqueue = function (item) {
//     queue.push(item);
//   }
//
//   /* Dequeues an item and returns it. If the queue is empty, the value
//    * 'undefined' is returned.
//    */
//   this.dequeue = function () {
//
//     // if the queue is empty, return immediately
//     if (queue.length == 0) return undefined;
//
//     // store the item at the front of the queue
//     var item = queue[offset];
//
//     // increment the offset and remove the free space if necessary
//     if (++offset * 2 >= queue.length) {
//       queue = queue.slice(offset);
//       offset = 0;
//     }
//
//     // return the dequeued item
//     return item;
//
//   }
//
//   /* Returns the item at the front of the queue (without dequeuing it). If the
//    * queue is empty then undefined is returned.
//    */
//   this.peek = function () {
//     return (queue.length > 0 ? queue[offset] : undefined);
//   }
// }

// start(){
//   setInterval(() =>{
//     if(!this.queue.isEmpty()){
//       console.log('not empty')
//
//     }else {
//       console.log('empty')
//     }
//
//   }, 100);
// }












































    // const worker = this.pool[this.currentWorker];
    // worker.postMessage({tile:args, workernumber:i});
    //
    // this.currentWorker = this.currentWorker === this.workerPoolSize - 1 ? 0 : this.currentWorker + 1;

    //
    // const messageObject = {tile :args, workernumber: this.currentWorker};

    // console.log('post something to worker nummer: ' + this.currentWorker);
    // worker.addEventListener('message', (e) => callback(e), false);
    //
    // worker.postMessage(messageObject);
    // this.currentWorker = this.currentWorker === this.workerPoolSize - 1 ? 0 : this.currentWorker + 1;

    // const id = setInterval( () => {
    //   for (let [key, value] of this.pool2) {
    //     if(!value.isbusy){
    //       value.isbusy = true;
    //       value.worker.addEventListener('message', callback(e), false);
    //       const messageObject = {tile :args, key: key};
    //       value.worker.postMessage(messageObject);
    //       value.workerJob = callback;
    //       clearInterval(id);
    //       break;
    //     }
    //   }
    // }, 50)




  // removeListener(workernumber){
  //
  //   // const worker = this.pool[workernumber];
  //   // console.log(worker)
  //   // worker.removeEventListener('message',function(){}, false);
  //   // console.log('remove listener')
  //
  //
  //   console.log(workernumber)
  //
  // }

  // buildTile(data){
  //
  //   console.log('message from main after worker ' + data)
  //
  //   switch (data.type){
  //
  //     case 'baseTile':
  //       this.addBaseTile(data.type);
  //
  //     case 'dataTile':
  //       this.addDataTile(data.type);
  //
  //     default: console.log('buildTile doesnt know what to do!')
  //
  //   }
  //
  // }
  //
  // addBaseTile(){
  //
  // }
  //
  // addDataTile(){
  //
  // }

}



