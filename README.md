# ethernet_relay
Nodejs script file to control cheap 8 channel ethernet relay

Thi script use the embedded Web server to control the relay


## Init
Edit the file according to your configuraition (IP adress, etc...)

## Usage
./relayHTTP.js <RelayNumber> <Action>
  
  with : 
    <RelayNumber> : Number of the relay beetween (1 and 8)
    <Action> : Action to perform, could be : 
        on : Open the relay
        off : Close the relay
        info : Get status of the relay
