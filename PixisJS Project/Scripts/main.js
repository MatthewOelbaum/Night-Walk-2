"use strict";
let container = document.getElementById("Game");

console.log(container);
const app = new PIXI.Application(900,720);
container.appendChild(app.view);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;	

// pre-load the images
PIXI.loader.
add(["images/Sky.png","images/HitBox.png","images/Player.png","images/Stalker.png","images/Block.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)}).
load(setup);

// main app
let stage;
//various game attributes
let score = 0;
let timer = 0;
//game over label
let gameOverScoreLabel = new PIXI.Text(`Final Score:  ${score}`);
//score label
let scoreLabel = new PIXI.Text(`Final Score:  ${score}`);
//start screen variables
let startScene, startButton;
//various attributes
let gameScene,lifeLabel, gameOverScene, player, baddies, hitbox, hitboxB,ground,sky, gameContainer, highScore, delayTimer;
//sound attributes
let music, intro;
//actual sprites of the characters
let hero, stalker;
// high score label
let highScoreLabel = new PIXI.Text(`Final Score:  ${highScore}`);



//setup function
function setup() {
    //setting up app
	stage = app.stage;
    
	//creating start scene
	startScene = new PIXI.Container();
    startScene.visible = true;
    stage.addChild(startScene);
    
	//creating game scene
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    //creating gameover scene
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);
    


// setting up background elements
    
    // setting up a sky texture (for gameScene)
  sky = gameScene.addChild(createAnimation(64,0,64,64,"images/Sky.png", 800, 760, 3));
    sky.width = sceneWidth;
    sky.height = sceneHeight;
    sky.x = 0;
    
        // setting up a sky texture (for startScene)
let sky2 = startScene.addChild(createAnimation(64,0,64,64,"images/Sky.png", 800, 760, 3));
      sky2.width = sceneWidth;
    sky2.height = sceneHeight;
    sky2.x = 0;
    
        // setting up a sky texture (for gameOverScene)
let sky3 = gameOverScene.addChild(createAnimation(64,0,64,64,"images/Sky.png", 800, 760, 3));
      sky3.width = sceneWidth;
    sky3.height = sceneHeight;
    sky3.x = 0;
    
        // setting up a snazzy ground texture
    ground = gameScene.addChild(createAnimation(64,0,64,64,"images/Block.png", 822, 460, 4));
    ground.width = sceneWidth + 347;
    ground.x -= 230;
    ground.height = sceneHeight;
    ground.y -= 50;
    
    //creating buttons and labels
    buttonsAndLabels();
    
    
   
    //create Baddies 
    baddies = [];// array filled with baddies
    stalker = []; // array filled with the actual textures of baddies
    hitboxB = [];// array filled with baddie hitbox
    
    //looping through each baddie array
    for(let x = 0; x < 16; x++){
        //setting up baddie and its location.
        baddies[x] = new Baddie(getRandom(sceneWidth, sceneWidth * 4), getRandom(162, 540));
        //baddie is now visible
        baddies[x].visible = true;
        //appending baddie
        gameScene.addChild(baddies[x]);
        //setting up texture animations
        stalker[x] = baddies[x].addChild(createAnimation(200,0,64,64,"images/Stalker.png", 150, 140, 4))
        //setting anchor for texture
        stalker[x].anchor.set(.5,.5);
        //setting up scale for texture
        stalker[x].scale.set(10);
        //setting up hitbox
        hitboxB[x] = new HitBox();
        //appending up hitbox
        baddies[x].addChild(hitboxB[x]);   
    }
   
  
//creating player elements      

    //creating player
	player = new Player();
    //appending player
    gameScene.addChild(player);
	
    //setting player locations
	 player.x = 300;
   	 player.y = 550;
    //making player visuble
    player.visible = true;
    
    //setting up player texture annimations
    hero =  player.addChild(createAnimation(50,50,64,64,"images/Player.png", 600, 500, 4));
    //setting anchor to texture
    hero.anchor.set(.5,.5);
    //setting scale to texture
    hero.scale.set(3);
    
    //creating player hitbox
    hitbox = new HitBox();
    //appending hitbox
    player.addChild(hitbox);
    
    
// setting various other elements
    
    //setting gameloop
	app.ticker.add(gameLoop);

    //setting score
   score = 0;
    
    //if the local storage score is undefined then the high score starts as 0
	let test = JSON.parse(localStorage.getItem('highScore'));
    if(test != undefined){
        //setting local storage score as  current highscore
        highScore = test;
    }
    else{
        highScore = 0;
    }
    
    //setting game music
    music = new Howl({
	src: ['Music/musicMain.wav']
});
    
    //setting spooky intro music
      intro = new Howl({
	src: ['Music/intro.wav']
});
    //playing intro music
     intro.play();
}


//function for setting buttons and labels
function buttonsAndLabels(){
    // setting button styles
       let buttonStyle = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize: 48,
        fontFamily: "Impact",
         stroke:0xFF0000,
        strokeThickness:3   
    });
    
   //setting start screen label
    let startLabel1 = new PIXI.Text("Night Walk 2!");
    //setting style
    startLabel1.style = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize:96,
        fontFamily:"Impact",
        stroke:0xFF0000,
        strokeThickness:6
    })
    
    //setting start label position
    startLabel1.x = sceneWidth/4 - 50; 
    startLabel1.y = sceneHeight - 520;
    //appending start label
    startScene.addChild(startLabel1);
    

    // setting start screen button
    let startButton  = new PIXI.Text("Start");
    //setting style
    startButton.style = buttonStyle;
    //setting start button positions
    startButton.width = 150;
    startButton.x = sceneWidth/2 - 90;
    startButton.y = sceneHeight - 300;
    
    //setting start button properties
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup",startGame);
    startButton.on('pointerover', e=>e.target.alpha = 0.7);
    startButton.on('pointerout', e=>e.currentTarget.alpha = 1.0);
    
    //appending start button
    startScene.addChild(startButton);
    
    
