
class WormPart extends Element {
  constructor(x,y,size,color,name) {
    super(x,y,size,color,name);
    // this.xreel = this.x * this.size;
    // this.yreel = this.y * this.size;
  }
  // draw() {
  //   // square origins
  //   var xo = this.x * this.size;
  //   var yo = this.y * this.size;

  //   if (! this.is_static) {
  //     // which part of the move ratio
  //     var mod = game.imagecount % movediv;
  //     // how many pixels by move
  //     var dep = mod * (this.size / movediv);

  //     switch (this.direction) {
  //       case DIR.RIGHT:
  //         xo += dep
  //         break;
  //       case DIR.DOWN:
  //         yo += dep
  //         break;
  //       case DIR.LEFT:
  //         xo -= dep
  //         break;
  //       case DIR.UP:
  //         yo -= dep
  //         break;
  //     }
  //   }

  //   // rect color
  //   arena.context.fillStyle = this.color;
  //   arena.context.fillRect(xo, yo, this.size, this.size);
  // }

  move() {
    var dest = {
      x: this.x,
      y: this.y
    }

    // get dest coord, ( 1 square move)
    if (this.direction == DIR.RIGHT) {
      dest.x++;
    }
    else if (this.direction == DIR.LEFT) {
      dest.x--;
    }
    else if (this.direction == DIR.UP) {
      dest.y--;
    }
    else if (this.direction == DIR.DOWN) {
      dest.y++;
    }

    this.x = dest.x;
    this.y = dest.y;
  }
}

class WormHead extends WormPart {
  constructor(x, y, size) {
    super(x,y,size,head_color,"head");
    this.direction = DIR.RIGHT;
  }
  draw() {
    // square origins
    var xo = this.x * this.size;
    var yo = this.y * this.size;

    // draw body mask behind head
    arena.context.fillStyle = body_color;
    arena.context.fillRect(xo, yo, this.size, this.size);

    // which part of the move ratio
    var mod = game.imagecount % movediv;
    // how many pixels by move
    var dep = mod * (this.size / movediv);

    switch (this.direction) {
      case DIR.RIGHT:
        xo += dep
        break;
      case DIR.DOWN:
        yo += dep
        break;
      case DIR.LEFT:
        xo -= dep
        break;
      case DIR.UP:
        yo -= dep
        break;
    }

    // rect color
    arena.context.fillStyle = this.color;
    arena.context.fillRect(xo, yo, this.size, this.size);
    
    // space beetween eyes and eyes size are the same
    var gap = this.size/5;

    // table of the four eyes positions
    // upper-left, upper-right, dow-right, down-left..and upper right again
    // ...cause eyes are drawed by pairs
    var eyecoords = [
      [ xo + gap, yo + gap ],
      [ xo + 3*gap, yo + gap ],
      [ xo + 3*gap, yo + 3*gap ],
      [ xo + gap, yo + 3*gap ],
      [ xo + gap, yo + gap ]
    ];

    // select eyes to display according to head direction
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

    // draw eyes
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
    console.log("worm reset");
    this.growth = 1;

    // create head at top left corner
    var xpos = 0;
    var ypos = 0;
    // make head, first part of the body
    this.head = new WormHead(xpos, ypos, sqr_size);
    this.body = [this.head];

    //flags
    this.has_new_tail = false;
    this.newtail = null;
    this.ghost = null;

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

    if (this.has_new_tail == true) {
      this.newtail.draw();
    }
  }

  died() {
    console.log("worm died");
    this.head.x = this.ghost.x;
    this.head.y = this.ghost.y;
    this.head.color = this.ghost.color;
    console.table(this.body);
  }

  push(side) {
    // push next direction change in fifo
    this.fifo.push(side);
  }

  pop() {
    // retrieve oldest direction command
    var dir;
    if (this.fifo.length > 0) {
      dir = this.fifo.shift();
      console.debug("worm pop: ", dir);
      return dir;
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
    console.log("worm move");
    var len = this.body.length;

    // copy head to display in case of collision
    var x = this.head.x;
    var y = this.head.y;
    // ghost will be displayed, head may disapear if collide
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

    // change head direction if requested
    var side;
    if (side=this.pop()) {
      // console.debug("pop side: ", side);
      this.turn(side);
    }


    console.log("move end");
    console.table(this.body);
  }

  grows() {
    // copy tail properties if worm growth
    var len = this.body.length;
    var tail = this.body[len-1];
    if (this.has_new_tail == true) {
      console.log("worm attach newtil");
      this.newtail.is_static = false;
      this.body.push(this.newtail);
      this.has_new_tail = false;
      console.table(this.newtail);
      return true;
    }

    if (this.growth > 0) {
      // var newtail = new Element(tail_x, tail_y, sqr_size, body_color, "tail");
      this.newtail = new WormPart(tail.x, tail.y, sqr_size, body_color, "tail");
      // this.newtail.direction = tail.direction;
      this.newtail.is_static = true;

      score.value += 1;
      this.growth--;
      this.has_new_tail = true;
      console.log("worm grows. ", tail.x, tail.y);
      console.table(this.body);
      console.table(this.newtail);
      return true;
    }
  }

  test_collision(){
    // board edges collision
    // if (this.head.x < 0 || this.body[0].x > division -1 || this.body[0].y < 0 || this.body[0].y > division -1 ) {
    var x = this.head.x ;
    var y = this.head.y ;
    if (x < 0 || x >= arena.cols || y < 0 || y >= arena.rows ) {
      status = "edge collision";
      // this.died();
      return true;
    }

    // worm auto-collision
    for (var i = 1; i < this.body.length; i++) {
      if (this.head.x == this.body[i].x && this.head.y == this.body[i].y) {
        status = "body collision";
        // this.died();
        return true;
      }
    }

    // worm is eating apple
    if (this.head.x == apple.x && this.body[0].y == apple.y) {
      // worms is getting bigger
      this.growth += apple.power;
      console.log("worm eats apple");
      apple.new();
    }
    return false;
  }
}

