var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("connect", function() {
  client.publish("mytopic", "Hello mqtt");
});
