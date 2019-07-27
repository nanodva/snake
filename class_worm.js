class WormHead extends Element {
  constructor(x, y, size) {
    super(x,y,size,head_color,"head");
    this.direction = DIR.RIGHT;
  }
  draw() {
    super.draw();

    // eyes
    // 
    var xo = this.x * this.size;
    var yo = this.y * this.size;
    // space and eye size
    var gap = this.size/5;

    var eyecoords = [
      [ xo + gap, yo + gap ],
      [ xo + 3*gap, yo + gap ],
      [ xo + 3*gap, yo + 3*gap ],
      [ xo + gap, yo + 3*gap ],
      [ xo + gap, yo + gap ]
    ];

    var i = 0;
    switch (this.direction) {
      case DIR.RIGHT:
        i = 1;
        break;
      case DIR.DOWN:
        i = 2;
        break;
      case DIR.LEFT:
        i = 3;
        break;
      case DIR.UP:
        i = 0;
        break;
    }
    this.ctx.fillStyle = "black";
    var j = i+2;
    var x,y;
    for (i;i<j; i++) {
      x = eyecoords[i][0];
      y = eyecoords[i][1];
      this.ctx.fillRect(x, y, gap, gap);
    }
  }


}

class Worm {
  constructor() {
    this.body = new Array();
  }

  reset() {
    // this.direction = DIR.RIGHT;
    this.growth = 1;

    // create head at top left corner
    var xpos = 0;
    var ypos = 0;
    // make head, first part of the body
    this.head = new WormHead(xpos, ypos, sqr_size);
    this.body = [this.head];

    // stack keyboard commands in fifo
    this.fifo = [];
  }

  draw() {
    function draw_head() {

    }
    var len = this.body.length ;
    var i = 0
    // for (i=0; i < len; i++) {
    for (i=len; i>0; i--) {
      this.body[i-1].draw();
    }
  }

  died() {
    // alert("worms died");
    this.head.x = this.ghost.x;
    this.head.y = this.ghost.y;
    this.head.color = this.ghost.color;
    // .color = "orange";
    // this.body.shift();
  }

  push(side) {
    // push next direction change in fifo
    this.fifo.push(side);
    // console.table(this.fifo);
  }

  pop() {
    // retrieve oldest direction command
    // console.debug("popping...");
    if (this.fifo.length > 0) {
      return this.fifo.shift();
    } else {
      return false;
    }
  }

  turn(side) {
    // compute new direction through modulus 4
    var add = 0;
    switch (side) {
      case "left":
        add = 1;
        break;
      case "right":
        add = 3;
        break;
    }
    var olddir = this.head.direction;
    var newdir = (olddir + add) % 4;
    this.head.direction = newdir;
  }

  move() {
    var len = this.body.length;

    // change head direction if requested
    var side;
    if (side=this.pop()) {
      // console.debug("pop side: ", side);
      this.turn(side);
    }

    // copy tail properties if worm growth
    var tail = this.body[len-1];
    var tail_x = tail.x;
    var tail_y = tail.y;
    var tail_dir = tail.direction;

    // copy head to display in case of collision
    var x = this.head.x;
    var y = this.head.y;
    this.ghost = new Element(x, y, sqr_size, ghost_color, "ghost");

    // move all body parts
    var i = 0;
    for (i=0; i<len; i++) {
      this.body[i].move();
    }    

    // moving body, forwardding direction to next element, from tail to head.
    if (len>0) {
      for (i=len-1; i>0; i--) {
        // each element get the direction of its predecessor
        this.body[i].set_direction(this.body[i-1].direction);
      }
    }

    // snake grows from the tail end by one element
    if (this.growth > 0) {
      var newtail = new Element(tail_x, tail_y, sqr_size, body_color, "tail");
      newtail.set_direction(tail_dir);
      this.body.push(newtail);
      score.value += 1;
      this.growth--;
    }
    return true;
  }

  test_collision(){
    // board edges collision
    // if (this.head.x < 0 || this.body[0].x > division -1 || this.body[0].y < 0 || this.body[0].y > division -1 ) {
    var x = this.head.x ;
    var y = this.head.y ;
    if (x < 0 || x >= arena.cols || y < 0 || y >= arena.rows ) {
      status = "edge collision";
      this.died();
      return true;
    }

    // worm auto-collision
    for (var i = 1; i < this.body.length; i++) {
      if (this.head.x == this.body[i].x && this.head.y == this.body[i].y) {
        status = "body collision";
        this.died();
        return true;
      }
    }

    // worm is eating apple
    if (this.head.x == apple.x && this.body[0].y == apple.y) {
      // worms is getting bigger
      this.growth += apple.power;
      apple.new();
    }
    return false;
  }
}

