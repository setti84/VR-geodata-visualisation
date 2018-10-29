class DataTile extends Tile {
  // BaseMapTile are square flat polygons with with a rendered map view as a texture

  constructor(origin, coords) {
    super(origin, coords);

  }

  create() {
    //  create objects with three js
    this.loadData().then( (res, err) => {
      if(err) return;

      this.processData(res)

    });

  }

  processData (res) {

    // var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

    console.log(res);

    const data = osmtogeojson(res);


    console.log(data)

    data.features.forEach( e => {
      console.log(e )
    } );

    // res.elements.forEach( e => console.log(e))


    // console.log(this.scene)

    // var geometry = new THREE.BoxGeometry(3, 7, 19 );
    //
    // var cube = new THREE.Mesh( geometry, material );
    // this.scene.object3D.add(cube);

  }




  loadData() {

    return new Promise( (resolve, reject) => {

      const tilecoords = this.tileBounds();

      const tileborder = LatLng.unprojectWorldCoordinates(tilecoords[0], tilecoords[2]).concat(LatLng.unprojectWorldCoordinates(tilecoords[1], tilecoords[3]));

      const httpRequest = new XMLHttpRequest();
      const url =  'http://overpass-api.de/api/interpreter?data='; // 'https://data.sebastiansettgast.com/sprite.json';
      // const url = 'http://overpass-api.de/api/interpreter?data=[out%3Ajson][timeout%3A25]%3B%28node[%22highway%22%3D%22bus_stop%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Brelation[%22landuse%22%3D%22residential%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Bway[%22landuse%22%3D%22retail%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Brelation[%22landuse%22%3D%22retail%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Bway[%22landuse%22%3D%22commercial%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Brelation[%22landuse%22%3D%22commercial%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3Bnode[%22highway%22%3D%22bus_stop%22]%2852.528127948407935%2C12.976956367492676%2C52.54572154464616%2C13.01549434661865%29%3B%29%3Bout%20body%3B%3E%3Bout%20skel%20qt%3B%0A';

      const query = '[out:json];(' +
        'node(' + tileborder + ')["building"];'
        +'way(' + tileborder + ')["building"];'
        + 'relation(' + tileborder + ')["building"];'
        +');out body; >;out skel qt;';

      httpRequest.open('GET', 'data/data.json'); //  url + query
      httpRequest.send();

      if (!httpRequest) {
        reject("Cannot create an XMLHTTP instance");
      }

      httpRequest.onreadystatechange = () => {

        if (httpRequest.readyState === XMLHttpRequest.DONE) {
          if (httpRequest.status === 200) {
            // data has arrived
            const resp = httpRequest.responseText;
            const respJson = JSON.parse(resp);
            resolve(respJson);
          } else {
            // no data arrived
            // TODO: reload data? or destroy? Suggestions?
            reject(httpRequest.status);
          }
        }
      }
    });

  }

  destroy() {

  }

}

/*

three js geometries

https://stackoverflow.com/questions/50077508/three-js-indexed-buffergeometry-vs-instancedbuffergeometry

Three.js indexed BufferGeometry

 for many different geometries, better rthan standard geometry type


InstancedBufferGeometry

if many geometries share something like a lot of arrows in the example below
or many trees in a scene with the same shape


https://codepen.io/usefulthink/pen/YNrvpY?editors=0010







 */

/*

var pointSouthWest = [center.lat - 0.003 , center.lng - 0.0045];
		var pointNorthWest = [center.lat + 0.003 , center.lng - 0.0045];
		var pointNorthEast = [center.lat + 0.003 , center.lng + 0.0045];
		var pointSouthEast = [center.lat - 0.003 , center.lng + 0.0045];

		queryBox = [pointSouthWest, pointNorthEast ];

		var query = '(node["level"](' + queryBox + '); way["level"](' + queryBox
            + '); relation["level"](' + queryBox + '); >>->.rels;>; ); out body; >; out skel qt;'

            	var endpoint = "https://overpass-api.de/api/interpreter?data="
		queryOverpass = $.get(endpoint + query, working);



(
  node( 52.545737855911085, 13.354670405387878, 52.54665453925685,13.357154130935669);
  way(52.545737855911085, 13.354670405387878, 52.54665453925685,13.357154130935669);
  relation(52.545737855911085, 13.354670405387878, 52.54665453925685,13.357154130935669);
);
out body;  >;
out skel qt;



 */


