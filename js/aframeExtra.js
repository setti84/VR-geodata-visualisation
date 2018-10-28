
AFRAME.registerComponent('cameralistener', {
  schema: {type: 'string'},

  init: function () {

    this.originLatLng = new LatLng( 52.54591075494661, 13.355914950370789 );   //Berlin beuth
    // this.originLatLng = new LatLng(40.72372, -73.98922);   // New York
    // this.originLatLng = new LatLng(1.29422,103.85411);        // Singapore
    // this.originLatLng = new LatLng(0,0);



    const cam = this.cam = new Camera(this.originLatLng);
    this.oldPos = this.newPos = this.originWorldPosition = this.el.object3D.getWorldPosition();
    let posDelta = new THREE.Vector3();
    let totalPosDelta = new THREE.Vector3();

    this.el.addEventListener('componentchanged', (evt) => {

      this.newPos = this.el.object3D.getWorldPosition();

      posDelta.set(this.newPos.x-this.oldPos.x, 0, (this.newPos.z-this.oldPos.z)*-1);
      totalPosDelta.set(this.newPos.x-this.originWorldPosition.z, 0, (this.newPos.z-this.originWorldPosition.z)*-1);

      this.cam.setPosition(posDelta);
      this.cam.setTotalPosDelta(totalPosDelta);
      this.cam.getMovementWatcher().search();

      changeCoordinatesDisplay(this.cam);

      this.oldPos = this.el.object3D.getWorldPosition();

    });
  },

  tick: function () {

  }

});