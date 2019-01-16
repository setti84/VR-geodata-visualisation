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

    let pos = [];
    this.rayCasterPoints.forEach( (e, i) => {

      this.raycaster.setFromCamera(e, this.threeCamera);
      pos = this.raycaster.intersectObjects([map.get().raycastFrame]);

      if(pos.length === 0) return;

      this.frustumPolygon.splice( i, 1, {
        x: util.clamp( Math.round( pos[0].point.x - map.get().cam.camPosOnSurface.x) , -this.frustumMaxDistance,this.frustumMaxDistance),
        z: util.clamp(Math.round( pos[0].point.z - map.get().cam.camPosOnSurface.z), -this.frustumMaxDistance,this.frustumMaxDistance)

        });

    });

    this.raycasterIsBusy = false;

    map.get().tiles.update(map.get().cam.newLatLng);

  }

  setPosition (position){

    const coords = LatLng.unprojectWorldCoordinates(this.originMercator[0]+position.x, this.originMercator[1]-position.z);
    if(coords[0] < -80 || coords[0] > 80 || coords[1] < -180 || coords[1] > 180) {
      // set map back to old coords

      return;
    }
    this.camPosOnSurface = position;
    this.newLatLng.setCoords(coords[0], coords[1]);

  }

}