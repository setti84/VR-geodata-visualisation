class Tiles {

  constructor(origin){

    this.pool = new Map();
    this.origin = origin;
    this.tileIncrement = Math.floor(CALCULATE_TILE_DISTANCE / 2);
    this.isbusy = false;

  }

  getTilenumber(x,y){
    return parseInt(String(1)+String(x)+String(y));
  }

  update(position){

    //create tiles around the camera position on surface and adds it to the pool

    this.createTiles(position);
    this.createTilesOSMB(position);

    // iterate through the tiles of the pool and check if they need to get loaded or destroyed
    this.pool.forEach( (tile, key) => {

      //update tile distance
      tile.calculateDistanceToOrigin(position);

      if(tile.distanceToOrigin < LOADING_TILE_DISTANCE && tile.state === 'blank'){
        tile.loadData();
      }else if(tile.distanceToOrigin > LOADING_TILE_DISTANCE*2){
        this.remove(key);
        tile.destroy();
      }
    });

    this.isbusy = false;

  }

  createTilesOSMB(position){

    // OSMB Tiles are only available on zoomlevel 15 or 17. Therefore we need to calculate new tiles separately.
    // Nevertheless the procedure is the same like for other tiles.
    //adds new tiles to the pool. For this a for-sign(plus or minus) matrix is calculated from which the new tiles are generated.
    //for the key of the maptiles the numbers consist of a leading number(1 = basemap tile, 2 = datatile) and the tilenumber.

    const calculateTileDistance = 3; // 3
    let tileIncrement = Math.floor(calculateTileDistance / 2);
    const curTileOSMB = position.OSMBmerc2Tile();

    let f, h, k;
    let g = k = tileIncrement * -1;
    let tilenumber1;
    for (f = 0; f < calculateTileDistance; f++) {
      for (h = 0; h < calculateTileDistance; h++) {

        // get tile name(key) ready
        tilenumber1 = this.getTilenumber(curTileOSMB[0]+g,curTileOSMB[1]+k); // parseInt(String(2)+String(curTileOSMB[0]+g)+String(curTileOSMB[1]+k));

        // add this new datatile only if it doesnt exist already in the map
        if(!this.pool.has(tilenumber1)){
          this.add(tilenumber1, new DataTile(tilenumber1,this.origin,[curTileOSMB[0]+g, curTileOSMB[1]+k], OSMB_TILE_ZOOM)); //datatile
        }
        k++;
      }
      k = tileIncrement * -1;
      g++;
    }

  }

  createTiles(position){

    //adds new tiles to the pool. For this a for-sign(plus or minus) matrix is calculated from which the new tiles are generated.
    //for the key of the maptiles the numbers consist of a leading number(1 = basemap tile, 2 = datatile) and the tilenumber.

    const curTile = position.merc2Tile();

    let f, h, k;
    let g = k = this.tileIncrement * -1;
    let tilenumber1;
    for (f = 0; f < CALCULATE_TILE_DISTANCE; f++) {
      for (h = 0; h < CALCULATE_TILE_DISTANCE; h++) {

        // get tile name(key) ready
        tilenumber1 = this.getTilenumber(curTile[0]+g, curTile[1]+k); //parseInt(String(1)+String(curTile[0]+g)+String(curTile[1]+k));

        // add this new basemap tile only if it doesnt exist already in the map
        if(!this.pool.has(tilenumber1)){
          this.add(tilenumber1, new BaseTile( tilenumber1, this.origin, [curTile[0]+g, curTile[1]+k], map.get().zoom) ); //basemaptile
        }
        k++;
      }
      k = this.tileIncrement * -1;
      g++;
    }
  }

  add(key,vale){
    this.pool.set(key,vale);
  }

  remove(key){
    this.pool.delete(key);
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