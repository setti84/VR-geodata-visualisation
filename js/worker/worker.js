
importScripts('./../lib/three.js');

const loadData = (link, callback) => {

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
  httpRequest.responseType = "blob";
  httpRequest.send();


}

createBaseTile = (data) => {

  const tile = data.tile;
  // console.log('im worker')


  const x = tile.tileCoords[0];
  const y = (Math.pow(2, tile.zoom) - 1) - tile.tileCoords[1];
  let size = (tile.bounds[1] - tile.bounds[0]);
  const pos = [(tile.mercator[0] - tile.tileMiddle[0]), (tile.mercator[1] - tile.tileMiddle[1])];
  let texture, mesh, bufferGeometry, geometry, material;


  data.pos = pos;
  data.size = size;
  // if (map.get().debugging) {
  //   // this.showTileNumber(pos, x, y);  still in a frame mode
  //   size = Math.floor(this.bounds[1] - this.bounds[0]) * SCALEFACTOR; // recognise tile gaps
  // }

  // TODO: Tiles from codefor and link4 not working
  // https://leaflet-extras.github.io/leaflet-providers/preview/

  const link = `https://api.tiles.mapbox.com/v4/setti.411b5377/${tile.zoom}/${x}/${y}.png` +
    '?access_token=pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A';
  const link2 = `http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${tile.zoom}/${y}/${x}`;
  const link3 = `https://a.basemaps.cartocdn.com/light_nolabels/${tile.zoom}/${x}/${y}.png`;
  const link4 = `https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/${tile.zoom}/${x}/${y}.png`;

  // https://stackoverflow.com/questions/39062595/how-can-i-create-a-png-blob-from-binary-data-in-a-typed-array


  loadData(link, (picture) => {

    // geometry = new THREE.PlaneGeometry(size, size);
    bufferGeometry = new THREE.BufferGeometry().fromGeometry(new THREE.PlaneGeometry(size, size));

    // console.log(picture)

    createImageBitmap(picture,0,0,256,256).then((resolve,reject) => {

      // console.log(resolve)
      // console.log(reject)


      const res = {
          data: data,
        picture : resolve,
          vertices: bufferGeometry.attributes.position.array,
          normal: bufferGeometry.attributes.normal.array,
          color: bufferGeometry.attributes.color.array,
          uv: bufferGeometry.attributes.uv.array,

        };

      // console.log(res)

        self.postMessage(res, [
          res.picture,
          res.vertices.buffer,
          res.normal.buffer,
          res.color.buffer,
          res.uv.buffer,
        ]);

      //
      // const res = {
      //   data: data,
      //   picture : picture,
      //   vertices: bufferGeometry.attributes.position.array,
      //   normal: bufferGeometry.attributes.normal.array,
      //   color: bufferGeometry.attributes.color.array,
      //   uv: bufferGeometry.attributes.uv.array,
      //
      // };
      //
      // self.postMessage(res, [
      //   res.picture,
      //   res.vertices.buffer,
      //   res.normal.buffer,
      //   res.color.buffer,
      //   res.uv.buffer,
      // ]);



    });

    // console.log(bufferGeometry)
    // console.log(bufferGeometry.attributes)


    // self.postMessage({data: data, picture:res}, [res]);


    //
    // const res1 = {
    //   items: items,
    //   position: position,
    //   vertices: new Float32Array(tri.vertices),
    //   normals: new Float32Array(tri.normals),
    //   colors: new Float32Array(tri.colors),
    //   texCoords: new Float32Array(tri.texCoords),
    //   heights: new Float32Array(tri.heights),
    //   pickingColors: new Float32Array(tri.pickingColors)
    // };
    //
    // postMessage(res1, [
    //   res1.vertices.buffer,
    //   res1.normals.buffer,
    //   res1.colors.buffer,
    //   res1.texCoords.buffer,
    //   res1.heights.buffer,
    //   res1.pickingColors.buffer
    // ]);






    // var texture = new THREE.Texture(res);
    // console.log(texture.toJSON());
    //
    // material = new THREE.MeshBasicMaterial({map: res});
    // geometry = new THREE.PlaneGeometry(size, size);
    // bufferGeometry = new THREE.BufferGeometry();
    //
    //   mesh = new THREE.Mesh(geometry, material );
    //
    //   mesh.rotation.x = -Math.PI / 2; // 90 degree
    //   mesh.position.set(-1 * pos[0], 0, pos[1]);
    //   //map.get().mapTiles.add(this.mesh)
    //
    // console.log('loaded texture done')
    //   console.log(geometry)
    // console.log(material)
    // self.postMessage(data);
    //self.postMessage(data);

  })

  // loader.load(link,
  //
  //   // onLoad callback
  //   function ( image ) {
  //     self.postMessage(data);
  //   },
  //
  //   // onProgress callback currently not supported
  //   undefined,
  //
  //   // onError callback
  //   function () {
  //     console.error( 'An error happened.' );
  //   })

  // textureManager.load(link).then(res => {
  //
  //   // TODO: update distance from tile to camera and check if tile is still needed, otherwise destroy texture
  //
  //   texture = res;
  //   material = new THREE.MeshBasicMaterial({map: texture});
  //   geometry = new THREE.PlaneGeometry(size, size);
  //   mesh = new THREE.Mesh(geometry, material );
  //
  //   mesh.rotation.x = -Math.PI / 2; // 90 degree
  //   mesh.position.set(-1 * pos[0], 0, pos[1]);
  //   //map.get().mapTiles.add(this.mesh)
  //
  //   console.log(mesh)
  //

  //
  // }).catch(err => console.log(err));





}

createDataTile = (data) => {

}

self.addEventListener('message', (e) => {


  switch (e.data.tile.type){

    case 'baseTile':
      createBaseTile(e.data);

    case 'dataTile':
      createDataTile(e.data);

    // default: self.postMessage('Worker doesnt know what to do!')

  }

}, false);