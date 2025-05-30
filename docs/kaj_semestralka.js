const pet = document.getElementById("pet");
const status = document.getElementById("status");
let title = document.getElementById("title");

//for making adding more pets in future easier
const petFoods = {
  '🐶': 'maso',
  '🐱': 'ryba',
  '🐰': 'mrkev'
};

let typeOfPetFood;


const petEatingSounds = {
  '🐶': 'doggo_eating.mp3',
  '🐱': 'kitten_eating.mp3',
  '🐰': 'bunny_bite_01.mp3'
};
let petEatingSound;

let isPetted = false;
let nickname = localStorage.getItem("nickname") || "nobody";

let isPetting =false;
const form = document.getElementById("form");

const gameArea = document.getElementById('game-area');


let currentState = "default";
let hungerLevel = 0;
let sleepLevel = 0;
let happinessLevel = 0;

let feedingGameRunning = false;
let feedingGameInterval;

let sleepInterval;

const lullaby = new Audio("lullaby.mp3");
lullaby.volume = 0.2;

let isOnline = true;

const offlineMessage = document.createElement('div');
offlineMessage.id = 'offline-message';
document.body.appendChild(offlineMessage);


const indexCenter = document.getElementById("index-center");

let unicornInterval;

let unicornsRunning = false;




//starts feeding game, reaction for button
function feedPet() {
  if(!isOnline) return;
  if (feedingGameRunning) endGame();
  if(hungerLevel == 100){
    status.textContent = "Your pet is full right now";
  }else{ 
  wakeUp();
  pet.classList.remove("pet-default");
  pet.classList.add("pet-game");

  startGame();


  currentState = "eating";
  status.textContent = "Use the arrow keys or your finger to catch the falling food.";
  }
}
//enables petting function
function playPet() {
  if(!isOnline) return;

  wakeUp();
  if (feedingGameRunning) endGame();
  currentState = "playing";
  status.textContent = "Swipe or move the mouse over the pet";
  
}

//puts pet into sleep
function sleepPet() {
  if(!isOnline) return;
  wakeUp();
  if (feedingGameRunning) endGame();
  sleep();
  currentState = "sleeping";
  status.textContent = "💤💤💤💤";
}
//status ganges after starting petting process
function pettingStatus(){
    status.textContent = "💕💕💕💕";
}

// state before user clicks any button
function defaultStatus(){
  currentState = "dafeault";
  status.textContent = "Your pet was waiting for you. 💕";
}

