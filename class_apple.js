
class Apple extends Element {
  constructor(color) {
    super(0, 0, sqr_size, color);
    this.color = color;
    this.x = null;
    this.y = undefined;
  }
  reset() {
    // power: how many Elements will the apple add to the worm
    this.power = 0;

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
  
  new() {
    // generate a new increased apple
    this.generate_coords("apple");
    this.power++;
  }
}
