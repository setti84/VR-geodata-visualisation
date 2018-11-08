class Events {

  constructor () {
    this.listeners = {};
  }

  on (type, fn) {
    (this.listeners[type] || (this.listeners[type] = [])).push(fn);
  }

  off (type, fn) {
    if (this.listeners[type] === undefined) {
      return;
    }
    this.listeners[type] = this.listeners[type].filter( item => {
      return item[0] !== fn;
    });
  }

  emit (type, payload) {
    if (this.listeners[type] === undefined) {
      return;
    }
    setTimeout( () => {
      const typeListeners = this.listeners[type];
      for (let i = 0, len = typeListeners.length; i < len; i++) {
        typeListeners[i](payload);
      }
    }, 0);

  }

  destroy () {
    this.listeners = {};
  }

}

/*
Example Usage

var App = new Events();

// tell javascript what to do when event POSITION_CHANGE  is fired
App.on('POSITION_CHANGE', position => {
   map.setPosition(position);
   buildingLayer = map.addGeoJSONTiles('https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json', { fixedZoom: 15 });
});

// Fire event POSITION_CHANGE
App.emit('POSITION_CHANGE', { latitude: params.lat, longitude: params.lon });

 */


// var Events = (function() {
//
//   function constructor() {
//     this.listeners = {};
//   }
//
//   var prototype = constructor.prototype;
//
//   prototype.on = function(type, fn) {
//     (this.listeners[type] || (this.listeners[type] = [])).push(fn);
//   };
//
//   prototype.off = function(type, fn) {
//     if (this.listeners[type] === undefined) {
//       return;
//     }
//
//     this.listeners[type] = this.listeners[type].filter(function(item) {
//       return item[0] !== fn;
//     });
//   };
//
//   prototype.emit = function(type, payload) {
//     if (this.listeners[type] === undefined) {
//       return;
//     }
//     setTimeout(function() {
//       var typeListeners = this.listeners[type];
//       for (var i = 0, len = typeListeners.length; i < len; i++) {
//         typeListeners[i](payload);
//       }
//     }.bind(this), 0);
//   };
//
//   prototype.destroy = function() {
//     this.listeners = {};
//   };
//
//   return constructor;
//
// }());