// save state into localStorage
function saveState() {
  if(!isOnline){
    return;
  }
  const data = {
    time: Date.now(),
    happiness: happinessLevel,
    hunger: hungerLevel,
    sleep: sleepLevel,
  };
  localStorage.setItem(`petState_${nickname}`, JSON.stringify(data));
}
  


  if (pet && status) {
    pet.classList.add("pet-default");
    defaultStatus();
    slowLoweringOfStats();
    loadState();
  
    // listeners for petting:
    document.addEventListener("mousedown", () => {
      isPetting = true;
    });
    document.addEventListener("mouseup", () => {
      isPetting = false;
    });
    document.addEventListener("mousemove", (e) => {
      if (isPetting) {
        handlePetting(e.clientX, e.clientY);
      }
    });
    
    document.addEventListener("touchstart", () => {
      isPetting = true;
    });
    document.addEventListener("touchend", () => {
      isPetting = false;
    });
    document.addEventListener("touchmove", (e) => {
      if (isPetting && e.touches.length > 0) {
        const touch = e.touches[0];
        handlePetting(touch.clientX, touch.clientY);
      }
    });

      //loading states from local storage
    function loadState() {
      if(!isOnline) return;
  
      loadOrChoosePet();
  
      title.textContent = `${nickname}'s pet 🐾`;
  
  
      const saved = JSON.parse(localStorage.getItem(`petState_${nickname}`));
      if (saved) {
        if (saved) {
  
          //  stats are lowering even when player is not with their pet
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - saved.time) / 1000);
      
          const hungerDecayPerSec = 0.2;
          const sleepDecayPerSec = 0.05;
          const happinessDecayPerSec = 0.1;
      
          hungerLevel = Math.max(0, saved.hunger - hungerDecayPerSec * elapsedSeconds);
          sleepLevel = Math.max(0, saved.sleep - sleepDecayPerSec * elapsedSeconds);
          happinessLevel = Math.max(0, saved.happiness - happinessDecayPerSec * elapsedSeconds);
      
        } else {
          hungerLevel = 0;
          sleepLevel = 0;
          happinessLevel = 0;
        }
       
      }
      updateDisplay();
    }
  }


 
    
    // function for petting
    function handlePetting(x, y) {
      const rect = pet.getBoundingClientRect();
      const isInside =
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom;

      if(currentState === "playing" && isInside){ 
        happinessLevel +=0.05;
        if(happinessLevel >=100){
          happinessLevel = 100;
        }
        updateDisplay();
      pettingStatus();
      }
    }
  
    
    document.addEventListener("DOMContentLoaded", loadState);

    //update for everiting thats changing
    function updateDisplay() {
      if (document.getElementById("hungerLevel"))
        document.getElementById("hungerLevel").textContent = `${Math.round(hungerLevel)} %`;
      if (document.getElementById("happinessLevel"))
        document.getElementById("happinessLevel").textContent = ` ${Math.round(happinessLevel)} %`;
      if (document.getElementById("sleepLevel"))
        document.getElementById("sleepLevel").textContent = `${Math.round(sleepLevel)} %`;
      if(!(hungerLevel==0 && happinessLevel==0 && sleepLevel == 0)){
      saveState();
    }

    }
  
  // form handeling
  if(form){
    form.addEventListener("submit", logSubmit);
  }
  function logSubmit(event) {
    event.preventDefault();
    nickname = document.getElementById("nickname").value;
    localStorage.setItem("nickname", nickname);
    window.location.href = "kaj_semestralka.html";
  }


  //feeding game without svg just in case svg version is not wotking

  function createFood() {
    const food = document.createElement("div");
    food.classList.add("food");
    food.textContent = "🍗"; 
    food.style.left = `${Math.random() * window.innerWidth}px`;
    document.body.appendChild(food);
  
    let top = 0;
    const fall = setInterval(() => {
      fallingSeed = Math.floor(Math.random() * 9) +1;
      top += fallingSeed;
      food.style.top = `${top}px`;
  
      const petRect = pet.getBoundingClientRect();
      const foodRect = food.getBoundingClientRect();
  
      if (
        foodRect.bottom >= petRect.top &&
        foodRect.left < petRect.right &&
        foodRect.right > petRect.left
      ) {

        clearInterval(fall);
        food.remove();
        hungerLevel+= fallingSeed/2;
           
        if(hungerLevel>=100){
          hungerLevel =100;
          endGame();
        }
        updateDisplay();
      }
  
      if (top +100 > window.innerHeight) {
        clearInterval(fall);
        food.remove();
      }
    }, 16);
  }
  // end of just in case code.



//starts feeding game
  function startGame() {
    feedingGameRunning = true;

    startGameWithSVG();
    movePet();


  }

 //ends feeding game
  function endGame(){
   
    feedingGameRunning = false;
    clearInterval(feedingGameInterval);
    document.getElementById("game-area").style.display = "none";
    

      
    pet.classList.remove("pet-game");
    pet.classList.add("pet-default");
    
  }

  //contoling the feeding game by arrows or finger

  function movePet(){
    const gameAreaRect = gameArea.getBoundingClientRect();

    let petRect= pet.getBoundingClientRect();
    let petX = pet.offsetLeft;
    let petWidthHalfed = pet.offsetWidth/4;


    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") petX -= 30;
      if (e.key === "ArrowRight") petX += 30;
      if(petX > (gameAreaRect.left + petWidthHalfed) && petX < (gameAreaRect.right-petWidthHalfed)){  
      pet.style.left = `${petX}px`;
      }
    });

    document.addEventListener("touchmove", (e) => {
      e.preventDefault();

      const touch = e.touches[0];
      const x = touch.clientX;
      if(x > (gameAreaRect.left + petWidthHalfed) && x<(gameAreaRect.right-petWidthHalfed)){
      pet.style.left = `${x}px`;
      }
    }, {passive:false});
  }


