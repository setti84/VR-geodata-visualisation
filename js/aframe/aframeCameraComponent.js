
AFRAME.registerComponent('camerascanner', {
  schema: {type: 'string'},

  init: function () {

    this.cam = new Camera(map.get().position);
    this.oldPos = this.newPos = this.el.object3D.getWorldPosition();
    let posDelta = new THREE.Vector3();
    let camScale = Math.pow(1/SCALEFACTOR,2);
    let camScaleVec = new THREE.Vector3(SCALEFACTOR*camScale,1,SCALEFACTOR*camScale*-1)
    // console.log(SCALEFACTOR)
    // bei SCALFACTOR 2 dann: SCALEFACTOR*0.25,1,SCALEFACTOR*0.25
    // bei SCALEFACTOR 0.5 dann: SCALEFACTOR*4,1,SCALEFACTOR*-4
    // bei SCALEFACTOR 0.25 dann: SCALEFACTOR*16,1,SCALEFACTOR*-16
    // bei SCALEFACTOR 0.125 dann: SCALEFACTOR*64,1,SCALEFACTOR*-64

    this.el.addEventListener('componentchanged', () => {

      // console.log(this.newPos)

      this.newPos = this.el.object3D.getWorldPosition().multiply(camScaleVec);
      console.log(this.el.object3D.getWorldPosition())
      // posDelta.set((this.newPos.x-this.oldPos.x), 0, (this.newPos.z-this.oldPos.z)*-1);
      posDelta.set(this.newPos.x-this.oldPos.x, 0, this.newPos.z-this.oldPos.z);
      this.cam.setPosition(posDelta);
      // TODO: call this not every movement... maybe just every fifth loop
      this.cam.getMovementWatcher().search();
      changeCoordinatesDisplay(this.cam);
      this.oldPos = this.el.object3D.getWorldPosition().multiply(camScaleVec);
      console.log(this.el.object3D.getWorldPosition())

    });
  },

  // tick: function () {
  //
  // }

});