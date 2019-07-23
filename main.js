// DECLARATIONS
var direction = ["right", "down", "left", "up"];  // direction for components
var DIR = Object.freeze({"RIGHT":0, "UP":1, "LEFT": 2, "DOWN": 3});
// game status flag
var game_status = ""; // not really used
var game_is_running = false;
var game_is_over = false;
var wait_for_submit = false;

// arena dimension in px
var width = 400;
var height = width;
// size of grid and grid squares in pixels
var division = 12;
// var sqr_size = Math.trunc(width / division);
var sqr_size = width / division;

var refresh_rate = 10; // delay beetween two loops
var game_speed = 14; // game speed 
var loop = null; // interval loop
var head_color = "hsl(245, 12%, 92%)";
var body_color = "hsl(225, 8%, 25%)";
var apple_color = "hsl(0, 80%, 50%)";


// OBJECTS
var menu = new Menu();
var arena = new Arena(division, division, width, height);
var score = new Score(20, 20, 40, "hsla(0, 100%, 100%, 0.5)");
var worm = new Worm();
var apple = new Apple();



// FUNCTIONS
function f_init_all() {
  // start listening to keyboard
  parent.document.addEventListener("keydown", keyManager);
  document.addEventListener("keydown", keyManager);
  // game init
  // arena.init();
  arena.draw();
  menu.init();
  menu.show();
  // f_arena_data();
  // f_game_data();
  // f_apple_data();
  alert("initialized");
} 

function keyManager(event) {
  document.getElementById("data5").innerHTML = event.key;

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
      
function game_start() {
  menu.hide();
  score.value = 0;
  apple.power = 0;
  arena.frame = 0;

  worm.init();
  arena.start();
  apple.new();
  loop = setInterval(game_loop, refresh_rate);

  game_is_running = true;
}

function game_over() {
  // when player lose
  clearInterval(loop);
  menu.game_over();
}


// use to pop apples randomly
function rnd(mini, maxi) {
  // return a randomized integer
  var num = Math.trunc(Math.random() * (maxi-mini) + mini);
  return num;
}

// this is called when score form is submitted
function on_submit() {}

function game_loop() {
  // clear arena
  
  if (game_is_running) {
    // draw components
    arena.refresh();
    

    arena.frame++;
    if ((arena.frame % game_speed) == 0) {
      worm.move();
      f_worm_data();
      worm.draw();
      worm.test_collision();
    }
    
    f_arena_data();
    f_game_data();
    f_apple_data();
    // arena.refresh();
  }
  else {
    game_over();
  }
}
function f_game_data() {
    document.getElementById('game_status').innerHTML = game_status;
    document.getElementById('data2').innerHTML = worm.direction;
    document.getElementById('data3').innerHTML = arena.frame;
    document.getElementById('data4').innerHTML = worm.body[0];
    //document.getElementById('data4').innerHTML = apple.body.x + ", " + apple.body.y;
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
  // document.getElementById('arena_cols'). innerHTML = arena.board.length;

}

// Start game
f_init_all();

