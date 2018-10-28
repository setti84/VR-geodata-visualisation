class MovementWatcher {

  // Tile loading logic

  constructor (origin, newCameraPos) {

    this.newCameraPos = newCameraPos;
    this.origin = origin;
    this.joiningTiles = [];
    this.joiningTilesBlocked = false;
    this.oldTile = newCameraPos.googleTiles();
    this.tileIncrement = Math.floor(CALCULATE_TILE_DISTANCE/2);
    this.tileStack = []

    this.changeTilesStack();
    this.invokeTileLoading();

  }

  // setNewOrigin(origin){
  //   // used if the position changes to entirely new scene in another part of world.
  //   // Sets whole coordinates transformation to a zero point
  //   this.origin = origin;
  //   this.addJoiningTiles()
  // }

  invokeTileLoading() {
    if(this.joiningTilesBlocked) return;

    this.joiningTiles.forEach( e => {
      e.calculateDistanceToOrrigin(this.newCameraPos)
      // console.log(e.distanceToOrigin)
      // console.log("distance: " + e.distanceToOrigin)
      // console.log("is loaded? " + e.isLoading)
      // console.log("------------------------------------")
      if(e.distanceToOrigin < LOADING_TILE_DISTANCE && !e.isLoading){
        // console.log("create tile")
        // console.log(e.isLoading)
        e.create();
        // console.log(e.tileCoords)
        // console.log(e)
      }





    });
  }

  showDistances() {
    if(this.joiningTilesBlocked) return;
    this.joiningTiles.forEach( e => console.log(e.distanceToOrigin));
    console.log("------------------")
  }

  search (){
    //update distance from camera position to tiles & init tile loading
    this.invokeTileLoading();

    // this.showDistances();


    // if the camera is moving in the area of a new tile the TileStack gets an update and filled with new tiles
    if(this.newCameraPos.googleTiles()[0] !== this.oldTile[0] ||
       this.newCameraPos.googleTiles()[1] !== this.oldTile[1]){

      console.log("moving to new tile")
      this.changeTilesStack();
      this.oldTile = this.newCameraPos.googleTiles();

    }



  }

  changeTilesStack() {
  //  check in old tiles which tile we need to keep for moving camera to new tile
  //  add additional new tiles to stack

    const curTile = this.newCameraPos.merc2Tile();
    this.tileStack = [];
    // console.log(curTile)

  //find new tiles from the new position
  let f,h,k;
  let g = k = this.tileIncrement*-1;
    for(f=0; f<CALCULATE_TILE_DISTANCE ; f++){

      for(h=0; h<CALCULATE_TILE_DISTANCE ; h++){
        this.tileStack.push([g,k]);
        // console.log([g,k])
        k++;
      }
      k = this.tileIncrement*-1;
      g++;
    }
    // console.log(helpArry)
    // console.log(this.tileStack)

    this.tileStack.forEach(e => {
      // console.log(curTile)
      e[0] = curTile[0]+e[0];
      e[1] = curTile[1]+e[1];


    });
    // console.log(this.tileStack.length)
    // this.joiningTiles.forEach( e => console.log(e.tileCoords));

    this.joiningTilesBlocked = true;

    let neededTile = false;
    let i,j;
    let oldElement,newElement;

    // console.log(this.joiningTiles.length)
    for(i=0; i<this.joiningTiles.length ; i++){
      oldElement= this.joiningTiles[i];


      for(j=0; j<this.tileStack.length ; j++){
        newElement = this.tileStack[j];


        if(oldElement.tileCoords[0] === newElement[0] && oldElement.tileCoords[1] === newElement[1]){
          neededTile=true;
          this.tileStack.splice(j,1);
          j--;
        }
      };
      if(!neededTile){
        this.joiningTiles.splice(i,1);
        oldElement.destroy();
        i--;
      }
      neededTile=false;
    }
    // console.log(this.tileStack)
    // add the new needed tiles to the old tile stack. tiles get loaded later. From this point there are only available for distance calculation
    this.tileStack.forEach( e => { this.joiningTiles.push(new Tile(this.origin,e)) });

    this.joiningTiles.sort( (a,b) => {return a.tileCoords[0] - b.tileCoords[0]} )
// distanceToOrigin
    this.joiningTilesBlocked = false;

    // this.tileStack.forEach( e => console.log(e));
    console.log(this.joiningTiles.length)
    // console.log(this.joiningTiles)

    // console.log("------")

  }

}


