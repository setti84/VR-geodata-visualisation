class DataTile extends Tile {
  // BaseMapTile are square flat polygons with with a rendered map view as a texture

  constructor(id,origin, coords, zoom) {
    super(id,origin, coords, zoom);
    this.bounds = this.tileBounds();
    this.tileMiddle = this.gettileMiddle();
    this.calculateDistanceToOrigin(origin);
    this.meshes = [];
    this.amplitude = 0.1;
    this.materialShader = null;
    this.buildingMaterial = null;

    //   TODO: order objects in categories (buildings,trees,...)
    //   TODO: add texture to objects (option to turn it on and off)
    //   TODO: use Events to check if all vector and texture data have loaded successfully

  }

  loadData() {

    this.threeScene = map.get().threeScene;
    this.state = 'loading';

    const mapOrigin = this.origin.wgs2Mercator();
    const x = this.tileCoords[0];
    const y = (Math.pow(2, this.zoom) - 1) - this.tileCoords[1];
    const s = 'abcd'[(x + y) % 4];

    this.size = this.bounds[1] - this.bounds[0];
    this.pos = [mapOrigin[0] - this.tileMiddle[0], mapOrigin[1] - this.tileMiddle[1]];

    let user = 'anonymous';
    if(config) user = config.osmbuildings;

    // const test = 'http://localhost/VR-geodata-visualisation/data/osmbTile.json';
    // https://a.data.osmbuildings.org/0.2/anonymous/tile/17/70397/42970.json
    // const link = `https://${s}.data.osmbuildings.org/0.2/anonymous/tile/${this.zoom}/${x}/${y}.json`;
    const link = `https://${s}.data.osmbuildings.org/0.2/${user}/tile/${this.zoom}/${x}/${y}.json`;

    const messageData = {
      type: 'dataTile',
      id: this.id,
      zoom :this.zoom,
      tileCoords: this.tileCoords,
      bounds: this.bounds,
      tileMiddle: this.tileMiddle,
      link: link,
      x: x,
      y: y,
      debugging: map.get().status.debugging
    };

    map.get().workerPool.postMessage(messageData);

  }

  receiveData(data){

    // somehow the worker sends 2 meessages back. One with the response and the other one is empty. We dont consider the empty answer
    if(data.vertices.length === 0) return;

    if(map.get().status.busy === 'moving'){
      setTimeout( () => {
        // console.log('bin bei waiting')
        this.receiveData(data)
      },100)
      return;
    }

    // console.log(data)
    const tile = data.data.tile;

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( data.vertices, 3 ) );
    geometry.addAttribute( 'normal', new THREE.BufferAttribute( data.normal, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( data.color, 3 , true) );

    this.buildingMaterial = new THREE.MeshLambertMaterial({  vertexColors: THREE.VertexColors});

    this.buildingMaterial.transparent = true;
    this.buildingMaterial.opacity = 0;

    this.buildingMaterial.onBeforeCompile = shader => {
      shader.uniforms.amplitude = { value: 0 };
      shader.vertexShader = 'uniform float amplitude;\n' + shader.vertexShader;
      // console.log(shader);

      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', THREE.ShaderChunk.begin_vertex + '\ntransformed.z = transformed.z*amplitude;\n' )
      this.materialShader = shader;
      this.blendIn();

    };

    this.mesh = new THREE.Mesh(geometry);
    this.mesh = new THREE.Mesh(geometry, this.buildingMaterial);
    this.mesh.rotation.x = -Math.PI / 2; // 90 degree
    this.mesh.rotateZ(Math.PI);
    this.mesh.material.side = THREE.DoubleSide;
    this.mesh.position.set(-1*this.pos[0], 1, this.pos[1]);

    // TODO cancel all timeouts on destroy
    // const chunks3 = (this.mesh.geometry.attributes.position.count%2)? 4:5;

    let loop = 0;
    // amount of vertices to put on the map is calculated in either 4 or 6 portions(depending on tile size), take even numbers
    const chunks = this.zoom === 17? 4:6;
    const chunkVertices = this.mesh.geometry.attributes.position.count/chunks;
    let vertices = 0;

    this.chunkIntervall = setInterval( () => {
      if(map.get().status.busy !== 'moving'){
        if(loop === 0) map.get().dataTiles.add(this.mesh);
        loop++;
        vertices+=chunkVertices;
        geometry.setDrawRange( 0, vertices );
        loop === chunks ? clearInterval(this.chunkIntervall):false;
      }
    },200);

    if(tile.debugging){
      const geometryBox = new THREE.BoxGeometry( 10, 10, 10 );
      const materialBox = new THREE.MeshBasicMaterial( { color: 0xFF0000 } );
      const cubeBox = new THREE.Mesh( geometryBox, materialBox );
      cubeBox.position.set(-1*this.pos[0], 1, this.pos[1]);
      map.get().dataTiles.add(cubeBox);
    }

    this.state = 'loaded';
  }

  blendIn(){

    const height = setInterval( () => {

      this.materialShader.uniforms.amplitude.value += 0.02;
      this.materialShader.uniforms.amplitude.value >= 1 ? clearInterval(height): false;
    }, 20);

    const opacity = setInterval( () => {
      this.buildingMaterial.opacity += 0.05;
      this.buildingMaterial.opacity >= 1 ? clearInterval(opacity): false;
    }, 20);

  }

  tileBounds(){
    // "Returns bounds of the given tile in EPSG:900913 coordinates"
    const res = 2*Math.PI*EARTH_RADIUS_IN_METERS/TILE_SIZE/(Math.pow(2,this.zoom));

    //order minX,maxX,minYmaxY
    return [
      this.tileCoords[0]*TILE_SIZE*res-ORIGINSHIFT,
      (this.tileCoords[0]+1)*TILE_SIZE*res-ORIGINSHIFT,
      this.tileCoords[1]*TILE_SIZE*res-ORIGINSHIFT,
      (this.tileCoords[1]+1)*TILE_SIZE*res-ORIGINSHIFT
    ]

  }

  gettileMiddle() {
    // return middle point of tile in mercator point x,y coordinates
    // offset is half of a tile
    const offset = (this.bounds[1] - this.bounds[0])/2;
    return [this.bounds[0] + offset, this.bounds[2] + offset]

  }

  calculateDistanceToOrigin(newCameraPos) {
    // Pythagorean theorem to get the distance to the camera
    this.distanceToOrigin = Math.round(Math.sqrt(Math.pow((newCameraPos.wgs2Mercator()[0] - this.tileMiddle[0]), 2) + Math.pow((newCameraPos.wgs2Mercator()[1] - this.tileMiddle[1]), 2)));

  }

  destroy() {

    if(this.state === 'loading' || this.state === 'loaded'){
      const waiting = setInterval(() => {
        if (this.state === 'loaded') {
          map.get().dataTiles.remove(this.mesh);
          this.mesh.material.dispose();
          this.mesh.geometry.dispose();
          this.mesh = undefined;

          clearTimeout(waiting);
        }
      }, 200);

    }
  }

}



