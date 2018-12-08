class MapApp {

  constructor(options = {}){

    this.zoom = options.zoom || 18;
    this.position = new LatLng(options.position.lat, options.position.lng, this.zoom) || new LatLng( 52.545, 13.355, this.zoom);
    this.debugging = options.debugging || false;
    this.vrEnable = false;
    this.tiles = new Tiles(this.position);
    this.threeScene = null;
    this.threeCamera = null;
    this.threeRenderer = null;
    this.initScene();

    this.vrMode = new VrMode();
    this.events = new Events();
    // this.textureManager = new TextureManager();
    this.cam = new MapCamera(this.position, this.threeCamera);
    this.workerPool = new Workerpool();

    this.addEvents();

    //debugging
    const geometry = new THREE.BoxGeometry( 5, 5, 5 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    this.debuggingCube = new THREE.Mesh( geometry, material );
    if(this.debugging){
      const axesHelper = new THREE.AxesHelper( 150 );
      this.threeScene.add(axesHelper);
      this.threeScene.add( this.debuggingCube );
    }

    this.threeRenderer.setAnimationLoop( () =>{
      this.animationLoop();
    } );

    console.log(this.threeRenderer.info)

    this.setUrlHash();

  }

  animationLoop(){
    if(this.vrEnable && this.vrMode.isSelecting){
      this.vrMode.handleController();

    }
    //console.log(this.threeRenderer.vr.isPresenting())
    //console.log(WEBVR);
    //console.log(this.threeScene);
    // let timer = 0;
    // uniforms.amplitude.value = util.clamp(uniforms.amplitude.value+0.01,0,1);
    if(this.debugging){
      this.debuggingCube.position.set(this.cam.camPosOnSurface.x, this.cam.camPosOnSurface.y, this.cam.camPosOnSurface.z);
    }
    // timer=util.clamp(timer+0.01,0,1);
    this.threeRenderer.render(this.threeScene, this.threeCamera);
  }

  mapOriginChange(){
    console.log('map origin change')
  }

  setUrlHash() {
    // set hash if none is in URL
    if(window.location.hash.length === 0){
      this.events.emit('MAP_URL_CHANGE', `${this.position.zoom}/${parseFloat(this.position.lat).toFixed(6)}/${parseFloat(this.position.lng).toFixed(6)}`);
    }else {
      // // set map on this position
      // const position = window.location.hash;
      // const zoomLatLng = position.split('/');
      // this.position = new LatLng(zoomLatLng[1], zoomLatLng[2], this.zoom) || new LatLng( 52.545, 13.355, this.zoom);
      // this.mapOriginChange();
    }
  }

  addEvents() {

    this.events.on('MAP_URL_CHANGE', position => {
      // console.log('map url change')
      window.location.hash = `${position}`;
    });

    this.events.on('CAMPOS_ON_SURFACE_MOVE', target => {
      this.cam.setPosition(target);
    });

    this.events.on('MAP_HEIGHT_CHANGE', change => {
      this.controls.setDolly(change);
    });

    this.events.on('MAP_TILT_CHANGE', change => {
      this.controls.setTilt(change);
    });

    this.events.on('MAP_ROTATION_CHANGE', change => {
      this.controls.setRotation(change);
    });

    this.events.on('HANDLE_VR', event => {
      console.log('enter VR mode')
       if(this.vrEnable){
        this.vrEnable = false;
        this.vrMode.end();
         this.threeRenderer.vr.enabled = false;
      } else{
        this.vrEnable = true;
        this.vrMode.start();
      }
    });

    this.events.on('VR_MOVE_CAMERA', change => {
      this.controls.setRotation(change);
    });

    this.events.on('VR_MOVE', change => {
      this.controls.setRotation(change);
    });

    document.getElementById('mapzoom-plus').addEventListener('click', () => this.events.emit('MAP_HEIGHT_CHANGE', 0.8) );
    document.getElementById('mapzoom-minus').addEventListener('click', () => this.events.emit('MAP_HEIGHT_CHANGE', 1.4));

    document.getElementById('maptilt-up').addEventListener('click', () => this.events.emit('MAP_TILT_CHANGE', 1) );
    document.getElementById('maptilt-down').addEventListener('click', () => this.events.emit('MAP_TILT_CHANGE', -1));

    document.getElementById('maprotate-counterclock').addEventListener('click', () => this.events.emit('MAP_ROTATION_CHANGE', -1) );
    document.getElementById('maprotate-clock').addEventListener('click', () => this.events.emit('MAP_ROTATION_CHANGE', 1));

    document.getElementById('enter-VR').addEventListener('click', () => this.events.emit('ENTER_VR'));

    window.addEventListener( 'vrdisplaypresentchange', ( event ) => {
      this.events.emit('HANDLE_VR', event)
    }, false );

    // window.addEventListener( 'click', ( event ) => {
    //
    // }, false );


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
    //this.threeRenderer.vr.enabled = true;

    this.threeCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 15000);
    this.threeCamera.position.set(0, CAMERAHEIGHT, 0);

    // controls
    this.controls = new THREE.MapControls(this.threeCamera, this.threeRenderer.domElement);
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 500000;
    this.controls.maxPolarAngle = 1.2;


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
      console.log('add datatiles')
      this.dataTiles = new THREE.Group();
      this.dataTiles.name = options.dataTiles || 'buildings';
      this.threeScene.add(this.dataTiles);

    }
    // init tile loading
    this.tiles.update(this.position)

  }

}
