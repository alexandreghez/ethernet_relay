#!/usr/bin/node

//Quelques constantes
const RELAY_IP = "192.168.1.166";
const RELAY_LOGIN = "admin";
const RELAY_PWD = "12345678";

numRelai = process.argv[2].toLowerCase();
commande = process.argv[3].toLowerCase();

//Usage
// ./relayHTTP.js <numRelai> <on|off|info>
// ex : ./relayHTTP.js 2 on --> active le relai 2 et renvoie true
// ex : ./relayHTTP.js 2 off --> active le relai 2et renvoie false
//ex : ./relayHTTP.js 2 info -->  renvoie l'état du relai 2

//Pour On / Off, on envoi une variable post
//Pour info, on fait pareil mais l'envoi n'est pas traité, il n'y a que la sortie qui nous interesse

url =  "http://" +  RELAY_IP ;

const http = require('http');
const querystring = require('querystring');

// POST parameters
var postParams =[];
postParams["saida" + numRelai + commande] = commande;


// POST parameters as query string
var postData = querystring.stringify(postParams);

var options = {
	auth: RELAY_LOGIN + ":" + RELAY_PWD,
	port: "80",
	path: "/relay_en.cgi",
	method: "POST",
	headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
	    'Content-Length': postData.length
  }
}

//console.log(options);

// request object
var req = http.request(url,options, function (res) {
  var result = '';
  res.on('data', function (chunk) {
    result += chunk;
  });
  res.on('end', function () {

	//On va analyser la page  de retour
	//On ne s'interesse qu'a la partie qui commence avec le relai

	indexDebut =  result.indexOf("relay" + numRelai);

	//Pour la fin, on cherche le relai suivant ou "ALL" si on est sur le dernier relai
	if (numRelai == 8) chaineFin = "All"; else chaineFin = "relay" + (parseInt(numRelai) + 1);
	indexFin = result.indexOf(chaineFin);

	section = result.substring(indexDebut,indexFin);

//	console.log(" de " + indexDebut + " à " + indexFin);
	



//console.log("ICI");	

//   console.log(section);

	if (section.indexOf("lighton.jpg") > -1)
		console.log("true");
	else
		console.log("false");
	




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
req.write(postData);
req.end();

