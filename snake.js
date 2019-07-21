// CLASSES
class Element {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.value = 0;   // ??
    this.size = size; // square side lenght
  }
  draw() {
    // rect color
    arena.context.fillStyle = this.color;
    var xo = this.x * this.size;
    var yo = this.y * this.size;
    arena.context.fillRect(xo, yo, this.size, this.size);
  }
  move(direction) {
    // if (direction == "right") {
    if (direction == DIR.RIGHT) {
      this.x++;
    }
    // if (direction == "left") {
    if (direction == DIR.LEFT) {
      this.x--;
    }
    if (direction == DIR.UP) {
      this.y--;
    }
    if (direction == DIR.DOWN) {
      this.y++;
    }
  }
}

class Score {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;   // font size
    this.value = 0;     // score counter
  }
  draw() {
    arena.context.fillStyle = this.color;
    arena.context.font = this.size + "px Arial";
    arena.context.fillText(this.value, 50, 50);
  }
}

class Apple extends Element {
  constructor() {
    super(0, 0, sqr_size, apple_color);
    this.generate_coords();
    // power: how many Elements will the apple add to the worm
    this.power = 0;
  }
  generate_coords() {
    // generate a new apple position
    var x = 0;
    var y = 0;
    var test = false;
    
    // loop until free coordinates are found
    while (!test) {
      test = true;
      // generate rnd coordinates
      x = rnd(0, division - 1);
      y = rnd(0, division - 1);
     
      // check square is free
      var i;
      for (i=0; i<worm.body.length; i++) {
        if (x != worm.body[i].x) { continue; }
        if (y != worm.body[i].y) { continue; }
        // go for another try
        test = false;
      }
    }
    // save new position
    this.x = x;
    this.y = y;
  }

  new() {
    // generate a new increased apple
    this.generate_coords();
    this.power++;
  }
}

class Worm {
  constructor() {
    this.body = [];
    this.direction = DIR.RIGHT;
    this.grow = 0;
    // this.lenght = 0;
  }

  init() {
    this.direction = DIR.RIGHT;
    // this.direction = Dir.right;
    this.grow = 0;
    // create head at top left corner
    var xpos = 0
    var ypos = 0
    this.body = [new Element( xpos, ypos, sqr_size, head_color)];
    // this.lenght += 1;
  }
  draw() {
    for (var i=0; i < this.body.length; i++) {
      this.body[i].draw();
    }
  }
  died() {
    game_is_running = false;
    this.body.shift();
    this.body[0].color = head_color;
    this.draw();
  }
  turn_left() {
    //teste global.key et change .direction
    if (this.direction == DIR.DOWN) {
      this.direction = DIR.RIGHT;
    } else {
      this.direction++;
    }
    // this.direction--;
    // if (this.direction < 0) this.direction = 3;
  }
  turn_right() {
    // if (key == "ArrowRight") {
      if (this.direction == DIR.RIGHT) {
        this.direction = DIR.DOWN;
      } else {
        this.direction--;
      }
      // this.direction++;
      // if (this.direction > 3) this.direction = 0;
  }
  move() {
    //cree et insere copie de la tete
    var x = this.body[0].x;
    var y = this.body[0].y;
    this.body.splice(1, 0, new Element(x, y, sqr_size, body_color));
    //deplace tete
    // this.body[0].move(direction[this.direction]);
    this.body[0].move(this.direction);
    
    // end game if collide
    if (this.testCollision()) {
      this.died();
      return;
    }

    if (this.grow == 0) {
      // worm is not growing
      this.body.pop();
    } else {
      // WORM IS GROWING
      score.value += 1;
      // this.lenght += 1;
      this.grow--;
    }
  }
  testCollision(){
    // board edges collision
    if (this.body[0].x < 0 || this.body[0].x > division -1 || this.body[0].y < 0 || this.body[0].y > division -1 ) {
      return true;
    }
    // worm auto-collision
    for (var i = 1; i < this.body.length; i++) {
      if (this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
        return true;
      }
    }
    // worm is eating apple
    if (this.body[0].x == apple.x && this.body[0].y == apple.y) {
      // worms is getting bigger
      this.grow += apple.power;
      apple.new();
    }
    return false;
  }
  test_collide() {
    var data = arena.frame;
    var data = DIR.RIGHT;
    info(data);
  }
}

class Arena {
  constructor() {
    // ouput style
    this.font_size = 40;

    //CONTAINER INIT
    this.container = document.createElement("div");
    this.container.style.height = height + "px";
    this.container.style.width = width + "px";
    this.container.style.position = "absolute";
    this.container.style.zIndex = "-1";
    //arena is the first object ref in this page
    document.body.insertBefore(this.container, document.body.childNodes[0]);

    // CANVAS INIT
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.backgroundColor = "black";
    //canvas insertion
    this.container.appendChild(this.canvas);

    // CANVAS CONYTEXT
    this.context = this.canvas.getContext("2d");
    this.context.font = this.font_size + "px Arial";
    this.context.textAlign = "center";
  }

