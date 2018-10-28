class MovementWatcher {

  // Tile loading logic

  constructor(origin, newCameraPos) {

    this.newCameraPos = newCameraPos;
    this.origin = origin;
    this.joiningTiles = [];
    this.joiningTilesBlocked = false;
    this.oldTile = newCameraPos.googleTiles();
    this.tileIncrement = Math.floor(CALCULATE_TILE_DISTANCE / 2);
    this.tileStack = []

    this.changeTilesStack();
    this.invokeTileLoading();

  }

  invokeTileLoading() {
    // update distance from camera position to tiles and load texture for tile if necessary

    if (this.joiningTilesBlocked) return;

    this.joiningTiles.forEach(e => {
      e.calculateDistanceToOrrigin(this.newCameraPos);
      if (e.distanceToOrigin < LOADING_TILE_DISTANCE && !e.isLoading) {
        e.create();
      }

    });

  }

  search() {

    this.invokeTileLoading();

    // if the camera is moving in the area of a new tile the TileStack gets an update and filled with new tiles
    if (this.newCameraPos.googleTiles()[0] !== this.oldTile[0] || this.newCameraPos.googleTiles()[1] !== this.oldTile[1]) {

      this.changeTilesStack();
      this.oldTile = this.newCameraPos.googleTiles();

    }

  }

  createNewTiles(curTile) {
    //creates an array with new tile numbers. For this a for-sign(plus or minus) matrix is calculated from which the new tiles are generated

    // empty array for new camera position(and the corresponding tile)
    this.tileStack = [];
    let f, h, k;
    let g = k = this.tileIncrement * -1;
    for (f = 0; f < CALCULATE_TILE_DISTANCE; f++) {
      for (h = 0; h < CALCULATE_TILE_DISTANCE; h++) {
        this.tileStack.push([curTile[0] +g, curTile[1] +k]);
        this.tileStack.push([g, k]);
        k++;
      }
      k = this.tileIncrement * -1;
      g++;
    }

  }

  changeTilesStack() {
    //  check in old tiles which tile we need to keep for moving camera to new tile
    //  add additional new tiles to stack

    // new current camera position
    const curTile = this.newCameraPos.merc2Tile();

    // add new needed tile number from position change
    this.createNewTiles(curTile);

    this.joiningTilesBlocked = true;

    let neededTile = false;
    let i, j;
    let oldElement, newElement;
    // decision which tiles will be needed after the camera move from one tile to another
    for (i = 0; i < this.joiningTiles.length; i++) {
      oldElement = this.joiningTiles[i];

      for (j = 0; j < this.tileStack.length; j++) {
        newElement = this.tileStack[j];

        // tile is connected to the new tile where the camera is moving to. so we keep it
        if (oldElement.tileCoords[0] === newElement[0] && oldElement.tileCoords[1] === newElement[1]) {
          neededTile = true;
          // it has to be removed from the new needed tiles because we have it already
          this.tileStack.splice(j, 1);
          j--;
        }

      }
      // this tile is not interesting anymore it is not connected to the new tile we are moving to.
      if (!neededTile) {
        this.joiningTiles.splice(i, 1);
        oldElement.destroy();
        i--;
      }
      neededTile = false;
    }

    // the new needed tile numbers become proper tiles and get pushed to the old tile stack. Tiles get loaded later.
    // Only from this point there are available for distance calculation and therefore check if get loaded(visualized) or not
    this.tileStack.forEach(e => {
      this.joiningTiles.push(new Tile(this.origin, e))
    });

    this.joiningTilesBlocked = false;

  }

}



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

