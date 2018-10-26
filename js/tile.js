class Tile {

  constructor (origin, coords) {

    this.origin = origin;
    this.tileCoords = coords;
    this.isLoaded = false;
    this.distanceToOrigin = 100; // random value set
    this.scene = document.querySelector('a-scene');
    this.tilePlane;

    const bounds = this.bounds = this.tileBounds(this.tileCoords,this.origin.zoom);
    this.tileMiddle = this.gettileMiddle(bounds);
    this.calculateDistanceToOrrigin(origin);

  }

  create () {

    this.isLoaded = true;
    const x = this.tileCoords[0];
    const y = this.tileCoords[1];
    console.log("load: " + x + y)
    const texture = document.createElement('img');
    const size = Math.floor(this.bounds[1] - this.bounds[0]); // recognise tile gaps
    // const size = this.bounds[1] - this.bounds[0];
    const pos = [this.origin.wgs2Mercator()[0]-this.tileMiddle[0], this.origin.wgs2Mercator()[1]-this.tileMiddle[1]];
    this.tilePlane = document.createElement('a-entity');

    texture.addEventListener('load', e => {

      document.querySelector('a-assets').appendChild(texture);

      this.tilePlane.setAttribute('geometry', {
        primitive: 'plane',
        height:size,
        width: size
      });

      this.tilePlane.setAttribute('material', { src: '#' + x + "a" + y});
      this.tilePlane.setAttribute('position', {x:-1*pos[0], y:0, z:pos[1]});
      this.tilePlane.setAttribute('rotation', {x:-90, y:0, z:0});

      // document.querySelector('a-scene').appendChild(tilePlane);
      this.scene.appendChild(this.tilePlane);

    });

    texture.setAttribute('id', x + "a" + y);
    texture.setAttribute('crossorigin', "anonymous" );
    texture.setAttribute('src', "https://api.tiles.mapbox.com/v4/setti.411b5377/" +
      this.origin.zoom + "/" +
      this.tileCoords[0] + "/" +
      this.tileCoords[1] +
      ".png?access_token=pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A");

    // texture.setAttribute('src', "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/" +
    //   this.origin.zoom + "/" +
    //   this.tilecoords[1] + "/" +
    //   this.tilecoords[0]);

  }

  gettileMiddle (bounds) {
    // return middle point of tile in mercator point x,y coordinates
    // offset is half of a tile
    const offset = (bounds[1] - bounds[0])/2;
    console.log(bounds)
    return [bounds[0]+offset,bounds[2]-offset]
  }

  tileBounds(){
    // tile = [tx, ty] = tilecoordinates
    // "Returns bounds of the given tile in EPSG:900913 coordinates"
    const res = 2 * Math.PI*EARTH_RADIUS_IN_METERS/TILE_SIZE/(Math.pow(2,this.origin.zoom));

    const minX = this.tileCoords[0]*TILE_SIZE*res-ORIGINSHIFT;
    const maxX = (this.tileCoords[0]+1)*TILE_SIZE*res-ORIGINSHIFT;
    const minY = Math.abs(this.tileCoords[1]*TILE_SIZE*res-ORIGINSHIFT);
    const maxY = Math.abs((this.tileCoords[1]+1)*TILE_SIZE*res-ORIGINSHIFT);
    // const minY = this.tileCoords[1]*TILE_SIZE*res-ORIGINSHIFT;
    // const maxY = (this.tileCoords[1]+1)*TILE_SIZE*res-ORIGINSHIFT;

    return [minX, maxX, minY, maxY];

  }
  calculateDistanceToOrrigin(newCameraPos){
    // Pythagorean theorem to get the distance
    // this.distanceToOrigin =  Math.floor(Math.abs(newCameraPos.wgs2Mercator()[0] - this.tileMiddle[0]) + Math.abs(newCameraPos.wgs2Mercator()[1] - Math.abs(this.tileMiddle[1])));
  console.log(newCameraPos.wgs2Mercator())
    console.log(this.tileMiddle)

    this.distanceToOrigin =  Math.floor(Math.abs(newCameraPos.wgs2Mercator()[0] - this.tileMiddle[0]) + Math.abs(newCameraPos.wgs2Mercator()[1] - Math.abs(this.tileMiddle[1])));

  }

  destroy () {
    console.log("destroy tile???????")
    // console.log(this.tilePlane)
    // if(this.tilePlane){
    //   this.scene.removeChild(this.tilePlane);
    // }

    /*
    get rid of texture
    get rid of geometry
     */
  }
}
