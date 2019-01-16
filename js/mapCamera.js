class MapCamera {

  constructor (latLng, cam) {

    // https://www.engr.uvic.ca/~mech410/lectures/4_2_RotateArbi.pdf

    this.threeCamera = cam;
    this.originlatLon = latLng;
    this.originMercator = this.originlatLon.wgs2Mercator();
    this.newLatLng = new LatLng(latLng.lat, latLng.lng, latLng.zoom);
    this.camPosOnSurface = new THREE.Vector3();

    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = CAMERA_MAX_FAR;
    this.raycaster.near = CAMERA_NEAR;
    this.raycasterIsBusy = false;
    // upper left , upper right, lower right, lower left of screen
    this.rayCasterPoints = [new THREE.Vector2(-1,1), new THREE.Vector2(1,1), new THREE.Vector2(1,-1), new THREE.Vector2(-1,-1)];
    this.frustumPolygon = [{x:0,z:0}, {x:0,z:0}, {x:0,z:0}, {x:0,z:0}];
    this.frustumMaxDistance = CAMERA_MAX_FAR;

  }

  updateRaycaster (){
    // updates the polygon used for tile loading by getting coordinates from intersection
    // of screen with ground material. Result are world coordinates we can use to know if we need new maptiles.

    if(this.raycasterIsBusy) return;
    this.raycasterIsBusy = true;

    const frame = map.get().raycastFrame;

    // empty array with coordinates for new run
    // this.frustumPolygon.length = 0;

    let pos = [];
    this.rayCasterPoints.forEach( (e, i) => {

      this.raycaster.setFromCamera(e, this.threeCamera);
      pos = this.raycaster.intersectObjects([map.get().raycastFrame]);
      // console.log(pos)

      if(pos.length === 0) return;

      this.frustumPolygon.splice( i, 1, {
        x: util.clamp( Math.round( pos[0].point.x - map.get().cam.camPosOnSurface.x) , -this.frustumMaxDistance,this.frustumMaxDistance),
        z: util.clamp(Math.round( pos[0].point.z - map.get().cam.camPosOnSurface.z), -this.frustumMaxDistance,this.frustumMaxDistance)
        // x: util.clamp( Math.round( pos[0].point.x - map.get().threeCamera.position.x) , -this.frustumMaxDistance,this.frustumMaxDistance),
        // z: util.clamp(Math.round( pos[0].point.z - map.get().threeCamera.position.z), -this.frustumMaxDistance,this.frustumMaxDistance)
        // x:   pos[0].point.x ,
        // z:  pos[0].point.z
        });

    });




    // this.rayCasterPoints.forEach( (e) => {
    //   this.raycaster.setFromCamera(e, this.threeCamera);
    //   pos = this.raycaster.intersectObjects([map.get().raycastFrame]);
    //   if(pos.length === 0) {
    //     console.log('recall')
    //     this.updateRaycaster();
    //     return;
    //   } else {
    //     this.frustumPolygon.push({
    //       // x: util.clamp( Math.round( pos[0].point.x - map.get().threeCamera.position.x ) , -this.frustumMaxDistance , this.frustumMaxDistance ) ,
    //       // z: util.clamp( Math.round( pos[0].point.z - map.get().threeCamera.position.z ) , -this.frustumMaxDistance , this.frustumMaxDistance )
    //       // x: Math.round( pos[0].point.x - map.get().threeCamera.position.x ) ,
    //       // z: Math.round( pos[0].point.z - map.get().threeCamera.position.z )
    //       x: pos[0].point.x ,
    //       z: pos[0].point.z
    //     });
    //   }
    // });

    if(map.get().status.debugging){
      const ecke = 0;
      //change first number in array to chose different point

      map.get().debugging.camCube.position.set(this.frustumPolygon[ecke].x + map.get().cam.camPosOnSurface.x, 100, this.frustumPolygon[ecke].z+map.get().cam.camPosOnSurface.z)

    }

    this.raycasterIsBusy = false;

    map.get().tiles.update(map.get().cam.newLatLng);

  }

  setPosition (position){

    const coords = LatLng.unprojectWorldCoordinates(this.originMercator[0]+position.x, this.originMercator[1]-position.z);
    if(coords[0] < -80 || coords[0] > 80 || coords[1] < -180 || coords[1] > 180) {
      // set map back to old coords

      // map.get().setPosition(this.newLatLng.lat, this.newLatLng.lng)
      // console.log(this.newLatLng.lat, this.newLatLng.lng)
      return;
    }
    this.camPosOnSurface = position;
    this.newLatLng.setCoords(coords[0], coords[1]);


    // this.camPosOnSurface = position;
    // const coords = LatLng.unprojectWorldCoordinates(this.originMercator[0]+this.camPosOnSurface.x, this.originMercator[1]-this.camPosOnSurface.z);
    // if(coords[0] < -80 || coords[0] > 80 || coords[1] < -180 || coords[1] > 180) {
    //   // set map back to old coords
    //   console.log('bei return')
    //   return;
    // }
    // this.newLatLng.setCoords(coords[0], coords[1]);

    // console.log(this.originlatLon)
    // console.log(map.get().threeCamera.position)

    // console.log(this.camPosOnSurface.x, this.camPosOnSurface.z)
    // map.get().events.emit('MAP_URL_CHANGE', `${this.newLatLng.zoom}/${parseFloat(this.newLatLng.lat).toFixed(6)}/${parseFloat(this.newLatLng.lng).toFixed(6)}`)
    // console.log(this.originlatLon)

    // map.get().tiles.update(this.newLatLng);


    // TODO map-scaling here? if we change the scale here we dont change the scale for map tiles, scaling factor from mapApp element
    // add the new camera Position(or the point where the camera is looking at) to the origin and thats where the new camera looking position is in LatLng

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