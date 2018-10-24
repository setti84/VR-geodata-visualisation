class Camera {

  constructor (latLng) {

    this.originlatLon = latLng;
    this.originMercator = this.originlatLon.wgs2Mercator();
    this.newLatLng = new LatLng(latLng.lat, latLng.lng);
    this.totalPosDelta = new THREE.Vector3();
    this.movementWatcher = new MovementWatcher(this.originlatLon, this.newLatLng);
    const camDom =document.querySelector('#camera');
    camDom.setAttribute('wasd-controls', { acceleration: MOVINGFACTOR });
    camDom.object3D.position.set(camDom.object3D.position.x, CAMERAHEIGHT, camDom.object3D.position.z);
    // this.createDetectionPlane();


  }

  getMovementWatcher(){
    return this.movementWatcher;
  }

  setPosition (positionDelta){
    const temp = Util.unprojectWorldCoordinates(this.newLatLng.wgs2Mercator()[0]+positionDelta.x, this.newLatLng.wgs2Mercator()[1]+positionDelta.z);
    this.newLatLng.setCoords(temp[0], temp[1]);
  }

  getPosition(){
    return this.newLatLng;
  }

  setTotalPosDelta (vector) {
    this.totalPosDelta = vector;
  }

  getTotalPosDelta () {
    return this.totalPosDelta;
  }

  getOffset() {
    return this.originMercator
  }

  // getDetectionArea() {
  //   let xy = this.newLatLng.wgs2Mercator();
  //   let minX = xy[0]-DETECTIONLENGTH;
  //   let minY = xy[1]-DETECTIONLENGTH;
  //   let maxX = xy[0]+DETECTIONLENGTH;
  //   let maxY = xy[1]+DETECTIONLENGTH;
  //
  //   return [minX, maxX,  minY,  maxY];
  // }

  // createDetectionPlane() {
  //
  //   const detectionPlane = document.createElement('a-entity');
  //   detectionPlane.setAttribute('id','detectionPlane');
  //   detectionPlane.setAttribute('geometry', {
  //     primitive: 'plane',
  //     height:DETECTIONLENGTH*2,
  //     width: DETECTIONLENGTH*2
  //   });
  //   detectionPlane.setAttribute('position', {x:0, y:1, z:0});
  //
  //   detectionPlane.setAttribute('rotation', {x:-90, y:0, z:0});
  //   document.querySelector('a-scene').appendChild(detectionPlane);
  // }
  //
  // setPositionDetectionArea () {
  //   const detectionPlane = document.querySelector('#detectionPlane');
  //   detectionPlane.object3D.position.set(this.totalPosDelta.x, 1, this.totalPosDelta.z*-1);
  //
  // }

}
