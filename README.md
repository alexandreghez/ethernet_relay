# ethernet_relay
Nodejs script file to control cheap 8 channel ethernet relay

Thi script use the embedded Web server to control the relay


## Init
Edit the file according to your configuraition (IP adress, etc...)

## Usage
./relayHTTP.js &lt;RelayNumber&gt; &lt;Action&gt;<br><br>
  
  with : <br>
    &lt;RelayNumber&gt; : Number of the relay beetween (1 and 8)<br>
    &lt;Action&gt; : Action to perform, could be : <br>
        on : Open the relay<br>
        off : Close the relay<br>
        info : Get status of the relay<br>
