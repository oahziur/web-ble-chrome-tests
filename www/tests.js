(function () {

  var HEART_RATE_SENSOR_UUID = '0000180d-0000-1000-8000-00805f9b34fb';

  var model = document.querySelector('#model');

  model.requestDevices = function() {
    navigator.bluetooth.requestDevice([{
      services: [HEART_RATE_SENSOR_UUID]
    }], {
      optionalServices: []
    }).then(function (device) {
      console.log(device)
    }, function () {
      console.error('Failed to request device');
    });
  };

})();
