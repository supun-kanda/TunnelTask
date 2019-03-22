var server = new require("ws").Server;
var s_local = new server({ port: 5000 });

s_local.on("connection", function (ws) {
    ws.on('message', function (message) {
        message = JSON.parse(message);
        console.log("Recieved from ", message.name);
        s_local.clients.forEach(function (element) {
            if (element != ws) element.send(JSON.stringify(message));
            else element.send(JSON.stringify({ "name": message.name, success: true }));
        });
    });
    ws.on('close', function () {
        console.log("I lost a client");
    })
});
console.log("Hello World");