// const chunks = 1;
// const posLength = data.vertices.length/3/chunks;
// let start=0;
// let endPos=posLength;
// let vertices,normal,uv;
//
// const mesh = new THREE.Mesh();
// // const geometry = new THREE.BufferGeometry();
// const buildingMaterial = new THREE.MeshLambertMaterial({color: 0x56a0c5}); //  0xcac8d2
//
// console.log(data.uv.length)
// console.log(data.vertices.length)
//
// for(let i = 1; i< chunks+1;i++){
//   // console.log(i)
//   console.log(start,endPos)
//   vertices = data.vertices.slice(start*3,endPos*3);
//   normal = data.normal.slice(start*3,endPos*3);
//   uv = data.uv.slice(start*2,endPos*2);
//   start=(posLength*i)+(1*i);
//   endPos=(posLength*(i+1))+(1*i)
//
//   console.log(vertices.length,normal.length, uv.length)
//
//   const geometry = new THREE.BufferGeometry();
//   geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
//   geometry.addAttribute( 'normal', new THREE.BufferAttribute( normal, 3 ) );
//   // geometry.addAttribute( 'color', new THREE.BufferAttribute( data.color, 3 ) );
//   geometry.addAttribute( 'uv', new THREE.BufferAttribute( uv, 2 ) );
//
//   const mesh = new THREE.Mesh(geometry, buildingMaterial);
//   mesh.rotation.x = -Math.PI / 2; // 90 degree
//   mesh.rotateZ(Math.PI);
//   mesh.material.side = THREE.DoubleSide;
//   mesh.position.set(-1*this.pos[0], 1, this.pos[1]);
//
//   this.meshes.push(mesh);
// }

