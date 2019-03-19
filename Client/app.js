var name,socket;
var WebSocket = require('ws'),
readline = require('readline');
exec = require('child_process').exec,
rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
}),

pubIP = '3.83.36.159',
L = '8000',
S = '5000',
keyPath = '/home/supunk/Documents/KEYS/myKey.pem',

remoteCommand = 'ssh -o \"StrictHostKeyChecking no\" -fN -R '+L+':localhost:22 ubuntu@' + pubIP + ' -i ' + keyPath,
localCommand = 'ssh -o \"StrictHostKeyChecking no\" -fN -L '+S+':localhost:'+S+' ubuntu@' + pubIP + ' -i ' + keyPath,
getCommand = 'ssh -o \"StrictHostKeyChecking no\" -fN -L '+L+':localhost:'+L+' ubuntu@' + pubIP + ' -i ' + keyPath,

reciever = function (response) { //this response parameter is an event
    data = JSON.parse(response.data);
    if(data.name == name && data.success == true){
        console.log('(Sent Successful)');
    }
    else if(name == 'reciever' && data.type=='command' && data.name=='sender'){
        console.log(remoteCommand);
        exec(remoteCommand,
            function (error, stdout, stderr) {
                console.log('RC:Executing')
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            }
        );
    }else if(data.type == 'message'){
        console.log(data.name+": "+data.data);
    }else{console.log('Didnot Capture the msg',data)}
},

sender = function (request) {
    //console.log('Request %s',request)
    if(request == 'quit'){
        rl.close();
        socket.close();
    }else if(request == 'sender' || request == 'reciever'){
        name = request;
        console.log('Name Aquired');
    }
    else if(request == 'logme'){
        console.log(getCommand);
        socket.send(JSON.stringify( {type:"command", data:"test", "name":name} ));
        exec(getCommand,
            function (error, stdout, stderr) {
                console.log('GC:Executing');
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            }
        );
        console.log('Sending');
    }
    else{
        socket.send(JSON.stringify( {type:"message", data:request, "name":name} ));
    }
};

console.log(localCommand);
exec(localCommand,
    function (error, stdout, stderr) {
        console.log('WS:Executing');
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    }
);
socket = new WebSocket("ws://localhost:"+S);
socket.onopen = function(event){
    console.log("Socket Success");
};

socket.onmessage = reciever;

rl.on('line', sender);
