var express = require('express');
var app = express();
var fs = require("fs");
var serv = require('http').Server(app);
var { generatePack } = require('./server');
var masterSetData = fs.readFileSync('./sets/index.json');

var masterSet = JSON.parse(masterSetData);

//port number to server is listening to
var port = 2021;
//number of players drafting
var players = parseInt(process.argv[3]);
//name of set being drafted
var setName = process.argv[2];
var pathName = "./sets/" + setName + ".json"

var currentSet = masterSet.sets[setName];

app.get('/', function(req, res) {
  if (setName === 'BP2') {
    res.sendFile(__dirname + '/client/bp2.html')
  } else {
    res.sendFile(__dirname + '/client/index.html')
  }
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(port);
console.log('*** STARTING SERVER @ leela.netsoc.co:' + port + ' ***');

var playerCount = 1;
var SOCKET_LIST = {};
var PLAYER_LIST = {};
var disconnected_id = null;
let passRight = true;

var Player = function(id){
  var self = {
    id: id,
    deck : [],
    isReady : false,
    packs : generatePacks(currentSet),
    currentPack : [],
    outgoingPack: [],
    playerNo: playerCount,
  };
  playerCount ++;
  return self;
};

var io = require('socket.io')(serv, {});

io.sockets.on('connection', function(socket){
  var player;
  socket.emit('validateUser');

  socket.on('userValidation', ({ sessionId }) => {
    socket.id = sessionId;
    SOCKET_LIST[sessionId] = socket;
      if (PLAYER_LIST[sessionId]) {
        console.log('existing user re-connects');
          //player exists in session
          player = PLAYER_LIST[sessionId];
      } else {
          if (playerCount <= players) {
            console.log('new player has joined')
              player = Player(sessionId);
              player.currentPack = player.packs.pop();
              PLAYER_LIST[sessionId] = player;
          } else {
            console.log('new player could not join because player limit was reached')
          }
      }
    //draw your current pack
    if (player) socket.emit('drawPack', player.currentPack);
  });

  socket.on('disconnect', function(){
    disconnected_id = socket.id
    console.log('socket disconnection ', socket.id);
  });

  socket.on('cardChosen', function({ cardChosen, sessionId }){
    //console.log('player', player.id, ' choose ', data.cardChosen);
    if (!player) {
      player = PLAYER_LIST[sessionId];
    }
    if (!player.isReady){
      player.deck.push(player.currentPack[cardChosen]);
      player.currentPack.splice(cardChosen, 1);
      player.outgoingPack = player.currentPack;
      player.currentPack = [];
      player.isReady = true;
    }
  })

  socket.on('exportDeck', function({ sessionId }){
    var ids = [];
    let main = "#created by ...\n#main\n";
    let extra = "#extra\n!side\n";

    if (!player) {
      player = PLAYER_LIST[sessionId];
    }

    player.deck.forEach(card => {
      try {
        if (card.isExtra) {
          extra += card.id + "\n";
        } else {
          main += card.id + "\n";
        }
      } catch (e) {
      }
    });
    socket.emit("downloadDeck", main + extra);
  })
});

function generatePacks(currentSet){
  var packs = [];
  if (currentSet.setName === 'BP2') {
    packs.push(generatePack('BP2'));
    packs.push(generatePack('BP2-Reinforcements'));
    packs.push(generatePack('BP2'));
  } else {
    for(let i = 0; i < currentSet.amountOfPacks; i++){
      packs.push(generatePack(currentSet.setName));
    }
  }
  return packs;
}

setInterval(function(){
  var playerReadyCount = 0;
  for (var i in PLAYER_LIST){ //check all players are ready
    var player = PLAYER_LIST[i];
    //console.log('checking player:', player);
    if (player.isReady){
      playerReadyCount ++;
    }
  }

  if (playerReadyCount === players){ //everyone is ready
    //swap currentPacks into outgoingPacks
    var outgoingPacks = [];
    var count = 0;
    for (var l in PLAYER_LIST){
      outgoingPacks.push(PLAYER_LIST[l].outgoingPack);
      PLAYER_LIST[l].outgoingPack = [];
    }

    //change order of outgoingPacks so player recieves new pack
    if (passRight) {
      outgoingPacks.push(outgoingPacks.shift());
    } else {
      outgoingPacks = [outgoingPacks.pop(), ...outgoingPacks];
    }

    for (var m in PLAYER_LIST){
      PLAYER_LIST[m].currentPack = outgoingPacks[count];
      PLAYER_LIST[m].isReady = false;
      count ++;
    }

    for (var n in PLAYER_LIST){
      //check if its time to open a new pack
      //why this is in a for loop that breaks at index 0 if triggered I'm not sure
      if (PLAYER_LIST[n].currentPack.length === 0){ //players still without packs after swap

        //every one opens a new pack
        for (var k in PLAYER_LIST){
          PLAYER_LIST[k].currentPack = PLAYER_LIST[k].packs.pop();
        }
        //swap direction packs are being swapped
        passRight = !passRight;
        break;
      }
    }
    for (var j in SOCKET_LIST){ //sends updated data
      var socket = SOCKET_LIST[j];
      socket.emit('drawPack', PLAYER_LIST[j].currentPack);
    }
  }
  for (var j in SOCKET_LIST){ //sends updated data
    var socket = SOCKET_LIST[j];
    socket.emit('updateData', PLAYER_LIST[j]);
  }
},1000/25);
