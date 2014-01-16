var Hapi = require('hapi');

var quotes = [
  {
    author: 'Audrey Hepburn'
  , text: 'Nothing is impossible, the word itself says \'I\'m possible\'!'
  }
, {
    author: 'Walt Disney'
  , text: 'You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you'
  }
, {
    author: 'Unknown'
  , text: 'Even the greatest was once a beginner. Don\'t be afraid to take that first step.'
  }
, {
    author: 'Neale Donald Walsch'
  , text: 'You are afraid to die, and you\'re afraid to live. What a way to exist.'
  }
];

var server = Hapi.createServer('0.0.0.0', parseInt(process.env.PORT, 10) || 3000);
server.pack.require({ lout: { endpoint: '/docs'} }, function (err) {
  if (err) {
    console.log('Failed loading plugins');
  }
});

server.route({
  method: 'GET'
, path: '/quotes'
, handler: function(req) {
    req.reply(quotes);
  }
});

server.route({
  method: 'GET'
, path: '/random'
, handler: function(req) {
    var id = Math.floor(Math.random() * quotes.length);
    req.reply(quotes[id]);
  }
});

server.route({
  method: 'GET'
, path: '/quote/{id?}'
, handler: function(req) {
    if (req.params.id) {
      if (quotes.length <= req.params.id) {
        return req.reply('No quote found.').code(404);
      }
      return req.reply(quotes[req.params.id]);
    }
    req.reply(quotes);
  }
});

server.route({
  method: 'POST'
, path: '/quote'
, config: {
    handler: function(req) {
      var newQuote = {
        author: req.payload.author
      , text: req.payload.text
      };
      quotes.push(newQuote);
      req.reply(newQuote);
    }
  , validate: {
      payload: {
        author: Hapi.types.String().required()
      , text: Hapi.types.String().required()
      }
    }
  }
});

server.route({
	method: 'DELETE'
,	path: '/quote/{id}'
,	handler: function(req) {
		if (quotes.length <= req.params.id) {
			return req.reply('No quote found.').code(404);
		}
		quotes.splice(req.params.id, 1);
		req.reply(true);
	}
});

server.route({
	method: 'GET'
,	path:'/'
,	handler: function(req) {
		req.reply('i am a beautiful butterfly');
	}
});

server.start();
console.log("Listening on port 3000...");
