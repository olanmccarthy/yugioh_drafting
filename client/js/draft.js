(function() {

  let player = null; //which player user is
  let isReady = false; //boolean to determine if player has made draft pick or not
  let currentPack = []; //list of cards in current pack
  let deck = []; //list of player's deck
  let canvas, context;
  let width, height, interval_id;
  const socket = io();

  document.addEventListener('DOMContentLoaded', init, false);

  function init() {
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    interval_id = window.setInterval(draw, 33);
    window.addEventListener('click', onClick, false);
  }

  function draw(){
    context.clearRect(0,0, width, height); //clean frame
    context.font = "25px Arial";
    if (player === null){
      //draw player options
      context.rect(10, 10, 100, 100);
      context.fillText('Player 1', 15,65);
      context.rect(130, 10, 100, 100);
      context.fillText('Player 2', 135,65);
      context.rect(250, 10, 100, 100);
      context.fillText('Player 3', 255,65);
      context.rect(370, 10, 100, 100);
      context.fillText('Player 4', 375,65);
    }
    else {
      context.rect(1000, 10, 200, 890);
    }
    context.stroke();
  }

  function onClick(event) {
    if (player === null) {
      if (event.layerX >= 10 && event.layerX <= 110 && event.layerY >= 10 && event.layerY <= 110){
        console.log('player 1 clicked');
        player = 1;
      }
      else if (event.layerX >= 130 && event.layerX <= 230 && event.layerY >= 10 && event.layerY <= 110){
        console.log('player 2 clicked');
        player = 2;
      }
      else if (event.layerX >= 250 && event.layerX <= 350 && event.layerY >= 10 && event.layerY <= 110){
        console.log('player 3 clicked');
        player = 3;
      }
      else if (event.layerX >= 370 && event.layerX <= 470 && event.layerY >= 10 && event.layerY <= 110){
        console.log('player 4  clicked');
        player = 4;
      }
    }
  }

})();