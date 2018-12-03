// class TextureManager {
//
//   constructor(){
//     this.loader = new THREE.TextureLoader();
//     this.textures = new Map();
//
//     this.loadInitTextures();
//
//   }
//
//  loadTexture(url) {
//
//     return new Promise((resolve, reject) => {
//
//       this.loader.load(url,
//
//         ( texture ) =>{
//           resolve(texture)
//         },
//
//         // onProgress callback currently not supported
//         undefined,
//
//         // onError callback
//         ( err ) => {
//           reject(err)
//         });
//     });
//
//   }
//
//   loadInitTextures(){
//     const textureNames = [
//       'buildingStone',
//       'buildingMetal'
//     ];
//   }
//
// }