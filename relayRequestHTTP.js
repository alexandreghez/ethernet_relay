module.exports  =  {

/*
//Quelques constantes
var RELAY_IP = "192.168.1.166";
var RELAY_LOGIN = "admin";
var RELAY_PWD = "12345678";
*/


setRelayRequest:function(numRelai, commande)
{
	//Quelques constantes
	var RELAY_IP = "192.168.1.166";
	var RELAY_LOGIN = "admin";
	var RELAY_PWD = "12345678";


	if (commande=="pulse")
	 commande = "pluse";
	if (commande  == "true")
	 commande = "on";
	if (commande == "false")
	 commande = "off"; 

	url =  "http://" +  RELAY_IP ;

	const http = require('http');
	const querystring = require('querystring');

	// POST parameters
	var postParams =[];
	if (numRelai > 0) 
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

	// request object
	var req = http.request(url,options,  function (res) {

 	var result = '';
	res.on('data', function (chunk) {
    		result += chunk;
 	 });
  	res.on('end', function () {

	//On va analyser la page  de retour
	//On ne s'interesse qu'a la partie qui commence avec le relai


//	console.log(result);
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


 

//	console.log('INTERIEUR HTTP');
	//send request witht the postData form
	req.write(postData);
	req.end();

}
}
