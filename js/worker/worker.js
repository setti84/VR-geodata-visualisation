
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
  let bufferGeometry, geometry;

  if (tile.debugging) {
    tile.size = Math.floor(tile.bounds[1] - tile.bounds[0]) ; // recognise tile gaps
  }

  loadData(tile.link,'blob', (picture) => {

    geometry = new THREE.PlaneGeometry(tile.size, tile.size);
    // bufferGeometry = new THREE.PlaneBufferGeometry( tile.size, tile.size);
    bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.fromGeometry(geometry);

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

const createBuilding = (feature, origin, buildingHeight) =>{

  // TODO: solve this problem in a better way, height of building is very uneven compared to reality
  let buildingFootprint,
    oRingElement = [];
  const tags = feature.properties;
  // console.log(tags)

  if (tags.hasOwnProperty('levels')) {
    buildingHeight = tags['levels']*2;
  }
  if (tags.hasOwnProperty('height')) {
    buildingHeight = tags['height'];
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

  return new THREE.ExtrudeBufferGeometry(buildingFootprint, {
    depth: buildingHeight,
    bevelEnabled: false
  });

}



createDataTile = (data) => {

  const tile = data.tile;
  let buildingHeight = 4;


  loadData(tile.link,'json', (features) => {

    const geometries = [];

    features.features.forEach(feature => {
        if (feature.geometry.type === 'Polygon') {
          geometries.push(createBuilding(feature, tile.tileMiddle, buildingHeight));
        }
    });

    const geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries);

    const res = {
      data: data,
      vertices: geometry.attributes.position.array,
      normal: geometry.attributes.normal.array,
      // color: new Float32Array(testi.attributes.color.array),
      uv: geometry.attributes.uv.array,
    };

    self.postMessage(res, [
      res.vertices.buffer,
      res.normal.buffer,
      // res.color.buffer,
      res.uv.buffer,
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


