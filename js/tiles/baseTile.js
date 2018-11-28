class BaseTile extends Tile {
  // BaseMapTile are square flat polygons with with a rendered map as a texture

  constructor(id,origin, coords) {

    super(id,origin, coords);
    // const bounds = this.bounds = this.tileBounds();
    // this.tileMiddle = this.gettileMiddle(bounds);
    // this.calculateDistanceToOrigin(origin);

  }

  receiveData(data){

    // console.log(data)

    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', data.picture.width);
    canvas.setAttribute('height', data.picture.height);

    const ctx = canvas.getContext('2d');

    ctx.drawImage(data.picture,0,0);

    this.texture = new THREE.CanvasTexture( canvas );
    // console.log(texture)

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( data.vertices, 3 ) );
    geometry.addAttribute( 'normal', new THREE.BufferAttribute( data.normal, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( data.color, 3 ) );
    geometry.addAttribute( 'uv', new THREE.BufferAttribute( data.uv, 2 ) );

    var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    // material.side = THREE.DoubleSide
    // this.mesh = new THREE.Mesh(geometry, material);

    this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: this.texture}));
    // console.log(data)
    // this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(data.data.size, data.data.size), new THREE.MeshBasicMaterial({map: this.texture}));
    this.mesh.rotation.x = -Math.PI / 2; // 90 degree
    this.mesh.position.set(-1 * data.data.pos[0], 0, data.data.pos[1]);

    map.get().mapTiles.add(this.mesh)
    this.state = 'loaded';

  }

  create() {
    // creates a flat geometry with the needed map tile as a texture

    this.state = 'loading';
    this.threeScene = map.get().threeScene;

    const messageData = {type: 'baseTile',
      id: this.id,
      zoom :this.origin.zoom,
      mercator: this.origin.wgs2Mercator(),
      tileCoords: this.tileCoords,
      bounds: this.bounds,
      tileMiddle: this.tileMiddle,

    };

    map.get().workerPool.postMessage(messageData);

    const x = this.tileCoords[0];
    const y = (Math.pow(2, this.origin.zoom) - 1) - this.tileCoords[1];
    let size = (this.bounds[1] - this.bounds[0]) * SCALEFACTOR;
    const pos = [(this.origin.wgs2Mercator()[0] - this.tileMiddle[0]) * SCALEFACTOR, (this.origin.wgs2Mercator()[1] - this.tileMiddle[1]) * SCALEFACTOR];

    if (map.get().debugging) {
      // this.showTileNumber(pos, x, y);  still in a frame mode
      size = Math.floor(this.bounds[1] - this.bounds[0]); // recognise tile gaps
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

    // map.textureManager.loadTexture(link4).then(res => {
    //
    //   // TODO: update distance from tile to camera and check if tile is still needed, otherwise destroy texture
    //
    //   this.texture = res;
    //   // console.log(new THREE.MeshBasicMaterial({map: this.texture}))
    //   this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({map: this.texture}));
    //
    //   this.mesh.rotation.x = -Math.PI / 2; // 90 degree
    //   this.mesh.position.set(-1 * pos[0], 0, pos[1]);
    //   // map.get().mapTiles.add(this.mesh)
    //   // this.state = 'loaded'
    //
    // }).catch(err => console.log(err));

  }

  // showTileNumber(pos, x, y) {
  //   // visualisation of the tilenumber on top of the tile -> debugging
  //
  //   this.tileText = document.createElement('a-text');
  //   const scale = 15;
  //   const text = "G: " + x + "/" + y +
  //     "\n TMS: " + this.tileCoords[0] + "/" + this.tileCoords[1] +
  //     "\n Zoom: " + this.origin.zoom;
  //
  //   this.tileText.setAttribute('position', {x: -1 * pos[0], y: 0.5, z: pos[1]});
  //   this.tileText.setAttribute('align', 'center');
  //   this.tileText.setAttribute('value', text);
  //
  //   this.tileText.setAttribute('scale', {x: scale, y: scale, z: scale});
  //   this.tileText.setAttribute('color', 'black');
  //   this.tileText.setAttribute('side', 'double');
  //   this.tileText.setAttribute('rotation', {x: -90, y: 0, z: 0});
  //
  //   this.scene.appendChild(this.tileText);
  //
  // }

  abordLoading(){

  }

  destroy() {

    // TODO: try to aboard loading if tile is still in loading state

    if(this.state === 'blank'){

    }else if(this.state === 'loading' || this.state === 'loaded') {

      const waiting = setInterval(() => {

        if (this.state === 'loaded') {
          map.get().mapTiles.remove(this.mesh);
          this.texture.dispose();
          this.mesh.material.dispose();
          this.mesh.geometry.dispose();

          if (DEBUGGING) {
            // this.tileText.parentNode.removeChild(this.tileText);
          }
          clearTimeout(waiting);
        }
      }, 200);

    }

  }

}
