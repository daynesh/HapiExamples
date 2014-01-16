var Hapi = require('hapi');
var routes = require('./routes');

var config = { };
var server = new Hapi.Server('localhost', 8080, config);
server.pack.require({ lout: { endpoint: '/docs'} }, function (err) {
	if (err) {
		console.log('Failed loading plugins');
	}
});

server.addRoutes(routes);

server.start();
console.log("Listening on port 8080...");