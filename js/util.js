
const util = function(){

  const wgs2MercX = (lng) => {
    // OSM version
    //"Converts given lon in WGS84 Datum to X in Spherical Mercator EPSG:900913"
    return lng * ORIGINSHIFT / 180;
  }

  const wgs2MercY = (lat) => {
    // OSM version
    //"Converts given lat in WGS84 Datum to Y in Spherical Mercator EPSG:900913"
    const y = Math.log( Math.tan((90 + lat) * Math.PI / 360 )) / (Math.PI / 180);

    return y * ORIGINSHIFT / 180;
  }

  const showMatrix = (matrix) => {

    console.log(Math.round(matrix.elements[0] * 100)/100, Math.round(matrix.elements[1] * 100)/100, Math.round(matrix.elements[2] * 100)/100, Math.round(matrix.elements[3] * 100)/100, '\n',
      Math.round(matrix.elements[4] * 100)/100, Math.round(matrix.elements[5] * 100)/100, Math.round(matrix.elements[6] * 100)/100, Math.round(matrix.elements[7] * 100)/100, '\n',
      Math.round(matrix.elements[8] * 100)/100, Math.round(matrix.elements[9] * 100)/100, Math.round(matrix.elements[10] * 100)/100, Math.round(matrix.elements[11] * 100)/100, '\n',
      Math.round(matrix.elements[12] * 100)/100, Math.round(matrix.elements[13] * 100)/100, Math.round(matrix.elements[14] * 100)/100, Math.round(matrix.elements[15] * 100)/100
    )

  }

  const clamp = (num, min, max) => {
    return Math.min(Math.max(min, num), max);
  }



  return{
    wgs2MercX: wgs2MercX,
    wgs2MercY: wgs2MercY,
    clamp : clamp,
    showMatrix: showMatrix,
    // getCamLookingPos: getCamLookingPos
  }

}();