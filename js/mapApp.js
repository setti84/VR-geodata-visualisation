class MapApp {

  constructor(options = {}){

    this.zoom = options.zoom || 18;
    this.position = new LatLng(options.position.lat, options.position.lng, this.zoom) || new LatLng( 52.545, 13.355, this.zoom);
    this.debugging = options.debugging || false;
    this.tiles = new Tiles(this.position);
    this.threeScene;
    this.threeCamera;
    this.threeRenderer;
    this.initScene();

    this.events = new Events();
    this.textureManager = new TextureManager();
    this.cam = new MapCamera(this.position, this.threeCamera);
    this.workerPool = new Workerpool();

    this.addEvents();

    //debugging
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    if(this.debugging){
      const axesHelper = new THREE.AxesHelper( 150 );
      this.threeScene.add(axesHelper);
      this.threeScene.add( cube );
    }

    this.threeRenderer.setAnimationLoop( () => {
      if(this.debugging){
        cube.position.set(this.cam.camPosOnSurface.x, this.cam.camPosOnSurface.y, this.cam.camPosOnSurface.z);
      }
      this.threeRenderer.render(this.threeScene, this.threeCamera);
    } );

  }

  addEvents() {

    // this.events.on('CAMERA_MOVE', target => {
    //     this.cam.setPosition(target);
    //     this.cam.movementWatcher.search();
    // });

    this.events.on('CAMPOS_ON_SURFACE_MOVE', target => {
      this.cam.setPosition(target);
      // this.cam.movementWatcher.search();
    });

    document.getElementById('mapzoom-plus').addEventListener('click', () => {

      // this.workerPool.postMessage('this is the message')

      // this.workerPool.postMessage({type: 'baseTile', tileID: 123});
      // this.workerPool.postMessage({type: 'baseTile', tileID: 234});


    });

    document.getElementById('mapzoom-minus').addEventListener('click', () => this.events.emit('MAP_HEIGHT_CHANGE', 3));


    this.events.on('MAP_HEIGHT_CHANGE', change => {


    });

  }

  initScene(){

    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0xE5F2FB);
    // this.threeScene.fog = new THREE.FogExp2( 0xFFFFFF , 0.005 );

    this.threeRenderer = new THREE.WebGLRenderer({antialias: true});
    this.threeRenderer.setPixelRatio(window.devicePixelRatio);
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.threeRenderer.domElement);

    document.body.appendChild( WEBVR.createButton( this.threeRenderer ) );
    // this.threeRenderer.vr.enabled = true;

    this.threeCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
    this.threeCamera.position.set(0, CAMERAHEIGHT, 0);

    // controls
    const controls = new THREE.MapControls(this.threeCamera, this.threeRenderer.domElement);
    controls.screenSpacePanning = false;
    controls.minDistance = 5;
    controls.maxDistance = 500000;
    controls.maxPolarAngle = 1.2;

    // lights

    // light needs to walk with the camera
    // var light = new THREE.PointLight( 0xffffff, 1, 1800 );
    // light.position.set( 0,150, 0 );
    // this.threeScene.add( light );

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    this.threeScene.add(light);

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(-1, -1, -1);
    this.threeScene.add(light);

    var light = new THREE.AmbientLight(0x222222);
    this.threeScene.add(light);

    window.addEventListener('resize', () => {
      this.threeCamera.aspect = window.innerWidth / window.innerHeight;
      this.threeCamera.updateProjectionMatrix();
      this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

  }

  get() {
    return this;
  }

  addTiles(options = {}){

    this.mapTiles = new THREE.Group();
    this.mapTiles.name = options.mapTiles || 'mapbox';
    this.threeScene.add(this.mapTiles);

    if(options.dataTiles){
      this.dataTiles = new THREE.Group();
      this.dataTiles.name = options.dataTiles || 'buildings';
      this.threeScene.add(this.dataTiles);

    }

    // this.cam.addMovementWatcher();
    this.tiles.update(this.position)

  }

}


