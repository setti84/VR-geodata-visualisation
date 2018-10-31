
AFRAME.registerComponent('cameralistener', {
  schema: {type: 'string'},

  init: function () {

    this.cam = new Camera(map.get().position);
    this.oldPos = this.newPos = this.el.object3D.getWorldPosition();
    let posDelta = new THREE.Vector3();

    this.el.addEventListener('componentchanged', () => {

      this.newPos = this.el.object3D.getWorldPosition();
      posDelta.set(this.newPos.x-this.oldPos.x, 0, (this.newPos.z-this.oldPos.z)*-1);
      this.cam.setPosition(posDelta);
      this.cam.getMovementWatcher().search();
      changeCoordinatesDisplay(this.cam);
      this.oldPos = this.el.object3D.getWorldPosition();

    });
  },

  // tick: function () {
  //
  // }

});