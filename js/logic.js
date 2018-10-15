

const latLonPos = document.getElementById('latLonPos');
const sendPos = document.getElementById('sendPos');


sendPos.addEventListener("click", function(event){
  event.preventDefault()
  //let pos = latLonPos.value.split(" ");
  changeCoordinatesDisplay(latLonPos.value.split(" "))



  const camera = document.querySelector('a-entity[cameralistener]');
  Util.calcPos("hello");
});


// --------------------------------------------------

function changeCoordinatesDisplay(position) {
  document.getElementById('texPosi').innerText = "Camera Position: " + position[0] + " "  + position[1];
}





/*
,

  setPos: function(position) {
    // call setPos(this.latLonPos)
    console.log("set map to: " + position.lat + " and " + position.lon)

  }


 */

