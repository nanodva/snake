
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
  new() {
    // generate a new increased apple
    this.generate_coords("apple");
    this.power++;
  }
}
