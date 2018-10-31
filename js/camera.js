class Camera {

  constructor (latLng) {

    this.originlatLon = latLng;
    this.originMercator = this.originlatLon.wgs2Mercator();
    this.newLatLng = new LatLng(latLng.lat, latLng.lng, latLng.zoom);
    this.movementWatcher = new MovementWatcher(this.originlatLon, this.newLatLng);
    const camDom = document.querySelector('#camera');

    camDom.setAttribute('wasd-controls', { acceleration: MOVINGFACTOR });
    camDom.object3D.position.set(camDom.object3D.position.x, CAMERAHEIGHT, camDom.object3D.position.z);
    // console.log(camDom.object3D.position)

  }

  getMovementWatcher(){
    return this.movementWatcher;
  }

  setPosition (positionDelta){

    // TODO map-scaling here? if we change the scale here we dont change the scale for map tiles
    // "Converts XY point from Spherical Mercator EPSG:900913 and the change from a-frame camera position to lat/lon in WGS84 Datum"

    const coords = LatLng.unprojectWorldCoordinates(this.newLatLng.wgs2Mercator()[0]+(positionDelta.x*SCALEFACTOR), this.newLatLng.wgs2Mercator()[1]+(positionDelta.z*SCALEFACTOR))
    this.newLatLng.setCoords(coords[0], coords[1]);

  }

  getPosition(){
    return this.newLatLng;
  }

}


// const lng = ((this.newLatLng.wgs2Mercator()[0]+positionDelta.x) / ORIGINSHIFT) * 180;
// let lat = ((this.newLatLng.wgs2Mercator()[1]+positionDelta.z) / ORIGINSHIFT) * 180;
// lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
// this.newLatLng.setCoords(lat, lng);