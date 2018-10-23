class Tile {

  constructor (offset, latLon) {

    this.offset = [offset[0],offset[1]];
    this.latLon = latLon;
    // this.tileCoords = [latLon.googleTiles()[0], latLon.googleTiles()[1]];
    this.tileCoords = [latLon.merc2Tile()[0], latLon.merc2Tile()[1]];
    // this.size2 = Util.getTileSizeInMeters(latLon.lat, this.latLon.zoom);

    const bounds = this.bounds = this.tileBounds(this.tileCoords,this.latLon.zoom);
    const middle = this.tileMiddle = this.tileMiddle(bounds);
    console.log(middle)
    this.create(bounds, middle);

  }

  create (bounds, middle) {

    const x = this.latLon.googleTiles()[0];
    const y = this.latLon.googleTiles()[1];
    const texture = document.createElement('img');
    // const size = Math.floor(bounds[3] - bounds[2]); // recognise tile gaps
    const size = bounds[3] - bounds[2];
    const pos = [this.offset[0]-middle[0], this.offset[1]-middle[1]];
    const tilePlane = document.createElement('a-entity');

    texture.addEventListener('load', (event) => {

      document.querySelector('a-assets').appendChild(texture);

      tilePlane.setAttribute('geometry', {
        primitive: 'plane',
        height:size,
        width: size
      });

      tilePlane.setAttribute('material', { src: '#' + x + "a" + y});
      tilePlane.setAttribute('position', {x:-1*pos[0], y:0, z:pos[1]});
      tilePlane.setAttribute('rotation', {x:-90, y:0, z:0});

      document.querySelector('a-scene').appendChild(tilePlane);

    });

    texture.setAttribute('id', x + "a" + y);
    texture.setAttribute('crossorigin', "anonymous" );
    texture.setAttribute('src', "https://api.tiles.mapbox.com/v4/setti.411b5377/" +
      this.latLon.zoom + "/" +
      this.latLon.googleTiles()[0] + "/" +
      this.latLon.googleTiles()[1] +
      ".png?access_token=pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A");

  }

  tileMiddle (bounds) {
    // return middle point of tile in mercator point x,y coordinates
    const offset = (bounds[1] - bounds[0])/2;
    return [bounds[0]+offset,bounds[2]+offset]
  }

  tileBounds(){
    // tile = [tx, ty] = tilecoordinates
    // "Returns bounds of the given tile in EPSG:900913 coordinates"
    const res = 2 * Math.PI*EARTH_RADIUS_IN_METERS/TILE_SIZE/(Math.pow(2,this.latLon.zoom));

    const minX = this.tileCoords[0]*TILE_SIZE*res-ORIGINSHIFT;
    const minY = this.tileCoords[1]*TILE_SIZE*res-ORIGINSHIFT;
    const maxX = (this.tileCoords[0]+1)*TILE_SIZE*res-ORIGINSHIFT;
    const maxY = (this.tileCoords[1]+1)*TILE_SIZE*res-ORIGINSHIFT;

    return [minX, maxX,  minY,  maxY];

  }

  destroy () {}
}

/*

// entityEl.setAttribute('position', {x:-1*(size/2), y:0, z:-1*(size/2)});


 // entityEl.setAttribute('src', "https://c.tile.openstreetmap.org/" + this.zoom + "/" + this.tileLong + "/" + this.tileLat + ".png");




    // texture.setAttribute('src', 'https://data.sebastiansettgast.com/42972.png' );
    // texture.setAttribute('src', "https://c.tile.openstreetmap.org/" + this.latLon.zoom + "/" + this.latLon.googleTiles()[0] + "/" + this.latLon.googleTiles()[1] + ".png");



    // entityEl.setAttribute('src', "https://c.tile.openstreetmap.org/17/70268/42972.png");
    // entityEl.setAttribute('material', '#' + this.tileLong + "/" + this.tileLat);
// https://api.tiles.mapbox.com/v4/setti.411b5377/3/1/1.png?access_token=pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A
//     entityEl.setAttribute('material', { src: '#' + this.latLon.coords2Tile()[0] + 'a' + this.latLon.coords2Tile()[1]  });


 */
