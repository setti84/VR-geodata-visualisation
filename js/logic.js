

const latLonPos = document.getElementById('latLonPos');
const sendPos = document.getElementById('sendPos');
console.log(window)

sendPos.addEventListener("click", function(event){
  event.preventDefault()
  //let pos = latLonPos.value.split(" ");
  changeCoordinatesDisplay(latLonPos.value.split(" "))

  const camera = document.querySelector('a-entity[cameralistener]');

});


// --------------------------------------------------

function changeCoordinatesDisplay(cam) {

  document.getElementById('texPosi').innerText = "Cam Pos Origin in WGS: " + cam.originlatLon.toString() + "\n "
    + "Cam Pos Origin in Mercator: " + cam.originMercator + "\n "
    + "Cam Pos Origin in Tile: " + cam.originlatLon.googleTiles()  + "\n "
    + "------------------------------------------------------------------------------\n "
    + "New Pos in WGS: " + cam.newLatLng.toString()  + "\n "
    + "New Pos in Mercator: " + cam.newLatLng.wgs2Mercator() + "\n "
    + "New Pos in Tile: " + cam.newLatLng.googleTiles()  + "\n ";

  ;
}