// this.tilesStack = [
//   [curTile[0]-1, curTile[1]-1], [curTile[0], curTile[1]-1], [curTile[0]+1, curTile[1]-1],
//   [curTile[0]-1, curTile[1]],   [curTile[0], curTile[1]],   [curTile[0]+1, curTile[1]],
//   [curTile[0]-1, curTile[1]+1], [curTile[0], curTile[1]+1], [curTile[0]+1, curTile[1]+1]
// ];

// this.tileStack = [
//   [curTile[0]-2, curTile[1]-2], [curTile[0]-1, curTile[1]-2], [curTile[0], curTile[1]-2], [curTile[0]+1, curTile[1]-2], [curTile[0]+2, curTile[1]-2],
//   [curTile[0]-2, curTile[1]-1], [curTile[0]-1, curTile[1]-1], [curTile[0], curTile[1]-1], [curTile[0]+1, curTile[1]-1], [curTile[0]+2, curTile[1]-1],
//   [curTile[0]-2, curTile[1]],   [curTile[0]-1, curTile[1]],   [curTile[0], curTile[1]],   [curTile[0]+1, curTile[1]],   [curTile[0]+2, curTile[1]],
//   [curTile[0]-2, curTile[1]+1], [curTile[0]-1, curTile[1]+1], [curTile[0], curTile[1]+1], [curTile[0]+1, curTile[1]+1], [curTile[0]+2, curTile[1]+1],
//   [curTile[0]-2, curTile[1]+2], [curTile[0]-1, curTile[1]+2], [curTile[0], curTile[1]+2], [curTile[0]+1, curTile[1]+2], [curTile[0]+2, curTile[1]+2],
// ];

/*

create sign matrix
------------------

given: five from CALCULATE_TILE_DISTANCE and two from Math.floor(CALCULATE_TILE_DISTANCE/2) and loopnumber
where CALCULATE_TILE_DISTANCE is a free(uneven) chosen number

mercator
--------

3x3

[-1,+1],[0,+1],[+1,+1],
[-1,0], [0,0], [+1,0],
[-1,-1],[0,-1],[+1,-1],


5x5

[-2,+2],[-1,+2],[0,+2],[+1,+2],[+2,+2],
[-2,+1],[-1,+1],[0,+1],[+1,+1],[+2,+1],
[-2,0] ,[-1,0] ,[0,0] ,[+1,0] ,[+2,0] ,
[-2,-1],[-1,-1],[0,-1],[+1,-1],[+2,-1],
[-2,-2],[-1,-2],[0,-2],[+1,-2],[+2,-2],

compare google and mercator: y-value sign is switched from bottom to top and vice versa


google
------

5x5 google

[-2,-2] [-1,-2] [0,-2] [+1,-2] [+2,-2]
[-2,-1] [-1,-1] [0,-1] [+1,-1] [+2,-1]
[-2,0 ] [-1,0 ] [0,0 ] [+1,0 ] [+2,0 ]
[-2,+1] [-1,+1] [0,+1] [+1,+1] [+2,+1]
[-2,+2] [-1,+2] [0,+2] [+1,+2] [+2,+2]


zweite zahl erhöht sich ums eins

[-2,-2]
[-2,-1]
[-2,0 ]
[-2,+1]
[-2,+2]

[-1,-2]
[-1,-1]
[-1,0 ]
[-1,+1]
[-1,+2]

[0,-2]
[0,-1]
[0,0 ]
[0,+1]
[0,+2]

[1,-2]
[1,-1]
[1,0 ]
[1,+1]
[1,+2]

[2,-2]
[2,-1]
[2,0 ]
[2,+1]
[2,+2]

*/
//   console.log(this.tileIncrement)
// console.log(CALCULATE_TILE_DISTANCE)