// const chunks = 1;
// const posLength = data.vertices.length/3/chunks;
// let start=0;
// let endPos=posLength;
// let vertices,normal,uv;
//
// const mesh = new THREE.Mesh();
// // const geometry = new THREE.BufferGeometry();
// const buildingMaterial = new THREE.MeshLambertMaterial({color: 0x56a0c5}); //  0xcac8d2
//
// console.log(data.uv.length)
// console.log(data.vertices.length)
//
// for(let i = 1; i< chunks+1;i++){
//   // console.log(i)
//   console.log(start,endPos)
//   vertices = data.vertices.slice(start*3,endPos*3);
//   normal = data.normal.slice(start*3,endPos*3);
//   uv = data.uv.slice(start*2,endPos*2);
//   start=(posLength*i)+(1*i);
//   endPos=(posLength*(i+1))+(1*i)
//
//   console.log(vertices.length,normal.length, uv.length)
//
//   const geometry = new THREE.BufferGeometry();
//   geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
//   geometry.addAttribute( 'normal', new THREE.BufferAttribute( normal, 3 ) );
//   // geometry.addAttribute( 'color', new THREE.BufferAttribute( data.color, 3 ) );
//   geometry.addAttribute( 'uv', new THREE.BufferAttribute( uv, 2 ) );
//
//   const mesh = new THREE.Mesh(geometry, buildingMaterial);
//   mesh.rotation.x = -Math.PI / 2; // 90 degree
//   mesh.rotateZ(Math.PI);
//   mesh.material.side = THREE.DoubleSide;
//   mesh.position.set(-1*this.pos[0], 1, this.pos[1]);
//
//   this.meshes.push(mesh);
// }

//
// destroy() {
//
//   // TODO: try to aboard loading if tile is still in loading state
//
//   if(this.state === 'blank'){
//
//   }else if(this.state === 'loading' || this.state === 'loaded') {
//
//     const waiting = setInterval(() => {
//
//       if (this.state === 'loaded') {
//         map.get().mapTiles.remove(this.mesh);
//         this.texture.dispose();
//         this.mesh.material.dispose();
//         this.mesh.geometry.dispose();
//
//         if (DEBUGGING) {
//           // this.tileText.parentNode.removeChild(this.tileText);
//         }
//         clearTimeout(waiting);
//       }
//     }, 200);
//
//   }
//
// }

// creatureBuilding(feature, buildingMaterial, origin) {
//
//   // console.log(feature)
//   // TODO: solve this problem in a better way, height of building is very uneven compared to reality
//   let buildingHeight = 4;
//   const tags = feature.properties.tags;
//   if (tags.hasOwnProperty('height')) {
//     buildingHeight = tags['height'];
//   } else if (tags.hasOwnProperty('building:levels')) {
//     buildingHeight = tags['building:levels'] * 2;
//   } else if (tags.hasOwnProperty('levels')) {
//     buildingHeight = tags['levels'] * 2;
//   }
//
//   let buildingFootprint, oRingElement = [];
//   const coordinates = feature.geometry.coordinates;
//   coordinates.forEach((ring, index) => {
//     if (index === 0) {
//       oRingElement = ring.map(x => {
//         return new THREE.Vector2(-1 * (origin[0] - util.wgs2MercX(x[0])), (origin[1] - util.wgs2MercY(x[1])))
//       });
//       buildingFootprint = new THREE.Shape(oRingElement);
//     } else {
//       // these all are the inner rings of the polygon and therefore holes
//       buildingFootprint.holes.push(new THREE.Path(ring.map(x => {
//         return new THREE.Vector2(-1 * (origin[0] - util.wgs2MercX(x[0])), (origin[1] - util.wgs2MercY(x[1])))
//       })));
//
//     }
//   });
//
//   var geometry = new THREE.ExtrudeGeometry(buildingFootprint, {
//     depth: buildingHeight * -1 * SCALEFACTOR,
//     bevelEnabled: false
//   });
//   var mesh = new THREE.Mesh(geometry, buildingMaterial); //  new THREE.MeshBasicMaterial({map: this.texture})
//   mesh.rotation.x = -Math.PI / 2; // 90 degree
//   mesh.rotateY(Math.PI);
//   mesh.rotateZ(Math.PI);
//   mesh.material.side = THREE.DoubleSide;
//   this.buildingGroup.add(mesh);
//
// }

