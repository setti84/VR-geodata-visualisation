
AFRAME.registerComponent('cameralistener', {
  schema: {type: 'string'},

  init: function () {

    this.originLatLng = new LatLng(52.545584 , 13.355818);

    const cam = this.cam = new Camera(this.originLatLng);
    this.oldPos = this.newPos = this.originWorldPosition = this.el.object3D.getWorldPosition();

    let posDelta = new THREE.Vector3();
    let totalPosDelta = new THREE.Vector3();

    // get a tile for the given coordinates
    this.tile = new Tile(this.oldPos.x, this.oldPos.z, this.originLatLng);



    // let origin = this.origin = new LatLng(52.545584 , 13.355818);
    // let latLonPos = this.latLonPos = this.latLonNewPos = new LatLng(52.545584 , 13.355818);

    // let pos = this.oldPos = this.newPos = this.el.object3D.getWorldPosition();
    // this.tempo = this.el.object3D.getWorldPosition();
    // this.tile = new Tile(pos.x, pos.z, ZOOMLEVEL, latLonPos);
    // console.log(this.tile)
    // console.log(this.el.object3D.getWorldPosition())

    // let temp = latLonPos.wgs2Mercator();
    // let tempLatLon = new LatLng(1,1);

    this.el.addEventListener('componentchanged', (evt) => {

      this.newPos = this.el.object3D.getWorldPosition();

      posDelta.set(this.newPos.x-this.oldPos.x, 0, this.newPos.z-this.oldPos.z);
      totalPosDelta.set(this.newPos.x-this.originWorldPosition.z, 0, this.newPos.z-this.originWorldPosition.z);

      this.cam.setPosition(posDelta);
      this.cam.setTotalPosDelta(totalPosDelta);

      changeCoordinatesDisplay(this.cam);
      console.log(this.cam.getTotalPosDelta())

      this.oldPos = this.el.object3D.getWorldPosition();



      // let posDelta = {x: this.newPos.x-this.oldPos.x, y: 0, z: this.newPos.z-this.oldPos.z};
      // let totalPosDiff = {x: this.newPos.x+this.tempo.x, y: 0, z: this.newPos.z+this.tempo.z};

      // x is longitude und z is latitude
      // let lonDifference = 1/METERS_PER_DEGREE_LONGITUDE*posDelta.x;
      // let latDifference = 1/METERS_PER_DEGREE_LATITUDE*posDelta.z*-1;
      // this.latLonNewPos.setCoords(this.latLonPos.lat+latDifference, this.latLonPos.lng+lonDifference);


      // position change from difference in WorldPosition in a-frame calculated to mercator and WGS84
      // temp = [temp[0]+ posDelta.x, temp[1]+ posDelta.z];
      // console.log(posDelta)
      // tempLatLon.setCoords(Util.unprojectWorldCoordinates(temp[0],temp[1])[0],Util.unprojectWorldCoordinates(temp[0],temp[1])[1])
      // console.log(this.latLonPos.projectWorldCoordinates2())
      // console.log(this.tile.bounds);


      // console.log(totalPosDiff)
      // positionChange();
      // this.oldPos = this.el.object3D.getWorldPosition();
      // changeCoordinatesDisplay(this.latLonNewPos);

    });
  },

  tick: function () {
    // `this.el` is the element.
    // `object3D` is the three.js object.

    // `rotation` is a three.js Euler using radians. `quaternion` also available.
    // console.log(this.el.object3D.rotation);

    // `position` is a three.js Vector3.
    // console.log(this.el.object3D.position);


    // var position = new THREE.Vector3();
    // var rotation = new THREE.Euler();
    // console.log(this.el.object3D.getWorldPosition(position));
    // console.log(this.el.object3D.getWorldRotation(rotation));
    // position and rotation now contain vector and euler in world space.
  }

});


/*
 onload: this.metersPerLon = METERS_PER_DEGREE_LATITUDE * Math.cos(this.latitude / 180 * Math.PI);

(this.longitude - APP.position.longitude) * this.metersPerLon,
(APP.position.latitude-this.latitude) * METERS_PER_DEGREE_LATITUDE,


 (aktuelle long minus gegebene Long) * originale(this.metersPerLon)
 (aktuelle lat minus gegebene lat) * METERS_PER_DEGREE_LATITUDE



 */


// this.el.addEventListener('componentchanged', function (evt) {
//   // console.log(evt)
//   console.log(evt.srcElement.object3D.position);
//   console.log(this.oldPos)
// }).bind(this);