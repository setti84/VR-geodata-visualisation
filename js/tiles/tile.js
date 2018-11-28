class Tile {
  constructor (id,origin, coords) {

    this.id = id;
    this.origin = origin;
    this.tileCoords = coords;
    this.state = 'blank'; // blank, loading and loaded
    this.distanceToOrigin = 100; // random value set
    const bounds = this.bounds = this.tileBounds();
    this.tileMiddle = this.gettileMiddle(bounds);
    this.calculateDistanceToOrigin(origin);
    this.threeScene = null;

  }

  tileBounds(){
    // "Returns bounds of the given tile in EPSG:900913 coordinates"
    const res = 2 * Math.PI*EARTH_RADIUS_IN_METERS/TILE_SIZE/(Math.pow(2,this.origin.zoom));

    //order minX,maxX,minYmaxY

    return [
      this.tileCoords[0]*TILE_SIZE*res-ORIGINSHIFT,
      (this.tileCoords[0]+1)*TILE_SIZE*res-ORIGINSHIFT,
      this.tileCoords[1]*TILE_SIZE*res-ORIGINSHIFT,
      (this.tileCoords[1]+1)*TILE_SIZE*res-ORIGINSHIFT
    ]

  }

  calculateDistanceToOrigin(newCameraPos) {
    // Pythagorean theorem to get the distance to the camera
    this.distanceToOrigin = Math.sqrt(Math.pow((newCameraPos.wgs2Mercator()[0] - this.tileMiddle[0]), 2) + Math.pow((newCameraPos.wgs2Mercator()[1] - this.tileMiddle[1]), 2));

  }

  gettileMiddle(bounds) {
    // return middle point of tile in mercator point x,y coordinates
    // offset is half of a tile
    const offset = (bounds[1] - bounds[0]) / 2;
    return [bounds[0] + offset, bounds[2] + offset]

  }

}
