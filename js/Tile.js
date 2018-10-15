class Tile {

  constructor (x, y, zoom, latitude, longitude) {
    this.x = x;
    this.y = y;
    this.zoom = 17;
    this.latitude = latitude;
    this.longitude = longitude;
    this.tileLong = Util.long2tile(this.longitude,this.zoom);
    this.tileLat = Util.lat2tile(this.latitude,this.zoom);
    this.size = Util.getTileSizeInMeters(latitude, zoom);
    this.plane = this.create()

  }

  create () {

    const texture = document.createElement('a-asset-item');
    // <img id="advertisement" src="ad.png">

    THREE.ImageUtils.crossOrigin = '';

    texture.setAttribute('id', this.tileLong + "a" + this.tileLat);
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
    entityEl.setAttribute('material', { src: '#' + this.tileLong + 'a' + this.tileLat  });
    // entityEl.setAttribute('src', "https://c.tile.openstreetmap.org/" + this.zoom + "/" + this.tileLong + "/" + this.tileLat + ".png");


    entityEl.setAttribute('position', {x:this.x, y:0, z:this.y});
    entityEl.setAttribute('rotation', {x:-90, y:0, z:0});
  console.log(entityEl)
    document.querySelector('a-scene').appendChild(entityEl);

    return entityEl;

  }

  destroy () {}
}
