
class Apple extends Element {
  constructor() {
    super(0, 0, sqr_size, apple_color);
    this.x = null;
    this.y = undefined;

    this.generate_coords("apple");
    // power: how many Elements will the apple add to the worm
    this.power = 0;
  }
  new() {
    // generate a new increased apple
    this.generate_coords();
    this.power++;
  }
}
