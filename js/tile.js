class Tile {

  constructor (x, y, zoom, latLon) {
    this.x = x;
    this.y = y;
    this.zoom = ZOOMLEVEL;
    this.latLon = latLon;
    this.size = Util.getTileSizeInMeters(latLon.lat, zoom);
    this.plane = this.create()

  }

  create () {

    const texture = document.createElement('a-asset-item');
    // <img id="advertisement" src="ad.png">

    THREE.ImageUtils.crossOrigin = '';

    texture.setAttribute('id', this.latLon.coords2Tile()[0] + "a" + this.latLon.coords2Tile()[1]);
    texture.setAttribute('src', 'https://data.sebastiansettgast.com/42972.png');
    // texture.setAttribute('src', "https://c.tile.openstreetmap.org/" + this.zoom + "/" + this.tileLong + "/" + this.tileLat + ".png");
    // texture.setAttribute('src', "https://api.tiles.mapbox.com/v4/setti.411b5377/" + this.zoom + "/" + this.tileLong + "/" + this.tileLat + ".png?access_token=pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A");

    console.log(texture)

    document.querySelector('a-assets').appendChild(texture);

    let entityEl = document.createElement('a-entity');

    entityEl.setAttribute('geometry', {
      primitive: 'plane',
      height:this.size,
      width: this.size
    });

    // entityEl.setAttribute('src', "https://c.tile.openstreetmap.org/17/70268/42972.png");
    // entityEl.setAttribute('material', '#' + this.tileLong + "/" + this.tileLat);
// https://api.tiles.mapbox.com/v4/setti.411b5377/3/1/1.png?access_token=pk.eyJ1Ijoic2V0dGkiLCJhIjoiNmUyMDYzMjlmODNmY2VhOGJhZjc4MTIzNDJiMjkyOGMifQ.hdPIqIoI_VJ_RQW1MXJ18A
    entityEl.setAttribute('material', { src: '#' + this.latLon.coords2Tile()[0] + 'a' + this.latLon.coords2Tile()[1]  });
    // entityEl.setAttribute('src', "https://c.tile.openstreetmap.org/" + this.zoom + "/" + this.tileLong + "/" + this.tileLat + ".png");


    entityEl.setAttribute('position', {x:this.x, y:0, z:this.y});
    entityEl.setAttribute('rotation', {x:-90, y:0, z:0});
  console.log(entityEl)
    document.querySelector('a-scene').appendChild(entityEl);

    return entityEl;

  }

  tileBounds () {
    // "Returns bounds of the given tile in EPSG:900913 coordinates"

    return []

  }

  destroy () {}
}
/*


def TileBounds(self, tx, ty, zoom):
        "Returns bounds of the given tile in EPSG:900913 coordinates"

        minx, miny = self.PixelsToMeters( tx*self.tileSize, ty*self.tileSize, zoom )
        maxx, maxy = self.PixelsToMeters( (tx+1)*self.tileSize, (ty+1)*self.tileSize, zoom )
        return ( minx, miny, maxx, maxy )




 */