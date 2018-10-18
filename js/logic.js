

const latLonPos = document.getElementById('latLonPos');
const sendPos = document.getElementById('sendPos');


sendPos.addEventListener("click", function(event){
  event.preventDefault()
  //let pos = latLonPos.value.split(" ");
  changeCoordinatesDisplay(latLonPos.value.split(" "))



  const camera = document.querySelector('a-entity[cameralistener]');

});


// --------------------------------------------------

function changeCoordinatesDisplay(position) {

  document.getElementById('texPosi').innerText = "Camera Position: " + Math.round(position.lat*10000)/10000 + " "  + Math.round(position.lng*10000)/10000 + "\n "
    + "Camera Position2: " + Util.unprojectWorldCoordinates(position.projectWorldCoordinates()[0], position.projectWorldCoordinates()[1]) + "\n "
    + "Tile Coords in x,y: " +position.coords2Tile() + "\n "
    + "Tile Coords2 in x,y: " +position.tileCoordinate() + "\n "
    + "World Coords: " + position.projectWorldCoordinates() + "\n "
    + "Pixel Coords: " + position.pixelCoordinates() + "\n "
  ;
}

// var testi = new LatLng(41.85, -87.64999999999998)
// console.log(testi)
// console.log("Wordl Coord: " + testi.projectWorldCoordinates())
// console.log("tile coords: " + testi.coords2Tile())
// console.log("Pixel Coords: " + testi.pixelCoordinates())


/*
,

  setPos: function(position) {
    // call setPos(this.latLonPos)
    console.log("set map to: " + position.lat + " and " + position.lon)

  }


 */

