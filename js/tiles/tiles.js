class Tiles {
  constructor(origin){
    this.pool = new Map;
    this.origin = origin;
    this.tileIncrement = Math.floor(CALCULATE_TILE_DISTANCE / 2);
    this.isbusy = false;

    this.createTiles(this.origin);
    // this.update(this.origin);

    console.log(this)

  }

  add(key,vale){
    this.pool.set(key,vale);
  }

  remove(key){
    this.pool.delete(key);
  }

  createTiles(position){
    //adds new tiles to the pool. For this a for-sign(plus or minus) matrix is calculated from which the new tiles are generated.
    //for the key of the maptiles the numbers consist of a leading number(1 = basemap tile, 2 = datatile) and the tilenumber.

    const curTile = position.merc2Tile();
    // console.log(this.pool)

    let f, h, k;
    let g = k = this.tileIncrement * -1;
    let tilenumber1, tilenumber2 = 0;
    for (f = 0; f < CALCULATE_TILE_DISTANCE; f++) {
      for (h = 0; h < CALCULATE_TILE_DISTANCE; h++) {

        tilenumber1 = parseInt(String(1)+String(curTile[0]+g)+String(curTile[1]+k));
        tilenumber2 = parseInt(String(2)+String(curTile[0]+g)+String(curTile[1]+k));

        // add this new basemap tile only if it doesnt exist already in the map
        if(!this.pool.has(tilenumber1)){
          this.add(tilenumber1, new BaseTile(tilenumber1,this.origin,[curTile[0]+g, curTile[1]+k])); //basemaptile
        }
        // add this new datatile only if it doesnt exist already in the map
        if(!this.pool.has(tilenumber2)){
          this.add(tilenumber2, new DataTile(tilenumber2,this.origin,[curTile[0]+g, curTile[1]+k])); //datatile
        }
        // this.tileStack.push([g, k]);
        k++;
      }
      k = this.tileIncrement * -1;
      g++;
    }
  }

  update(position){
    if(this.isbusy) return;

    this.isbusy = true;
    //create tiles around the camera position on surface
    this.createTiles(position)

    this.pool.forEach( (tile, key) => {

      //update tile distance
      tile.calculateDistanceToOrigin(position);

      if(tile.distanceToOrigin < LOADING_TILE_DISTANCE && tile.state === 'blank'){
        tile.create();
        // console.log('load')
      }else if(tile.distanceToOrigin > LOADING_TILE_DISTANCE*2){
        this.remove(key);
        tile.destroy();
      }
    })
    this.isbusy = false;
  }

  changeTileStack() {
    //  check in old tiles which tile we need to keep for moving camera to new tile
    //  add additional new tiles to stack

    // new current camera position


    // add new needed tile number from position change
    // this.createTiles(curTile);

    // this.joiningTilesBlocked = true;
    //
    // let neededTile = false;
    // let i, j;
    // let oldElement, oldElement2, newElement;
    // // decision which tiles will be needed after the camera move from one tile to another
    // for (i = 0; i < this.joiningTiles.length; i++) {
    //   oldElement = this.joiningTiles[i][0];
    //   oldElement2 = this.joiningTiles[i][1];
    //
    //   for (j = 0; j < this.tileStack.length; j++) {
    //     newElement = this.tileStack[j];
    //
    //     // tile is connected to the new tile where the camera is moving to. so we keep it
    //     if (oldElement.tileCoords[0] === newElement[0] && oldElement.tileCoords[1] === newElement[1]) {
    //       neededTile = true;
    //       // it has to be removed from the new needed tiles because we have it already
    //       this.tileStack.splice(j, 1);
    //       j--;
    //     }
    //
    //   }
    //   // this tile is not interesting anymore it is not connected to the new tile we are moving to.
    //   if (!neededTile) {
    //     this.joiningTiles.splice(i, 1);
    //     oldElement.destroy();
    //     oldElement2.destroy();
    //     i--;
    //   }
    //   neededTile = false;
    // }
    //
    // // the new needed tile numbers become proper tiles and get pushed to the old tile stack. Tiles get loaded later.
    // // Only from this point there are available for distance calculation and therefore check if get loaded(visualized) or not
    // this.tileStack.forEach(e => {
    //   this.joiningTiles.push([new BaseTile(this.origin, e), new DataTile(this.origin, e)]);
    // });
    //
    // this.joiningTilesBlocked = false;

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