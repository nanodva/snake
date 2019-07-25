// DECLARATIONS
var DIR = Object.freeze({"RIGHT":0, "UP":1, "LEFT": 2, "DOWN": 3});
// game status flag
var game_is_running = false;
var game_is_over = false;
var wait_for_submit = false;

// arena dimension in px
var width = 400;
var height = width;
// size of grid and grid squares in pixels
var division = 12;
var sqr_size = width / division;

// GAME SPEED AND REFRESH RATE
var loop_delay = 10; 
var game_speed = 14;

// COMPONENTS COLORS
var head_color = "hsl(245, 12%, 92%)";
var body_color = "hsl(225, 8%, 25%)";
var apple_color = "hsl(0, 80%, 50%)";


// OBJECTS
var game = new Game();
var menu = new Menu(width, height);
var arena = new Arena(division, division, width, height);
var score = new Score(20, 20, 40, "hsla(0, 100%, 100%, 0.5)");
// var worm = new Worm();
var worm;
var apple;



// FUNCTIONS
function f_init_all() {
  // start listening to keyboard
  parent.document.addEventListener("keydown", keyManager);
  document.addEventListener("keydown", keyManager);
  // game init
  arena.draw();
  menu.init_all();
  menu.show();
} 

function game_start() {
  menu.hide();

  arena.reset();
  score.reset()
  worm = new Worm();
  apple = new Apple();
  apple.new();
  
  game.start(loop_delay, game_speed);
  game_is_running = true;
  
}

function game_over() {
  // when player lose
  game.stop();
  menu.game_over();
}

function rnd(mini, maxi) {
  // return a randomized integer
  var num = Math.trunc(Math.random() * (maxi-mini) + mini);
  return num;
}



function keyManager(event) {
  document.getElementById("game_key").innerHTML = event.key;

  // ingame key events
  if (game_is_running) {
    switch (event.key) {
      case "ArrowRight":
        worm.turn_right();
        break;
      case "ArrowLeft":
        worm.turn_left();
        break;
    }
  }
  // wait for name submit after game is over
  else if (wait_for_submit) {
    switch (event.key) {
    case "Enter":
      game_status = "submit form";
      menu.submit_score();
      break;
    }
  }
  // wait for game menu
  else {
    switch (event.key) {
    case "Enter":
      game_status = "start game";
      game_start();
      break;
    }
  }
}
      

function update_debug_data() {
      f_worm_data();
      f_arena_data();
      f_game_data();
      f_apple_data();
}

function f_game_data() {
    document.getElementById('game_status').innerHTML = game.status;
    document.getElementById('game_speed').innerHTML = game.speed;
    document.getElementById('game_frame').innerHTML = game.framecount;
    document.getElementById('data4').innerHTML = worm.body[0];
}

function f_worm_data() {
  document.getElementById('worm_xpos').innerHTML = worm.body[0].x;
  document.getElementById('worm_ypos').innerHTML = worm.body[0].y;
  document.getElementById('worm_lenght').innerHTML = worm.body.length;
  document.getElementById('worm_direction').innerHTML = worm.direction;
  document.getElementById('worm_growth').innerHTML = worm.growth;
}

function f_apple_data() {
  document.getElementById('apple_xpos').innerHTML = apple.x;
  document.getElementById('apple_ypos').innerHTML = apple.y;
  document.getElementById('apple_power').innerHTML = apple.power;
}
function f_arena_data() {
  document.getElementById('arena_width').innerHTML = arena.width;
  document.getElementById('arena_height').innerHTML = arena.height;
  document.getElementById('arena_board_size'). innerHTML = arena.board.length;
}

// Start game
f_init_all();

