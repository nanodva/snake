
class Arena {
  constructor(cols, rows, width, height) {
    // ouput style
    this.font_size = 40;

    // display size
    this.width  = width;
    this.height = height;
    // grid
    this.cols = cols;
    this.rows = rows;

    //CONTAINER INIT
    this.container = document.createElement("div");
    this.container.style.height   = this.height + "px";
    this.container.style.width    = this.width  + "px";
    this.container.style.position = "absolute";
    this.container.style.zIndex   = "-1";
    //arena is the first object ref in this page
    document.body.insertBefore(this.container, document.body.childNodes[0]);

    // CANVAS INIT
    this.canvas = document.createElement("canvas");
    this.canvas.width  = this.width;
    this.canvas.height = this.height;
    this.canvas.style.backgroundColor = "black";
    //canvas insertion
    this.container.appendChild(this.canvas);

    // CANVAS CONYTEXT
    this.context = this.canvas.getContext("2d");
    this.context.font = this.font_size + "px Arial";
    this.context.textAlign = "center";

    // Hardware
    // board squares occupation
    this.board = new Array(this.cols * this.rows);
    for (let i=0; i<this.board.length; i++) {
      this.board[i] = {'isfree': true, 'object': null};
    }
    console.log(this.board);
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
  refresh() {
    this.draw(); 
    worm.draw(); 
    apple.draw();
    score.draw();

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
  is_square_free(col, row) {
    var square = col + (this.cols * row);

    // alert('square number: ' + square + "(" + col + "," + row + ")");
    if (this.board[square].isfree == true) {
      return true;
    } else {
      // alert("coord: " + col + ":" + row + "\nis not free.");
      return false;
    }
  }
  book(col, row) {
    if (col < 0 || col > this.cols - 1) {
      alert ("out of board: col");
      return false;
    }
    if (row < 0 || row > this.rows - 1) {
      alert ("out of board: row");
      return false;
    }

    var num = col + (this.cols * row);
    if (num < 0 || num > this.board.length ) {
      return false;
    }

    // var square = this.board[num];
    // if (square.isfree == false ) return false;

    // alert('book num: ' + num + "(" + col + "," + row + ")");
    this.board[num].isfree = false;
    // this.board[num].object = name;
    return true;
  }
  free(col, row) {
    var num = col + (this.cols * row);
    // var num = 10;
    // alert('free num: ' + num + "(" + col + "," + row + ")");
    if (num < 0 || num > this.board.length ) return false;
    this.board[num].isfree = true;
    this.board[num].object = null;
  }

}
