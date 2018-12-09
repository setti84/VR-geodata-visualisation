let map;

const init = () => {

  if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
  }

//   {lat: 52.54591, lng: 13.35591}   //Berlin beuth
//   {lat: 40.72372, lng: -73.98922}   New York
//   {lat:1.29422, lng: 103.85411}     Singapore
//   {lat:-46.63604, lng: -23.54887}   Sao Paulo
//   {lat: 52.54081, lng: 12.994}      Elstal

  map = new MapApp({
    zoom: 16,
    position: {lat: 52.5459, lng: 13.35591} ,
    debugging: false,
  });

  map.addTiles({mapTiles: 'mapbox', dataTiles: 'buildings'});

  const addStats = () => {
    javascript:(function () {
      var script = document.createElement('script');
      script.onload = function () {
        var stats = new Stats();
        document.body.appendChild(stats.dom);
        requestAnimationFrame(function loop() {
          stats.update();
          requestAnimationFrame(loop)
        });
      };
      script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
      document.head.appendChild(script);
    })()
  }

  addStats();

}

document.addEventListener("DOMContentLoaded", init);


const changeCoordinatesDisplay = (cam) => {

  document.getElementById('text').innerText = "Cam Pos Origin in WGS: " + cam.originlatLon + "\n "
    + "Cam Pos Origin in Mercator: " + cam.originMercator + "\n "
    + "Cam Pos Origin in Tile: " + cam.originlatLon.googleTiles() + "\n "
    + "------------------------------------------------------------------------------\n "
    + "New Pos in WGS: " + cam.newLatLng + "\n "
    + "New Pos in Mercator: " + cam.newLatLng.wgs2Mercator() + "\n "
    + "New Pos in Tile: " + cam.newLatLng.googleTiles() + "\n ";

}