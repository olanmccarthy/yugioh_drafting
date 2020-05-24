var express = require('express');
var app = express();
var serv = require('http').Server(app);
var { generatePack } = require('./server');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html')
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(2004);
console.log('*** STARTING SERVER ***');

var playerCount = 1;
var SOCKET_LIST = {};
var PLAYER_LIST = {};

var Player = function(id){
  var self = {
    id: id,
    deck : [],
    isReady : false,
    packs : [
      generatePack(5),
      generatePack(5),
      generatePack(5),
      generatePack(5),
      generatePack(5)],
    currentPack : [],
    outgoingPack: [],
    playerNo: playerCount,
  };
  playerCount ++;
  return self;
};

var io = require('socket.io')(serv, {});

io.sockets.on('connection', function(socket){
  console.log('socket connection');
  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;
  var player = Player(socket.id);
  player.currentPack = player.packs.pop();
  PLAYER_LIST[socket.id] = player;

  socket.on('disconnect', function(){
    delete SOCKET_LIST[socket.id];
    delete PLAYER_LIST[socket.id];
    playerCount --;
    console.log('socket disconnection')
  });

  socket.on('cardChosen', function(data){
    console.log('player', player.id, ' choose ', data.cardChosen);
    if (!player.isReady){
      player.deck.push(player.currentPack[data.cardChosen]);
      player.currentPack.splice(data.cardChosen, 1);
      player.outgoingPack = player.currentPack;
      player.currentPack = [];
      player.isReady = true;
    }
  })
});

setInterval(function(){
  var playerReadyCount = 0;
  for (var i in PLAYER_LIST){ //check all players are ready
    var player = PLAYER_LIST[i];
    //console.log('checking player:', player);
    if (player.isReady){
      playerReadyCount ++;
    }
  }
  if (playerReadyCount === 4){ //everyone is ready
    //swap currentPacks into outgoingPacks
    var outgoingPacks = [];
    var count = 0;
    for (var l in PLAYER_LIST){
      outgoingPacks.push(PLAYER_LIST[l].outgoingPack);
      PLAYER_LIST[l].outgoingPack = [];
    }
    outgoingPacks.push(outgoingPacks.shift());
    for (var m in PLAYER_LIST){
      PLAYER_LIST[m].currentPack = outgoingPacks[count];
      PLAYER_LIST[m].isReady = false;
      count ++;
    }
    for (var n in PLAYER_LIST){
      if (PLAYER_LIST[n].currentPack.length === 0){ //players still without packs after swap
        console.log('players still without packs after swap');
        for (var k in PLAYER_LIST){
          PLAYER_LIST[k].currentPack = PLAYER_LIST[k].packs.pop();
        }
        break;
      }
    }
  }
  for (var j in SOCKET_LIST){ //sends updated data
    var socket = SOCKET_LIST[j];
    socket.emit('updateData', PLAYER_LIST[j]);
  }
},1000/25);
