class MovementWatcher {

  // Tile loading logic

  constructor (origin, newCameraPos) {
    this.newCameraPos = newCameraPos;

    this.origin = origin;
    this.joiningTiles = [];
    this.oldTile = newCameraPos.googleTiles();
    this.addJoiningTiles();
    this.joiningTilesBlocked = false;

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
      if(e.distanceToOrigin < LOADING_TILE_DISTANCE){
        if(!e.isLoaded){
          e.create();
          console.log(e)
        }
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
      // this.changeTilesStack();
      this.oldTile = this.newCameraPos.googleTiles();

    }



  }

  changeTilesStack() {
  //  check in old tiles which tile we need to keep for moving camera to new tile
  //  add additional new tiles to stack
    const currentTile = this.newCameraPos.googleTiles();

    const tilesStack = [
      [currentTile[0]-1, currentTile[1]-1],
      [currentTile[0], currentTile[1]-1],
      [currentTile[0]+1, currentTile[1]-1],

      [currentTile[0]-1, currentTile[1]],
      [currentTile[0], currentTile[1]],
      [currentTile[0]+1, currentTile[1]],

      [currentTile[0]-1, currentTile[1]+1],
      [currentTile[0], currentTile[1]+1],
      [currentTile[0]+1, currentTile[1]+1]
      // new Tile(this.origin, [currentTile[0]+1, currentTile[1]+1])
    ];

    this.joiningTilesBlocked = true;
    this.joiningTiles.forEach( e => {
      tilesStack.forEach( a => {
        if(e.tileCoords[0] !== a[0] || e.tileCoords[1] !== a[1]){
          // this.joiningTiles.push(new Tile(this.origin, a[0], a[1]))
        } else{

        }
      });
    });
    /*
    1. if new doesnt exist in old -> save it in old
    2. if old doesnt exist in new -> delete it
    3.
     */
    this.joiningTilesBlocked = false;

  }

  // invokeTileLoading() {
  //   this.joiningTiles.forEach( e => {
  //
  //   });
  // }

  addJoiningTiles() {
  /*
  http://www.maptiler.org/google-maps-coordinates-tile-bounds-projection/

  1    2    3
  7  origin 3
  6    5    4

  */

    this.joiningTiles = [
      new Tile(this.origin, [this.origin.googleTiles()[0]-1, this.origin.googleTiles()[1]-1]),
      new Tile(this.origin, [this.origin.googleTiles()[0], this.origin.googleTiles()[1]-1]),
      new Tile(this.origin, [this.origin.googleTiles()[0]+1, this.origin.googleTiles()[1]-1]),

      new Tile(this.origin, [this.origin.googleTiles()[0]-1, this.origin.googleTiles()[1]]),
      new Tile(this.origin, [this.origin.googleTiles()[0], this.origin.googleTiles()[1]]),
      new Tile(this.origin, [this.origin.googleTiles()[0]+1, this.origin.googleTiles()[1]]),

      new Tile(this.origin, [this.origin.googleTiles()[0]-1, this.origin.googleTiles()[1]+1]),
      new Tile(this.origin, [this.origin.googleTiles()[0], this.origin.googleTiles()[1]+1]),
      new Tile(this.origin, [this.origin.googleTiles()[0]+1, this.origin.googleTiles()[1]+1])
    ];
  }

}
