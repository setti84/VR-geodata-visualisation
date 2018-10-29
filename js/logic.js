

function changeCoordinatesDisplay(cam) {

  document.getElementById('text').innerText = "Cam Pos Origin in WGS: " + cam.originlatLon + "\n "
    + "Cam Pos Origin in Mercator: " + cam.originMercator + "\n "
    + "Cam Pos Origin in Tile: " + cam.originlatLon.googleTiles()  + "\n "
    + "------------------------------------------------------------------------------\n "
    + "New Pos in WGS: " + cam.newLatLng  + "\n "
    + "New Pos in Mercator: " + cam.newLatLng.wgs2Mercator() + "\n "
    + "New Pos in Tile: " + cam.newLatLng.googleTiles()  + "\n ";

  ;

}


// setTimeout( () => {
//
//   const allObjects = document.querySelector('a-scene').object3D.children;
//   // console.log(allObjects)
//
//   allObjects.forEach( e => {
//     // console.log("resize")
//     // e.scale.set(SCALEFACTOR,SCALEFACTOR , SCALEFACTOR);
//   })
//
//
// },2000);