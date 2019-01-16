
const util = function(){

  const wgs2MercX = (lng) => {
    // OSM version
    //"Converts given lon in WGS84 Datum to X in Spherical Mercator EPSG:900913"
    return lng * ORIGINSHIFT / 180;
  };

  const wgs2MercY = (lat) => {
    // OSM version
    //"Converts given lat in WGS84 Datum to Y in Spherical Mercator EPSG:900913"
    const y = Math.log( Math.tan((90 + lat) * Math.PI / 360 )) / (Math.PI / 180);

    return y * ORIGINSHIFT / 180;
  };

  const merc2Tile = (x, y, zoom) => {
    // "Returns tile for given mercator coordinates"
    const res = 2 * Math.PI*EARTH_RADIUS_IN_METERS/TILE_SIZE/(Math.pow(2,zoom));
    const px = (x+ORIGINSHIFT)/res;
    const py = (y+ORIGINSHIFT)/res;

    return [parseInt(Math.ceil(px/parseFloat(TILE_SIZE))-1), parseInt(Math.ceil(py/parseFloat(TILE_SIZE))-1)]
  };

  const mercX2Tile = (x, zoom) => clamp( parseInt( Math.ceil( (x+ORIGINSHIFT)/ (2 * Math.PI * EARTH_RADIUS_IN_METERS / TILE_SIZE / ( Math.pow( 2, zoom ) ) ) / parseFloat( TILE_SIZE ) )-1 ), 0, Math.pow(2,zoom)-1)

  const clamp = (num, min, max) => Math.min(Math.max(min, num), max);


  return{
    mercX2Tile: mercX2Tile,
    merc2Tile: merc2Tile,
    wgs2MercX: wgs2MercX,
    wgs2MercY: wgs2MercY,
    clamp : clamp,
    // getCamLookingPos: getCamLookingPos
  }

}();