//setting up gameover labels
    
    //setting up first gameover label
let gameOverText = new PIXI.Text("Game Over!");
    //setting up gameover label style
let textStyle = new PIXI.TextStyle({
        fill: 0x000000,
        fontSize:96,
        fontFamily:"Impact",
        stroke:0xFF0000,
        strokeThickness:6
});
gameOverText.style = textStyle;
    //setting up gameover label positions
gameOverText.x = sceneWidth/4 - 10;
gameOverText.y = sceneHeight - 620;
    //appending gameover label
gameOverScene.addChild(gameOverText);
    
    
//creating new style for gameOverScore label
let textStyle2 = new PIXI.TextStyle({
	fill: 0x000000,
        fontSize:34,
        fontFamily:"Impact",
        stroke:0xFF0000,
        strokeThickness:6
});
gameOverScoreLabel.style = textStyle2;
    
//setting gameOverScoreLabel position
gameOverScoreLabel.x = sceneWidth/4 + 120;
gameOverScoreLabel.y = sceneHeight - 420;
    //appending gameOverScore Label
gameOverScene.addChild(gameOverScoreLabel);
    
    //if the highscore is undifined then it equals 0
    if(highScore == undefined){
        highScore = 0;    
    }  
    
    //setting highscore label
 highScoreLabel.text = (`High Score:  ${highScore}`);
    //setting highscore label style
highScoreLabel.style = textStyle2;
    //setting highscore label position
highScoreLabel.x = sceneWidth/4 + 120;
highScoreLabel.y = sceneHeight - 320;
    //appending highscore label
gameOverScene.addChild(highScoreLabel);
    

// setting up replay button
let playAgainButton = new PIXI.Text("Play Again?");
    //setting replay button style
playAgainButton.style = buttonStyle;
    //setting replay button position
playAgainButton.x =  sceneWidth/4 + 100;
playAgainButton.y = sceneHeight - 200;
    //setting replay button properties
playAgainButton.interactive = true;
playAgainButton.buttonMode = true;
playAgainButton.on("pointerup",startGame); 
playAgainButton.on('pointerover',e=>e.target.alpha = 0.7); 
playAgainButton.on('pointerout',e=>e.currentTarget.alpha = 1.0); 
    //appending replay button
gameOverScene.addChild(playAgainButton);
    
    
    //setting up style for score label
 let scoreStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 18,
        fontFamily: "Impact",
        stroke:  0xFF0000,
        strokeThickness: 4
    });

    //setting up scoreLabel style
    scoreLabel.style = scoreStyle ;
    //setting scoreLabel position
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    //appending score Label
    gameScene.addChild(scoreLabel);    
}

//function for increasing score value
function increaseScoreBy(value){
    //incrementing score by value
    score += value;
    //changing score label text, to fit score
    scoreLabel.text = `Score:  ${score}`;
    //changing score label text, to fit high score
    gameOverScoreLabel.text =(`Final Score:  ${score}`);
    //if highscore is undefined it equals 0
   if(highScore == undefined){
        highScore = 0; 
    }  
    // if highscore is less then score, then the highscore changes
    if(score > highScore ){
        highScore = score;           
    }
    //changing highscore text to fit its changes
    highScoreLabel.text = (`High Score:  ${highScore}`);
    //saving highscore into local storage
   localStorage.setItem('highScore', JSON.stringify(highScore));
}
 

