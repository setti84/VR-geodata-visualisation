class MapCamera {

  constructor (latLng, cam) {

    // https://www.engr.uvic.ca/~mech410/lectures/4_2_RotateArbi.pdf

    this.threeCamera = cam;
    this.originlatLon = latLng;
    this.originMercator = this.originlatLon.wgs2Mercator();
    this.newLatLng = new LatLng(latLng.lat, latLng.lng, latLng.zoom);

    this.camPosOnSurface = new THREE.Vector3();
    this.positionchange = 0;

    this.testi1 = new THREE.Vector3();
    this.testi2 = new THREE.Vector3();


  }

  getPosition(){
    return this.threeCamera.getWorldPosition();
  }

  // addMovementWatcher () {
  //   this.movementWatcher = new MovementWatcher(this.originlatLon, this.newLatLng);
  // }


  setPosition (position){




    // this.testi2.copy(map.get().threeCamera.position)
    // this.testi2.x=this.testi2.x+this.testi1.x*5;
    // this.testi2.z=this.testi2.z+this.testi1.z*5;
    // console.log(map.get().threeCamera.position)
    // console.log(position)

    // map.get().threeCamera.getWorldDirection(this.testi2);
    // this.testi1.set(map.get().threeCamera.position.x+this.testi2.x*2, map.get().threeCamera.position.y, map.get().threeCamera.position.z+this.testi2.z*2)
    // console.log(map.get().threeCamera.position)
    // console.log(this.testi1)

    this.camPosOnSurface = position;

    // TODO map-scaling here? if we change the scale here we dont change the scale for map tiles, scaling factor from mapApp element
    // add the new camera Position(or the point where the camera is looking) to the origin and thats where the new camera looking position is in LatLng
    const coords = LatLng.unprojectWorldCoordinates(this.originMercator[0]+this.camPosOnSurface.x, this.originMercator[1]-this.camPosOnSurface.z);
    this.newLatLng.setCoords(coords[0], coords[1]);
    // map.get().events.emit('MAP_URL_CHANGE', `${this.newLatLng.zoom}/${parseFloat(this.newLatLng.lat).toFixed(6)}/${parseFloat(this.newLatLng.lng).toFixed(6)}`)
    // console.log(this.newLatLng)
    map.get().tiles.update(this.newLatLng);
    // changeCoordinatesDisplay(this);

  }

}



// setRotationTest(change) {
//   // change is in degrees 0-360
//   // console.log(document.querySelector('a-scene').object3D.children)
//   let pos = this.getPosition()
//
//   // console.log(this.threeCam)
//   // util.showMatrix(this.threeCam.matrixWorld);
//   // console.log(this.threeCam.matrix)
//
//   console.log(90-change)
//   // this.threeCam.rotateOnAxis(new THREE.Vector3(0, 0, 1), change * Math.PI / 180)
//
//   let changeRad = change/180*Math.PI;
//   //
//   // console.log(change)
//   // console.log(Math.sin(changeRad))
//   // // console.log(Math.sin(change/180*Math.PI))
//   // console.log(this.getPosition())
//   this.threeCam.position.set(pos.x, pos.y*Math.sin(changeRad), pos.z*Math.cos(changeRad));
//
//   const allObjects = document.querySelector('a-scene').object3D.children;
//
// // allObjects.forEach( e => {
// //   if(e.type === 'Group' ) {
// //     if(e.name === 'mapbox' || e.name === 'overpass') {
// //
// //       if((change * Math.PI / 180)+e.rotation._x > -90 * Math.PI / 180 && (change * Math.PI / 180)+e.rotation._x < 0){
// //         e.rotateOnAxis(new THREE.Vector3(1, 0, 0), change * Math.PI / 180)
// //       }
// //
// //       // console.log(e.rotation._x)
// //       //
// //       // console.log((change * Math.PI / 180)+e.rotation._x)
// //       // console.log(-90 * Math.PI / 180)
// //       // console.log(change * Math.PI / 180)
// //     }
// //   }
// // });
//
//   // document.querySelector('a-scene').object3D.rotateOnAxis(new THREE.Vector3(0, 0, 1), -1 * change * Math.PI / 180)
// }

