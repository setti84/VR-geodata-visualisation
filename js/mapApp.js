class MapApp {

  constructor(options = {}){

    this.zoom = options.zoom || 18;
    this.position = new LatLng(options.position.lat, options.position.lng, this.zoom) || new LatLng( 52.545, 13.355, this.zoom);
    this.debugging = options.debugging || false;
    this.maptiles = options.maptiles || 'mapbox';
    this.events = new Events();

    // this.originLatLng = new LatLng( 52.54591075494661, 13.355914950370789 );   //Berlin beuth
    // this.originLatLng = new LatLng(40.72372, -73.98922);   // New York
    // this.originLatLng = new LatLng(1.29422,103.85411);        // Singapore
    // this.originLatLng = new LatLng(0,0);
    // this.originLatLng = new LatLng( 52.54591075494661, 13.355914950370789 );

    var testi = new DataTile(this.originLatLng, [563187, 704813]);
    testi.create();


    const startPos = window.location.href.split("/");
    if(startPos.length === 8){
      // http://localhost/git/aframeCameraPosition/#/19/56
      this.position = new LatLng( startPos[startPos.length-1], startPos[startPos.length-2], this.zoom );
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