
class Worm {
  constructor() {
    this.body = new Array();
  }
  reset() {
    // this.direction = DIR.RIGHT;
    this.growth = 0;
    // create head at top left corner
    var xpos = 0
    var ypos = 0
    this.body = [new Element( xpos, ypos, sqr_size, head_color, "head")];
    this.head = this.body[0];
    this.head.direction = DIR.RIGHT;
    this.fifo = [];
  }
  draw() {
    var len = this.body.length ;
    var i = 0
    for (i=0; i < len; i++) {
      this.body[i].draw();
    }
  }
  died() {
    // alert("worms died");
    this.head.color = "orange";
    // this.body.shift();
    // this.body[0].color = head_color;
    // this.draw();
  }
  // turn_left() {
  //   if (this.head.direction == DIR.DOWN) {
  //     this.head.direction = DIR.RIGHT;
  //   } else {
  //     this.head.direction++;
  //   }
  // }
  // turn_right() {
  //   if (this.head.direction == DIR.RIGHT) {
  //     this.head.direction = DIR.DOWN;
  //   } else {
  //     this.head.direction--;
  //   }
  // }

  push(side) {
    // push next direction change in fifo
    this.fifo.push(side);
    console.table(this.fifo);
  }
  
  pop() {
    // retrieve oldest direction command
    console.debug("popping...");
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

    // copy tail properties if worm growth
    var tail = this.body[len-1];
    var tail_x = tail.x;
    var tail_y = tail.y;
    var tail_dir = tail.direction;

    // change head direction if requested
    var side;
    if (side=this.pop()) {
      console.debug("pop side: ", side);
      this.turn(side);
    }

    // move all body parts
    var i = 0;
    for (i=0; i<len; i++) {
      // this.body[i].move() || this.died();
      if (! this.body[i].move()) {
        console.log("move false");
        return false;
      }
    }

    // moving body, forwardding direction to next element
    if (len>0) {
      for (i=len-1; i>0; i--) {
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
    // if (this.body[0].x < 0 || this.body[0].x > division -1 || this.body[0].y < 0 || this.body[0].y > division -1 ) {
    var x = this.body[0].x ;
    var y = this.body[0].y ;
    if (x < 0 || x > arena.cols || y < 0 || y > arena.rows ) {
      status = "edge collision";
      this.died();
      return true;
    }
    // worm auto-collision
    for (var i = 1; i < this.body.length; i++) {
      if (this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
        status = "body collision";
        this.died();
        return true;
      }
    }
    // worm is eating apple
    if (this.body[0].x == apple.x && this.body[0].y == apple.y) {
      // worms is getting bigger
      this.growth += apple.power;
      apple.new();
    }
    return false;
  }
}

