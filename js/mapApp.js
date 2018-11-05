class MapApp {

  constructor(options = {}){

    this.zoom = options.zoom || 18;
    this.position = new LatLng(options.position.lat, options.position.lng, this.zoom) || new LatLng( 52.545, 13.355, this.zoom);
    this.debugging = options.debugging || false;
    this.maptiles = options.maptiles || 'mapbox';
    this.events = new Events();
    // this.textureLoader = new THREE.TextureLoader();
    this.textureManager = new TextureManager();
    // TODO: array(or map object?) with mother object for tiles? like plane geometry, building geometry, everything we need more than once for tiles?
    // TODO: Scaling: buildings should be closer together, maptiles needs to be improved

    // var testi = new DataTile(this.position, [563187, 704813]);
    // testi.create();


    // TODO: its not working, mabe use set interval to keep track of href and map position
    const startPos = window.location.href.split("/");
    // console.log(startPos)
    if(startPos.length === 8){
      // http://localhost/git/aframeCameraPosition/#/19/56
      this.position = new LatLng( startPos[startPos.length-1], startPos[startPos.length-2], this.zoom );
      console.log(this.position)
    }

    // this.cam = new Camera(this.position);

  }

  get() {
    return this;
  }

}


/*



performance

staendige if abfrage ob framrate schlecht ist. Wenn ja dann abschalten von: Schatten, shadows,
antialiasing, reducing the resolution(setPixelRatio)

https://threejs.org/docs/#api/en/objects/LOD



 */