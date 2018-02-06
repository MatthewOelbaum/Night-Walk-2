
//My class for setting up the player character
class Player extends PIXI.Sprite{
   constructor(x=0,y=0){
    super();
        this.anchor.set(.5,.5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
    }
}
//My class for setting up the base of each baddie 
class Baddie extends PIXI.Sprite{
   constructor(x=0,y=0){
    super();
        this.anchor.set(.5,.5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
    }
}

//My class for setting up the base of each hitbox
class HitBox extends PIXI.Sprite{
   constructor(){
    super();
        this.anchor.set(.5,.5);
        this.scale.set(0.2);
    }
}
