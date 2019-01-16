class BaseTile extends Tile {
  // BaseMapTile are square flat polygons with with a rendered map as a texture

  constructor(id,origin, coords, zoom) {

    super(id,origin, coords, zoom);

    const bounds = this.bounds = this.tileBounds();
    this.tileMiddle = this.gettileMiddle(bounds);
    this.calculateDistanceToOrigin(origin);

  }

  loadData() {
    // creates a flat geometry with the needed map tile as a texture

    this.state = 'loading';
    this.threeScene = map.get().threeScene;

    const x = this.tileCoords[0];
    const y = (Math.pow(2, this.zoom) - 1) - this.tileCoords[1];
    const s = 'abcd'[(x + y) % 4];

    // TODO: Tiles from codefor and link4 not working
    // https://leaflet-extras.github.io/leaflet-providers/preview/
    const link1 = `https://api.tiles.mapbox.com/v4/setti.411b5377/${this.zoom}/${x}/${y}.png` +
      '?access_token=pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A';
    const link6 = `https://a.tile.openstreetmap.se/hydda/base/${this.zoom}/${x}/${y}.png`;

    const messageData = {
      type: 'baseTile',
      id: this.id,
      zoom :this.zoom,
      mercator: this.origin.wgs2Mercator(),
      tileCoords: this.tileCoords,
      bounds: this.bounds,
      tileMiddle: this.tileMiddle,
      link: link1,
      x: x,
      y: y,
      debugging: map.get().status.debugging

    };

    map.get().workerPool.postMessage(messageData);

  }

  receiveData(data){

    const tile = data.data.tile;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', data.picture.width);
    canvas.setAttribute('height', data.picture.height);

    const ctx = canvas.getContext('2d');
    ctx.drawImage(data.picture,0,0);
    this.texture = new THREE.CanvasTexture( canvas );

    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( data.vertices, 3 ) );
    geometry.addAttribute( 'normal', new THREE.BufferAttribute( data.normal, 3 ) );
    geometry.addAttribute( 'color', new THREE.BufferAttribute( data.color, 3 ) );
    geometry.addAttribute( 'uv', new THREE.BufferAttribute( data.uv, 2 ) );

    this.mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: this.texture })); // vertexColors: THREE.VertexColors
    this.mesh.rotation.x = -Math.PI / 2; // 90 degree
    this.mesh.position.set(-1 * tile.pos[0], 0, tile.pos[1]);

    map.get().mapTiles.add(this.mesh);
    this.state = 'loaded';
  }

  calculateDistanceToOrigin(newCameraPos) {
    // Pythagorean theorem to get the distance to the camera
    this.distanceToOrigin = Math.round(Math.sqrt(Math.pow((newCameraPos.wgs2Mercator()[0] - this.tileMiddle[0]), 2) + Math.pow((newCameraPos.wgs2Mercator()[1] - this.tileMiddle[1]), 2)));

  }

  tileBounds(){
    // "Returns bounds of the given tile in EPSG:900913 coordinates"
    const res = 2 * Math.PI*EARTH_RADIUS_IN_METERS/TILE_SIZE/(Math.pow(2,this.zoom));

    //order minX,maxX,minYmaxY

    return [
      this.tileCoords[0]*TILE_SIZE*res-ORIGINSHIFT,
      (this.tileCoords[0]+1)*TILE_SIZE*res-ORIGINSHIFT,
      this.tileCoords[1]*TILE_SIZE*res-ORIGINSHIFT,
      (this.tileCoords[1]+1)*TILE_SIZE*res-ORIGINSHIFT
    ]

  }

  gettileMiddle(bounds) {
    // return middle point of tile in mercator point x,y coordinates
    // offset is half of a tile
    const offset = (bounds[1] - bounds[0]) / 2;
    return [bounds[0] + offset, bounds[2] + offset]

  }

  destroy() {

    if(this.texture){
      this.texture.dispose();
    }
    if(this.mesh){
      map.get().mapTiles.remove(this.mesh);
      this.mesh.material.dispose();
      this.mesh.geometry.dispose();
    }

  }

}