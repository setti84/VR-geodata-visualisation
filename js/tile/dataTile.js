class DataTile extends Tile {
  // BaseMapTile are square flat polygons with with a rendered map view as a texture

  constructor(origin, coords) {
    super(origin, coords);
    this.buildingGroup = new THREE.Group();

    //   TODO: order objects in categories (buildings,trees,...)
    //   TODO: add texture to objects (option to turn it on and off)
    //   TODO: use Events to check if all vector and texture data have loaded successfully

  }

  create() {
    this.isLoading = true;

    this.loadData()
      .then(res => this.processData(res))
      .catch(e => {
        if (e === 429) {
          console.log(e);
          setTimeout(() => this.loadData(), 1000);
        }
      });

  }

  processData(res) {

    const buildingMaterial = new THREE.MeshLambertMaterial({color: 0x56a0c5}); //  0xcac8d2
    const origin = this.origin.wgs2Mercator();
    const data = osmtogeojson(res);

    data.features.forEach(feature => {

      if (feature.geometry.type === 'Polygon' && feature.properties.tags.hasOwnProperty('building')) {
        this.creatureBuilding(feature, buildingMaterial, origin);
      } else if (false) {

      }

    });

    map.get().dataTiles.add(this.buildingGroup)

    this.isLoaded = true;

  }


  loadData() {

    return new Promise((resolve, reject) => {

      const tilecoords = this.tileBounds();

      const tileborder = LatLng.unprojectWorldCoordinates(tilecoords[0], tilecoords[2]).concat(LatLng.unprojectWorldCoordinates(tilecoords[1], tilecoords[3]));

      const httpRequest = new XMLHttpRequest();

      // random numer between 1 and 4
      const randomNum = Math.floor((Math.random() * 4) + 1) - 1;

      const urls = [
        'https://overpass-api.de/api/interpreter?data=',
        'https://lz4.overpass-api.de/api/interpreter?data=',
        'https://overpass.openstreetmap.fr/api/interpreter?data=',
        'https://overpass.kumi.systems/api/interpreter?data='
      ];


      const url = 'http://overpass-api.de/api/interpreter?data='; // 'https://data.sebastiansettgast.com/sprite.json';
      // const url = 'http://overpass-api.de/api/interpreter?data=[out%3Ajson][timeout%3A25]%3B%28node[%22highway%22%3D%22bus_stop%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Brelation[%22landuse%22%3D%22residential%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Bway[%22landuse%22%3D%22retail%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Brelation[%22landuse%22%3D%22retail%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Bway[%22landuse%22%3D%22commercial%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Brelation[%22landuse%22%3D%22commercial%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Bnode[%22highway%22%3D%22bus_stop%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3B%29%3Bout%20body%3B%3E%3Bout%20skel%20qt%3B%0A';

      const url2 = 'https://lz4.overpass-api.de/api/interpreter?data=';

      const query = '[out:json];(' +
        'node(' + tileborder + ')["building"];'
        + 'way(' + tileborder + ')["building"];'
        + 'relation(' + tileborder + ')["building"];'
        + ');out body; >;out skel qt;';

      // console.log(query)

      httpRequest.open('GET', urls[randomNum] + query); //    'data/data.json'
      httpRequest.send();

      if (!httpRequest) {
        reject("Cannot create an XMLHTTP instance");
      }

      httpRequest.onreadystatechange = (ev) => {

        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.readyState == 4 && httpRequest.status === 200) {
            // data has arrived
            resolve(JSON.parse(httpRequest.responseText));

          }
          // else if(httpRequest.status === 429){
          //   reject(httpRequest.status)
          // }
          else {
            // no data arrived
            // TODO: reload data? or destroy? Suggestions?
            reject(httpRequest.status);
          }
        }
      }
    });

  }

  creatureBuilding(feature, buildingMaterial, origin) {

    // console.log(feature)
    // TODO: solve this problem in a better way, height of building is very uneven compared to reality
    let buildingHeight = 4;
    const tags = feature.properties.tags;
    if (tags.hasOwnProperty('height')) {
      buildingHeight = tags['height'];
    } else if (tags.hasOwnProperty('building:levels')) {
      buildingHeight = tags['building:levels'] * 2;
    } else if (tags.hasOwnProperty('levels')) {
      buildingHeight = tags['levels'] * 2;
    }

    let buildingFootprint, oRingElement = [];
    const coordinates = feature.geometry.coordinates;
    coordinates.forEach((ring, index) => {
      if (index === 0) {
        oRingElement = ring.map(x => {
          return new THREE.Vector2(-1 * map.get().scaleFactor * (origin[0] - util.wgs2MercX(x[0])), (origin[1] - util.wgs2MercY(x[1])) * map.get().scaleFactor)
        });
        buildingFootprint = new THREE.Shape(oRingElement);
      } else {
        // these all are the inner rings of the polygon and therefore holes
        buildingFootprint.holes.push(new THREE.Path(ring.map(x => {
          return new THREE.Vector2(-1 * map.get().scaleFactor * (origin[0] - util.wgs2MercX(x[0])), (origin[1] - util.wgs2MercY(x[1])) * map.get().scaleFactor)
        })));

      }
    });

    var geometry = new THREE.ExtrudeGeometry(buildingFootprint, {
      amount: buildingHeight * -1 * map.get().scaleFactor,
      bevelEnabled: false
    });
    var mesh = new THREE.Mesh(geometry, buildingMaterial); //  new THREE.MeshBasicMaterial({map: this.texture})
    mesh.rotation.x = -Math.PI / 2; // 90 degree
    mesh.rotateY(Math.PI);
    mesh.rotateZ(Math.PI);
    mesh.material.side = THREE.DoubleSide;
    this.buildingGroup.add(mesh);

  }

  destroy() {

    // TODO: try to aboard loading if tile is still in loading state
    const waiting = setInterval(() => {
      if (this.isLoaded) {
        map.get().dataTiles.remove(this.buildingGroup);
        this.buildingGroup.children.forEach(e => {
          e.geometry.dispose();
          e.material.dispose();
        });
        this.buildingGroup = undefined;
        clearTimeout(waiting);
      }
    }, 200);

  }

}

/*

three js geometries

https://stackoverflow.com/questions/50077508/three-js-indexed-buffergeometry-vs-instancedbuffergeometry

Three.js indexed BufferGeometry

 for many different geometries, better than standard geometry type


InstancedBufferGeometry

if many geometries share something like a lot of arrows in the example below
or many trees in a scene with the same shape


https://codepen.io/usefulthink/pen/YNrvpY?editors=0010

 */




