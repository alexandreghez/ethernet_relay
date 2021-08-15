#!/usr/bin/node

//Quelques constantes
const RELAY_COUNT = 8;
const RELAY_REFRESH = 10;

//Infos MQTT
const MQTT_SERVER = 'mqtt://127.0.0.1';
const MQTT_QOS = 1;
const MQTT_CLIENT = 'relay_client';
const MQTT_TOPIC = 'relay';

const MQTT_PUBLISH_OPTIONS = {retain:true,qos:MQTT_QOS};

var mqtt    = require('mqtt');
var client  = mqtt.connect( MQTT_SERVER,{clientId:MQTT_CLIENT});
console.log("connected flag  " + client.connected);

var relayHTTP = require('./relayRequestHTTP');


//handle incoming messages
client.on('message',function(topic, message, packet){
	console.log("receive : '" + topic + "' -> " +  message.toString());
	numRelai = topic.split("/")[1];
	message = message.toString().toLowerCase();
//	console.log(numRelai);

	//On envoie la commande au relai sans s'interesser au retour
	if (message != "")
	{
		console.log("Appel HTTP : setRelayRequest(" + numRelai + "," + message + ")");
 		relayHTTP.setRelayRequest(numRelai,message);
	}

	//On mets à jour notre serveur MQTT immédiatement en fonction de l'état
	switch(message) {
	case "on" :
	case "true":
		publish(MQTT_TOPIC + "/" + numRelai,"true",MQTT_PUBLISH_OPTIONS);
		break;
	case "off":
	case "false":
		publish(MQTT_TOPIC + "/" + numRelai,"false",MQTT_PUBLISH_OPTIONS);
		break;
	case "pulse" : 
		publish(MQTT_TOPIC + "/" + numRelai,"true",MQTT_PUBLISH_OPTIONS);
		setTimeout(function(){publish(MQTT_TOPIC + "/" + numRelai,"false",MQTT_PUBLISH_OPTIONS)},1000);
		break;
	}
});


client.on("connect",function(){	
console.log("connected  "+ client.connected);
})

client.on("reconnect",function(){ 
console.log("Reconnection");
})


//handle errors
client.on("error",function(error){
console.log("Can't connect" + error);
process.exit(1)});

//publish
function publish(topic,msg,options){
console.log("publish MQTT : '"+ msg  +"'-> '" + topic + "'");

if (client.connected == true){
	
client.publish(topic,msg,options);

}
}

////////////////////////
/// GESTION DE LA SYNCHRO CARTE VERS SERVEUR MQTT
///////////////////////

//toutes les X secondes, on interroge l'état des relais et on met à jour le serveur MQTT
if (RELAY_REFRESH > 0)
	var timer_id=setInterval(function(){getRelayStatus();},RELAY_REFRESH *1000);

function getRelayStatus()
{
  console.log("On récupére l'état des relais");
	//Appel Externe (TODO faire un appel direct)
	relaiProcess = require('child_process').spawnSync('./getRelayStatus.js' );
	etatRelai= relaiProcess.stdout.toString().replace("\n","");
	etatRelai = etatRelai.split(",");

	//On n'a plus qu'a mettre à jour nos données MQTT
  	for (var i=1;i<=RELAY_COUNT;i++)
  	{
		publish(MQTT_TOPIC + "/" + i,etatRelai[i-1],MQTT_PUBLISH_OPTIONS);
  	}
}


//////////////////////////////////
//Gestion de l'abonnement
/////////////////////////////////
var topic=[];
for (i=1;i<= RELAY_COUNT;i++)
	topic[i-1]= "relay/" + i + "/set";
///On a désormais un tableau avec la liste des topics :  ["relay/1/set","relay/2/set", ...]

console.log("subscribing to topics", topic);
client.subscribe(topic,{qos:MQTT_QOS}); 

