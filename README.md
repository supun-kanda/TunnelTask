# TunnelTask
## Manual Way
This is an application of reverse tunnel to log in a machine in a remote network using a middleman remote server
![alt text](https://toic.org/media/filer_public/2e/0d/2e0d1abf-c331-4625-ba0b-efed1c800254/reverese-ssh2.png)

*src:https://toic.org/blog/2009/reverse-ssh-port-forwarding/*

Basically you cannot access a pc which is plugged in for a remote network connection because you do not know their public IP addresses to connect. But instead of connecting directly, you can use an intermediate server so that both of the machines can secure tunnel into the server and forward traffic accordingly.

When using manually the remote machine you wanna logged in forward its traffic from specific port to server through remote port forwarding. This is done is ssh using following command

```
ssh -fN -R 8000:localhost:22 -i privateRSAKeyPath userName@publicIP
```
- 22 : the port from which the traffic you are intend to forward.(ssh traffic in here)
- 8000 : the port of server which you wishes to pass the traffic
- -fN : used to stop bringing up the terminal and to background traffic pass  

So by capture that traffic to our local machine, we can make a way to log into that remote machine. So from our end we pass the servers traffic on a specific port to us. We use local port forwarding. In ssh it like this

```
ssh -fN -L 8000:localhost:8000 -i privateRSAKeyPath userName@publicIP
```
- LHS 8000 : the port you pass the servers traffic
- RHS 8000 : The port which you listens in server for traffic

This is the process if we done this manually.

## Automatic Way
So the previous task can be automated using a separated websocket connection through the server for both machines.
![alt text](https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a79a64a389ab1c9f/2017/05/03/WebSocketArch.png)

*src:https://d2908q01vomqb2.cloudfront.net/887309d048beef83ad3eabf2a79a64a389ab1c9f/2017/05/03/WebSocketArch.png*

In my case the websocket server is running on the actual server which used as the intermediate before. To avoid port traffic conflicts ws runs in 5000 and traffic passing happens in 8000. This websocket server is customized to send the messages to all the clients except the sender. The sender gets success msg by the way. A web socket client listens on the port 5000. The Client is customized to send anything to others.

## Execute code

- The Server/server.js code should run on the remote server (WebSocket Server)
- Client/app.js code should be running on both clients

### Server
install the required libraries using following command
```
npm i ws
```
Set up the server using following command
```
node server.js
```
### Client

install the required libraries using following command
```
npm i ws readline child_process
```
Set the client to listen and configure using following command
```
node app.js
```

When you execute above command this is what happening
- set the local port forwarding with server on port 5000 to listen on websocket server.
- set up the websocket client on port 5000
- set the command line to take input to send to other side through WebSocket server

Heres how the input sending works (You have to execute app.js on both edges to communicate through WebSocket path)
- first insert as string either you are **sender** or **reciever** accordingly on 2 separate edges.(sender wishes to log in to reciever)
- you have to use exactly **sender**, **reciever** strings
- then you can send messages between sender and reciever like chatting
- when sender types **logme**, the reciever will execute the previously explained remote port forwarding command and the sender will execute the local port forwarding command. So that's it. The traffic is automatically passing on port 8000

To log in to the remote machine now take a terminal and insert this command. (you need to know user_name of your remote machine)
```
ssh 8000 userName@localhost
```
and simply you will be directed to insert the password to your remote machine and **BOOM**

### Configure

In Client/app.js refer following line numbers
- 11: public ip of your remote server. Please change the username from **ubuntu** @16,17,18
- 12: port which remote machine passes and your machine takes traffic
- 13: web socket client working port. Please make sure to change it in Server/server.js from port 5000 as well.
- 14: RSA private key location to log in without password. This way is mandotory because automatic commands messes when using key board inputs.
## Dependencies
- OpenSSH SSH client (remote login program): OpenSSH_7.6p1 Ubuntu-4ubuntu0.3, OpenSSL 1.0.2n  7 Dec 2017 ( basically installed)
- node: v8.10.0
- npm: 6.8.0

## Branch Tree Graph

![picture](https://i.ibb.co/xqdgvvs/Screenshot-from-2019-03-20-00-00-31.png)
