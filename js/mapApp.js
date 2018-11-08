class MapApp {

  constructor(options = {}){

    this.zoom = options.zoom || 18;
    this.position = new LatLng(options.position.lat, options.position.lng, this.zoom) || new LatLng( 52.545, 13.355, this.zoom);
    this.debugging = options.debugging || false;
    this.maptiles = options.maptiles || 'mapbox';
    const scene = this.threeScene = document.querySelector('a-scene').object3D;
    this.events = new Events();
    this.textureManager = new TextureManager();
    this.camera = document.querySelector('#camera').object3D;
    console.log(this.camera)

    const dataTiles = this.dataTiles = new THREE.Group();
    dataTiles.name = 'buildings';
    scene.add(dataTiles);

    const basetiles = this.baseTiles = new THREE.Group();
    basetiles.name = 'basemap';
    scene.add(basetiles);

    this.scaleFactor = 1;
    this.oldScaleFactor = 1;
    this.scale = document.getElementById("scale-slider");
    this.initScale();

    // TODO: array(or map object?) with mother object for tiles? like plane geometry, building geometry, everything we need more than once for tiles?
    // TODO: Scaling: buildings should be closer together, maptiles needs to be improved

    // TODO: its not working, mabe use set interval to keep track of href and map position
    const startPos = window.location.href.split("/");
    // console.log(startPos)
    if(startPos.length === 8){
      // http://localhost/git/aframeCameraPosition/#/19/56
      this.position = new LatLng( startPos[startPos.length-1], startPos[startPos.length-2], this.zoom );
      console.log(this.position)
    }

  }

  get() {
    return this;
  }

  initScale() {
    let target, temp;
    this.scale.addEventListener('input', (e) => {
      target = (e.target) ? e.target : e.srcElement;
      // calculation: (max-1)*Math.pow(val, strength) + min;
      // temp = (4-1)*Math.pow(target.value, 2.5);
      // // set minimum value to 0.00003
      // temp = temp < 0.07 ? 0.07 : temp;
      this.scaleFactor = target.value;
      this.changeScale();
      console.log(target.value)
    })

  }

  changeScale() {

    // this.camera.scale.set(this.camera.scale.x/this.oldScaleFactor*this.scaleFactor, this.camera.scale.y, this.camera.scale.z/this.oldScaleFactor*this.scaleFactor);
    this.camera.position.set(this.camera.position.x, 0+this.scaleFactor, this.camera.position.z);

    // console.log(this.oldScaleFactor)
    // console.log(this.scaleFactor)
    // this.threeScene.children.forEach( e => {
    //   if(e.type === 'Group' ) {
    //     if(e.name === 'buildings' || e.name === 'basemap') { // /this.oldScaleFactor*this.scaleFactor
    //
    //       e.position.set(e.position.x/this.oldScaleFactor*this.scaleFactor, e.position.y/this.oldScaleFactor*this.scaleFactor, e.position.z/this.oldScaleFactor*this.scaleFactor );
    //       e.scale.set(e.scale.x/this.oldScaleFactor*this.scaleFactor,  e.scale.y, e.scale.z/this.oldScaleFactor*this.scaleFactor );
    //
    //     }
    //   }
    // });

    // this.oldScaleFactor = this.scaleFactor;

  }


}


/*



performance

staendige if abfrage ob framrate schlecht ist. Wenn ja dann abschalten von: Schatten, shadows,
antialiasing, reducing the resolution(setPixelRatio)

https://threejs.org/docs/#api/en/objects/LOD



 */