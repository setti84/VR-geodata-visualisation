
importScripts('./../lib/three.js', './../lib/BufferGeometryUtils.js', './../point/point.js', './../point/latLng.js');

const wgs2MercX = (lng) => lng*Math.PI*6378137/180;

const wgs2MercY = (lat) => Math.log( Math.tan((90 + lat)*Math.PI/360))/(Math.PI/180)*Math.PI*6378137/180;

const loadData = (link, type, callback) => {

  const httpRequest = new XMLHttpRequest();

  if (!httpRequest) {
    console.log('Giving up :( Cannot create an XMLHTTP instance');
    return false;
  }
  httpRequest.onreadystatechange = () =>{
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        // callback(httpRequest.responseText);
        callback(httpRequest.response);

      } else {
        console.log('There was a problem with the request.');
        // console.log(link);
        // console.log(httpRequest.readyState)
      }
    }

  };

  httpRequest.open('GET', link, true);
  httpRequest.responseType = type;
  httpRequest.send();

}

createBaseTile = (data) => {

  const tile = data.tile;

  tile.size = tile.bounds[1] - tile.bounds[0];
  tile.pos = [tile.mercator[0] - tile.tileMiddle[0], tile.mercator[1] - tile.tileMiddle[1]];
  let bufferGeometry;

  if (tile.debugging) {
    tile.size = Math.floor(tile.bounds[1] - tile.bounds[0]) ; // recognise tile gaps
  }

  loadData(tile.link,'blob', (picture) => {

    bufferGeometry = new THREE.BufferGeometry();
    const length = tile.size/2;

    var vertices = new Float32Array( [
      -length,  length,  1.0,
      -length, -length,  1.0 ,
      length,  length,  1.0,

      -length, -length,  1.0,
      length, -length,  1.0,
      length,  length,  1.0
    ] );

    bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

	/*
	normals show the facing direction of a vertex.
 	Things that are facing forward have the normal 0, 0, 1. Things that are facing away are 0, 0, -1. 
	Facing left is -1, 0, 0, Facing right is 1, 0, 0. Up is 0, 1, 0 and down is 0, -1, 0.
	I think the number discribe the x,y,z axis with the corosponding amount the vertex is facing this axis.
	Example:
	top side of a cube has normals: 0,1,0
	bottom side of a cube has normals: 0,1,0
	*/
	// wrong?
    const normal = new Float32Array( [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ] );

    bufferGeometry.addAttribute( 'normal', new THREE.BufferAttribute( normal, 3 ) );

    // usr RGB values
    const colors = new Uint8Array( [
      255,  0,  0,
      0,  255,  0,
      0,  0,  255,

      0,  0,  255,
      0,  255,  0,
      255,  0,  0
    ] );

    bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3) );

    const uv = new Float32Array( [
      0,1,
      0,0,
      1,1,

      0,0,
      1,0,
      1,1
    ] );

    bufferGeometry.addAttribute( 'uv', new THREE.BufferAttribute( uv, 3 ) );

    createImageBitmap(picture,0,0,256,256).then((resolve) => {

      data.tile = tile;

      const res = {
        data: data,
        picture : resolve,
        vertices: bufferGeometry.attributes.position.array,
        normal: bufferGeometry.attributes.normal.array,
        color: bufferGeometry.attributes.color.array,
        uv: bufferGeometry.attributes.uv.array,
      };

      self.postMessage(res, [
        res.picture,
        res.vertices.buffer,
        res.normal.buffer,
        res.color.buffer,
        res.uv.buffer,
      ]);

    });

  })

}

const createBuilding = (feature, origin, buildingHeight, buildingCol) =>{

  // TODO: solve this problem in a better way, height of building is very uneven compared to reality

  const tags = feature.properties;

  const createBuildingGeometry = (geometry, height) => {

    let buildingFootprint, oRingElement = [];

    geometry.coordinates.forEach((ring, index) => {

      if (index === 0) {
        oRingElement = ring.map(x => {

          return new THREE.Vector2( origin[0] - wgs2MercX(x[0]), (origin[1] - wgs2MercY(x[1])));
        });
        buildingFootprint = new THREE.Shape(oRingElement);
      } else {
        // these all are the inner rings of the polygon and therefore holes
        buildingFootprint.holes.push(new THREE.Path(ring.map(x => {
          return new THREE.Vector2( origin[0] - wgs2MercX(x[0]), (origin[1] - wgs2MercY(x[1])))
        })));
      }

    });

    return new THREE.ExtrudeBufferGeometry(buildingFootprint, {
      depth: height,
      bevelEnabled: false
    });

  }

  if (tags.hasOwnProperty('levels')) {
    buildingHeight = tags['levels']*4;
  }
  if (tags.hasOwnProperty('height')) {
    // console.log(tags['height'])
    buildingHeight = tags['height'];
  }
  if (tags.hasOwnProperty('color')) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(tags['color']);
    buildingCol = result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  const buildingGeometry = createBuildingGeometry(feature.geometry, buildingHeight);

  var colors = new Uint8Array(buildingGeometry.attributes.normal.array.length);

  for(let i = 0; i < buildingGeometry.attributes.normal.array.length;i=i+3){
    colors[i] = buildingCol.r;
    colors[i+1] = buildingCol.g;
    colors[i+2] = buildingCol.b;
  }

  buildingGeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3, true) );

  return buildingGeometry;

}



createDataTile = (data) => {

  const tile = data.tile;

  // Standard building properties
  let buildingHeight = 6;
  let buildingColor = { r: 255, g:255 , b:255 }; // r: 252, g:253 , b:253    r: 255, g:255 , b:255

  loadData(tile.link,'json', (features) => {

    const geometries = [];

    features.features.forEach(feature => {

      if (feature.geometry.type !== 'Polygon') return;

      geometries.push(createBuilding(feature, tile.tileMiddle, buildingHeight, buildingColor));

    });

    const geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);

    const res = {
      data: data,
      vertices: geometry.attributes.position.array,
      normal: geometry.attributes.normal.array,
      color: geometry.attributes.color.array,
    };

    self.postMessage(res, [
      res.vertices.buffer,
      res.normal.buffer,
      res.color.buffer,
    ]);

    self.postMessage(res);

  })

}

self.addEventListener('message', (e) => {

  const type = e.data.tile.type;

  if(type === 'baseTile'){
    createBaseTile(e.data);
  } else if(type === 'dataTile'){
    createDataTile(e.data);
  }

}, false);


