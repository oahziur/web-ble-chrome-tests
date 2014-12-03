(function () {

  var HEART_RATE_SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb';
  var HEART_RATE_MEASUREMENT_UUID   = '00002a37-0000-1000-8000-00805f9b34fb';

  var model = document.querySelector('#model');
  var selectedDevice;
  var knownServices = new Set();
  var knownCharacteristics= new Set();
  var knownDescriptors = new Set();

  var abToStr = function(ab) {
    return String.fromCharCode.apply(null, new Uint8Array(ab));
  };

  var strToAb = function(str) {
    var ab = new ArrayBuffer(str.length);
    var abView = new Uint8Array(ab);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      abView[i] = str.charCodeAt(i);
    }
    return ab;
  };

  model.reset = function() {
    selectedDevice.disconnect();
    knownServices.clear();
    knownCharacteristics.clear();
    knownDescriptors.clear();
  };

  model.addListener = function() {
    // Add events listener for characteristic value changed
    navigator.bluetooth.addEventListener('characteristicvaluechanged', function(e) {
      var characteristic = e.characteristic;
      console.log('Characteristic value changed');
      console.log(characteristic);
      console.log('Value is ' + abToStr(characteristic.value));
    });
  };

  model.requestDevices = function() {
    navigator.bluetooth.requestDevice([{
      services: [HEART_RATE_SERVICE_UUID]
    }], {
      optionalServices: []
    }).then(function (device) {
      selectedDevice = device;
      console.log(device)
    }, function () {
      console.log('Failed to request device');
    });
  };

  model.connectSelectedDevice = function() {

    if (!selectedDevice) {
      console.log('No device selected');
      return;
    }

    selectedDevice.connect().then(function() {
      console.log('Successfully connect selected device');
    }, function() {
      console.log('Failed to connect selected device');
    });

  };

  model.disconnectSelectedDevice = function() {

    if (!selectedDevice) {
      console.log('No device selected');
      return;
    }

    selectedDevice.disconnect().then(function() {
      console.log('Successfully disconnect selected device');
    }, function() {
      console.log('Failed to disconnect selected device');
    });

  };

  model.getAllServices = function() {

    if (!selectedDevice) {
      console.log('No device selected');
      return;
    }

    selectedDevice.getAllServices().then(function(services) {
      services.forEach(function(service) {
        console.log(service);
        console.log(service.uuid);
        console.log(service.isPrimary);
        console.log(service.instanceId);
        knownServices.add(service);
      });
    }, function() {
      console.log('Failed to get all services');
    });

  };

  model.getAllIncludedServices = function() {

    if (knownServices.size === 0) {
      console.log('No known services');
      return;
    }

    knownServices.forEach(function(service) {
      service.getAllIncludedServices().then(function(includedServices) {
        includedServices.forEach(function(service) {
          console.log(service);
          console.log(service.uuid);
          console.log(service.isPrimary);
          console.log(service.instanceId);
          knownServices.add(service);
        });
      }, function() {
        console.log('Failed to get included services');
      });
    });
  };

  model.getAllCharacteristics = function() {

    if (knownServices.size === 0) {
      console.log('No known services');
      return;
    }

    knownServices.forEach(function(service) {
      service.getAllCharacteristics().then(function(characteristics) {
        characteristics.forEach(function(characteristic) {
          console.log(characteristic);
          console.log(characteristic.uuid);
          console.log(characteristic.properties);
          console.log(characteristic.instanceId);
          knownCharacteristics.add(characteristic);
        });
      }, function() {
        console.log('Failed to get all characteristics');
      });
    });
  };

  model.getAllDescriptors = function() {

    if (knownCharacteristics.size === 0) {
      console.log('No known characteristics');
      return;
    }

    knownCharacteristics.forEach(function(characteristic) {
      characteristic.getAllDescriptors().then(function(descriptors) {
        descriptors.forEach(function(descriptor) {
          console.log(descriptor);
          console.log(descriptor.uuid);
          console.log(descriptor.instanceId);
          knownDescriptors.add(descriptor);
        });
      }, function() {
        console.log('No known descriptors');
      });
    });
  };

  model.readAllCharacteristics = function() {

    if (knownCharacteristics.size === 0) {
      console.log('No known characteristics');
      return;
    }

    knownCharacteristics.forEach(function(characteristic) {
      if (characteristic.properties.read) {
        characteristic.readValue().then(function(ab) {
          console.log('Value read: ' + abToStr(ab));
        }, function() {
          console.log('Failed to read value');
        });
      }
    });
  };

  model.writeAllCharacteristics = function() {
    if (knownCharacteristics.size === 0) {
      console.log('No known characteristics');
      return;
    }

    knownCharacteristics.forEach(function(characteristic) {
      if (characteristic.properties.write) {
        characteristic.writeValue(strToAb('test')).then(function() {
          console.log('Write characteristic success');
        }, function() {
          console.log('Failed to write characteristic');
        });
      }
    });
  };

  model.startNotificationOnAllCharacteristics = function() {
    if (knownCharacteristics.size === 0) {
      console.log('No known characteristics');
      return;
    }

    knownCharacteristics.forEach(function(characteristic) {
      if (characteristic.properties.notify &&
          characteristic.uuid === HEART_RATE_MEASUREMENT_UUID) {
        characteristic.startNotifications().then(function() {
          console.log('Start notification success');
        }, function() {
          console.log('Start notification failed');
        });
      }
    });
  };

  model.stopNotificationOnAllCharacteristics = function() {
    if (knownCharacteristics.size === 0) {
      console.log('No known characteristics');
      return;
    }

    knownCharacteristics.forEach(function(characteristic) {
      if (characteristic.properties.notify &&
          characteristic.uuid === HEART_RATE_MEASUREMENT_UUID) {
        characteristic.stopNotifications().then(function() {
          console.log('Stop notification success');
        }, function() {
          console.log('Stop notification failed');
        });
      }
    });
  };

  model.readAllDescriptors = function() {
    if (knownDescriptors.size === 0) {
      console.log('No known descriptors');
      return;
    }

    knownDescriptors.forEach(function(descriptor) {
      descriptor.readValue().then(function(ab) {
        console.log('Value read: ' + abToStr(ab));
      }, function() {
        console.log('Failed to read descriptor');
      });
    });
  };

  model.writeAllDescriptors = function() {
    if (knownDescriptors.size === 0) {
      console.log('No known descriptors');
      return;
    }

    knownDescriptors.forEach(function(descriptor) {
      descriptor.writeValue(strToAb('test')).then(function() {
        console.log('Write descriptor success');
      }, function() {
        console.log('Failed to write descriptor');
      });
    });
  };

})();