  clear() {
    // clean arena
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw() {
    // draw the arena background
    var ctx = this.context;

    // clear cancas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // draw lines to delimit square sides
    ctx.beginPath();
    for ( var i = 1; i<division; i++) {
      // draw verticals
      ctx.moveTo(i*sqr_size, 0);
      ctx.lineTo(i*sqr_size, this.canvas.height);    
      // draw horizontals
      ctx.moveTo(0, i*sqr_size);
      ctx.lineTo(this.canvas.width, i*sqr_size);    
    }
    // execute drawings
    this.context.strokeStyle = "#700";
    this.context.stroke();
  }
  start() {
    // start game
    this.frame = 0;
    // this.interval = setInterval(game_loop, refresh_rate);
  }
  stop() {
    // stop game loop
    clearInterval(this.interval);
  }
}

class Menu {
  constructor() {
    this.container = document.createElement("div");
    this.canvas = document.createElement("canvas");
    this.form = document.createElement("form");
    this.if_score = document.createElement("iframe");
    
    this.in_name = document.createElement("input");
    this.in_score = document.createElement("input");
    this.textbox = document.createElement("div");
  
    // arena dimensions
    this.height = 400;
    this.width = 400;
    // ouput style
    this.font_size = 40;
  }

  init() {
    //CONTAINER INIT
    this.container.style.height = this.height + "px";
    this.container.style.width = this.width + "px";
    document.body.appendChild(this.container);
    
    // if_score: iframe use to display highscore and info
    // position
    this.if_score.style.position = "absolute";
    this.if_score.style.height = this.height + "px";
    this.if_score.style.width = this.width + "px";
    // style
    this.if_score.border = "no";
    this.if_score.scrolling = "no";
    this.if_score.style.visibility = "hidden";
    // target and metadata
    this.if_score.src="./highscore.php";
    this.if_score.name = "if_score"
    // insertion
    this.container.appendChild(this.if_score);

    
    // CANVAS INIT
    this.canvas.style.position = "absolute";
    // this.canvas.d
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    // canvas context
    this.context = this.canvas.getContext("2d");
    this.context.font = this.font_size + "px Arial";
    this.context.textAlign = "center";
    //canvas insertion
    this.container.appendChild(this.canvas);
    
    // TEXTBOX
    // position
    this.textbox.style.position = "absolute";
    this.textbox.style.width = this.width * 2/3 + "px";
    this.textbox.style.height = this.height * 16/18 + "px";
    this.textbox.style.top =  this.height * 1/18 + "px";
    this.textbox.style.left = ( this.canvas.width * 1/6 ) + "px";
    //textbox style
    this.textbox.style.backgroundColor = "hsla(0, 0%, 0%, 0)";
    // font
    this.textbox.style.color = "white";
    this.textbox.style.fontSize = this.canvas.height / 18 + "px";
    this.textbox.style.textTransform = "uppercase";
    this.textbox.style.textAlign = "center";
    // visibilitythis.textbox.style.visibility = "visible";
    this.textbox.style.visibility = "hidden";

              
    //input.score insertion
    this.container.appendChild(this.textbox);
    
    // FORM INIT
    // input position
    this.in_name.style.width = this.canvas.width / 2 + "px";
    this.in_name.style.height = this.font_size + "px";
    this.in_name.style.position = "absolute";
    this.in_name.style.top =  this.canvas.height * 0.75 + "px";
    this.in_name.style.left = ( this.canvas.width / 4 ) + "px";
    // input colors
    this.in_name.style.backgroundColor = "hsla(20, 40%, 0%, 60%)";
    // input font style
    this.in_name.style.fontSize = this.canvas.height / 18 + "px";
    this.in_name.style.color = "white";
    // this.in_name.style.textTransform = "uppercase";
    this.in_name.style.textAlign = "center";
    this.in_name.maxLength = "8";
    this.in_name.style.visibility = "hidden";
    //input attribut
    this.in_name.setAttribute("type", "text");
    this.in_name.setAttribute("autocomplete", "off");
    this.in_name.name = "name";
    // input insertion
    this.form.appendChild(this.in_name);

    // in_score attribut
    this.in_score.setAttribute("type", "number");
    this.in_score.setAttribute("autocomplete", "off");
    this.in_score.style.visibility = "hidden";
    this.in_score.name = "score";
    this.form.appendChild(this.in_score);

    //form attribut
    // this.form.action = "submit_score.php";
    this.form.action = "highscore.php";
    this.form.onsubmit = on_submit()
    this.form.method = "post";
    // this.form.target = "if_debug";
    this.form.target = "if_score";
    
    //form insertion
    this.container.appendChild(this.form);
    this.container.style.zIndex = "2";
  }

