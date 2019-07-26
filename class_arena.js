
class Arena {
  constructor(cols, rows, width, height) {

    // display size
    this.width  = width;
    this.height = height;
    // grid
    this.cols = cols;
    this.rows = rows;
    this.sqrlen = width / cols;


    //CONTAINER INIT
    this.div = document.createElement("div");
    this.div.style.height   = this.height + "px";
    this.div.style.width    = this.width  + "px";
    this.div.style.position = "absolute";
    this.div.style.zIndex   = "-1";
    //arena is the first object ref in this page
    document.body.insertBefore(this.div, document.body.childNodes[0]);

    // CANVAS INIT
    this.canvas = document.createElement("canvas");
    this.canvas.width  = this.width;
    this.canvas.height = this.height;
    this.canvas.style.backgroundColor = "black";
    //canvas insertion
    this.div.appendChild(this.canvas);

    // CANVAS CONYTEXT
    this.context = this.canvas.getContext("2d");
    this.fontsize = 1/2 * this.width / this.cols;
    
    // board squares occupation
    var size = this.cols * this.rows;
    this.board = new Array(size);
    // memory for each board square
    this.reset();
    // var i = 0;
    // for (i=0; i<size; i++) {
      // this.board[i] = {'isfree': true, 'object': null};
    // }
  }


  reset_context_properties() {
    // draw properties
    this.context.strokeStyle = "hsla(0, 100%, 100%, 0.5)";
    // font properties
    this.context.font = this.fontsize + "px Arial";
    this.context.textAlign = "center";
    this.context.fillStyle = "#777";
  }

  reset() {
    // clean board
    var size = this.board.length;
    // memory for each board square
    var i = 0;
    for (i=0; i<size; i++) {
      this.board[i] = {'isfree': true, 'object': null};
    }
  }

  draw() {
    // draw the arena background
    this.clear();
    this.reset_context_properties();
    this.draw_grid();
    this.draw_numbers();
  }
  clear() {
    // clean arena
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  draw_grid() {
    // draw lines to delimit square sides
    var ctx = this.context;
    ctx.beginPath();
    // execute drawings
    for ( var i = 1; i<division; i++) {
      // draw verticals
      ctx.moveTo(i*sqr_size, 0);
      ctx.lineTo(i*sqr_size, this.canvas.height);    
      // draw horizontals
      ctx.moveTo(0, i*sqr_size);
      ctx.lineTo(this.canvas.width, i*sqr_size);    
    }

    this.context.stroke();
  }
  draw_numbers() {
    // numerate columns and rows
    var ctx = this.context;
    var i = 0;
    var x,y;

    var center_x = this.sqrlen/2;
    var center_y = this.sqrlen/2 + this.fontsize/2 - 1;
    for (i=0; i<this.cols; i++) {
      x = (i * this.sqrlen) + center_x;
      y = center_y;
      ctx.fillText(i, x, y);
    }
    for (i=0; i<this.rows; i++) {
      x = center_x;
      y = i*this.sqrlen + center_y;
      ctx.fillText(i, x, y);
    }
  }
 
  is_square_free(col, row) {
    // square number
    var num = col + (this.cols * row);
    var square = this.board[num];

    // test square is not out of the board
    if (col < 0 || col > this.cols) return false;
    if (row < 0 || row > this.rows) return false;

    // test square is unused
    // if (square.isfree == true) {
    if (square.isfree == true || square.object == "apple") {
      return true;
    } else {
      return false;
    }
  }
 
  book(col, row, name) {
    // reserve a square
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

    this.board[num].isfree = false;
    this.board[num].object = name;
    return true;
  }
 
  free(col, row) {
    // free a square
    var num = col + (this.cols * row);
    if (num < 0 || num > this.board.length ) return false;
    this.board[num].isfree = true;
    this.board[num].object = null;
  }
}
