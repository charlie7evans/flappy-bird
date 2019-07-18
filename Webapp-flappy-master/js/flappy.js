// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

var score = 0;
var labelScore;
var player;
var pipes = [];
var balloons = [];

var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 200;
var jumpPower = 200;
var y;
var gapMargin = 50;
var gapSize = 75;
var blockHeight = 50;
var pipeEndExtraWidth = 10;
var pipeEndHeight = 25;

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {

  game.load.image("playerImg", "../assets/flappy-cropped.png");
  game.load.audio("score", "../assets/point.ogg");
  game.load.image("pipeBlock", "../assets/pipe2-body.png");
  game.load.image("background","../assets/picture.jpg");
  game.load.image("pipeEnd","../assets/pipe-end.png");
  game.load.image("balloons","../assets/balloons.png");
}


/*
 * Initialises the game. This function is only called once.
 */
function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  backgroundImage = game.add.sprite(0, 0, "background");
  backgroundImage.height = 400;
  backgroundImage.width = 790;
    game.stage.setBackgroundColor("#32CD32");
    labelScore = game.add.text(0, 0, score.toString());
    player = game.add.sprite(50, 50, "playerImg");
    game.physics.arcade.enable(player);
    player.body.gravity.y = 400;
    game.add.text(50, 0, "Hello!", {font: "30px Comic Sans", fill: " #0000FF"});
    game.add.text(600, 0 , "Flappy Bird!", {font: "30px Comic Sans", fill: " #0000FF"});
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);
    var pipeInterval = 1.75 * Phaser.Timer.SECOND;
    var pipeInterval2 = 0.5 * Phaser.Timer.SECOND;
    game.time.events.loop(
     pipeInterval,
     generate
    );
    game.time.events.loop(pipeInterval2,moveForward);

    // game.input
    //     .keyboard.addKey(Phaser.Keyboard.RIGHT)
    //     .onDown.add(moveRight);
    // game.input
    //     .keyboard.addKey(Phaser.Keyboard.LEFT)
    //     .onDown.add(moveLeft);
    // game.input
    //     .keyboard.addKey(Phaser.Keyboard.DOWN)
    //     .onDown.add(moveDown);
    // game.input
    //     .keyboard.addKey(Phaser.Keyboard.UP)
    //     .onDown.add(moveUp);
}



// function generatePipe(){
//   var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);
//   for(var y = gapStart; y > 0; y -= blockHeight){
//     addPipeBlock(width, y - blockHeight);
//   }
//   for(var y = gapStart + gapSize; y < height; y += blockHeight) {
//     addPipeBlock(width, y);
//   }
//   changeScore();
// }

function generatePipe() {
 var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

 addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart - 25);
 for(var y = gapStart - pipeEndHeight; y > 0; y -= blockHeight) {
 addPipeBlock(width, y - blockHeight);
 }

 for(var y = gapStart + gapSize + pipeEndHeight; y < height; y += blockHeight) {
 addPipeBlock(width, y);
 }
 addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart + gapSize + 25);
 changeScore();
}
function moveForward() {
    player.x = player.x + 1;
}

//   for(var count=0; count < 8; count = count + 1){
//     if(count !=gapStart && count !=gapStart + 1){
//       addPipeBlock(800, count *50);
//     }
//   }
//   changeScore();
// }
/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
  game.physics.arcade.overlap(
    player,
    pipes,
    gameOver);

  for(var i = balloons.length - 1; i >= 0; i--){
     game.physics.arcade.overlap(player, balloons[i], function(){
     changeGravity(-50);
     balloons[i].destroy();
     balloons.splice(i, 1);
   });
  }

  if (player.body.y < 0){
    gameOver();
  }
  if(player.body.y > 400){
    gameOver();
  }
  player.anchor.setTo(0.5, 0.5);
  player.rotation += 1;
  player.rotation = Math.atan(player.body.velocity.y / 200);
}

function gameOver(){
 registerScore(score);
 score = 0;
 game.state.restart();
 gameGravity = 200;

}

function addPipeBlock(x, y){
  var block = game.add.sprite(x, y, "pipeBlock");
  pipes.push(block);

  game.physics.arcade.enable(block);
  block.body.velocity.x = -200;
}

function addPipeEnd(x,y){
  var pipeEnd = game.add.sprite(x,y,"pipeEnd");
  pipes.push(pipeEnd);

  game.physics.arcade.enable(pipeEnd);
  pipeEnd.body.velocity.x = -200;
}

function moveRight() {
  player.x = player.x + 50;
}
function moveLeft(){
  player.x = player.x - 50;
}
function moveDown(){
  player.y = player.y + 50;
}
function moveUp(){
  player.y = player.y - 50;
}
function spaceHandler() {
  changeScore();
  game.sound.play("score");
}

function changeScore() {
  score = score + 1;
  labelScore.setText(score.toString());
}
function playerJump(){
  player.body.velocity.y = -200;
  game.sound.play("score");
}
function changeGravity(g) {
 gameGravity += g;
 player.body.gravity.y = gameGravity;
}
function generateBalloons(){
 var bonus = game.add.sprite(width, height, "balloons");
 balloons.push(bonus);
 game.physics.arcade.enable(bonus);
 bonus.body.velocity.x = - 200;
 bonus.body.velocity.y = -      game.rnd.integerInRange(60, 100);
}
function generate() {
   var diceRoll = game.rnd.integerInRange(1, 10);
   if(diceRoll==1) {
   generateBalloons();
   }
   // else if(diceRoll==2) {
   // generateWeight();
   // }
   else {
   generatePipe();
   }
}
