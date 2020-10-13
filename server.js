
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

   // Ha az URL a "localhost:8080"-ra mutat, akkor töltsük be a Chat Ablakot.
   if(url_parts.pathname == '/') {

      // index.html beolvasása, és válaszként visszaadása
      fs.readFile('./index.html', function(err, data) {
        res.end(data);
      });

   } else if(url_parts.pathname.substr(0, 9) == '/message/') {
    // Ha az URL a "localhost:8080/message/"-ra mutat, akkor mentsük az URL-ben található üzenetet

    var msg = decodeURIComponent(url_parts.pathname).substr(9)

    // Hozzáadjuk a messages array-hez
    messages.push(msg);


    // Elküldjük a klienseknek az új üzenetet és az össz üzenet számot JSON objectként.
    for(var i = 0; i < clients.length; i++) {
      var client = clients[i];
      client.end(JSON.stringify( {
        count: messages.length,
        append: msg+"\n"
      }));
    }
    res.end();
  } else if(url_parts.pathname.substr(0, 6) == '/poll/') {
     // Ha az URL a "localhost:8080/poll/"-ra mutat, akkor töltsük le az új üzeneteket

     // A kliensekhez hozzáadjuk a lekérést
     clients.push(res);

     // Kinyerjük az URL-ből, hány üzenetet töltött le eddig a kliens
     var count = url_parts.pathname.substr(6)

     // Ha több üzenet van a szerveren elmentve, mint amennyit
     // a felhasználó letöltött, válaszként visszaküldjük az új üzeneteket
     if(messages.length > count) {

       // A slice paranccsal levágjuk a régi üzeneteket
       var new_messages = messages.slice(count).join("\n")+"\n";

       // JSON object-ként adjuk vissza az új üzeneteket.
       res.end(JSON.stringify( {
         count: messages.length,
         append: new_messages
       }));

     }
 }
}).listen(8080, 'localhost');
console.log('Server running.');
