
AFRAME.registerComponent('cameralistener', {
  schema: {type: 'string'},

  init: function () {
    this.latLonPos = {lat: 52.545584 , lon: 13.355818};
    this.oldPos = this.el.object3D.getWorldPosition();
    this.newPos = this.el.object3D.getWorldPosition();

    // this.el.addEventListener('componentchanged', function (evt) {
    //   // console.log(evt)
    //   console.log(evt.srcElement.object3D.position);
    //   console.log(this.oldPos)
    // }).bind(this);

    this.el.addEventListener('componentchanged', (evt) => {
      this.newPos = this.el.object3D.getWorldPosition();
      console.log(this.calcLatLonFromWorld(this.newPos));
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
  },

  calcLatLonFromWorld: function(position) {

    /*
    use the quick and dirty estimate that 111,111 meters (111.111 km) in the y direction is 1 degree (of latitude) and
    111,111 * cos(latitude) meters in the x direction is 1 degree (of longitude).
     */


    return position;
  }

});