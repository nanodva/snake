class Score {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;   // font size
  }
  draw() {
    // TODO add context to constructor()
    arena.context.fillStyle = this.color;
    arena.context.font = this.size + "px Arial";
    arena.context.fillText(this.value, 50, 50);
  }
  reset() {
    // reset score counter
    // this value  is send to highscore.php
    this.value = 0;
  }
}