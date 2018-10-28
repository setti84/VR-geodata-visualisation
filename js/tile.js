class Tile {
  // Tiles are square flat polygons with with a rendered map view as a texture

  constructor (origin, coords) {

    this.origin = origin;
    this.tileCoords = coords;
    this.isLoaded = false;
    this.isLoading = false;
    this.distanceToOrigin = 100; // random value set
    this.scene = document.querySelector('a-scene');

    const bounds = this.bounds = this.tileBounds(this.tileCoords,this.origin.zoom);
    this.tileMiddle = this.gettileMiddle(bounds);
    this.calculateDistanceToOrrigin(origin);
  }

  create () {

    this.isLoading = true;
    const x = this.tileCoords[0];
    const y = (Math.pow(2,this.origin.zoom) -1) - this.tileCoords[1];
    let size = this.bounds[1] - this.bounds[0];
    const pos = [this.origin.wgs2Mercator()[0]-this.tileMiddle[0], this.origin.wgs2Mercator()[1]-this.tileMiddle[1]];
    if(DEBUGGING){
      this.showTileNumber(pos,x,y);
      size = Math.floor(this.bounds[1] - this.bounds[0]); // recognise tile gaps
    }

    this.tilePlane = document.createElement('a-entity');
    this.tilePlane.setAttribute('geometry', {
      primitive: 'plane',
      height:size,
      width: size
    });
    this.tilePlane.object3D.position.set(-1*pos[0],0,pos[1]);
    this.tilePlane.setAttribute('rotation', {x:-90, y:0, z:0});
    this.tilePlane.setAttribute('id', x + "a" + y);
    this.tilePlane.addEventListener('loaded', () => {
      this.isLoaded = true;
    });

    const texture = document.createElement('img');
    texture.setAttribute('id', x + "a" + y);
    texture.setAttribute('crossorigin', "anonymous" );
    texture.setAttribute('src', "https://api.tiles.mapbox.com/v4/setti.411b5377/" +
      this.origin.zoom + "/" +
      x + "/" +
      y +
      ".png?access_token=pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A");

    // texture.setAttribute('src', "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/" +
    //   this.origin.zoom + "/" +
    //   this.tilecoords[1] + "/" +
    //   this.tilecoords[0]);

    texture.addEventListener('load', () => {
      document.querySelector('a-assets').appendChild(texture);
      this.tilePlane.setAttribute('material', { src: '#' + x + "a" + y});
      this.scene.appendChild(this.tilePlane);
    });

  }

  gettileMiddle (bounds) {
    // return middle point of tile in mercator point x,y coordinates
    // offset is half of a tile
    const offset = (bounds[1] - bounds[0])/2;
    return [bounds[0]+offset,bounds[2]+offset]

  }

  tileBounds(){
    // tile = [tx, ty] = tilecoordinates
    // "Returns bounds of the given tile in EPSG:900913 coordinates"
    const res = 2 * Math.PI*EARTH_RADIUS_IN_METERS/TILE_SIZE/(Math.pow(2,this.origin.zoom));

    const minX = this.tileCoords[0]*TILE_SIZE*res-ORIGINSHIFT;
    const maxX = (this.tileCoords[0]+1)*TILE_SIZE*res-ORIGINSHIFT;
    const minY = this.tileCoords[1]*TILE_SIZE*res-ORIGINSHIFT;
    const maxY = (this.tileCoords[1]+1)*TILE_SIZE*res-ORIGINSHIFT;

    return [minX, maxX, minY, maxY];

  }

  calculateDistanceToOrrigin(newCameraPos){
    // Pythagorean theorem to get the distance to the camera
    this.distanceToOrigin = Math.sqrt(Math.pow((newCameraPos.wgs2Mercator()[0]-this.tileMiddle[0]), 2) + Math.pow((newCameraPos.wgs2Mercator()[1]-this.tileMiddle[1]), 2));

  }

  showTileNumber(pos,x,y) {
    // visualisation of the tilenumber on top of the tile -> debugging

    this.tileText = document.createElement('a-text');
    const scale = 15;
    const text = "G: " + x + "/" + y +
                 "\n TMS: " + this.tileCoords[0] + "/" + this.tileCoords[1] +
                 "\n Zoom: " + this.origin.zoom;

    this.tileText.setAttribute('position', {x:-1*pos[0], y:0.5, z:pos[1]});
    this.tileText.setAttribute('align', 'center');
    this.tileText.setAttribute('value', text);

    this.tileText.setAttribute('scale', {x:scale,y:scale,z:scale});
    this.tileText.setAttribute('color', 'black');
    this.tileText.setAttribute('side', 'double');
    this.tileText.setAttribute('rotation', {x:-90, y:0, z:0});

    this.scene.appendChild(this.tileText);

  }

  destroy () {

    if(this.isLoaded){
      this.tilePlane.parentNode.removeChild(this.tilePlane);
      if(DEBUGGING){
        this.tileText.parentNode.removeChild(this.tileText);
      }
    } else {
      const waiting = setInterval( () => {
        if(this.isLoaded){
          this.tilePlane.parentNode.removeChild(this.tilePlane);
          if(DEBUGGING){
            this.tileText.parentNode.removeChild(this.tileText);
          }
          clearTimeout(waiting);
        }
      } , 200);
    }

  }

}
