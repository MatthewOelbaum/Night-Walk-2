
//function for controlling baddie movements
function BaddieMoveMent(){
    //looping through baddies
     for(let x = 0; x < 16; x++){
         // setting speed
         let speed = getRandom(1, 6);
         //setting behavior
         let behavior = 1;
         //giving a few baddies a "special behavior"
         if(x > 12)
             behavior = 2;
         //if baddies aren't at the end of the screen then they keep moving left.
         if(baddies[x].x > -100){
            baddies[x].x -= speed;
         }
         //otherwise baddies are teleported back to the start, with a random x and y
         else{
          baddies[x].x = getRandom(sceneWidth,  sceneWidth * 4);
         baddies[x].y = getRandom(250, 550);
         
         }
         // if behavior is 1 (basic)
         if(behavior == 1){
             //if baddie y is greater then players, they will try moving downwords
               if(baddies[x].y > player.y){
      baddies[x].y-= 0.6;
        }
            //if baddie y is less then players, they will try moving upwords
        if(baddies[x].y < player.y){
       baddies[x].y+= 0.6;
        }   
         }
         // if behavior is 2 (speacial)
         else if(behavior == 2){
             // baddie isn't right in front of player, they will move slower
             if(  baddies[x].x > hero.x + 75){
                 speed = 1;
            //if baddie y is greater then players, they will try moving downwords
                 if(baddies[x].y > player.y){
                baddies[x].y-= 1.5;
                 }
          //if baddie y is less then players, they will try moving upwords         
               if(baddies[x].y < player.y){
               baddies[x].y+= 2;
              }   
             }
            //if baddie is in front of player they will dash foward
             else{
                 speed = 4;
             }
          }
   }               
}

//function to automatically sort each sprites z-index according to its y value
function SortIndex(){
    //looping through each child of gameScene
    for(let x = 2; x < 20; x++){ 
        //if the child isn't null 
            if(gameScene.children[x] != null){    
                //current holds the current index
                let current = x;
                //while loop sorts through the index
              while(current > 0 && gameScene.children[current - 1].y >=  gameScene.children[current].y){
                //old baddie gets replaced
                let replace = gameScene.children[current - 1];
                gameScene.children[current - 1] =  gameScene.children[current];
                gameScene.children[current] = replace;
                  current--;
            }
        }                
    }
}

//gameLoop function, for the main gameplay
function gameLoop(){
	
	// Calculateing "delta time"
let dt = 1/app.ticker.FPS;
if (dt > 1/7) dt=1/12;
	
      //starting move 
     moveTowards( app.renderer.plugins.interaction.mouse.global);  
    
    //incrementing delay time
    delayTimer++;
    //using delay Time to create a snazzy delay from when baddies attack
    if(delayTimer > 860){  BaddieMoveMent();}       
    
    //using sort index method
    SortIndex();
    
    //using collision method
    Collision();
    
    //updating heo hitbox, so it changes with the sprite
    hitbox.x = hero.x;
     hitbox.y = hero.y + hitbox.height;
    hitbox.height = hero.height/4;
    hitbox.width = hero.width/7;
    
    //looping through and updating all baddies hitboxes
    for(let x = 0; x < 16; x++){
        // setting baddie hitbox position and width/height
        hitboxB[x].x = stalker[x].x - hitboxB[x].width/2;
        hitboxB[x].y = stalker[x].y + hitboxB[x].height/2;
        hitboxB[x].width = stalker[x].width/3;
        hitboxB[x].height = stalker[x].height/2.5;
      //changing the acutal sprite width/height
        stalker[x].width = 1500/2 + (baddies[x].y * 1.5)
         stalker[x].height = stalker[x].width - 100;
    }
    
    // changing player texture/annimation width and height
     hero.width = 1200  + (player.y * 1.5);
    hero.height = hero.width - 300;  
   
    //timer is used to slowly increment the score
    //the timmer and score will only increment if the game starts and when the delay ends
   if(gameScene.visible == true && delayTimer > 860){
       timer++;
       if(timer > 100){
            increaseScoreBy(1); 
           timer = 0;
       } 
   }
    
    //if the gameOverScene is visable main music will stop
    if(gameOverScene.visible == true){
        music.stop();
       
    }
    // if the gameScene is visble then the spooky music will stop
    if(gameScene.visible == true){
        intro.stop();
    }
 
    }

//function that starts the game
function startGame(){
    //hero starts at a set location
    hero.x = 200;
     //sets baddies x at a random location
    for(let x = 0; x < 16; x++){       
       baddies[x].x = getRandom(sceneWidth + 20, sceneWidth * 4);  
    }
    //sets score at 0
   score = 0;
    //setting score label text
 scoreLabel.text = `Score:  ${score}`;
    //set timer to 0
    timer = 0;
    //set gameScene visiblity
    gameScene.visible = true;
    //set startscene visibilty
    startScene.visible = false;
    //set gameOverScene visibilty
    gameOverScene.visible = false;
    //make snazzy game music play
        music.play();
    //set delay timer to 0
    delayTimer = 0;
    
}

//method that controls players movements, based on mouse cordinates
function moveTowards(trackPosition){
    //If player x is greater then the mouse, then it decreses
    if(trackPosition.x < player.x){
        player.x-= 2;
    }
    //if player x is less then the mouse, then it increases
    if(trackPosition.x > player.x){
      player.x+= 2.6;
    }
    //if player y is greater then mouse, then it increases
    if(trackPosition.y - 15 < player.y){
       player.y-= 2.7;
    }
    //if player y is less then mouse, ten it decreases
    if(trackPosition.y - 15 > player.y){
        player.y+= 2.7;
    }
    //Player x can't go under 0
    if(player.x < 0){
      player.x = 0;  
    }
     //Player x can't go over screen width
    if(player.x > sceneWidth){
      player.x = sceneWidth;  
    }
     //Player x can't go under 115
       if(player.y < 115){
      player.y = 115;  
    }
     //Player x can't go over 550
    if(player.y > 550){
      player.y = 550;  
    }
}

//method for creating animated sprites
function createAnimation(x,y,frameWidth,frameHeight, Image, W, H, Frames){
 
    // taking the sprite peices from loadSpriteSheet
    let ani = new PIXI.extras.AnimatedSprite(loadSpriteSheet(Image, W, H, Frames));
    //setting the x and y
   ani.x = x;
     ani.y = y;
    //setting the animation speed
   ani.animationSpeed = 1/7;
    //setting loop
    ani.loop = true;
    //setting the animation to play
    ani.play();
    //return sprite animations
    return ani;
}

//method for detecting collisions
function Collision(){
    //looping through each baddie
    for(let x = 0; x < 16; x++){
        //if the players hitbox and a baddies hitbox collide, then the game ends
        if(rectsIntersect(hitbox,hitboxB[x])){
            //setting game scene to false
          gameScene.visible = false;
            //setting gameOver scene to true
        gameOverScene.visible = true;
            //playing spooky music
             intro.play();
        }
    }
}

//method for loading sprite sheet
function loadSpriteSheet(image, W, H, frames){
    //making sprite sheet from image
    let spriteSheet = PIXI.BaseTexture.fromImage(image);
    //setting width
    let width = W;
    //setting height
    let height = H;
    //setting frames
    let numFrames = frames;
    //array for each sprite
    let textures = [];
    //incrementing through each frame
    for(let i=0;i<numFrames;i++){
        let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i*width,0,width,height));
        textures.push(frame);
    }
    return textures;
}
