class Camera {

  constructor (latLng) {

    // https://www.engr.uvic.ca/~mech410/lectures/4_2_RotateArbi.pdf

    this.originlatLon = latLng;
    this.originMercator = this.originlatLon.wgs2Mercator();
    this.newLatLng = new LatLng(latLng.lat, latLng.lng, latLng.zoom);
    this.movementWatcher = new MovementWatcher(this.originlatLon, this.newLatLng);
    const threeCam = this.threeCamera = document.querySelector('#camera').object3D;

    document.querySelector('#camera').setAttribute('wasd-controls', { acceleration: MOVINGFACTOR });
    threeCam.position.set(threeCam.position.x, CAMERAHEIGHT, threeCam.position.z);
    threeCam.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -90 * Math.PI / 180);

  }


  getMovementWatcher(){
    return this.movementWatcher;
  }

  setPosition (positionDelta){

    // TODO map-scaling here? if we change the scale here we dont change the scale for map tiles, scaling factor from mapApp element
    // "Converts XY point from Spherical Mercator EPSG:900913 and the change from a-frame camera position to lat/lon in WGS84 Datum"
    const coords = LatLng.unprojectWorldCoordinates(this.newLatLng.wgs2Mercator()[0]+positionDelta.x, this.newLatLng.wgs2Mercator()[1]+positionDelta.z)
    this.newLatLng.setCoords(coords[0], coords[1]);
    // console.log(camDom)

  }

  getPosition(){
    return this.newLatLng;
  }

}


// const lng = ((this.newLatLng.wgs2Mercator()[0]+positionDelta.x) / ORIGINSHIFT) * 180;
// let lat = ((this.newLatLng.wgs2Mercator()[1]+positionDelta.z) / ORIGINSHIFT) * 180;
// lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
// this.newLatLng.setCoords(lat, lng);