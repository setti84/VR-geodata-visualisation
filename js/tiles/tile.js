class Tile {
  constructor (id,origin, coords, zoom) {

    this.id = id;
    this.origin = origin;
    this.tileCoords = coords;
    this.zoom = zoom;
    this.state = 'blank'; // blank, loading,loaded and delete
    this.distanceToOrigin = 100; // random value set
    this.threeScene = null;

  }

}
