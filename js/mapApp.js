class MapApp {

  constructor(options = {}){

    this.status = { busy: 'startLoading', vr: false, debugging: options.debugging || false }; // busy: startLoading, loading, moving(includes paning,rotating, pitching),...
    this.zoom = options.zoom || 16;
    this.mapHeight = 1400;
    this.position = new LatLng(options.position.lat, options.position.lng, this.zoom) || new LatLng( 52.545, 13.355, this.zoom);
    // this.debugging = options.debugging || false;
    this.debugging = {};

    this.threeScene = null;
    this.threeCamera = null;
    this.threeRenderer = null;
    this.threeLight = {};
    // this.ground = null;
    this.initScene();

    this.vrMode = new VrMode();
    this.events = new Events();
    // this.textureManager = new TextureManager();
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

    this.setUrlHash();

    this.threeRenderer.setAnimationLoop( () =>{
      this.animationLoop();
    } );


  }

  animationLoop(){

    // init loading phase ended
    if(this.status.busy === 'startLoading'){
      this.status.busy = 'idle';
    }

    // console.log(this.status)

    if(this.status.vr && this.vrMode.gamepadConnected){
      this.vrMode.handleController();
    }

    this.threeRenderer.render(this.threeScene, this.threeCamera);

  }

  setPosition( lat, lng){

    lat = util.clamp(lat,-89,89);
    lng = util.clamp(lng,-179,179)
    // if(lat < -80 || lat > 80 || lng < -180 || lng > 180) return;

    const newPos = new THREE.Vector3(Math.floor(util.wgs2MercX(lng)) ,0, Math.floor(util.wgs2MercY(lat))*-1);
    this.events.emit('CAMPOS_ON_SURFACE_MOVE', newPos);
    this.controls.moveMap(newPos);
    this.controls.update();


    // console.log(JSON.stringify(this.cam.originlatLon.lng))

    // neue position in mercator

    // const oldPos = { x: Math.floor(util.wgs2MercX(this.cam.originlatLon.lng)) , z: Math.floor(util.wgs2MercY(this.cam.originlatLon.lat)) };
    // console.log(oldPos);
    // console.log(newPos);
    // const delta = { x: Math.floor(newPos.x - oldPos.x) , z: Math.floor(newPos.y - oldPos.y)};

    // const delta = {x: Math.floor(Math.sqrt(Math.pow(oldPos.x,2) - Math.pow(newPos.x,2))) , y: Math.sqrt( Math.pow(oldPos.y,2) - Math.pow(newPos.y,2))}

    // console.log('before: ' + JSON.stringify(this.threeCamera.position));

    // this.threeCamera.position.setY(1);
    // console.log(JSON.stringify(this.cam.camPosOnSurface));
    // this.threeCamera.position.set({x: this.threeCamera.position.x , y: this.threeCamera.position.y, z: this.threeCamera.position.z });
    // console.log('after: ' + JSON.stringify(this.threeCamera.position));

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


    // paning
    this.events.on('CAMPOS_ON_SURFACE_MOVE', target => {

      // console.log(JSON.stringify(this.threeCamera.position));

      this.events.emit('CAM_VIEW_CHANGE');

      // console.log(target)

      this.cam.setPosition(target);
      // this.threeLight.pointLight.position.set(this.cam.camPosOnSurface.x, 300, this.cam.camPosOnSurface.z)
      // this.ground.position.set(this.cam.camPosOnSurface.x, -1, this.cam.camPosOnSurface.z);
      if(this.raycastFrame){
        this.raycastFrame.position.set(this.cam.camPosOnSurface.x, this.raycastFrame.position.y, this.cam.camPosOnSurface.z);
      }

      if(this.status.debugging){
        // this.debugging.camCube.position.set(this.cam.camPosOnSurface.x, this.cam.camPosOnSurface.y, this.cam.camPosOnSurface.z);

        // this.threeLight.pointLightHelper.position.set(this.cam.camPosOnSurface.x, 300, this.cam.camPosOnSurface.z);
      }

    });


    // paning, zooming, tilting,...
    this.events.on('CAM_VIEW_CHANGE',() => {
      if(this.raycastFrame){
        this.cam.updateRaycaster();
      }



      // this.tiles.noName();
      // console.log('init update map');
      // console.log(this.threeCamera.position.y);

    });

    // **************** MAP HEIGHT *******************
    this.events.on('MAP_ZOOM_CHANGE', (change) => {

      if(this.mapHeight > this.controls.maxDistance ) return;

      this.mapHeight = this.mapHeight+change.deltaY;
      // console.log('Cameraheight : ' + this.threeCamera.position.y)
      // console.log(change)
      // console.log('zoom change')
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

      // console.log(`set Map status: ${state}`)
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

    // this.events.on('VR_MOVE_CAMERA', change => {
    //   this.controls.setRotation(change);
    // });
    //
    // this.events.on('VR_MOVE', change => {
    //   this.controls.setRotation(change);
    // });

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

    // window.addEventListener( 'click', ( event ) => {
    //   console.log(event)
    //   // console.log(window.innerHeight)
    //   console.log(this.cam.frustumPosition)
    // }, false );


  }

  // getZoom(){
  //   return this.zoom;
  // }
  //
  //
  // setZoom(zoom){
  //
  //   if (this.zoom !== zoom) {
  //     this.zoom = zoom;
  //   }
  //
  // }

  getCamerHeight(){

    // this.mapHeight = 3000000;

    this.mapHeight = 500;


    // function onWindowResize( event ) {
    //
    //   camera.aspect = window.innerWidth / window.innerHeight;
    //
    //   // adjust the FOV
    //   camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( window.innerHeight / windowHeight ) );
    //
    //   camera.updateProjectionMatrix();
    //   camera.lookAt( scene.position );
    //
    //   renderer.setSize( window.innerWidth, window.innerHeight );
    //   renderer.render( scene, camera );
    //
    // }


    // this.mapHeight = (-220*this.zoom)+4380;


      // switch(zoom) {
      //
      // case 20:
      //   this.mapHeight = 425;
      //   break;
      // case 19:
      //   this.mapHeight = 850;
      //   break;
      // case 18:
      //   this.mapHeight = 1375;
      //   break;
      // case 17:
      //   this.mapHeight = 1800;
      //   break;
      // case 16:
      //   this.mapHeight = 2225;
      //   break;
      //
      // }
      //
      // console.log(this.mapHeight)


  }

  initScene(){

    this.getCamerHeight();

    this.threeScene = new THREE.Scene();
    // this.threeScene.fog = new THREE.FogExp2( 0xFFFFFF , 0.0004 ); // default 0.00025

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
    const maxSize = 20000000; // const maxSize = 20000000;
    this.raycastFrame = new THREE.Mesh(
      new THREE.BoxBufferGeometry( maxSize, CAMERA_MAX_FAR, maxSize), //10000, 2000, 10000
      new THREE.MeshBasicMaterial( { visible: false, color: 0xFFFFFF, side:THREE.DoubleSide} ) // 0xFFFFFF 0xf0ff00
    );
    this.raycastFrame.name = 'raycastFrame';
    this.raycastFrame.position.set( 0,CAMERA_MAX_FAR/2,0 );
    this.threeScene.add( this.raycastFrame );


    // Ground
    // this.ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( maxSize, maxSize ), new THREE.MeshBasicMaterial( {color: 0xFFFFFF} ) );
    // this.ground.name = 'ground';
    // this.ground.rotation.x = -Math.PI / 2;
    // this.ground.position.set( 0,-1,0 );
    // this.threeScene.add( this.ground );

    // https://threejs.org/examples/?q=sky#webgl_shaders_sky
    const theta = Math.PI * ( 0 - 0.5 ); // inclination   0.453
    const phi = 2 * Math.PI * ( 0.25 - 0.5 ); // azimuth   0.25
    const sunPos = new THREE.Vector3(400000* Math.cos( phi ), 400000* Math.sin( phi ) * Math.sin( theta ),400000 * Math.sin( phi )* Math.cos( theta ))

    const sky = new THREE.Sky();
    sky.scale.setScalar( 20000000 );
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

    console.log(this.threeScene)

    // lights
    // 0xffffff kind of white
    // 0xff0000 kind of red

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



    // this.tiles.update(this.position)

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