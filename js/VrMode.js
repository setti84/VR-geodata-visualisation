class VrMode {

  constructor(){

    this.isSelecting = false;
    this.newPos = new THREE.Vector3();
    this.facingDirection = new THREE.Vector3();
    this.rig = new THREE.Object3D();
    this.gamepadConnected = false;
    this.rigIsUp = true;
    this.buttons = [];

  }

  handleController(){

    if(this.buttons[0] && this.buttons[0].pressed){
      map.get().threeCamera.getWorldDirection(this.facingDirection);
      this.newPos.set(this.rig.position.x+ this.facingDirection.x*5 , this.rig.position.y, this.rig.position.z+this.facingDirection.z*5);
      this.rig.position.set(this.newPos.x, this.newPos.y, this.newPos.z);
      map.get().events.emit('CAMPOS_ON_SURFACE_MOVE', this.rig.position);
    }

    if(this.buttons[1]){
      if(!this.buttons[1].pressed && this.rigIsUp){
        this.rig.position.set(this.newPos.x, 1.6, this.newPos.z);
        this.rigIsUp = false;
        console.log('set rig down')
      }
      if(this.buttons[1].pressed && !this.rigIsUp) {
        this.rig.position.set(this.newPos.x, 200, this.newPos.z);
        this.rigIsUp=true;
        console.log('set rig up')
      }
    }

  }

  start(){

    window.addEventListener("gamepadconnected", (e) => {
      e.gamepad.buttons.forEach( (button) => {
        this.gamepadConnected = true;
        this.buttons.push(button);
      });
    });

    this.rig.add(map.get().threeCamera);
    map.get().threeScene.add(this.rig);

    map.get().threeRenderer.vr.enabled = true;
    map.get().threeRenderer.vr.getController(0)  //  <--------- ?????????????????????    wichtig

  }

  end(){

    this.gamepadConnected = false;
    this.buttons = [];

    // effect?
    map.get().threeRenderer.vr.enabled = false;

    // remove camera rig
    map.get().threeScene.remove(this.rig);

    // TODO: back to old tile loading strategy

    console.log('end')
  }

}
