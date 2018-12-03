class Tile {
  constructor (id,origin, coords) {

    this.id = id;
    this.origin = origin;
    this.tileCoords = coords;
    this.state = 'blank'; // blank, loading and loaded
    this.distanceToOrigin = 100; // random value set
    // const bounds = this.bounds = this.tileBounds();
    // this.tileMiddle = this.gettileMiddle(bounds);
    // this.calculateDistanceToOrigin(origin);
    this.threeScene = null;

  }

}