// loadData() {
//
//   return new Promise((resolve, reject) => {reject(false)});
//
//   // return new Promise((resolve, reject) => {
//   //
//   //   const tilecoords = this.tileBounds();
//   //
//   //   const tileborder = LatLng.unprojectWorldCoordinates(tilecoords[0], tilecoords[2]).concat(LatLng.unprojectWorldCoordinates(tilecoords[1], tilecoords[3]));
//   //
//   //   const httpRequest = new XMLHttpRequest();
//   //
//   //   // random numer between 1 and 4
//   //   const randomNum = Math.floor((Math.random() * 4) + 1) - 1;
//   //
//   //   const urls = [
//   //     'https://overpass-api.de/api/interpreter?data=',
//   //     'https://lz4.overpass-api.de/api/interpreter?data=',
//   //     'https://overpass.openstreetmap.fr/api/interpreter?data=',
//   //     'https://overpass.kumi.systems/api/interpreter?data='
//   //   ];
//   //
//   //
//   //   const url = 'http://overpass-api.de/api/interpreter?data='; // 'https://data.sebastiansettgast.com/sprite.json';
//   //   // const url = 'http://overpass-api.de/api/interpreter?data=[out%3Ajson][timeout%3A25]%3B%28node[%22highway%22%3D%22bus_stop%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Brelation[%22landuse%22%3D%22residential%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Bway[%22landuse%22%3D%22retail%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Brelation[%22landuse%22%3D%22retail%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Bway[%22landuse%22%3D%22commercial%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Brelation[%22landuse%22%3D%22commercial%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Bnode[%22highway%22%3D%22bus_stop%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3B%29%3Bout%20body%3B%3E%3Bout%20skel%20qt%3B%0A';
//   //
//   //   const url2 = 'https://lz4.overpass-api.de/api/interpreter?data=';
//   //
//   //   const query = '[out:json];(' +
//   //     'node(' + tileborder + ')["building"];'
//   //     + 'way(' + tileborder + ')["building"];'
//   //     + 'relation(' + tileborder + ')["building"];'
//   //     + ');out body; >;out skel qt;';
//   //
//   //   // console.log(query)
//   //
//   //   httpRequest.open('GET', urls[randomNum] + query); //    'data/data.json'
//   //   httpRequest.send();
//   //
//   //   if (!httpRequest) {
//   //     reject("Cannot create an XMLHTTP instance");
//   //   }
//   //
//   //   httpRequest.onreadystatechange = (ev) => {
//   //
//   //     if (httpRequest.readyState === XMLHttpRequest.DONE) {
//   //       if (httpRequest.readyState == 4 && httpRequest.status === 200) {
//   //         // data has arrived
//   //         resolve(JSON.parse(httpRequest.responseText));
//   //
//   //       }
//   //       // else if(httpRequest.status === 429){
//   //       //   reject(httpRequest.status)
//   //       // }
//   //       else {
//   //         // no data arrived
//   //         // TODO: reload data? or destroy? Suggestions?
//   //         reject(httpRequest.status);
//   //       }
//   //     }
//   //   }
//   // });
//
// }

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




