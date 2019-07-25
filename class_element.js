// class for mobile elements
class Element {
  constructor(x, y, size, color) {
    // square side lenght
    this.size = size;
    this.x = x ;
    this.y = y ;
    arena.book(this.x,this.y);
    this.color = color;
  }
  set_direction(direction) {
    // for moving element
    this.direction = direction;
  }
  generate_coords(name) {
    // generate a new apple position
    var x = 0;
    var y = 0;
    var test = false;
    
    // loop until free coordinates are found
    while (true) {
      // generate rnd coordinates
      x = rnd(0, division - 1);
      y = rnd(0, division - 1);
     
      // check square is free
      if (arena.is_square_free(x,y)) {
        break;
      } else {
        continue;
      }
    }
    // save new position
    if (this.x != undefined && this.y == undefined) arena.free(this.x, this.y);
    this.x = x ;
    this.y = y ;
    arena.book(this.x, this.y, name);
  }
  
  draw() {
    // rect color
    arena.context.fillStyle = this.color;
    var xo = this.x * this.size;
    var yo = this.y * this.size;
    arena.context.fillRect(xo, yo, this.size, this.size);
    // arena.context.fillRect(this.x, this.y, this.size, this.size);
  }

  // move(direction) {
  move() {
    var dest = {
      x: this.x,
      y: this.y
    }

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
    if (arena.is_square_free(dest.x, dest.y)) {
      arena.free(this.x, this.y);
      this.x = dest.x;
      this.y = dest.y;
      arena.book(this.x, this.y)
      return true;
    } else {
      return false;
    }

  }
}
