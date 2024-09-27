let board;
let boardH = 640;
let boardW = 360;
let ctx;

let birdImg;
let birdX = boardW/8;
let birdY = boardH/2;
let birdW = 34;
let birdH = 24;

let bird = {
    x : birdX,
    y : birdY,
    width : birdW,
    height : birdH
}

let pipeArray = [];
let pX = boardW;
let pY = 0;
let pW = 64;
let pH = 512; 

let toppipeImg;
let bottompipeImg; 

let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;
let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardH;
    board.width = boardW;
    ctx = board.getContext("2d");

    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        ctx.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }  

    toppipeImg = new Image();
    toppipeImg.src = "./toppipe.png";
   
    bottompipeImg = new Image();
    bottompipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update)
    setInterval(placepipes,1500 - score*200);
    document.addEventListener("keydown",movebird);
}

function update(){
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    ctx.clearRect(0, 0, boardW, boardH);
    velocityY +=gravity;  
    bird.y = Math.max(0,bird.y+velocityY);
    ctx.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    if (bird.y > board.height) {
        gameOver = true;
    }

    for(i=0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x += (velocityX - score/10);
        ctx.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);
        if(detect(bird,pipe)){
            gameOver=true;}
        if(!pipe.passed && bird.x>pipe.x+pipe.width){
            score+=0.5;
            pipe.passed = true;
        }        
    }
    
    while (pipeArray.length > 0 && pipeArray[0].x < -pW) {
        pipeArray.shift(); 
    }
    ctx.fillStyle = "white";
    ctx.font="45px sans-serif";
    ctx.fillText(score, 5, 45);

    if(gameOver){
        ctx.fillText("game over",80,240);
    }
    
};

function movebird(e){
    if(e.code=="Space" || e.code=="ArrowUp" || e.code == "KeyX"){
        velocityY = -6;
    } 
    if(e.code=="Space" && gameOver==true){
        gameOver=false;
        gravity = 0.4;
        score = 0;
        bird.y = boardH/2;
        pipeArray = [];
    }
}

function placepipes(){
    if(gameOver){
        return;
    }
    let randomH = pY - pH/4 - Math.random(0,1)*pH/2;
    let openingspace = board.height/4;
    let toppipe = {
        x : pX,
        y : randomH,
        width : pW,
        height : pH,
        img : toppipeImg,
        passed : false
    }
    pipeArray.push(toppipe);

    let bottompipe = {
        x : pX,
        y : randomH + pH + openingspace,
        width : pW,
        height : pH,
        img : bottompipeImg,
        passed : false
    }
    pipeArray.push(bottompipe);
}

function detect(a,b){
    return a.x<b.x+b.width && a.x+a.width>b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