// setRotationY(change) {
//   // change is in degrees 0-360
//   this.threeCam.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -1 * change * Math.PI / 180)
// }
//
// setRotationX(change) {
//   // change is in degrees 0-360
//   this.threeCam.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -1 * change * Math.PI / 180)
// }
//
// setHeight(height) {
//   const pos = this.threeCam.getWorldPosition();
//   this.threeCam.position.set(pos.x, height, pos.z);
// }
//
// getHeight() {
//   return this.threeCam.getWorldPosition().y;
// }





// getMovementWatcher(){
//   return this.movementWatcher;
// }















// this.updatePos();

// document.querySelector('#camera').setAttribute('wasd-controls', { acceleration: MOVINGFACTOR_KEYBOARD });

// threeCam.position.set(threeCam.position.x, CAMERAHEIGHT, threeCam.position.z);

// threeCam.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -90 * Math.PI / 180);


// this.oldPos = this.newPos = threeCam.getWorldPosition();
// let posDelta = new THREE.Vector3();
// let camScale = Math.pow(1/SCALEFACTOR,2);
// this.camScaleVec = new THREE.Vector3(SCALEFACTOR*camScale,1,SCALEFACTOR*camScale*-1)
// // bei SCALFACTOR 2 dann: SCALEFACTOR*0.25,1,SCALEFACTOR*0.25
// // bei SCALEFACTOR 0.5 dann: SCALEFACTOR*4,1,SCALEFACTOR*-4
// // bei SCALEFACTOR 0.25 dann: SCALEFACTOR*16,1,SCALEFACTOR*-16
// // bei SCALEFACTOR 0.125 dann: SCALEFACTOR*64,1,SCALEFACTOR*-64



// const lng = ((this.newLatLng.wgs2Mercator()[0]+positionDelta.x) / ORIGINSHIFT) * 180;
// let lat = ((this.newLatLng.wgs2Mercator()[1]+positionDelta.z) / ORIGINSHIFT) * 180;
// lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
// this.newLatLng.setCoords(lat, lng);


// class Camera {
//
//   constructor (latLng) {
//
//     // https://www.engr.uvic.ca/~mech410/lectures/4_2_RotateArbi.pdf
//
//     this.originlatLon = latLng;
//     this.originMercator = this.originlatLon.wgs2Mercator();
//     this.newLatLng = new LatLng(latLng.lat, latLng.lng, latLng.zoom);
//     this.movementWatcher = new MovementWatcher(this.originlatLon, this.newLatLng);
//     const threeCam = this.threeCamera = document.querySelector('#camera').object3D;
//
//     document.querySelector('#camera').setAttribute('wasd-controls', { acceleration: MOVINGFACTOR_KEYBOARD });
//     threeCam.position.set(threeCam.position.x, CAMERAHEIGHT, threeCam.position.z);
//     threeCam.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -90 * Math.PI / 180);
//
//   }
//
//
//   getMovementWatcher(){
//     return this.movementWatcher;
//   }
//
//   setPosition (positionDelta){
//
//     // TODO map-scaling here? if we change the scale here we dont change the scale for map tiles, scaling factor from mapApp element
//     // "Converts XY point from Spherical Mercator EPSG:900913 and the change from a-frame camera position to lat/lon in WGS84 Datum"
//     const coords = LatLng.unprojectWorldCoordinates(this.newLatLng.wgs2Mercator()[0]+positionDelta.x, this.newLatLng.wgs2Mercator()[1]+positionDelta.z)
//     this.newLatLng.setCoords(coords[0], coords[1]);
//     // console.log(camDom)
//
//   }
//
//   getPosition(){
//     return this.newLatLng;
//   }
//
// }