//function for going to sleep and plays lullaby
  function sleep(){
    lullaby.play();
    lullaby.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
    }, false);
    document.getElementById("sleep-dim").style.display = "block";
    sleepInterval = setInterval(() => {
      sleepLevel++;
      if (sleepLevel > 100) sleepLevel = 100;
      updateDisplay();
    }, 1000);

  }

  // function to stop sleeping
  function wakeUp(){
    lullaby.pause();
    lullaby.currentTime = 0;
    document.getElementById("sleep-dim").style.display = "none";
    clearInterval(sleepInterval);

  }


//stats are lowering every second
  function slowLoweringOfStats(){
     setInterval(() => {
      if(currentState != "sleeping")
        sleepLevel-= 0.05;
      if(currentState!= "eating")
        hungerLevel-=0.2;
      if(currentState !="playing")
        happinessLevel-=0.1;
      if (sleepLevel <= 0) sleepLevel = 0;
      if (hungerLevel <= 0) hungerLevel = 0;
      if (happinessLevel <= 0) happinessLevel = 0;

      updateDisplay();
    }, 1000);
  }

  //if nickname doesnt have pet he needs to choose one
  function loadOrChoosePet(){ 
  let savedPet = localStorage.getItem(`petEmoji_${nickname}`);
  if (!savedPet) {
    const table =document.getElementById("pet-selector");

    document.getElementById("pet-selected").style.display = "none";

    //responsibility, on phone it looks mutch better with display block

    if(window.innerWidth>600){ 
    table.style.display = "inline-block";

    } else{
      table.style.display = "inline-block";
      const tds = document.getElementsByTagName('td');
      for (let td of tds) {
        td.style.display = "block";
        td.style.padding = 0;
      }
      document.body.style.overflow = "auto";
    }

    if(!document.getElementById("instruction-label")){
    const label = document.createElement('div');
    label.id ="instruction-label";
    label.appendChild(document.createTextNode(`Choose yout pet, ${nickname} 🐾`));
    document.body.insertBefore(label, table);
    }

    pet.style.display = "none";
    return;
  } else {
    pet.textContent = savedPet;
    pet.style.display = "inline-block";
  }


  typeOfPetFood = petFoods[pet.textContent];
  petEatingSound = new Audio(petEatingSounds[pet.textContent]);


}


// saving emoji into localStorage after pet was selected
function selectPet(emoji) {
  localStorage.setItem(`petEmoji_${nickname}`, emoji);
  pet.textContent = emoji;
  pet.style.display = "inline-block";
  document.getElementById("pet-selector").style.display = "none";
  document.getElementById("pet-selected").style.display = "block";
  document.getElementById("instruction-label").style.display = "none";

  document.body.style.overflow = "hidden";
  loadState(); 
}

