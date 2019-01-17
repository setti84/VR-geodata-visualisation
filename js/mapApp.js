class MapApp {

  constructor(options = {}){

    this.setUrlHash();

    this.status = { busy: 'startLoading', vr: false, debugging: options.debugging || false }; // busy: startLoading, loading, moving(includes paning,rotating, pitching),...
    this.zoom = options.zoom || 16;
    this.mapHeight = 1400;
    this.position = new LatLng(options.position.lat, options.position.lng, this.zoom) || new LatLng( 52.545, 13.355, this.zoom);
    this.debugging = {};

    this.threeScene = null;
    this.threeCamera = null;
    this.threeRenderer = null;
    this.threeLight = {};
    this.initScene();

    this.vrMode = new VrMode();
    this.events = new Events();
    this.cam = new MapCamera(new LatLng(0, 0, this.zoom), this.threeCamera);
    this.workerPool = new Workerpool();

    this.addEvents();

    //debugging
    if(this.status.debugging){

      const size = 40000;
      const boxGeometry = new THREE.BoxGeometry( size, size, size );
      const colorGreen = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
      colorGreen.depthTest = false;
      this.debugging.camCube = new THREE.Mesh( boxGeometry, colorGreen );
      this.debugging.camCube.renderOrder = 1;
      this.threeScene.add( this.debugging.camCube );

    }



    this.threeRenderer.setAnimationLoop( () =>{
      this.animationLoop();
    });

  }

  animationLoop(){

    // init loading phase ended
    if(this.status.busy === 'startLoading'){
      this.status.busy = 'idle';
    }

    if(this.status.vr && this.vrMode.gamepadConnected){
      this.vrMode.handleController();
    }

    this.threeRenderer.render(this.threeScene, this.threeCamera);

  }

  setPosition( lat, lng){

    lat = util.clamp(lat,-89,89);
    lng = util.clamp(lng,-179,179);

    const newPos = new THREE.Vector3(Math.floor(util.wgs2MercX(lng)) ,0, Math.floor(util.wgs2MercY(lat))*-1);
    this.events.emit('CAMPOS_ON_SURFACE_MOVE', newPos);
    this.controls.moveMap(newPos);
    this.controls.update();

  }

  setUrlHash() {
    // set hash if none is in URL

    console.log(window.location.hash)

    if(window.location.hash.length === 0){

      return null;
      // this.events.emit('MAP_URL_CHANGE', `${this.position.zoom}/${parseFloat(this.position.lat).toFixed(6)}/${parseFloat(this.position.lng).toFixed(6)}`);
    }
    else {
        // // set map on this position
        const position = window.location.hash;
        const zoomLatLng = position.split('/');

      return new LatLng(options.position.lat, options.position.lng, zoomLatLng[0].substring(1, zoomLatLng[0].length))

    }
  }

  addEvents() {

    this.events.on('MAP_URL_CHANGE', position => {
      window.location.hash = `${position}`;
    });

    // paning
    this.events.on('CAMPOS_ON_SURFACE_MOVE', target => {

      this.events.emit('CAM_VIEW_CHANGE');

      this.cam.setPosition(target);
      this.raycastFrame.position.set(this.cam.camPosOnSurface.x, this.raycastFrame.position.y, this.cam.camPosOnSurface.z);
      this.ground.position.set(this.cam.camPosOnSurface.x, -1, this.cam.camPosOnSurface.z);

      if(this.status.debugging){
        this.debugging.camCube.position.set(this.cam.camPosOnSurface.x, this.cam.camPosOnSurface.y, this.cam.camPosOnSurface.z);
        this.threeLight.pointLightHelper.position.set(this.cam.camPosOnSurface.x, 300, this.cam.camPosOnSurface.z);
      }

    });


    // paning, zooming, tilting,...
    this.events.on('CAM_VIEW_CHANGE',() => {
      this.cam.updateRaycaster();

    });

    // **************** MAP HEIGHT *******************
    this.events.on('MAP_ZOOM_CHANGE', (change) => {

      if(this.mapHeight > this.controls.maxDistance ) return;

      this.mapHeight = this.mapHeight+change.deltaY;
    });

    this.events.on('MAP_HEIGHT_SET', change => {

      this.controls.setDolly(change);
      this.events.emit('MAP_STATUS_BUSY', 'moving');
      // timeout fakes end of button use
      setTimeout( () => {
        this.events.emit('MAP_STATUS_BUSY', 'idle');
        this.events.emit('CAM_VIEW_CHANGE');
      },100);

    });

    // **************** MAP TILT *******************
    this.events.on('MAP_TILT_CHANGE_START', () => {
      this.events.emit('MAP_STATUS_BUSY', 'moving');
    });

    this.events.on('MAP_TILT_SET', change => {
      this.controls.setTilt(change);
      this.events.emit('MAP_TILT_CHANGE_START');
      // timeout fakes end of button use
      setTimeout( () => {
        this.events.emit('MAP_STATUS_BUSY', 'idle');
        this.events.emit('CAM_VIEW_CHANGE');
      },100);
    });


    // **************** MAP ROTATION *******************
    this.events.on('MAP_ROTATION_CHANGE_START', () => {
      this.events.emit('MAP_STATUS_BUSY', 'moving');
    });

    this.events.on('MAP_ROTATION_SET', change => {
      this.controls.setRotation(change);
      this.events.emit('MAP_ROTATION_CHANGE_START');
      // timeout fakes end of button use
      setTimeout( () => {
        this.events.emit('MAP_STATUS_BUSY', 'idle');
        this.events.emit('CAM_VIEW_CHANGE');
      },100);
    });


    // map movement starts
    this.events.on('MAP_STATUS_BUSY', (state) => {
      this.status.busy = state;
    });

    this.events.on('HANDLE_VR', event => {
      console.log('enter VR mode')
       if(this.status.vr){
        this.status.vr = false;
        this.vrMode.end();
         this.threeRenderer.vr.enabled = false;
      } else{
        this.status.vr = true;
        this.vrMode.start();
      }
    });

    document.getElementById('mapzoom-plus').addEventListener('click', () => this.events.emit('MAP_HEIGHT_SET', -53) );
    document.getElementById('mapzoom-minus').addEventListener('click', () => this.events.emit('MAP_HEIGHT_SET', 53));

    document.getElementById('maptilt-up').addEventListener('click', () => this.events.emit('MAP_TILT_SET', 1) );
    document.getElementById('maptilt-down').addEventListener('click', () => this.events.emit('MAP_TILT_SET', -1));

    document.getElementById('maprotate-counterclock').addEventListener('click', () => this.events.emit('MAP_ROTATION_SET', -1) );
    document.getElementById('maprotate-clock').addEventListener('click', () => this.events.emit('MAP_ROTATION_SET', 1));

    document.getElementById('enter-VR').addEventListener('click', () => this.events.emit('ENTER_VR'));

    window.addEventListener( 'vrdisplaypresentchange', ( event ) => {
      this.events.emit('HANDLE_VR', event)
    }, false );


  }

  getCamerHeight(){

    // find a way to generate camera height

    this.mapHeight = 500;

  }

  initScene(){

    this.getCamerHeight();

    this.threeScene = new THREE.Scene();

    // this.threeScene.fog = new THREE.Fog( 0xFFFFFF , 4000,10000 ); // COLOR, NEAR, FAR

    this.threeRenderer = new THREE.WebGLRenderer({antialias: true});
    this.threeRenderer.setPixelRatio(window.devicePixelRatio);
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.threeRenderer.domElement);

    document.body.appendChild( WEBVR.createButton( this.threeRenderer ) );

    this.threeCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_MAX_FAR);
    this.threeCamera.position.set(0, this.mapHeight , 0); //

    // controls
    this.controls = new THREE.MapControls(this.threeCamera, this.threeRenderer.domElement);
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 5;
    this.controls.maxPolarAngle = 1.3;
    this.controls.maxDistance = CAMERA_MAX_FAR;

    // Raycast
    const maxSize = 20000000;
    this.raycastFrame = new THREE.Mesh(
      new THREE.BoxBufferGeometry( maxSize, CAMERA_MAX_FAR, maxSize), //10000, 2000, 10000
      new THREE.MeshBasicMaterial( { visible: false, color: 0xf0ff00, side:THREE.DoubleSide} ) // 0xFFFFFF 0xf0ff00
    );
    this.raycastFrame.name = 'raycastFrame';
    this.raycastFrame.position.set( 0,CAMERA_MAX_FAR/2,0 );
    this.threeScene.add( this.raycastFrame );

    // Ground
    const geometry = new THREE.PlaneBufferGeometry( maxSize, maxSize );
    const material = new THREE.MeshBasicMaterial( {color: 0xFFFFFF, side: THREE.FrontSide} );
    this.ground = new THREE.Mesh( geometry, material );
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.set(0,-1,0);
    this.threeScene.add( this.ground );

    // // Sky    https://threejs.org/examples/?q=sky#webgl_shaders_sky
    const theta = Math.PI * ( 0 - 0.5 ); // inclination   0.453
    const phi = 2 * Math.PI * ( 0.25 - 0.5 ); // azimuth   0.25
    const sunPos = new THREE.Vector3( 400000* Math.cos( phi ) , 400000* Math.sin( phi ) * Math.sin( theta ) , 400000 * Math.sin( phi )* Math.cos( theta ) );

    const sky = new THREE.Sky();
    sky.scale.setScalar( 20000000 );
    this.threeScene.add( sky );

    sky.onBeforeCompile = shader => {
      shader.uniforms.sunPosition = { value: sunPos };
    };
    sky.material.uniforms.sunPosition.value.set(sunPos.x, sunPos.y, sunPos.z)

    // Add Sun Helper
    const sunSphere = new THREE.Mesh( new THREE.SphereBufferGeometry( 30, 16, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
    sunSphere.position.set(sunPos.x, sunPos.y, sunPos.z);

    sunSphere.visible = true;
    this.threeScene.add( sunSphere );

    this.threeLight.pointLight = new THREE.PointLight( 0xffffff , 0.2);
    this.threeLight.pointLight.position.set( 0,150, 0 );
    this.threeScene.add( this.threeLight.pointLight );

    this.threeLight.directionalLight1 = new THREE.DirectionalLight(0xffffff,0.5);
    this.threeLight.directionalLight1.position.set(1, 1, 1);
    this.threeScene.add(this.threeLight.directionalLight1);

    this.threeLight.directionalLight3 = new THREE.DirectionalLight(0xffffff,0.2);
    this.threeLight.directionalLight3.position.set(0.5, 0.5, 0.5);
    this.threeScene.add(this.threeLight.directionalLight3);

    this.threeLight.directionalLight2 = new THREE.DirectionalLight(0xffffff,0.5);
    this.threeLight.directionalLight2.position.set(-1, -1, -1);
    this.threeScene.add(this.threeLight.directionalLight2);

    if(this.status.debugging){

      if(this.threeLight.pointLight){
        this.threeLight.pointLightHelper = new THREE.PointLightHelper( this.threeLight.pointLight, 30 ); // second value size sphere as lightbulb
        this.threeScene.add( this.threeLight.pointLightHelper );
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
      this.cam.updateRaycaster();
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

    const interval = setInterval( () => {
      console.log('check')
      if(this.status.busy !== 'startLoading'){
        // init tile loading
        this.tiles = new Tiles(new LatLng(0, 0, this.zoom));
        this.setPosition( this.position.lat, this.position.lng);
        // this.setPosition(52.54591, 13.35591);
        // this.cam.updateRaycaster();
        console.log('end interval')
        clearInterval(interval);
      }
    },100);

  }

}