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

}
