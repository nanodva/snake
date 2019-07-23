class Score {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;   // font size
    this.value = 0;     // score counter
  }
  draw() {
    arena.context.fillStyle = this.color;
    arena.context.font = this.size + "px Arial";
    arena.context.fillText(this.value, 50, 50);
  }
}