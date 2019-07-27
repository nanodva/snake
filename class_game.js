class Game {
  constructor(speed) {
    this._status = "initializing";
    // time beetween two draw refresh in ms
    this.refresh_rate = 10
    this.speed = speed;
  }
  get status() {
    return this._status;
  }
  get is_running() {
    if (this._status == "running") {
      return true;
    } else {
      return false;
    }
  }
  get is_over() {
    if (this._status == "stopped") {
      return true;
    } else {
      return false;
    }
  }
  reset() {
    this.framecount = 0;
    this.imagecount = 0;
    this.score = 0;
    this._status = "ready";
  }
  
  start() {
    // main routine
    this.loop = setInterval(this.mainloop, this.refresh_rate);
    this._status = "running";
  }
  
  stop() {
    clearInterval(this.loop);
    this._status = "stopped";
    game_over
  }
  mainloop() {
    // ! this is an external call
    // "this" doesn't exist here
    // and must be called by its variable name

    //reel frames count
    game.framecount++;
    // division for game speed, game frames count
    var frame = game.framecount % game.speed;
    if (frame == 0) {
      game.imagecount++;
      var mod = game.imagecount % movediv;
      console.log("new image: ", game.imagecount, " mod: ", mod);
    
      if ((game.imagecount % movediv) == 0) {
      // if ((game.imagecount % movediv) == movediv) {
        worm.move();
        console.log("new move");
        if (worm.test_collision()) {
          worm.died();
          game_over();
        }
      }
    }
    arena.draw(); 
    apple.draw();
    worm.draw();
    score.draw();
    update_debug_data();
  }
}