//craeting food with SVG
function createSVGFood(type) {
  const svgNS = "http://www.w3.org/2000/svg";
  const food = document.createElementNS(svgNS, "g");

  if (type === "mrkev") {

  //carrot for bunny
    const body = document.createElementNS(svgNS, "polygon");
    body.setAttribute("points", "10,30 0,0 20,0"); 
    body.setAttribute("fill", "orange");

    const leaf1 = document.createElementNS(svgNS, "line");
    leaf1.setAttribute("x1", "10");
    leaf1.setAttribute("y1", "0");
    leaf1.setAttribute("x2", "5");
    leaf1.setAttribute("y2", "-15");
    leaf1.setAttribute("stroke", "green");
    leaf1.setAttribute("stroke-width", "3");

    const leaf2 = document.createElementNS(svgNS, "line");
    leaf2.setAttribute("x1", "10");
    leaf2.setAttribute("y1", "0");
    leaf2.setAttribute("x2", "15");
    leaf2.setAttribute("y2", "-15");
    leaf2.setAttribute("stroke", "green");
    leaf2.setAttribute("stroke-width", "3");

    food.appendChild(body);
    food.appendChild(leaf1);
    food.appendChild(leaf2);

  } else if (type === "ryba") {

    // Fish for cat
    const body = document.createElementNS(svgNS, "path");
    body.setAttribute("d", "M -20,0 Q 0,-10 15,0 Q 0,10 -20,0 Z");
    body.setAttribute("fill", "lightblue");
    body.setAttribute("stroke", "darkblue");

    const tail = document.createElementNS(svgNS, "path");
    tail.setAttribute("d", "M 15,0 L 30,-10 L 30,10 Z");
    tail.setAttribute("fill", "darkblue");

    const eye = document.createElementNS(svgNS, "circle");
    eye.setAttribute("cx", "-10");
    eye.setAttribute("cy", "-1");
    eye.setAttribute("r", "1.5");
    eye.setAttribute("fill", "black");

    food.appendChild(body);
    food.appendChild(tail);
    food.appendChild(eye);

  } else {
    // bone for dog
      const bone = document.createElementNS(svgNS, "g");

       const middleBone2 = document.createElementNS(svgNS, "rect");
       middleBone2.setAttribute("x", "-13");
       middleBone2.setAttribute("y", "-3");
       middleBone2.setAttribute("width", "26");
       middleBone2.setAttribute("height", "6");
       middleBone2.setAttribute("rx", "2");
       middleBone2.setAttribute("stroke", "#000");
       middleBone2.setAttribute("stroke-width", "1");
       bone.appendChild(middleBone2);

      const leftEndTop = document.createElementNS(svgNS, "circle");
      leftEndTop.setAttribute("cx", "-15");
      leftEndTop.setAttribute("cy", "-5");
      leftEndTop.setAttribute("r", "5");
      leftEndTop.setAttribute("fill", "#F5F5DC");
      leftEndTop.setAttribute("stroke", "#000");
      leftEndTop.setAttribute("stroke-width", "1");
      bone.appendChild(leftEndTop);

      const leftEndBottom = document.createElementNS(svgNS, "circle");
      leftEndBottom.setAttribute("cx", "-15");
      leftEndBottom.setAttribute("cy", "5");
      leftEndBottom.setAttribute("r", "5");
      leftEndBottom.setAttribute("fill", "#F5F5DC");
      leftEndBottom.setAttribute("stroke", "#000");
      leftEndBottom.setAttribute("stroke-width", "1");
      bone.appendChild(leftEndBottom);

      const rightEndTop = document.createElementNS(svgNS, "circle");
      rightEndTop.setAttribute("cx", "15");
      rightEndTop.setAttribute("cy", "-5");
      rightEndTop.setAttribute("r", "5");
      rightEndTop.setAttribute("fill", "#F5F5DC");
      rightEndTop.setAttribute("stroke", "#000");
      rightEndTop.setAttribute("stroke-width", "1");
      bone.appendChild(rightEndTop);

      const rightEndBottom = document.createElementNS(svgNS, "circle");
      rightEndBottom.setAttribute("cx", "15");
      rightEndBottom.setAttribute("cy", "5");
      rightEndBottom.setAttribute("r", "5");
      rightEndBottom.setAttribute("fill", "#F5F5DC");
      rightEndBottom.setAttribute("stroke", "#000");
      rightEndBottom.setAttribute("stroke-width", "1");
      bone.appendChild(rightEndBottom);

      const leftConnector = document.createElementNS(svgNS, "rect");
      leftConnector.setAttribute("x", "-17");
      leftConnector.setAttribute("y", "-5");
      leftConnector.setAttribute("width", "4");
      leftConnector.setAttribute("height", "10");
      leftConnector.setAttribute("rx", "2");
      leftConnector.setAttribute("fill", "#F5F5DC");
 
      bone.appendChild(leftConnector);

      const rightConnector = document.createElementNS(svgNS, "rect");
      rightConnector.setAttribute("x", "13");
      rightConnector.setAttribute("y", "-5");
      rightConnector.setAttribute("width", "4");
      rightConnector.setAttribute("height", "10");
      rightConnector.setAttribute("rx", "2");
      rightConnector.setAttribute("fill", "#F5F5DC");
      bone.appendChild(rightConnector);

      const middleBone = document.createElementNS(svgNS, "rect");
      middleBone.setAttribute("x", "-13");
      middleBone.setAttribute("y", "-3");
      middleBone.setAttribute("width", "26");
      middleBone.setAttribute("height", "6");
      middleBone.setAttribute("rx", "2");
      middleBone.setAttribute("fill", "#F5F5DC");
    
      bone.appendChild(middleBone);

      const crack1 = document.createElementNS(svgNS, "path");
      crack1.setAttribute("d", "M -5,-1 L -3,1 M 0,-2 L 2,0 M 5,1 L 7,-1");
      crack1.setAttribute("stroke", "#D2B48C");
      crack1.setAttribute("stroke-width", "0.8");
      bone.appendChild(crack1);

      food.appendChild(bone);


  }

  food.setAttribute("transform", `translate(${Math.random() * window.innerWidth}, 0)`);
  food.setAttribute("data-type", type);

  document.getElementById("game-area").appendChild(food);
  return food;

}

