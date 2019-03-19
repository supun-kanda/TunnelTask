var SSHConnection=require('node-ssh-forward').SSHConnection;
 
const sshConnection = new SSHConnection({
  endHost: 'ubuntu@35.170.196.108',
  privateKey: '/home/supunk/Documents/KEYS/myKey.pem'
})
await sshConnection.forward({
  fromPort: 5000,
  toPort: 5000,
  toHost: 'localhost'
})