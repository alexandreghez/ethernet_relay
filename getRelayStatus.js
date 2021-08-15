#!/usr/bin/node

//Quelques constantes
const RELAY_IP = "192.168.1.166";
const RELAY_LOGIN = "admin";
const RELAY_PWD = "12345678";
const RELAY_COUNT = 8;
const http = require('http');

url =  "http://" +  RELAY_IP ;

var options = {
	auth: RELAY_LOGIN + ":" + RELAY_PWD,
	port: "80",
	path: "/relay_en.cgi",
	method: "GET"
}


// request object
var req = http.request(url,options, function (res) {
  var result = '';
  res.on('data', function (chunk) {
    result += chunk;
  });
  res.on('end', function () {

	//On va analyser la page  de retour
	//On ne s'interesse qu'a la partie qui commence avec le relai

//	console.log(result);

	var etatRelai = [];
	for (numRelai = 1;numRelai <= RELAY_COUNT ;numRelai++)
	{
		indexDebut =  result.indexOf("relay" + numRelai);
		//Pour la fin, on cherche le relai suivant ou "ALL" si on est sur le dernier relai
		if (numRelai == 8) chaineFin = "All"; else chaineFin = "relay" + (parseInt(numRelai) + 1);
		indexFin = result.indexOf(chaineFin);

		section = result.substring(indexDebut,indexFin);

		if (section.indexOf("lighton.jpg") > -1)
			etatRelai[numRelai-1] = true;
		else
			etatRelai[numRelai-1] = false;
	}

	//On renvoie l'état
	console.log(etatRelai.join());

  });

  res.on('error', function (err) {
    console.log(err);
  })
});
 
// req error
req.on('error', function (err) {
  console.log(err);
});
 
//send request witht the postData form
//req.write(postData);

req.end();

