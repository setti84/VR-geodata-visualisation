class Camera {

  constructor (latLng) {

    this.originlatLon = latLng;
    this.originMercator = this.originlatLon.wgs2Mercator();
    this.newLatLng = new LatLng(latLng.lat, latLng.lng);
    this.totalPosDelta = new THREE.Vector3();

  }

  setPosition (positionDelta){
    const temp = Util.unprojectWorldCoordinates(this.newLatLng.wgs2Mercator()[0]+positionDelta.x, this.newLatLng.wgs2Mercator()[1]+positionDelta.z);
    this.newLatLng.setCoords(temp[0], temp[1]);
  }

  setTotalPosDelta (vector) {
    this.totalPosDelta = vector;
    console.log(vector)
  }

  getTotalPosDelta () {
    return this.totalPosDelta
  }

}
