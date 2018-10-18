class LatLng {

  constructor (lat, lng) {
    this.lat = lat;
    this.lng = lng;
    this.zoom = ZOOMLEVEL;

  }

  setCoords (newLat, newLng){
    this.lat = newLat;
    this.lng = newLng;

  }

  projectWorldCoordinates () {
    // x and y
    let siny = Math.sin(this.lat * Math.PI / 180);
    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);
    return [
      TILE_SIZE * (0.5 + this.lng / 360),
      TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))];
  }

  coords2Tile () {
    // lng,lat aka x,y
    return [ (Math.floor((this.lng+180)/360*Math.pow(2,this.zoom))),
      (Math.floor((1-Math.log(Math.tan(this.lat*Math.PI/180) + 1/Math.cos(this.lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,this.zoom)))]
  }

  tileCoordinate () {
    // x,y
    const scale = Math.pow(2,this.zoom);
    return [Math.floor(this.projectWorldCoordinates()[0] * scale / TILE_SIZE), Math.floor(this.projectWorldCoordinates()[1] * scale / TILE_SIZE)]
  }

  pixelCoordinates () {
    const scale = Math.pow(2,this.zoom);
    return [Math.floor(this.projectWorldCoordinates()[0] * scale), Math.floor(this.projectWorldCoordinates()[1] * scale)]
  }

  destroy () {}
}
