
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
    game_status = "game over";
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

