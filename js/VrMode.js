class VrMode {

  constructor(){

    this.controller1 = null;
    this.isSelecting = false;
    this.newPos = new THREE.Vector3();
    this.facingDirection = new THREE.Vector3();
    this.rig = new THREE.Object3D();

  }

  handleController(){

    map.get().threeCamera.getWorldDirection(this.facingDirection);
    this.newPos.set(this.rig.position.x+ this.facingDirection.x*5 , this.rig.position.y, this.rig.position.z+this.facingDirection.z*5);
    this.rig.position.set(this.newPos.x, this.newPos.y, this.newPos.z);
    map.get().events.emit('CAMPOS_ON_SURFACE_MOVE', this.rig.position);

  }

  start(){

    // TODO: set new tile loading strategy? less tiles loading
    // get controller
    // add event listener
    // add controler arrow
    // add controller picture

    //map.get().controls = undefined;

    // window.addEventListener("gamepadconnected", function(e) {
    //   console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
    //     e.gamepad.index, e.gamepad.id,
    //     e.gamepad.buttons.length, e.gamepad.axes.length);
    //   console.log(e.gamepad.buttons)
    // });

    this.rig.add(map.get().threeCamera);
    map.get().threeScene.add(this.rig);

    this.controller1 = map.get().threeRenderer.vr.getController( 0 );
    map.get().threeScene.add(this.controller1)

    // var geometry = new THREE.BufferGeometry();
    // geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
    // geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
    // var material = new THREE.LineBasicMaterial( { vertexColors: true, blending: THREE.AdditiveBlending } );
    // this.controller1.add(new THREE.Line( geometry, material ));

    map.get().threeRenderer.vr.enabled = true;
    console.log(map.get().threeRenderer.vr.getController( 0 ))
    this.controller1.addEventListener( 'selectstart', () => this.isSelecting = true );
    this.controller1.addEventListener( 'selectend',   () => this.isSelecting = false );
    // this.controller1.addEventListener( 'selectstart', this.selectStart );
    // this.controller1.addEventListener( 'selectend',   this.selectEnd );




  }

  end(){

    // effect?
    map.get().threeRenderer.vr.enabled = false;

    // remove event listener on controller
    //this.controller1.addEventListener( 'selectstart', this.selectStart() );
    //this.controller1.addEventListener( 'selectend',   this.selectEnd() );

    // remove controller
    map.get().threeScene.remove(this.controller1);
    this.controller1 = undefined;

    // remove camera rig
    map.get().threeScene.remove(this.rig);

    // TODO: back to old tile loading strategy



    console.log('end')
  }

  selectStart(){
    this.isSelecting = true;
  }

  selectEnd(){
    this.isSelecting = false;
  }

}