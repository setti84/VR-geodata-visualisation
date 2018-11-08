
let map;

const init = () => {

// new LatLng( 52.54591075494661, 13.355914950370789, 18 );   //Berlin beuth
// new LatLng(40.72372, -73.98922);   // New York
// new LatLng(1.29422,103.85411);        // Singapore
// new LatLng(0,0);

  map = new MapApp({
    zoom: 19,
    position: {lat: 52.54591075494661, lng: 13.3559149503707}, //  {lat:40.714126602154664, lng: -74.0062665939331}
    debugging: false,
    maptiles: 'mapbox',
  });

  console.log(window);

  const handHTML = document.querySelector("#right-hand");

  handHTML.setAttribute('teleport-controls', {
    cameraRig: '#cameraRig',
    teleportOrigin: '#head',
  });


}

document.addEventListener("DOMContentLoaded", init);



const changeCoordinatesDisplay = (cam) => {

  document.getElementById('text').innerText = "Cam Pos Origin in WGS: " + cam.originlatLon + "\n "
    + "Cam Pos Origin in Mercator: " + cam.originMercator + "\n "
    + "Cam Pos Origin in Tile: " + cam.originlatLon.googleTiles()  + "\n "
    + "------------------------------------------------------------------------------\n "
    + "New Pos in WGS: " + cam.newLatLng  + "\n "
    + "New Pos in Mercator: " + cam.newLatLng.wgs2Mercator() + "\n "
    + "New Pos in Tile: " + cam.newLatLng.googleTiles()  + "\n ";

}




//
// setTimeout( () => {
//
//   const allObjects = document.querySelector('a-scene').object3D.children;
//
//   allObjects.forEach( e => {
//     if(e.type === 'Group' ) {
//       if(e.name === 'buildings' || e.name === 'basemap') {
//         e.position.set(e.position.x*SCALEFACTOR,e.position.y*SCALEFACTOR , e.position.z*SCALEFACTOR);
//         e.scale.set(e.scale.x*SCALEFACTOR,  e.scale.y, e.scale.z*SCALEFACTOR ,);
//       }
//     }
//   });
//
// },4000);