

const posLat = document.getElementById('latPos');
const posLon = document.getElementById('lonPos');
const sendPos = document.getElementById('sendPos');
const disPos = document.getElementById('texPosi');


// var searchThis = posLat.textContent || posLat.innerText;

sendPos.addEventListener("click", function(event){
  event.preventDefault()
  console.log(posLat.value)
  console.log(posLon.value)
  disPos.innerText = "Camera Position: " + posLat.value + " " + posLon.value + " ";
  console.log(disPos.innerText)

  const camera = document.querySelector('a-entity[cameralistener]');
  Util.calcPos("hello");
});


// --------------------------------------------------


/*
,

  setPos: function(position) {
    // call setPos(this.latLonPos)
    console.log("set map to: " + position.lat + " and " + position.lon)

  }


 */

