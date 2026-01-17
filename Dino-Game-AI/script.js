//GAME CODE
const display = document.querySelector("canvas");
const ctx = display.getContext("2d");
var currentFrame = 0;
var iteration = 1;
var timeout = false;
difficultyLevel = 300; //chances of object spawning goes down over time
var player = [];
var object = [];
const birdFrames = ["Bird_1.png", "Bird_2.png"];
const dinoFrames = ["Dino_1.png", "Dino_2.png"];


const playerImg = new Image();
playerImg.src = dinoFrames[currentFrame];
const cactusImg = new Image();
cactusImg.src = "Cactus.png";
const birdImg = new Image();
birdImg.src = birdFrames[currentFrame];

class Player {
  #brain;
  #timeSurvived;
  #alive;
  #y;
  #x;
  #yVel;
  #canvasHeight;

  constructor(name = "none") {
    this.name = name;
    this.#brain = new Brain(); //brain carries over previous assets - null = new brain assets
    this.#canvasHeight = 808; 
    this.#timeSurvived = 0;
    this.#alive = true;
    this.#y = this.#canvasHeight - 91;
    this.#x = 10;
    this.#yVel = 0;
  }

  getY() {return this.#y;}
  getAlive() {return this.#alive;}
  getTime() {return this.#timeSurvived;}

  //get assets from brain, functions are same name in brain as they are here
  getCactusJumpDistance() {return this.#brain.getCactusJumpDistance();}
  getTierOneJump() {return this.#brain.getTierOneJump();}
  getTierOneJumpDistance() {return this.#brain.getTierOneJumpDistance();}
  getTierTwoJump() {return this.#brain.getTierTwoJump();}
  getTierTwoJumpDistance() {return this.#brain.getTierTwoJumpDistance();}
  getTierThreeJump() {return this.#brain.getTierThreeJump();}
  getTierThreeJumpDistance() {return this.#brain.getTierThreeJumpDistance();}

  incrimentTime() {this.#timeSurvived++;}

  jump() {
    if (this.#y != this.#canvasHeight - 91) {return;}
    this.#yVel = -30;
    this.#y = this.#canvasHeight - 92;
  }

  move() {
    if (this.#y >= this.#canvasHeight - 91) {this.#y = this.#canvasHeight - 91; this.#yVel = 0;}
    this.#y += this.#yVel;
    this.#yVel += 1;
    this.collisionCheck();
  }

  collisionCheck() {
    for (let i = 0; i < object.length; i++) {
      if (object[i] == 0) {continue;}

      if (
        //Cactus Collisions
         (((this.#x >= object[i].getX() && this.#x <= object[i].getX() + 30 && object[i].type == "cactus") ||
         (this.#x + 40 >= object[i].getX() && this.#x + 40 <= object[i].getX() + 30 && object[i].type == "cactus")) &&
         ((this.#y >= object[i].getY() && this.#y <= object[i].getY() + 30) && object[i].type == "cactus" ||
         (this.#y + 40 >= object[i].getY() && this.#y + 40 <= object[i].getY() + 30 && object[i].type == "cactus"))) ||
        //Bird Collisions
         (((this.#x >= object[i].getX() && this.#x <= object[i].getX() + 50 && (object[i].type == "t1" || object[i].type == "t2" || object[i].type == "t3") ||
         (this.#x + 40 >= object[i].getX() && this.#x + 40 <= object[i].getX() + 50 && (object[i].type == "t1" || object[i].type == "t2" || object[i].type == "t3"))) &&
         ((this.#y >= object[i].getY() && this.#y <= object[i].getY() + 40) && (object[i].type == "t1" || object[i].type == "t2" || object[i].type == "t3") ||
         (this.#y + 40 >= object[i].getY() && this.#y + 40 <= object[i].getY() + 40 && (object[i].type == "t1" || object[i].type == "t2" || object[i].type == "t3")))))
         ) {
        this.#alive = false;
      }
    }
  }
}
class Brain {
  #CactusJumpDistance;
  #tierOneJump;
  #tierOneJumpDistance;
  #tierTwoJump;
  #tierTwoJumpDistance;
  #tierThreeJump;
  #tierThreeJumpDistance;

  constructor(cactusJumpDelay = 0, t1Jump = false, t1JumpDelay = 0, t2Jump = false, t2JumpDelay = 0, t3Jump = false, t3JumpDelay = 0, original = 0) {
    if (cactusJumpDelay == 0) {
      this.#makeBrain();
    } else {
      this.#CactusJumpDistance = cactusJumpDelay;
      this.#tierOneJump = t1Jump;
      this.#tierOneJumpDistance = t1JumpDelay;
      this.#tierTwoJump = t2Jump;
      this.#tierTwoJumpDistance = t2JumpDelay;
      this.#tierThreeJump = t3Jump;
      this.#tierThreeJumpDistance = t3JumpDelay;
      if (original == 0){this.#mutate();} //only mutate if it's a child
    }
  }

  getCactusJumpDistance() {return this.#CactusJumpDistance;}
  getTierOneJump() {return this.#tierOneJump;}
  getTierOneJumpDistance() {return this.#tierOneJumpDistance;}
  getTierTwoJump() {return this.#tierTwoJump;}
  getTierTwoJumpDistance() {return this.#tierTwoJumpDistance;}
  getTierThreeJump() {return this.#tierThreeJump;}
  getTierThreeJumpDistance() {return this.#tierThreeJumpDistance;}

  #makeBrain() {
    //Jump distances?
    this.#CactusJumpDistance = getRandomNumber(1, 70) * 5;
    this.#tierOneJumpDistance = getRandomNumber(1, 70) * 5;
    this.#tierTwoJumpDistance = getRandomNumber(1, 70) * 5;
    this.#tierThreeJumpDistance = getRandomNumber(1, 70) * 5;

    //Do they jump?
    this.#tierOneJump = getRandomNumber(0, 1);
    if (this.#tierOneJump == 1) {this.#tierOneJump = true;} else {this.#tierOneJump = false;}
    this.#tierTwoJump = getRandomNumber(0, 1);
    if (this.#tierTwoJump == 1) {this.#tierTwoJump = true;} else {this.#tierTwoJump = false;}
    this.#tierThreeJump = getRandomNumber(0, 1);
    if (this.#tierThreeJump == 1) {this.#tierThreeJump = true;} else {this.#tierThreeJump = false;}
  }

  #mutate() {
    //distance modified by (-5 < x < 5)
    this.#CactusJumpDistance = this.#modify(this.#CactusJumpDistance);
    this.#tierOneJumpDistance = this.#modify(this.#tierOneJumpDistance);
    this.#tierTwoJumpDistance = this.#modify(this.#tierTwoJumpDistance);
    this.#tierThreeJumpDistance = this.#modify(this.#tierThreeJumpDistance);

    
    //do they jump
    let rndOne = getRandomNumber(0, 20);
    let rndTwo = getRandomNumber(0, 20);
    let rndThree = getRandomNumber(0, 20);

    //5% chance to change whether or not it jumps -> means more iterations to perfect it
    if (rndOne == 20) {
      if (this.#tierOneJump == true) {this.#tierOneJump = false;}
      else {this.#tierOneJump = true;}
    } //else don't modify

    if (rndTwo == 20) {
      if (this.#tierTwoJump == true) {this.#tierTwoJump = false;}
      else {this.#tierTwoJump = true;}
    } //else don't modify

    if (rndThree == 20) {
      if (this.#tierThreeJump == true) {this.#tierThreeJump = false;}
      else {this.#tierThreeJump = true;}
    } //else don't modify
    

    
  }

  #modify(item) {
    let alter = getRandomNumber(0,1);
    let change = getRandomNumber(0,20);

    if (change < 7) {change = 0;}
    else if (change < 12) {change = 5;}
    else if (change < 17) {change = 10;}
    else {change = 15;}

    if (alter == 0) {alter = -1;}
    
    return item + change * alter;
  }
}
class Cactus {
  #x;
  #canvasHeight;
  
  constructor() {
    this.type = "cactus";
    this.width = 40;
    this.height = 40;
    this.#x = 1440;
    this.#canvasHeight = 808;
  }

  getX() {return this.#x;}
  getY() {return this.#canvasHeight - 91;}

  move() {
    this.#x -= 5;
  }
} 
class Bird {
  #x;
  #y;
  #canvasHeight;
  constructor() {
    this.#x = 1440;
    this.type = "bird";
    this.width = 50;
    this.height = 40;
    this.#canvasHeight = 808;
    this.#y = this.#setHeight();
  }

  getX() {return this.#x;}
  getY() {return this.#y;}

  #setHeight() {
    let height = getRandomNumber(0, 2);
    let newY = 0
    switch (height) {
      case 0: newY = 260; this.type = "t1"; break;
      case 1: newY = 520; this.type = "t2"; break;
      case 2: newY = 700; this.type = "t3"; break;
    }
    return newY;
  }
  
  move() {
    this.#x -= 5;
  }
} 

initialize();

let alive = setInterval(() => {
  if (allDead()) {regenerate();}
  
  update();
  spawnObject();
  
  //checks for closest object's type and x position
  let activeObjectsX = [];
  let activeObjectsType = [];
  let focusObjectX = -1;
  let focusObjectType = -1;

  //check for closest object
  for (let n = 0; n < object.length; n++) {
    if (object[n] == 0) {continue;}
    activeObjectsX.push(object[n].getX());
    activeObjectsType.push(object[n].type);
  }

  if (activeObjectsX.length >= 1) {
    focusObjectX = Math.min(...activeObjectsX);
    focusObjectType = activeObjectsType[activeObjectsX.indexOf(focusObjectX)];
  }
  
  //Move player and check if jump necessary
  for (let i = 0; i < player.length; i++) {
    if (!player[i].getAlive()) {continue;}
    
  //Jump checks
    if (focusObjectType != -1 && focusObjectType == "cactus" && player[i].getCactusJumpDistance() >= focusObjectX) {
      player[i].jump();
    } else if (focusObjectType != -1 && focusObjectType == "t1" && player[i].getTierOneJump() && player[i].getTierOneJumpDistance() >= focusObjectX) {
      player[i].jump();
    } else if (focusObjectType != -1 && focusObjectType == "t2" && player[i].getTierTwoJump() && player[i].getTierTwoJumpDistance() >= focusObjectX) {
      player[i].jump();
    } else if (focusObjectType != -1 && focusObjectType == "t3" && player[i].getTierThreeJump() && player[i].getTierThreeJumpDistance() >= focusObjectX) {
      player[i].jump();
    }

    
    //move player
    player[i].move();
    player[i].incrimentTime();
    
  }

  for (let i = 0; i < object.length; i++) {
    if (object[i] == 0) {continue;}
    object[i].move();
  }
}, 10);

let animate = setInterval(() => {
  if (currentFrame == 0) {
    currentFrame = 1;
    birdImg.src = birdFrames[currentFrame];
    playerImg.src = dinoFrames[currentFrame];
  } else if (currentFrame == 1) {
    currentFrame = 0;
    birdImg.src = birdFrames[currentFrame];
    playerImg.src = dinoFrames[currentFrame];
  }
}, 250);

function update() {
  ctx.clearRect(0,0,display.width, display.height);

  //LINE OF JUMP HEIGHT, PLAYER CAN JUMP UP TO 255 Y IN ONE JUMP
  ctx.beginPath();
  ctx.moveTo(0, 255);
  ctx.strokeStyle = "red";
  ctx.lineTo(display.width, 255);
  ctx.stroke();
  ctx.closePath();

  

  for (let i = 0; i < player.length; i++) {
    if (!player[i].getAlive()) {continue;}
    player[i].move();
    ctx.beginPath();
    ctx.drawImage(playerImg, 10, player[i].getY(), 40, 40);
    ctx.fill();
    ctx.closePath();

    ctx.font = "bold 18px serif";
    ctx.fillText(`Time Survived: ${player[i].getTime()}`, 10, 20);
    difficultyIncrease(player[i].getTime());
  }
  
  ctx.font = "bold 18px serif";
  ctx.fillText(`Iteration: ${iteration}`, 10, 40);
  if (iteration >= 2) {ctx.fillText(`Lineage of ${player[1].name}`, 10, 60);}

  for (let i = 0; i < object.length; i++) {
    if (object[i] == 0) {continue;}
    if (object[i].getX() + 20 < 0) {object[i] = 0; continue;}
    let imgSource;
    if (object[i].type == "cactus") {imgSource = cactusImg;}
    else if (object[i].type == "t1" || object[i].type == "t2" || object[i].type == "t3") {imgSource = birdImg;}
    
    
    ctx.beginPath();
    ctx.drawImage(imgSource, object[i].getX(), object[i].getY(), object[i].width, object[i].height);
    ctx.fill();
    ctx.closePath();

    
    //SHOW HITBOXES
    ctx.beginPath();
    ctx.moveTo(object[i].getX(), object[i].getY());
    ctx.lineTo(object[i].getX() + object[i].width, object[i].getY());
    ctx.lineTo(object[i].getX() + object[i].width, object[i].getY() + object[i].height);
    ctx.lineTo(object[i].getX(), object[i].getY() + object[i].height);
    ctx.lineTo(object[i].getX(), object[i].getY());
    ctx.stroke();
    ctx.closePath(); 
  }

  ctx.beginPath();
  ctx.fillStyle = "#525252";
  ctx.fillRect(0, display.height - 50, display.width, 50);
  ctx.fill();
  ctx.closePath();
}
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function spawnObject() {
  let rnd = getRandomNumber(0, difficultyLevel);

  if (object[0] != 0 && object[1] != 0 && object[2] != 0) {return;} //no active slots
  if (timeout) {return;}

  if (rnd == 0) {
    for (let i = 0; i < object.length; i++) {
      if (object[i] == 0) {
        object[i] = new Cactus();
        timeout = true;
        setTimeout(() => {timeout = false;}, 100);
        break;
      }
    }
  } else if (rnd == 1) {
    for (let i = 0; i < object.length; i++) {
      if (object[i] == 0) {
        object[i] = new Bird();
        timeout = true;
        setTimeout(() => {timeout = false;}, 100);
        break;
      }
    }
  }
}
function allDead() {
  let dead = true;
  
  for (let i = 0; i < player.length; i++) {
    if (player[i].getAlive()) {dead = false;}
  }
  return dead;
}
function initialize(cactusJumpDelay = 0, t1Jump = false, t1JumpDelay = 0, t2Jump = false, t2JumpDelay = 0, t3Jump = false, t3JumpDelay = 0, name = "none") {
  object = [0, 0, 0];

  if (name == "none") {
    player = [
      new Player("Corkle", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("Winnie", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("Ice Spice", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("Violet", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("Tim McIlrath", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("Spart", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("Goob", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("Lemon Boy", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("Striker Stronghammer", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("BlackBeard", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("HAX0R", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("John Baylor", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("Your Next Door Neighbor", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("A Man Named Dan", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player("Nicholas Cage", cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay)
    ];
  } else {
    player = [
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay, 1), //does not get mutated
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay),
      new Player(name, cactusJumpDelay, t1Jump, t1JumpDelay, t2Jump, t2JumpDelay, t3Jump, t3JumpDelay)
    ];
  }
  
}
function regenerate() {
  iteration++;
  let playerTimes = [];

  for (let i = 0; i < player.length; i++) {
    playerTimes.push(player[i].getTime());
  }

  //all are the same -> takes 0's attributes
  if (Math.max(...playerTimes) == Math.min(...playerTimes) && iteration >= 5) {
    initialize(
      player[0].getCactusJumpDistance(),
      player[0].getTierOneJump(),
      player[0].getTierOneJumpDistance(),
      player[0].getTierTwoJump(),
      player[0].getTierTwoJumpDistance(),
      player[0].getTierThreeJump(),
      player[0].getTierThreeJumpDistance(),
      player[0].name);
    return;
  } else {
    hardReset();
  }

  //Finding most fit for mutation
  let index = playerTimes.indexOf(Math.max(...playerTimes));
  initialize(
    player[index].getCactusJumpDistance(),
    player[index].getTierOneJump(),
    player[index].getTierOneJumpDistance(),
    player[index].getTierTwoJump(),
    player[index].getTierTwoJumpDistance(),
    player[index].getTierThreeJump(),
    player[index].getTierThreeJumpDistance(),
    player[index].name);
}
function difficultyIncrease(time) {
  if (time < 1000) {difficultyLevel = 300;}
  else if (time < 2000) {difficultyLevel = 250;}
  else if (time < 3000) {difficultyLevel = 200;}
  else if (time < 4000) {difficultyLevel = 150;}
  else if (time < 5000) {difficultyLevel = 100;}
  else if (time < 6000) {difficultyLevel = 50;}
  else if (time > 7000) {difficultyLevel = 5;}
}
function hardReset() {//hard resets, callable from conosle
  initialize();
}
