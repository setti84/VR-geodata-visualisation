
AFRAME.registerComponent('cameralistener', {
  schema: {type: 'string'},

  init: function () {

    let latLonPos = this.latLonPos = this.latLonNewPos = {lat: 52.545584 , lon: 13.355818};
    this.metersPerLon = Util.METERS_PER_DEGREE_LATITUDE * Math.cos(this.latLonPos.lat / 180 * Math.PI);

    let pos = this.oldPos = this.newPos = this.el.object3D.getWorldPosition();
    this.tile = new Tile(pos.x, pos.z, 17, latLonPos.lat, latLonPos.lon);

    this.el.addEventListener('componentchanged', (evt) => {
      this.newPos = this.el.object3D.getWorldPosition();
      // x is longitude und z is latitude
      let lonDifference = 1/this.metersPerLon*this.newPos.x;
      let latDifference = 1/Util.METERS_PER_DEGREE_LATITUDE*this.newPos.z*-1;

      this.latLonNewPos = { lat: (this.latLonPos.lat+latDifference), lon: (this.latLonPos.lon+lonDifference)};

      changeCoordinatesDisplay([Math.round(this.latLonNewPos.lon*10000)/10000, Math.round(this.latLonNewPos.lat*10000)/10000]);

      var tile1 = Util.long2tile(this.latLonNewPos.lon,17);
      var tile2 = Util.lat2tile(this.latLonNewPos.lat,17);

      console.log(tile1, tile2 )
      console.log(Util.tile2long(tile1,17), Util.tile2lat(tile2, 17))

    });
  },

  tick: function () {
    // `this.el` is the element.
    // `object3D` is the three.js object.

    // `rotation` is a three.js Euler using radians. `quaternion` also available.
    // console.log(this.el.object3D.rotation);

    // `position` is a three.js Vector3.
    // console.log(this.el.object3D.position);


    var position = new THREE.Vector3();
    var rotation = new THREE.Euler();
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