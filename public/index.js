// Initiate the connection to the server
//https://github.com/SocketCluster/socketcluster-client
var socket = socketCluster.connect({
    hostname: 'localhost',
    port: 8000,
    path: '/socketcluster/',
    autoReconnectOptions: {
        initialDelay: 1000, //milliseconds
        randomness: 1000, //milliseconds
        multiplier: 1.5, //decimal
        maxDelay: 2000 //milliseconds
    },
});

socket.on('error', function (err) {
  console.error(err);
});

socket.on('disconnect', function () {
    $('#messages').html('');
});

socket.on('connect', function () {
  console.log('Socket is connected');
  socket.emit('queryHistoryData', {});
});

socket.on('random', function (data) {
  console.log('Received "random" event with data: ' + data.number);
});

socket.on('historyMsg', function (msgs) {
    // console.log(msgs);
    console.log('Received "historyMsg" event with data: ' + msgs);
    if(msgs && msgs.length){
        msgs = msgs.reverse();
        for(let i in msgs){
            $('#messages').append('<div class="m-content">' + JSON.parse(msgs[i]).sender + ': &nbsp;&nbsp;&nbsp;' + JSON.parse(msgs[i]).content + '</div><div class="createdAt">' + JSON.parse(msgs[i]).createdAt + '</div>')
        }
        keepScrollBottom('#messages');
    }
});
socket.on('newMsg', function (msg) {
    // console.log('Received "newMsg" event with data: ' + msg);
    // $('#messages').append('<div class="m-content">' + msg.sender + ': &nbsp;&nbsp;&nbsp;' + msg.content + '</div><div class="createdAt">' + msg.createdAt + '</div>')
    // keepScrollBottom('#messages');
});



$(document).ready(function(){
    const name = utils.names[utils.randomInt(0, utils.names.length - 1)];
    console.log(name);
    $('#username').text(name);
    handleSubscript('room1');

    $('#snedMessageBtn').click(function(){
        let newMessage = $('#newMessage').val();
        if(!$.trim(newMessage)){
            return $('#newMessage').focus();
        }
        socket.emit('newMsg', {
            sender: $('#username').text(),
            content: newMessage
        });
        $('#newMessage').val('').focus();
    });
});

function handleSubscript(name){
    var privateChannel = socket.subscribe(name);

    privateChannel.on('subscribeFail', function (err) {
        console.error('Failed to subscribe to the sample channel due to error: ' + err);
    });

    privateChannel.watch(function (msg) {
        console.log('privateChannel channel message:', JSON.stringify(msg));
        $('#messages').append('<div class="m-content">' + msg.sender + ': &nbsp;&nbsp;&nbsp;' + msg.content + '</div><div class="createdAt">' + msg.createdAt + '</div>')
        keepScrollBottom('#messages');
    });
}


function keepScrollBottom(ele){
    var messageBody = document.querySelector(ele);
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
}