class MapApp {

  constructor(options = {}){

    this.zoom = options.zoom || 18;
    this.position = new LatLng(options.position.lat, options.position.lng, this.zoom) || new LatLng( 52.545, 13.355, this.zoom);
    this.debugging = options.debugging || false;
    this.maptiles = options.maptiles || 'mapbox';
    const scene = this.threeScene = document.querySelector('a-scene').object3D;
    this.events = new Events();
    this.textureManager = new TextureManager();
    this.camera = document.querySelector(CAMERA_DIV).object3D;
    this.events = new Events();

    const dataTiles = this.dataTiles = new THREE.Group();
    dataTiles.name = 'buildings';
    scene.add(dataTiles);

    const basetiles = this.baseTiles = new THREE.Group();
    basetiles.name = 'basemap';
    scene.add(basetiles);

    // this.scaleFactor = 1;
    // this.scale = document.getElementById("scale-slider");
    // this.initScale();

    // TODO: array(or map object?) with mother object for tiles? like plane geometry, building geometry, everything we need more than once for tiles?
    // TODO: Scaling: buildings should be closer together, maptiles needs to be improved

    // TODO: its not working, mabe use set interval to keep track of href and map position
    // const startPos = window.location.href.split("/");
    // // console.log(startPos)
    // if(startPos.length === 8){
    //   // http://localhost/git/aframeCameraPosition/#/19/56
    //   this.position = new LatLng( startPos[startPos.length-1], startPos[startPos.length-2], this.zoom );
    //   console.log(this.position)
    // }

  }

  addEvents() {
    // this.user = new User();

    document.body.addEventListener("wheel", (e) => {
      this.events.emit('MAP_HEIGHT_CHANGE', e.deltaY);
    });

    document.getElementById('mapzoom-plus').addEventListener("click", () => this.events.emit('MAP_HEIGHT_CHANGE', 3));
    document.getElementById('mapzoom-minus').addEventListener("click", () => this.events.emit('MAP_HEIGHT_CHANGE', -3));

    this.events.on('MAP_HEIGHT_CHANGE', change => {

      let posY = this.camera.position.y;
      let newPosY = util.clamp(parseInt(this.camera.position.y)+change, CAMERA_MIN_HEIGHT, CAMERA_MAX_HEIGHT);

      // turns the camera down to streetlevel between 90 and 1 meter height
      (posY <= 90 && posY > 1) ? this.camera.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -1 * change * Math.PI / 180):false;

      this.camera.position.set(this.camera.position.x, newPosY, this.camera.position.z);

    });

    // document.body.addEventListener("click", (e) => {
    //   e.stopPropagation();
    //   e.preventDefault();
    //
    // });
    //
    // document.body.addEventListener("mousedown", (e) => {
    //   e.stopPropagation();
    //   e.preventDefault();
    //
    // });


    // Prevent to open context menu on right click
    document.body.addEventListener("contextmenu", (e) => {
      e.stopPropagation();
      e.preventDefault();

    });

    document.body.addEventListener("mousemove", (e) => {
      e.stopPropagation();
      e.preventDefault()
      this.events.emit('MOUSE_POSITION_CHANGE', e);
    });

    this.events.on('MOUSE_POSITION_CHANGE', change => {
      // left button
      if(change.buttons === 1){
        this.events.emit('MAP_POSITION_CHANGE', change);

        // right button
      } else if(change.buttons === 2){
        this.events.emit('MAP_ROTATION_CHANGE', change);
      }

    });

    this.events.on('MAP_POSITION_CHANGE', change => {
      // console.log('mousemovement button 1', change)
    });

    this.events.on('MAP_ROTATION_CHANGE', change => {
      // console.log('mousemovement button 2', change)
    });

  }

  get() {
    return this;
  }

  // initScale() {
  //
  //
  //
  //   let target;
  //   this.scale.addEventListener('input', (e) => {
  //
  //     target = (e.target) ? e.target : e.srcElement;
  //
  //     // this.events.emit('MAP_HEIGHT_CHANGE', e.deltaY);
  //
  //
  //     console.log(0+parseInt(this.scaleFactor))
  //
  //     this.scaleFactor = target.value;
  //     // this.changeScale();
  //     this.camera.position.set(this.camera.position.x, 0+parseInt(this.scaleFactor), this.camera.position.z);
  //     // calculation: (max-1)*Math.pow(val, strength) + min;
  //     // temp = (4-1)*Math.pow(target.value, 2.5);
  //     // // set minimum value to 0.00003
  //     // temp = temp < 0.07 ? 0.07 : temp;
  //
  //   })
  //
  // }

  // changeScale() {
  //
  //   // this.camera.scale.set(this.camera.scale.x/this.oldScaleFactor*this.scaleFactor, this.camera.scale.y, this.camera.scale.z/this.oldScaleFactor*this.scaleFactor);
  //
  //
  //   // console.log(this.oldScaleFactor)
  //   // console.log(this.scaleFactor)
  //   // this.threeScene.children.forEach( e => {
  //   //   if(e.type === 'Group' ) {
  //   //     if(e.name === 'buildings' || e.name === 'basemap') { // /this.oldScaleFactor*this.scaleFactor
  //   //
  //   //       e.position.set(e.position.x/this.oldScaleFactor*this.scaleFactor, e.position.y/this.oldScaleFactor*this.scaleFactor, e.position.z/this.oldScaleFactor*this.scaleFactor );
  //   //       e.scale.set(e.scale.x/this.oldScaleFactor*this.scaleFactor,  e.scale.y, e.scale.z/this.oldScaleFactor*this.scaleFactor );
  //   //
  //   //     }
  //   //   }
  //   // });
  //
  //   // this.oldScaleFactor = this.scaleFactor;
  //
  // }


}


// document.querySelector('#cameraRig').object3D.rotateX( -1 * change * Math.PI / 180); // 1*posY/180*Math.PI
// document.querySelector('#zylinder').object3D.rotateOnAxis(new THREE.Vector3(1,0,0), -1 * change * Math.PI / 180);
//   document.querySelector('#zylinder').object3D.rotateX( -1 * change * Math.PI / 180); // 1*posY/180*Math.PI
// document.querySelector('#cameraRig').object3D.rotateX(-1*posY/180*Math.PI);
// document.querySelector('#camera').object3D.position.set(this.camera.position.x, posY, this.camera.position.z);
// console.log(posY, -1*posY/180*Math.PI)
// console.log(document.querySelector('#cameraRig').object3D.rotation, this.camera.position)
// console.log(document.querySelector('#cameraRig').object3D.rotation._x, -1*posY * Math.PI/180)
// console.log(-1*posY * Math.PI/180 + Math.abs(document.querySelector('#cameraRig').object3D.rotation._x));



/*



performance

staendige if abfrage ob framrate schlecht ist. Wenn ja dann abschalten von: Schatten, shadows,
antialiasing, reducing the resolution(setPixelRatio)

https://threejs.org/docs/#api/en/objects/LOD



 */