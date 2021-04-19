'use strict';

const dtWebServer = require('./dtwebserver');
const dtConsole = require('./dtconsole');


//Building the Console Terminal for VM
dtConsole.startDigitalTwin();
dtWebServer.start();