  show() {
    // wait for mysqli update and reload highscores
    this.if_score.style.visibility = "visible";
    // this.if_score.src = this.if_score.src;
    // this.if_score.src="./highscore.php";
  }

  hide() {
    // hide menu
    this.if_score.style.visibility = "hidden";
  }
  clear() {
    // this.context.fillStyle = "hsla(20, 100%, 0%, 100%)";
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
  }

  game_over() {
    var xpos, ypos, msg;
    info("game over");
    this.context.fillStyle = "white";
    //affiche texte Game over
    xpos = this.canvas.width * 1/2;
    ypos = this.canvas.height * 1/3;
    msg = "Game over";
    this.context.fillText(msg, xpos, ypos);
    // disply score
    ypos += this.font_size * 2;
    msg = "score " + score.value;
    this.context.fillText(msg, xpos, ypos);
    // display frames       
    // ypos += this.font_size;
    // msg = "frames " + arena.frame;
    // this.context.fillText(msg, xpos, ypos);
    // this.canvas.style.visibility = "visible";
          
    // ask for player name
    this.in_name.style.visibility = "visible";
    this.in_name.focus();
    // press Enter to submit  
    wait_for_submit = true;
  }

  submit_score() {
    // retrieve playername entry
    this.form["name"].value = this.in_name.value;
    // retrieve current score
    this.in_score.value = score.value;
    // send score
    this.form.submit();

    // reset input
    this.in_name.style.visibility = "hidden";
    this.in_name.blur();
    this.in_name.value = null;
    //
    this.clear();
    wait_for_submit = false;
    this.show();
  }
}


// DECLARATIONS
var direction = ["right", "down", "left", "up"];  // direction for components
var DIR = Object.freeze({"RIGHT":0, "UP":1, "LEFT": 2, "DOWN": 3});
var game_is_running = false;
var game_is_over = false;
var wait_for_submit = false;
var division = 12;
var width = 400;
var height = width;
var sqr_size = width / division;
// var score = new Element(20, 20, 40, "hsla(0, 100%, 100%, 0.5)", "text" );
var score = new Score(20, 20, 40, "hsla(0, 100%, 100%, 0.5)", "text" );
var refresh_rate = 10; // delay beetween two loops
var game_speed = 14; // game speed 
var loop = null; // interval loop
var head_color = "hsl(245, 12%, 92%)";
var body_color = "hsl(225, 8%, 25%)";
var apple_color = "hsl(0, 80%, 50%)";


// OBJECTS
var arena = new Arena();
var worm = new Worm();
var apple = new Apple();
var menu = new Menu();



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
      case " ":
        game_start();
        break;
      case "x":
        fluxdata();
        break;
      case "Enter":
        info("you pressed Enter");
        break;
    }
  }
  // wait for name submit after game is over
  else if (wait_for_submit) {
    switch (event.key) {
    case "Enter":
      document.getElementById("info1").innerHTML = "submit form";
      menu.submit_score();
      break;
    case "h":
      document.getElementById("info1").innerHTML = "can't help. Sorry";
      break;
    }
  }
  // wait for game menu
  else {
    switch (event.key) {
    case "Enter":
      document.getElementById("info1").innerHTML = "start game";
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
  var num = Math.trunc(Math.random() * (maxi-mini) + mini);
  return num;
}

function on_submit() {
  // this is called when score form is submitted
  //
}


function info(data) {
  //
  document.getElementById("info").innerHTML = data;
}

function game_loop() {
  // clear arena
  
  if (game_is_running) {
    // game is on, draw components
    arena.draw();
    apple.draw();
    worm.draw(); 
    score.draw();

    //COMPTEUR FRAME//
    arena.frame++;
    if ((arena.frame / game_speed) % 2 == 0) {
      worm.move();
    }
    else if ((arena.frame / game_speed) % 1 == 0) {
      worm.move();
      worm.test_collide();
    }
  }
  else {
    game_over();
  }
}
function fluxdata() {
    document.getElementById('data1').innerHTML = worm.body.length;
    document.getElementById('data2').innerHTML = worm.direction;
    document.getElementById('data3').innerHTML = arena.frame;
    document.getElementById('data4').innerHTML = worm.body[0];
    //document.getElementById('data4').innerHTML = apple.body.x + ", " + apple.body.y;
}

// Start game
f_init_all();
