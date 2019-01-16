class Tiles {

  constructor(origin){

    this.pool = new Map();
    this.origin = origin;
    this.tileIncrement = Math.floor(CALCULATE_TILE_DISTANCE / 2);
    this.isbusy = false;
    // this.noName();

    // this.createTiles(this.origin);


  }

  // noName(){
  //   // console.log('load')
  //   for (let tile of this.pool.values()) {
  //     // console.log(tile)
  //    if(tile.status === 'blank'){
  //      tile.loadData();
  //      setTimeout( this.noName(),200)
  //    }
  //   }
  //   setTimeout( () => {
  //     this.noName();
  //   },1000)
  //   // console.log(this.iterator.next())
  // }


  getTilenumber(x,y){
    return parseInt(String(1)+String(x)+String(y));
  }

  // getMinMax (frustPoly, zoom) {
  //
  //   const minMax = {
  //     // get the min and max coordinates to loop through all tiles
  //     minX : Math.min(
  //       util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[0].x, zoom),
  //       util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[1].x, zoom),
  //       util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[2].x, zoom),
  //       util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[3].x, zoom)
  //     ),
  //     minY : Math.min(
  //       util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[0].z, zoom),
  //       util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[1].z, zoom),
  //       util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[2].z, zoom),
  //       util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[3].z, zoom)
  //     ),
  //     maxX : Math.max(
  //       util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[0].x, zoom),
  //       util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[1].x, zoom),
  //       util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[2].x, zoom),
  //       util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[3].x, zoom)
  //     ),
  //     maxY : Math.max(
  //       util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[0].z, zoom),
  //       util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[1].z, zoom),
  //       util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[2].z, zoom),
  //       util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[3].z, zoom)
  //     )
  //   };
  //
  //   minMax.minXParent = Math.floor(minMax.minX/2);
  //   minMax.minYParent = Math.floor(minMax.minY/2);
  //   minMax.maxXParent = Math.floor(minMax.maxX/2);
  //   minMax.maxYParent = Math.floor(minMax.maxY/2);
  //
  //   return minMax;
  //
  // }


  getMinMax (frustPoly, zoom) {

    const minMax = {
      // get the min and max coordinates to loop through all tiles
      minX : Math.min(
        util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[0].x + map.get().cam.camPosOnSurface.x, zoom),
        util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[1].x + map.get().cam.camPosOnSurface.x, zoom),
        util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[2].x + map.get().cam.camPosOnSurface.x, zoom),
        util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[3].x + map.get().cam.camPosOnSurface.x, zoom)
      ),
      minY : Math.min(
        util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[0].z - map.get().cam.camPosOnSurface.z, zoom),
        util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[1].z - map.get().cam.camPosOnSurface.z, zoom),
        util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[2].z - map.get().cam.camPosOnSurface.z, zoom),
        util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[3].z - map.get().cam.camPosOnSurface.z, zoom)
      ),
      maxX : Math.max(
        util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[0].x + map.get().cam.camPosOnSurface.x, zoom),
        util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[1].x + map.get().cam.camPosOnSurface.x, zoom),
        util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[2].x + map.get().cam.camPosOnSurface.x, zoom),
        util.mercX2Tile(this.origin.mercatorCoord[0] + frustPoly[3].x + map.get().cam.camPosOnSurface.x, zoom)
      ),
      maxY : Math.max(
        util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[0].z - map.get().cam.camPosOnSurface.z, zoom),
        util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[1].z - map.get().cam.camPosOnSurface.z, zoom),
        util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[2].z - map.get().cam.camPosOnSurface.z, zoom),
        util.mercX2Tile(this.origin.mercatorCoord[1] - frustPoly[3].z - map.get().cam.camPosOnSurface.z, zoom)
      )
    };

    // minMax.minXParent = Math.floor(minMax.minX/2);
    // minMax.minYParent = Math.floor(minMax.minY/2);
    // minMax.maxXParent = Math.floor(minMax.maxX/2);
    // minMax.maxYParent = Math.floor(minMax.maxY/2);

    return minMax;

  }

  createBasemapTiles(){

    // find new tiles in screen, merge new tiles in pool, update distance, create parent or children tiles, perform delete or reload on pool

    let tileNum, parent, tileNumParent;
    const zoom = map.get().zoom;

    const diff = Math.abs((map.get().cam.frustumPolygon[0].x - map.get().cam.frustumPolygon[3].x))/
      Math.abs((map.get().cam.frustumPolygon[0].z - map.get().cam.frustumPolygon[3].z)); // Steigung

    const diff2 = Math.abs((map.get().cam.frustumPolygon[0].z - map.get().cam.frustumPolygon[3].z))/
      Math.abs((map.get().cam.frustumPolygon[0].x - map.get().cam.frustumPolygon[3].x)); // Steigung

    const diffAbs = Math.min(diff, diff2);
    const fac = 1;
    const frustPoly = [
      {x: ((diffAbs*map.get().cam.frustumPolygon[2].x) + map.get().cam.frustumPolygon[2].x)*-1*fac , z: map.get().cam.frustumPolygon[2].z*-1 }, //  (diffX + map.get().cam.frustumPolygon[2].x)*-1
      {x: ((diffAbs*map.get().cam.frustumPolygon[3].x) + map.get().cam.frustumPolygon[3].x)*-1*fac , z: map.get().cam.frustumPolygon[3].z*-1 },
      {x: map.get().cam.frustumPolygon[2].x, z: map.get().cam.frustumPolygon[2].z},
      {x: map.get().cam.frustumPolygon[3].x, z: map.get().cam.frustumPolygon[3].z}
    ];

    // frustPoly.forEach( (e) => {
    //
    // })


    // 20026376.39 -20048966.10 20026376.39 20048966.10

    const minMax = this.getMinMax(frustPoly, zoom);
    // console.log(minMax)
    // console.log(frustPoly)
    const tileChangeDistance = 200;
    const cam = map.get().cam.newLatLng.merc2Tile();
    const neededTiles = [];

    // all new tiles
    for(let i = minMax.minX; i<=minMax.maxX; i++){
      for(let j = minMax.minY; j<=minMax.maxY; j++){

        parent = [Math.floor(i/2), Math.floor(j/2)];
        tileNumParent = this.getTilenumber(parent);
        tileNum = this.getTilenumber(i,j); //parseInt(String(1)+String(i)+String(j));
        // console.log(tileNum)

        if(!this.pool.has(tileNum) & !this.pool.has(tileNumParent)){
          this.pool.set(tileNum, new BaseTile(tileNum,this.origin,[i, j],this.origin.zoom)); //basemaptile
          // this.pool.get(tileNum).loadData();

        }
      }
    }

    // update all tiles

    this.pool.forEach( (tile, key) => {

      //update tile distance
      tile.calculateDistanceToOrigin(map.get().cam.newLatLng);

      // not in view anymore -> remove
      if(
        tile.zoom === this.origin.zoom &&
        (
          (tile.tileCoords[0] < minMax.minX || tile.tileCoords[0] > minMax.maxX) ||
          (tile.tileCoords[1] < minMax.minY || tile.tileCoords[1] > minMax.maxY)
        )
      ){
        tile.state = 'delete';
      }
      else if(
        tile.zoom < this.origin.zoom &&
        (
          (tile.tileCoords[0] < minMax.minXParent || tile.tileCoords[0] > minMax.maxXParent) ||
          (tile.tileCoords[1] < minMax.minYParent || tile.tileCoords[1] > minMax.maxYParent)
        )
      ){
        tile.state = 'delete';
      }
      //  needs update to parent -> do update
      // else if(tile.distanceToOrigin > tileChangeDistance && tile.zoom === this.origin.zoom){
      //   // console.log(tile.distanceToOrigin)
      //   // console.log(tileChangeDistance)
      //   // console.log('to parent');
      //   this.makeParentTile(tile);
      // }
      // //  needs update to child -> do update
      // else if(tile.distanceToOrigin < tileChangeDistance && tile.zoom < this.origin.zoom){
      //   // console.log('to child');
      //   this.makeChildTiles(tile);
      // }

    });

    // console.log('------')

    this.pool.forEach( (tile, key) => {

      if(tile.state === 'delete'){
        this.remove(key);
        tile.destroy();
      }
      //  in view but new or changed -> load
      else if(tile.state === 'blank' && map.get().status.busy !== 'startLoading'){
        // console.log(tile)
        tile.loadData();
      }

    });
    // console.log(this.pool.size)

  }

  getAllChildren (parent) {

    return [                      // seen from parent tile:
      [parent[0]*2, parent[1]*2],     // upper left
      [parent[0]*2+1, parent[1]*2],   //  upper right
      [parent[0]*2, parent[1]*2+1],   //  bottom left
      [parent[0]*2+1, parent[1]*2+1]  // bottom right
    ]
  }

  makeParentTile(tile){

    // create parent tile
    // set state to delte for all childrn of parent tile
    const parent = [Math.floor(tile.tileCoords[0]/2), Math.floor(tile.tileCoords[1]/2)];
    const tilenumber = this.getTilenumber(parent[0],parent[1]); //parseInt(String(1)+String(parent[0])+String(parent[1]));
    const allChildren = this.getAllChildren(parent);
    let childTile;

    allChildren.forEach( (e) => {

      const tileNumChild = this.getTilenumber(e[0],e[1]); //parseInt( String(1)+String(e[0])+String(e[1]) );
      if( this.pool.has(tileNumChild) ){
        childTile = this.pool.get(tileNumChild);
        childTile.state = 'delete';
      }

    });

    this.pool.set(tilenumber, new BaseTile(tilenumber, this.origin, parent, this.origin.zoom-1) ); //basemaptile

  }

  makeChildTiles(tile){

    const tilenumber = this.getTilenumber(tile[0],tile[1]); //parseInt(String(1)+String(tile[0])+String(tile[1]));

    this.pool.delete(tilenumber);

    return this.getAllChildren(tile);
    //   make child tiles
    //  delete parent tiles
  }

  update(position){

    // TODO: find way to call this in two ways. Once with a cooordinate and with an area.
    // TODO: Area is used for map view and coordiante is used for VR mode

    if(this.isbusy) return;
    // console.log( `Tile Pool: ${this.pool.size} Tiles`);

    this.isbusy = true;

    // if(map.get().status.vr){
    // //  TODO: use position for tile generation
    // } else{
    //   this.createBasemapTiles();
    // }



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