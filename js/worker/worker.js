
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

    var normal = new Float32Array( [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,

      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ] );

    bufferGeometry.addAttribute( 'normal', new THREE.BufferAttribute( normal, 3 ) );

    // usr RGB values
    var colors = new Uint8Array( [
      255,  0,  0,
      0,  255,  0,
      0,  0,  255,

      0,  0,  255,
      0,  255,  0,
      255,  0,  0
    ] );

    bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3) );

    var uv = new Float32Array( [
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
  let buildingFootprint,
    oRingElement = [];
  const tags = feature.properties;

  // if(tags.material){
  //   console.log(`material: ${tags.material}`)
  // }
  //
  // if(tags.color){
  //   console.log(`material: ${tags.color}`)
  // }
  // console.log(tags)

  if (tags.hasOwnProperty('levels')) {
    buildingHeight = tags['levels']*3;
  }
  if (tags.hasOwnProperty('height')) {
    buildingHeight = tags['height']*2;
  }
  if (tags.hasOwnProperty('color')) {
    // console.log(`color: ${tags.color}`)
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(tags['color']);
    buildingCol = result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  feature.geometry.coordinates.forEach((ring, index) => {

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

  const temp = new THREE.ExtrudeBufferGeometry(buildingFootprint, {
    depth: buildingHeight,
    bevelEnabled: false
  });

  // const bufferGeometry = new THREE.BufferGeometry();

  // bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( temp.attributes.position.array, 3 ) );


  // console.log(temp.attributes.normal.array.length)

  var colors = new Uint8Array(temp.attributes.normal.array.length);

  // colors.fill(100);
  // var buildingCol = Math.floor(Math.random()*(255-1+1)+1);
  for(let i = 0; i < temp.attributes.normal.array.length;i=i+3){

    // colors[i] = Math.floor(Math.random()*(255-1+1)+1); //255;
    // colors[i+1] = Math.floor(Math.random()*(255-1+1)+1); //  66;
    // colors[i+2] = Math.floor(Math.random()*(255-1+1)+1); //170;

    // colors[i] =86;
    // colors[i+1] = 160;
    // colors[i+2] = 197;

    colors[i] = buildingCol.r;
    colors[i+1] = buildingCol.g;
    colors[i+2] = buildingCol.b;


  }

  // console.log(colors)

  temp.addAttribute( 'color', new THREE.BufferAttribute( colors, 3, true) );

  // console.log(colors)

  // return bufferGeometry;

  // return new THREE.ExtrudeBufferGeometry(buildingFootprint, {
  //   depth: buildingHeight,
  //   bevelEnabled: false
  // });

  return temp;

}



createDataTile = (data) => {

  const tile = data.tile;
  let buildingHeight = 6;
  let buildingColor = { r: 255, g:255 , b:255 };// r: 252, g:253 , b:253    r: 255, g:255 , b:255
  const buildingMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
  // console.log(buildingMaterial)


  loadData(tile.link,'json', (features) => {

    const geometries = [];

    var t0 = performance.now();

    features.features.forEach(feature => {
        if (feature.geometry.type === 'Polygon') {
          // var buildingCol = Math.floor(Math.random()*(255-1+1)+1);
          geometries.push(createBuilding(feature, tile.tileMiddle, buildingHeight, buildingColor));
        }
    });



    var t1 = performance.now();
    // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")

    const geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);



    // console.log(geometry)

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

  // console.log(e.data.tile.type)
  const type = e.data.tile.type;

  if(type === 'baseTile'){
    createBaseTile(e.data);
  } else if(type === 'dataTile'){
    createDataTile(e.data);
  }

}, false);


