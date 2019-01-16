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