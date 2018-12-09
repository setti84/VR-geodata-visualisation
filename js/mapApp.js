class MapApp {

  constructor(options = {}){

    this.zoom = options.zoom || 18;
    this.position = new LatLng(options.position.lat, options.position.lng, this.zoom) || new LatLng( 52.545, 13.355, this.zoom);
    this.debugging = options.debugging || false;
    this.vrEnable = false;
    this.tiles = new Tiles(this.position);
    // this.threeSky = null;
    this.threeScene = null;
    this.threeCamera = null;
    this.threeRenderer = null;
    this.threeLight = {};
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

    console.log(this.threeRenderer.info);

    this.setUrlHash();

  }

  animationLoop(){
    if(this.vrEnable && this.vrMode.isSelecting){
      this.vrMode.handleController();
    }

    // this.threeLight.pointLight.position.set(this.threeCamera.position.x, this.threeCamera.position.y, this.threeCamera.position.z)

    if(this.debugging){
      this.debuggingCube.position.set(this.cam.camPosOnSurface.x, this.cam.camPosOnSurface.y, this.cam.camPosOnSurface.z);
    }
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


    // https://threejs.org/examples/?q=sky#webgl_shaders_sky
    const phi = 2 * Math.PI * ( 0.25 - 0.5 ); // azimuth
    const theta = Math.PI * ( 0.453 - 0.5 ); // inclination
    const sunPos = new THREE.Vector3(400000* Math.cos( phi ), 400000* Math.sin( phi ) * Math.sin( theta ),400000 * Math.sin( phi )* Math.cos( theta ))

    const sky = new THREE.Sky();
    sky.scale.setScalar( 450000 );
    this.threeScene.add( sky );

    sky.onBeforeCompile = shader => {
      shader.uniforms.sunPosition = { value: sunPos };
    };

    sky.material.uniforms.sunPosition.value.set(sunPos.x, sunPos.y, sunPos.z)

    // Add Sun Helper
    const sunSphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry( 30, 16, 8 ),
      new THREE.MeshBasicMaterial( { color: 0xffffff } )
    );
    sunSphere.position.set(sunPos.x, sunPos.y, sunPos.z);

    sunSphere.visible = true;
    this.threeScene.add( sunSphere );

    // lights
    // 0xffffff kind of white
    // 0xff0000 kind of red

    this.threeLight.pointLight = new THREE.PointLight( 0xffffff , 0.2);
    this.threeLight.pointLight.position.set( 0,150, 0 );
    this.threeScene.add( this.threeLight.pointLight );

    this.threeLight.directionalLight1 = new THREE.DirectionalLight(0xffffff,0.5);
    this.threeLight.directionalLight1.position.set(1, 1, 1);
    this.threeScene.add(this.threeLight.directionalLight1);

    this.threeLight.directionalLight2 = new THREE.DirectionalLight(0xffffff,0.5);
    this.threeLight.directionalLight2.position.set(-1, -1, -1);
    this.threeScene.add(this.threeLight.directionalLight2);

    if(this.debugging){

      if(this.threeLight.pointLight){
        const pointLightHelper = new THREE.PointLightHelper( this.threeLight.pointLight, 30 ); // second value size sphere as lightbulb
        this.threeScene.add( pointLightHelper );
      }

      if(this.threeLight.directionalLight1){
        const helper = new THREE.DirectionalLightHelper( this.threeLight.directionalLight1, 150 );
        this.threeScene.add( helper );
      }

      if(this.threeLight.directionalLight2){
        const helper2 = new THREE.DirectionalLightHelper( this.threeLight.directionalLight2, 150 );
        this.threeScene.add( helper2 );
      }

    }

    this.threeLight.ambientLight = new THREE.AmbientLight(0x404040 ); // 0x222222
    this.threeScene.add(this.threeLight.ambientLight);

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
