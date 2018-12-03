class MapApp {

  constructor(options = {}){

    this.zoom = options.zoom || 18;
    this.position = new LatLng(options.position.lat, options.position.lng, this.zoom) || new LatLng( 52.545, 13.355, this.zoom);
    this.debugging = options.debugging || false;
    this.tiles = new Tiles(this.position);
    this.threeScene = null;
    this.threeCamera = null;
    this.threeRenderer = null;
    this.initScene();

    this.events = new Events();
    // this.textureManager = new TextureManager();
    this.cam = new MapCamera(this.position, this.threeCamera);
    this.workerPool = new Workerpool();

    this.addEvents();

    //debugging
    const geometry = new THREE.BoxGeometry( 5, 5, 5 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    if(this.debugging){
      const axesHelper = new THREE.AxesHelper( 150 );
      this.threeScene.add(axesHelper);
      this.threeScene.add( cube );
    }

    let timer = 0;

    this.threeRenderer.setAnimationLoop( () => {
      // uniforms.amplitude.value = util.clamp(uniforms.amplitude.value+0.01,0,1);
      if(this.debugging){
        cube.position.set(this.cam.camPosOnSurface.x, this.cam.camPosOnSurface.y, this.cam.camPosOnSurface.z);
      }
      timer=util.clamp(timer+0.01,0,1);
      this.threeRenderer.render(this.threeScene, this.threeCamera);

    });
    console.log(this.threeRenderer.info)

    this.setUrlHash();

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

    document.getElementById('mapzoom-plus').addEventListener('click', () => this.events.emit('MAP_HEIGHT_CHANGE', 0.8) );
    document.getElementById('mapzoom-minus').addEventListener('click', () => this.events.emit('MAP_HEIGHT_CHANGE', 1.4));

    document.getElementById('maptilt-plus').addEventListener('click', () => this.events.emit('MAP_TILT_CHANGE', 0.8) );
    document.getElementById('maptilt-minus').addEventListener('click', () => this.events.emit('MAP_TILT_CHANGE', 1.4));

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

/*
performance

staendige if abfrage ob framrate schlecht ist. Wenn ja dann abschalten von: Schatten, shadows,
antialiasing, reducing the resolution(setPixelRatio)

https://threejs.org/docs/#api/en/objects/LOD



 */