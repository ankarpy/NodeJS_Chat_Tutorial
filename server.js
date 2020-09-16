
// Az alapvető NodeJS funkciókat betöltjük
var http = require('http'), // Http lekérések
    url = require('url'), // Url kezelés
    fs = require('fs'); // File system

// Az üzeneteknek és a klienseknek létrehozunk array-okat
var messages = [];
var clients = [];

// A fájl futtatásakor létrehozunk egy szervert ami figyeli a lekéréseket:
http.createServer(function (req, res) {

   // URL cím lekérése
   var url_parts = url.parse(req.url);


   if(url_parts.pathname == '/') {
      // Ha az URL a "localhost:8080"-ra mutat, akkor mutassuk a felhasználónak a Chat Ablakot.

      fs.readFile('./index.html', function(err, data) {
        res.end(data);
      });

   } else if(url_parts.pathname.substr(0, 5) == '/poll') {
      // Ha az URL a "localhost:8080/poll"-ra mutat, akkor töltsük le az üzeneteket.

      // A kliensekhez hozzáadjuk a lekérést
      clients.push(res);

      // Megszámoljuk, hány üzenetet töltött le eddig a kliens
      var count = url_parts.pathname.replace(/[^0-9]*/, '');

      if(messages.length > count) {
        // Ha van új üzenet, töltse le

        res.end(JSON.stringify( {
          count: messages.length,
          append: messages.slice(count).join("\n")+"\n"
        }));

      }
  } else if(url_parts.pathname.substr(0, 9) == '/message/') {

    // Ha üzenetet küldünk, az URL címből mentsük az üzenet tartalmát
    var msg = decodeURIComponent(url_parts.pathname).substr(9)

    // Hozzáadjuk a messages array-höz
    messages.push(msg);

    // És elküldjük a klienseknek
    while(clients.length > 0) {
      var client = clients.pop();
      client.end(JSON.stringify( {
        count: messages.length,
        append: msg+"\n"
      }));
    }
    res.end();
  }
}).listen(8080, 'localhost');
console.log('Server running.');