//checking collsions, lowering food, removing food and playing sounds in collision
function animateFood(food) {
  let y = 0;
  const fallSpeed = Math.random() * 5 + 1;
  const gameArea = document.getElementById("game-area");
//fall (show food lower)
  const fall = setInterval(() => {
    y += fallSpeed;
    food.setAttribute("transform", `translate(${food.transform.baseVal.getItem(0).matrix.e}, ${y})`);

    // Get actual screen positions
    const foodRect = food.getBoundingClientRect();
    const petRect = pet.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();

    // Check collision
    if (
      foodRect.bottom >= petRect.top &&
      foodRect.left <= petRect.right &&
      foodRect.right >= petRect.left &&
      foodRect.top <= gameAreaRect.bottom
    ) {
      clearInterval(fall);
      food.remove();
      petEatingSound.pause();
      petEatingSound.currentTime = 0;
      petEatingSound.play();
      hungerLevel += fallSpeed/2;
      if(hungerLevel>=100){
        hungerLevel =100;
        endGame();

      }
      updateDisplay();
    }

    if (y > gameAreaRect.height) {
      clearInterval(fall);
      food.remove();
    }
  }, 16);
}

//start game, making new food every second
function startGameWithSVG() {
  document.getElementById("game-area").style.display = "block";
  feedingGameInterval = setInterval(() => {
    const food = createSVGFood(typeOfPetFood);
    animateFood(food);
  }, 1000);
}


// resize gamearea by window for responsive design 
function resizeGameArea() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  gameArea.setAttribute('viewBox', `0 0 ${width} ${height}`);
}
if(gameArea){ 
window.addEventListener('resize', resizeGameArea);
window.addEventListener('load', resizeGameArea);
}


// handeling offline state

function handleNetworkChange() {
  isOnline = navigator.onLine;
  
  if (isOnline) {
    offlineMessage.style.display = 'none';

    if(pet&&status) {loadState();}
  } else {
    offlineMessage.style.display = 'block';
    offlineMessage.textContent = 'You are offline. No saving state, we are sorry.😿.';
    if (feedingGameRunning) endGame();
  }
}

// Network listeners
window.addEventListener('online', handleNetworkChange);
window.addEventListener('offline', handleNetworkChange);
handleNetworkChange();


// making unicorns walk in backgrounf of index page
function createUnicorn(){
    const gif = document.createElement("img");
    gif.src = "unicorn.gif"; 
    gif.classList.add("floating-unicorn");

    const topPercent = Math.floor(Math.random() * 90);
    gif.style.top = `${topPercent}vh`;

    const size = 100 + Math.random() * 80;
    gif.style.width = `${size}px`;

    gif.addEventListener("animationend", () => {
      gif.remove();
    });

    document.body.appendChild(gif);
}

//creating unicorn only if I am on inedx page
if(indexCenter&&!unicornsRunning){
  let unicornDelay;
  if(window.innerWidth<=600)unicornDelay = 1500;
  else unicornDelay = 2500;

  unicornInterval= setInterval(createUnicorn, unicornDelay);
  unicornsRunning = true;
} else if(!indexCenter){
  clearInterval(unicornInterval);
  unicornsRunning=false;
}