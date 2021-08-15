# ethernet_relay
Nodejs script file to control cheap 8 channel ethernet relay

Thi script use the embedded Web server to control the relay


## Init
Edit the file according to your configuraition (IP adress, etc...)

## HTTP version

The HTTP version is a node script used to set / get information of the relay

### Usage
./relayHTTP.js &lt;RelayNumber&gt; &lt;Action&gt;<br><br>
  
  with : <br>
    &lt;RelayNumber&gt; : Number of the relay beetween (1 and 8)<br>
    &lt;Action&gt; : Action to perform, could be : <br>
        on : Open the relay<br>
        off : Close the relay<br>
        info : Get status of the relay<br>

##MQTT Version

This version synchronise the status of the relay to a MQTT server / Topic using the previous script.
You publish to MQTT and the relay will activate. 
Eg.
 publish "on" or "true" to open the relay
 publish "off" or "false" to close the relay
 publish "pulse" to open the relay for 1 second then close the relay


This program also retrieve the status of the relay and publish status to MQTT. The refresh is done every 10 seconds but can be edited or disabled (0 value).


Use as you want. This script are not supported, they are done for my personal use.


