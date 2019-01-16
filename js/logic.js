
let map;

const init = () => {

  if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
  }

//   {lat: 52.54591, lng: 13.35591}   //Berlin beuth
//   {lat: 40.72372, lng: -73.98922}   New York
//   {lat: 40.770141, lng: -73.974895}   New York central Park
//   {lat:1.29422, lng: 103.85411}     Singapore
//   {lat:-46.63604, lng: -23.54887}   Sao Paulo
//   {lat: 52.54081, lng: 12.994}      Elstal
//   {lat: 25.197139, lng: 55.274111}  dubai
//   {lat: 3.157, lng: 101.713}  Petronas Tower Malaisia
//   {lat: 22.3047, lng: 114.1767}  Hong Kong
//   {lat: -6.1405, lng: -81.1669}  südlich Equador

  map = new MapApp({
    zoom: 18,
    position:  {lat: 52.54591, lng: 13.35591},
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
  };

  addStats();

};

document.addEventListener("DOMContentLoaded", init);