// TODO: its not working, mabe use set interval to keep track of href and map position
// const startPos = window.location.href.split("/");
// // console.log(startPos)
// if(startPos.length === 8){
//   // http://localhost/git/aframeCameraPosition/#/19/56
//   this.position = new LatLng( startPos[startPos.length-1], startPos[startPos.length-2], this.zoom );
//   console.log(this.position)
// }



// addEvents() {
//
//   // // Prevent to open context menu on right click
//   // document.body.addEventListener("contextmenu", (e) => {
//   //   e.stopPropagation();
//   //   e.preventDefault();
//   // });
//   //
//   // document.body.addEventListener("wheel", (e) => {
//   //   this.events.emit('MAP_HEIGHT_CHANGE', e.deltaY);
//   // });
//   //
//   // document.body.addEventListener("mousemove", (e) => {
//   //   e.stopPropagation();
//   //   e.preventDefault();
//   //   this.events.emit('MOUSE_POSITION_CHANGE', e);
//   // });
//   //
//   // document.getElementById('mapzoom-plus').addEventListener("click", () => this.events.emit('MAP_HEIGHT_CHANGE', -3));
//   // document.getElementById('mapzoom-minus').addEventListener("click", () => this.events.emit('MAP_HEIGHT_CHANGE', 3));
//
//   // this.events.on('MAP_HEIGHT_CHANGE', change => {
//   //
//   //   let posY = this.cam.getPosition().y;
//   //   let newPosY = util.clamp(parseInt(this.camera.position.y)+change, CAMERA_MIN_HEIGHT, CAMERA_MAX_HEIGHT);
//   //
//   //   // (posY <= 90 && posY > 1) ? this.cam.setRotationX(change):false;
//   //   this.cam.setHeight(newPosY);
//   //
//   // });
//
//   // this.events.on('MOUSE_POSITION_CHANGE', e => {
//   //
//   //   // left button
//   //   if(e.buttons === 1){
//   //     this.events.emit('MAP_POSITION_CHANGE', e);
//   //
//   //     // right button
//   //   } else if(e.buttons === 2){
//   //     this.events.emit('MAP_ROTATION_CHANGE', e);
//   //   }
//   //
//   // });
//
//   // this.events.on('MAP_POSITION_CHANGE', e => {
//   //
//   //   // util.showMatrix(this.camera.matrixWorld);
//   //
//   //   // util.showMatrix(this.camera.modelViewMatrix);
//   //
//   //   // console.log(this.camera);
//   //
//   //   const pos = this.cam.getPosition();
//   //   this.cam.setPosition({x: pos.x+(e.movementX*MOVINGFACTOR_MOUSE*-1), y: pos.y, z: pos.z+(-1*e.movementY*MOVINGFACTOR_MOUSE)});
//   //
//   // });
//
//   // let oldAngle = 45;
//   //
//   // this.events.on('MAP_ROTATION_CHANGE', change => {
//   //   // console.log('mousemovement button 2', change)
//   //   // this.cam.setRotationY(change.movementX);
//   //   let newAngle = util.clamp(oldAngle+(change.movementY/2),0.01,90)
//   //   //
//   //   oldAngle = newAngle;
//   //   this.cam.setRotationTest(newAngle)
//   //   // this.cam.setRotationTest(change.movementY)
//   //
//   // });
//
//   // document.body.addEventListener("click", (e) => {
//   //   e.stopPropagation();
//   //   e.preventDefault();
//   //
//   // });
//   //
//   // document.body.addEventListener("mousedown", (e) => {
//   //   e.stopPropagation();
//   //   e.preventDefault();
//   //
//   // });
//
//
// }


/*



performance

staendige if abfrage ob framrate schlecht ist. Wenn ja dann abschalten von: Schatten, shadows,
antialiasing, reducing the resolution(setPixelRatio)

https://threejs.org/docs/#api/en/objects/LOD



 */