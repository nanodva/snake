class Game {
  constructor() {
    this._status = "initializing";
    // time beetween two draw refresh in ms
    this.refresh_rate = 10
  }
  get status() {
    return this._status;
  }
  start(speed) {
    // game speed 
    this.speed = speed;
    this.framecount = 0;
    this.score = 0;
  
    // main routine
    this.loop = setInterval(this.mainloop, this.refresh_rate);
    this._status = "running";
  }
  stop() {
    clearInterval(this.loop);
  }
  mainloop() {
    // ! this is an external call
    // "this" doesn't exist here
    // and must be called by its variable name

    game.framecount++;
    update_debug_data();
    // if ((arena.frame % game_speed) == 0) {
    if ((game.framecount % game.speed) == 0) {
      arena.draw(); 
      worm.move();
      apple.draw();
      worm.draw();
      score.draw();
      worm.test_collision();
    }
  }
}



