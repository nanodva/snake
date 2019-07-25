
class Worm {
  constructor() {
    this.body = [];
    this.direction = DIR.RIGHT;
    this.growth = 0;
    // this.lenght = 0;
    var xpos = 0
    var ypos = 0
    this.body = [new Element( xpos, ypos, sqr_size, head_color)];
  }
  init() {
    this.direction = DIR.RIGHT;
    this.growth = 0;
    // create head at top left corner
    var xpos = 0
    var ypos = 0
    this.body = [new Element( xpos, ypos, sqr_size, head_color)];
    // this.head = this.body[0];
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
    game_is_running = false;
    this.body.shift();
    // this.body[0].color = head_color;
    this.draw();
  }
  turn_left() {
    if (this.direction == DIR.DOWN) {
      this.direction = DIR.RIGHT;
    } else {
      this.direction++;
    }
  }
  turn_right() {
      if (this.direction == DIR.RIGHT) {
        this.direction = DIR.DOWN;
      } else {
        this.direction--;
      }
  }
  move() {
    var len = this.body.length;
    // copy tail properties if worm growth
    var tail = this.body[len-1];
    var tail_x = tail.x;
    var tail_y = tail.y;
    var tail_dir = tail.direction;


    var head = this.body[0];
    this.body[0].set_direction(this.direction);
    // move worm head
    // this.body[0].move() || this.died();
    // head.move() || this.died();
    // moving body, forwardding direction to next element
    // if (len > 1) {
    var trans_dir;
    var next_dir;
    var ring;

    var x;
    var y;
    var dir;

    var i = 0;
    for (i=0; i<len; i++) {
      this.body[i].move() || this.died();
    }

    if (len>0) {
      for (i=len-1; i>0; i--) {
        this.body[i].set_direction(this.body[i-1].direction);
      }
    }

    if (this.growth > 0) {
      // this.body.splice(1, 0, new Element(x, y, sqr_size, body_color)) ;
      // alert("new ring: pos: " + x + ',' + y + 'dir: ' + dir);
      var new_ring = new Element(tail_x, tail_y, sqr_size, body_color);
      new_ring.set_direction(tail_dir);
      this.body.push(new_ring);
      score.value += 1;
      this.growth--;
    }
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

