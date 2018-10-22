class Tile {

  constructor (x, y, latLon) {

    this.latLon = latLon;
    this.tileCoords = [latLon.googleTiles()[0], latLon.googleTiles()[1]];
    this.size2 = Util.getTileSizeInMeters(latLon.lat, this.latLon.zoom);


    const bounds = this.bounds = this.tileBounds(this.tileCoords,this.latLon.zoom);
    this.plane = this.create(bounds);

    console.log("TileSize2: " + this.size2);
    console.log("Tile Bounds: " + this.bounds.toString())

  }

  create (bounds) {

    const texture = document.createElement('img');
    // <img id="advertisement" src="ad.png">  crossorigin="anonymous"


    texture.setAttribute('id', this.latLon.googleTiles()[0] + "a" + this.latLon.googleTiles()[1]);
    texture.setAttribute('crossorigin', "anonymous" );
    // texture.setAttribute('src', 'https://data.sebastiansettgast.com/42972.png' );
    // texture.setAttribute('src', "https://c.tile.openstreetmap.org/" + this.latLon.zoom + "/" + this.latLon.googleTiles()[0] + "/" + this.latLon.googleTiles()[1] + ".png");

    texture.setAttribute('src', "https://api.tiles.mapbox.com/v4/setti.411b5377/" + this.latLon.zoom + "/" + this.latLon.googleTiles()[0] + "/" + this.latLon.googleTiles()[1] + ".png?access_token=pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A");


    document.querySelector('a-assets').appendChild(texture);

    const size = Math.floor(bounds[3] - bounds[2]);
    let entityEl = document.createElement('a-entity');


    entityEl.setAttribute('geometry', {
      primitive: 'plane',
      height:size,
      width: size
    });

    // entityEl.setAttribute('src', "https://c.tile.openstreetmap.org/17/70268/42972.png");
    // entityEl.setAttribute('material', '#' + this.tileLong + "/" + this.tileLat);
// https://api.tiles.mapbox.com/v4/setti.411b5377/3/1/1.png?access_token=pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A
//     entityEl.setAttribute('material', { src: '#' + this.latLon.coords2Tile()[0] + 'a' + this.latLon.coords2Tile()[1]  });
    entityEl.setAttribute('material', { src: '#' + this.latLon.googleTiles()[0] + "a" + this.latLon.googleTiles()[1]});
    // entityEl.setAttribute('src', "https://c.tile.openstreetmap.org/" + this.zoom + "/" + this.tileLong + "/" + this.tileLat + ".png");

    entityEl.setAttribute('position', {x:-1*(size/2), y:0, z:-1*(size/2)});
    entityEl.setAttribute('rotation', {x:-90, y:0, z:0});


    document.querySelector('a-scene').appendChild(entityEl);

    return entityEl;

  }

  tileBounds(){
    // tile = [tx, ty] = tilecoordinates
    // "Returns bounds of the given tile in EPSG:900913 coordinates"
    const res = 2 * Math.PI*EARTH_RADIUS_IN_METERS/TILE_SIZE/(2**this.latLon.zoom);

    const minX = this.tileCoords[0]*TILE_SIZE*res-ORIGINSHIFT;
    const minY = this.tileCoords[1]*TILE_SIZE*res-ORIGINSHIFT;
    const maxX = (this.tileCoords[0]+1)*TILE_SIZE*res-ORIGINSHIFT;
    const maxY = (this.tileCoords[1]+1)*TILE_SIZE*res-ORIGINSHIFT;

    return [minX, maxX,  minY,  maxY];

  }

  destroy () {}
}
