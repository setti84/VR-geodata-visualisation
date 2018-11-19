class BaseTile extends Tile {
  // BaseMapTile are square flat polygons with with a rendered map as a texture

  constructor(origin, coords) {

    super(origin, coords);
    const bounds = this.bounds = this.tileBounds();
    this.tileMiddle = this.gettileMiddle(bounds);
    this.calculateDistanceToOrigin(origin);

  }

  create() {
    // creates a flat geometry with the needed map tile as a texture

    this.isLoading = true;
    const x = this.tileCoords[0];
    const y = (Math.pow(2, this.origin.zoom) - 1) - this.tileCoords[1];
    let size = (this.bounds[1] - this.bounds[0]) * SCALEFACTOR;
    const pos = [(this.origin.wgs2Mercator()[0] - this.tileMiddle[0]) * SCALEFACTOR, (this.origin.wgs2Mercator()[1] - this.tileMiddle[1]) * SCALEFACTOR];

    if (DEBUGGING) {
      this.showTileNumber(pos, x, y);
      size = Math.floor(this.bounds[1] - this.bounds[0]) * SCALEFACTOR; // recognise tile gaps
    }


    // TODO: Tiles from codefor and link4 not working
    // https://leaflet-extras.github.io/leaflet-providers/preview/

    const link = `https://api.tiles.mapbox.com/v4/setti.411b5377/${this.origin.zoom}/${x}/${y}.png` +
      '?access_token=pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A';
    const link2 = `http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${this.origin.zoom}/${y}/${x}`;
    const link3 = `https://a.basemaps.cartocdn.com/light_nolabels/${this.origin.zoom}/${x}/${y}.png`;
    const link4 = `https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/${this.origin.zoom}/${x}/${y}.png`;

    // const link5 = `https://tiles.codefor.de/berlin-2018/${this.origin.zoom}/${x}/${y}.png`;
    // const link6 = `https://a.tile.openstreetmap.se/hydda/base/${this.origin.zoom}/${x}/${y}.png`;

    map.textureManager.loadTexture(link4).then(res => {

      // TODO: update distance from tile to camera and check if tile is still needed, otherwise destroy texture
      // if(calculateDistanceToOrigin(map.)){}

      this.texture = res;
      this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({map: this.texture}));

      this.mesh.rotation.x = -Math.PI / 2; // 90 degree
      this.mesh.position.set(-1 * pos[0], 0, pos[1]);
      map.get().mapTiles.add(this.mesh)
      // this.threeScene.add(this.mesh);
      this.isLoaded = true;

    }).catch(err => console.log(err));

  }

  gettileMiddle(bounds) {
    // return middle point of tile in mercator point x,y coordinates
    // offset is half of a tile
    const offset = (bounds[1] - bounds[0]) / 2;
    return [bounds[0] + offset, bounds[2] + offset]

  }

  calculateDistanceToOrigin(newCameraPos) {
    // Pythagorean theorem to get the distance to the camera
    this.distanceToOrigin = Math.sqrt(Math.pow((newCameraPos.wgs2Mercator()[0] - this.tileMiddle[0]), 2) + Math.pow((newCameraPos.wgs2Mercator()[1] - this.tileMiddle[1]), 2));

  }

  showTileNumber(pos, x, y) {
    // visualisation of the tilenumber on top of the tile -> debugging

    this.tileText = document.createElement('a-text');
    const scale = 15;
    const text = "G: " + x + "/" + y +
      "\n TMS: " + this.tileCoords[0] + "/" + this.tileCoords[1] +
      "\n Zoom: " + this.origin.zoom;

    this.tileText.setAttribute('position', {x: -1 * pos[0], y: 0.5, z: pos[1]});
    this.tileText.setAttribute('align', 'center');
    this.tileText.setAttribute('value', text);

    this.tileText.setAttribute('scale', {x: scale, y: scale, z: scale});
    this.tileText.setAttribute('color', 'black');
    this.tileText.setAttribute('side', 'double');
    this.tileText.setAttribute('rotation', {x: -90, y: 0, z: 0});

    this.scene.appendChild(this.tileText);

  }

  destroy() {

    // TODO: try to aboard loading if tile is still in loading state

    const waiting = setInterval(() => {

      if (this.isLoaded) {
        map.get().mapTiles.remove(this.mesh);
        this.texture.dispose();
        this.mesh.material.dispose();
        this.mesh.geometry.dispose();

        if (DEBUGGING) {
          this.tileText.parentNode.removeChild(this.tileText);
        }
        clearTimeout(waiting);
      }
    }, 200);

  }

}


//     // instantiate a loader
//     var loader = new THREE.TextureLoader();
// //
//     loader.load(
//       // resource URL
//       link,
//
//       // onLoad callback
//       ( texture ) => {
//         // in this example we create the material when the texture is loaded
//         console.log(texture)
//
//         this.texture = texture;
//
//           this.mesh = new THREE.Mesh( new THREE.PlaneGeometry( size, size ), new THREE.MeshBasicMaterial( { map: texture } ) );
//           console.log(this.mesh)
//
//           this.mesh.rotation.x = -Math.PI / 2; // 90 degree
//           this.mesh.position.set(-1*pos[0],0,pos[1]);
//
//           this.threeScene.add(this.mesh);
//           console.log(this.threeScene)
//
//           this.isLoaded = true
//
//       },
//
//       // onProgress callback currently not supported
//       undefined,
//
//       // onError callback
//       function ( err ) {
//         console.error( 'An error happened.' );
//         console.log(err)
//       }
//     );


// if(this.isLoaded){
//   this.tilePlane.parentNode.removeChild(this.tilePlane);
//   if(DEBUGGING){
//     this.tileText.parentNode.removeChild(this.tileText);
//   }
// } else {
//   const waiting = setInterval( () => {
//     if(this.isLoaded){
//       this.tilePlane.parentNode.removeChild(this.tilePlane);
//       if(DEBUGGING){
//         this.tileText.parentNode.removeChild(this.tileText);
//       }
//       clearTimeout(waiting);
//     }
//   } , 200);
// }


// this.tilePlane = document.createElement('a-entity');
// this.tilePlane.setAttribute('geometry', {
//   primitive: 'plane',
//   height:size,
//   width: size
// });
// this.tilePlane.object3D.position.set(-1*pos[0],0,pos[1]);
// this.tilePlane.setAttribute('rotation', {x:-90, y:0, z:0});
// this.tilePlane.setAttribute('id', x + "a" + y);
// this.tilePlane.addEventListener('loaded', () => {
//   this.isLoaded = true;
//   // console.log(this.tilePlane)
// });


// const texture = document.createElement('img');
// texture.setAttribute('id', x + "a" + y);
// texture.setAttribute('crossorigin', "anonymous" );
// texture.setAttribute('src', `https://api.tiles.mapbox.com/v4/setti.411b5377/${this.origin.zoom}/${x}/${y}.png` +
//   "?access_token=pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A");
//


// // texture.setAttribute('src', "https://api.tiles.mapbox.com/v4/setti.411b5377/${this.origin.zoom}" + this.origin.zoom + "/" +
// //   x + "/" +
// //   y +
// //   ".png?access_token=pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A");
//
// // texture.setAttribute('src', "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/" +
// //   this.origin.zoom + "/" +
// //   this.tilecoords[1] + "/" +
// //   this.tilecoords[0]);
//
// texture.addEventListener('load', () => {
//   document.querySelector('a-assets').appendChild(texture);
//   this.tilePlane.setAttribute('material', { src: '#' + x + "a" + y});
//   this.scene.appendChild(this.tilePlane);
// });
