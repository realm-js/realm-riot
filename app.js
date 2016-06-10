var realm = require('realm-js');
var server = require('realm-server');
var realmMongo = require("realm-mongo");

require("./build/app/backend.js");
require("./build/app/universal.js");

realm.start('app.Server');
