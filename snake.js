// DECLARATIONS
var direction = ["right", "down", "left", "up"];  // direction for components
var key = ""; // key event 
var game_is_running = false;
var game_is_over = false;
var wait_for_submit = false;
var division = 12;
var width = 400;
var height = width;
var sqr_size = width / division;
var score = new component(20, 20, 40, "hsla(0, 100%, 100%, 0.5)", "text" );
var refresh_rate = 10; // delay beetween two loops
var game_speed = 10; // game speed 
var loop = null; // interval loop
var head_color = "hsl(245, 12%, 92%)";
var body_color = "hsl(225, 8%, 25%)";
var apple_color = "hsl(0, 80%, 50%)";

// OBJECTS
var arena = {
  canvas : document.createElement("canvas"),
  container : document.createElement("div"),
  frame : "0",
  // ouput style
  font_size : 40,

  init : function() {
    //CONTAINER INIT
    this.container.style.height = height + "px";
    this.container.style.width = width + "px";
    this.container.style.position = "absolute";
    this.container.style.zIndex = "-1";
    
    //arena is the first object ref in this page
    document.body.insertBefore(this.container, document.body.childNodes[0]);
    
    // CANVAS INIT
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.backgroundColor = "black";
    // canvas context
    this.context = this.canvas.getContext("2d");
    this.context.font = this.font_size + "px Arial";
    this.context.textAlign = "center";
    //canvas insertion
    this.container.appendChild(this.canvas);
  },
  clear : function() {
    // clean arena
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  draw : function() {
    // squares dims 
    // var square = this.canvas.width / division;
    
    // draw the arena background
    ctx=this.context;
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
  },
  start : function() {
    // start game loop
    this.frame = 0;
    this.interval = setInterval(game_loop, refresh_rate);
  },
  stop : function() {
    // stop game loop
    clearInterval(this.interval);
  }
}

var apple = {
  // power: how many elements will the apple add to the worm
  power : 0,
  new : function() {
    // generate a new apple
    var test = false;
    while (!test) {
      // generate rnd coordinates
      var x = rnd(0, division - 1);
      var y = rnd(0, division - 1);
     
      test = true;
      // test case is available
      for (var i = 0; i < worm.body.length; i++) {
        if (x != worm.body[i].x) { continue; }
        if (y != worm.body[i].y) { continue; }
        test = false;
      }
    }
    // generate apple
    this.body = new component(x, y, sqr_size, apple_color, "draw");
    document.getElementById("data6").innerHTML = "new apple : " + x + " ," + y;
    // this.size++;
    this.power++;
  },
  draw : function() {
    this.body.draw();
  }
}

var worm = {
  start : function() {
    this.direction = 0;
    this.grow = 0;
    //this.body = null;
    this.body = [new component( 4, 4, sqr_size, head_color, "draw")];
  },
  draw : function() {
    for (var i=0; i < this.body.length; i++) {
      this.body[i].draw();
    }
  },
  died : function() {
    this.body.shift();
    this.body[0].color = head_color;
    this.draw();
  },
  test_key : function() {
    //teste global.key et change .direction
    switch (key) {
    // if (key == "ArrowRight") {
      case "ArrowRight":
        this.direction++;
        if (this.direction > 3) this.direction = 0;
        break;
      case "ArrowLeft": 
        this.direction--;
        if (this.direction < 0) this.direction = 3;
        break;
    }
    key = null;
  },
  move : function() {
    //mofifie direction
    this.test_key();
    //cree et insere copie de la tete
    var x = worm.body[0].x;
    var y = worm.body[0].y;
    this.body.splice(1, 0, new component(x, y, sqr_size, body_color, "draw"));
    //deplace tete
    this.body[0].move(direction[this.direction]);

    // end game if collide
    if (this.testCollision()) {
      game_is_running = false;
      this.died();
      return;
    }

    if (this.grow == 0) {
      // worm is not growing
      this.body.pop();
    } else {
      // WORM IS GROWING
      score.value += 1;
      this.grow--;
    }
  },
  testCollision : function(){
    // board edges collision
    if (worm.body[0].x < 0 || worm.body[0].x > division -1 || worm.body[0].y < 0 || worm.body[0].y > division -1 ) {
      return true;
    }
    // worm auto-collision
    for (var i = 1; i < worm.body.length; i++) {
      if (worm.body[0].x == worm.body[i].x && worm.body[0].y == worm.body[i].y) {
        return true;
      }
    }
    // worm is eating apple
    if (worm.body[0].x == apple.body.x && worm.body[0].y == apple.body.y) {
      // worms is getting bigger
      this.grow += apple.power;
      apple.new();
    }
    return false;
  }
}

var menu = {
  container : document.createElement("div"),
  canvas : document.createElement("canvas"),
  form : document.createElement("form"),
  if_score : document.createElement("iframe"),
  // if_debug : document.createElement("iframe"),
  input : document.createElement("input"),
  inputscore : document.createElement("input"),
  textbox : document.createElement("div"),
  
  // arena dimensions
  height : 400,
  width : 400,
  // ouput style
  font_size : 40,

  init : function() {
    //CONTAINER INIT
    this.container.style.height = this.height + "px";
    this.container.style.width = this.width + "px";
    // document.body.insertBefore(this.container, document.body.childNodes[1]);
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
    this.input.style.width = this.canvas.width / 2 + "px";
    this.input.style.height = this.font_size + "px";
    this.input.style.position = "absolute";
    this.input.style.top =  this.canvas.height * 0.75 + "px";
    this.input.style.left = ( this.canvas.width / 4 ) + "px";
    // input colors
    this.input.style.backgroundColor = "hsla(20, 40%, 0%, 60%)";
    // input font style
    this.input.style.fontSize = this.canvas.height / 18 + "px";
    this.input.style.color = "white";
    this.input.style.textTransform = "uppercase";
    this.input.style.textAlign = "center";
    this.input.maxLength = "8";
    this.input.style.visibility = "hidden";
    //input attribut
    this.input.setAttribute("type", "text");
    this.input.setAttribute("autocomplete", "off");
    this.input.name = "name";
    // input insertion
    this.form.appendChild(this.input);

    // inputscore attribut
    this.inputscore.setAttribute("type", "number");
    this.inputscore.setAttribute("autocomplete", "off");
    this.inputscore.style.visibility = "hidden";
    this.inputscore.name = "score";
    this.form.appendChild(this.inputscore);

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
  },
  show : function() {
    // wait for mysqli update and reload highscores
    this.if_score.style.visibility = "visible";
    // this.if_score.src = this.if_score.src;
    // this.if_score.src="./highscore.php";
  },
  hide : function() {
    // hide menu
    this.if_score.style.visibility = "hidden";
  },
  clear : function() {
    // this.context.fillStyle = "hsla(20, 100%, 0%, 100%)";
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
  },
  game_over : function (){
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
    this.input.style.visibility = "visible";
    this.input.focus();
    // press Enter to submit  
    wait_for_submit = true;
  },
  submit_score : function(){
    // retrieve playername entry
    this.form["name"].value = this.input.value;
    // retrieve current score
    this.inputscore.value = score.value;
    // send score
    this.form.submit();

    // reset input
    this.input.style.visibility = "hidden";
    this.input.blur();
    this.input.value = null;
    //
    this.clear();
    wait_for_submit = false;
    this.show();
  },
}


// FUNCTIONS
function init()
{
  // start listening to keyboard
  parent.document.addEventListener("keydown", keyManager);
  document.addEventListener("keydown", keyManager);
  // game init
  arena.init();
  arena.draw();
  menu.init();
  menu.show();
} 

function keyManager(event)
{
  document.getElementById("data5").innerHTML = event.key;
  key = event.key;

  // ingame key events
  if (game_is_running) {
    switch (event.key) {
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
  worm.start();
  // arena.start();
  apple.new();
  loop = setInterval(game_loop, refresh_rate);

  game_is_running = true;
}

function game_over() {
  // when player lose
  clearInterval(loop);
  // apple.body.draw();
  // stop game
  menu.game_over();
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
    if ((arena.frame / game_speed) % 1 == 0) {
      worm.move();
    }
  }
  else {
    game_over();
  }
}

// use to pop apples randomly
function rnd(mini, maxi) {
  var num = Math.trunc(Math.random() * (maxi-mini) + mini);
  return num;
}

function component(x, y, size, color, type) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.type = type;
  this.value = 0;
  this.size = size;
  // square side lenght
  // this.len = width / division;
  this.draw = function() {
    if (this.type == "draw") {
      arena.context.fillStyle = this.color;
      // arena.context.fillRect(this.x * 40, this.y *40, size, size);
      arena.context.fillRect(this.x * size, this.y * size, size, size);
    }
    if (this.type == "text") {
      arena.context.font = this.size + "px Arial";
      arena.context.fillStyle = this.color;
      arena.context.fillText(this.value, 50, 50);
    }
  }
  this.move = function(direction) {
    if (direction == "right") {
      this.x++;
    }
    if (direction == "left") {
      this.x--;
    }
    if (direction == "up") {
      this.y--;
    }
    if (direction == "down") {
      this.y++;
    }
  }
} 

function on_submit() {
  // this is called when score form is submitted
  //
}

function resizeIframe(obj) {
  // cut frme according to source dimensions
  obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
}
function info(data) {
  document.getElementById("info").innerHTML = data;
}

function fluxdata() {
    document.getElementById('data1').innerHTML = worm.body.length;
    document.getElementById('data2').innerHTML = worm.direction;
    document.getElementById('data3').innerHTML = arena.frame;
    document.getElementById('data4').innerHTML = worm.body[0];
    //document.getElementById('data4').innerHTML = apple.body.x + ", " + apple.body.y;
}

// Initialilze game
init();
