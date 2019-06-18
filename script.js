var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var img;

function makeSquare(x, y, length, speed) {
  return {
    x: x,
    y: y,
    w: length,
    h: length+5,
    s: speed,
    draw: function() {
      context.fillRect(this.x, this.y, this.w, this.h);
    }
  };
}

function makecannon(x,y,width,height,speed){
  return{
    x:x,
    y:y,
    w:width,
    h:height,
    s:speed,
    draw:function(){
    context.drawImage(img,this.x,this.y,this.w,this.h);

  }
  };
}

var cannon = makecannon(canvas.width / 2, canvas.height-45, 45, 45, 10);
var left = false;
var right = false;
var space = false;
var shooting = false;
var bullet = makeSquare(0, 0, 7, 30);
var enemies = [];
var name;
var arscore= [];
var score = 0;
var timeBetweenEnemies = 7 * 1000;
var timeoutId;

function makeenemy(x,y,radius,xspeed,yspeed,strength) {
  return{
    x: x,
    y: y,
    r: radius,
    sx: xspeed,
    sy: yspeed,
    num: strength,
    num1: strength,

      draw: function() {
        context.beginPath();
        context.arc(this.x,this.y,this.r,0,2*Math.PI,true);
        context.fill();
        context.fillStyle="#000000";
        context.font = '15px Georgia';
        context.fillText(this.num,this.x-6,this.y+3);
      }
  }
}

function makeenemyarray(){
  if(Math.floor(Math.random()*2)){
    var enemyX=0;
  }
  else{
    var enemyX=canvas.width;
  }
  var enemysize = 15;
  var enemyY=Math.floor(Math.random()*(3*canvas.height/4));
  var enemyxspeed = Math.floor((Math.random()*3)+1);
  var enemyyspeed = Math.floor((Math.random()*3)+1);
  var strength = Math.floor((Math.random()*25)+1);
  enemies.push(makeenemy(enemyX,enemyY,enemysize,enemyxspeed,enemyyspeed,strength));
}

function isWithin(a, b, c) {
  return (a > b && a < c);
}

function isColliding(a, b) {
  var result = false;
  if (isWithin(a.x, (b.x-b.r), (b.x + b.r)) || isWithin(a.x + a.w, (b.x-b.r), (b.x + b.r))) {
    if (isWithin(a.y, b.y-b.r, b.y + b.r) || isWithin(a.y + a.h, b.y-b.r, b.y + b.r)) { 
      result = true;
    }
  }
  return result;
}
function menu() {
  erase();
  context.fillStyle = '#8B0000';
  context.font = '36px Georgia';
  context.textAlign = 'center';
  context.fillText('Shoot them all', canvas.width / 2, canvas.height / 4);
  context.font = '20px Georgia';
  context.fillText('Click on the canvas to Start only when you have entered your name', canvas.width / 2, canvas.height / 2);
  context.font = '18px Georgia';
  context.fillText('Left/A to move left,Right/D to move right, Space to shoot.', canvas.width / 2, (canvas.height / 4) * 3);
  canvas.addEventListener('click', startGame);
}

function erase() {
  context.fillStyle = '#FFFFFF';
  context.fillRect(0, 0, 600, 400);
}

function startGame() {
  img = new Image();
  img.src="cannon.png";
  img.onload=function()
  {   
  name=document.getElementById("name").value;
   if(name.length>=10||name.length==0){
    alert("Enter some name with less than 10 letter");
   }else{
    document.getElementById("index").style.display="none";
    document.getElementById("canvas").style.display="inline-block";
  }
  timeoutId = setInterval(makeenemyarray, timeBetweenEnemies);
  draw();
  canvas.removeEventListener('click',startGame);
}
}

function endGame() {
  context.clearRect(0,0,canvas.width,canvas.height);
  clearInterval(timeoutId);
  erase();
  context.fillStyle = '#000000';
  context.font = '24px Arial';
  context.textAlign = 'center';+-
  context.fillText('Game Over. Final Score: ' + score, canvas.width / 2, canvas.height / 2);
  arscore=JSON.parse(localStorage.getItem('sta'));
  context.font = '20px Arial'
  arscore.sort(function(b,a){return a.sc-b.sc});
  
    x=40;
    dx=20;
  for( i=0;i<6;i++){
    context.fillText((i+1)+"."+arscore[i].nam+" : "+arscore[i].sc,70,x);
    x=x+dx;
}
}
canvas.addEventListener("keydown", keyDownHandler, false);
canvas.addEventListener("keyup", keyUpHandler, false);
 function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight"|| e.keyCode == 68) {
        right = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft"|| e.keyCode == 65) {
        left = true;
    }
    if (e.keyCode == 32) { 
         shoot();   
  }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight" || e.keyCode == 68) {
        right = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft" || e.keyCode == 65) {
        left = false;
    }
}

function shoot() {
  if (!shooting) {
    shooting = true;
    bullet.x = cannon.x + cannon.w/ 2;
    bullet.y = cannon.y + cannon.h/2;
  }
}

function draw() {
  erase();
  var gameOver = false;
  enemies.forEach(function(enemy) {
    enemy.x += enemy.sx;
    enemy.y += enemy.sy;
    if (enemy.x<0||enemy.x>canvas.width) {
      enemy.sx=-enemy.sx;
    }
    if (enemy.y<0||enemy.y>canvas.height){
      enemy.sy=-enemy.sy;
    }
    context.fillStyle = '#00FF00';
    enemy.draw();
  });
  enemies.forEach(function(enemy, i) {
    if (isColliding(cannon, enemy)) {
      gameOver = true;
        if (localStorage.length==0) {
          var arr=[];
          arr.push({nam:name,sc:score});
          localStorage.setItem('sta', JSON.stringify(arr));
        }else
        {
          var arr=JSON.parse(localStorage.getItem('sta'));
          arr.push({nam:name,sc:score});
           localStorage.setItem('sta', JSON.stringify(arr));
        }
    }
  });
  if (right) {
    cannon.x += cannon.s;
  }
  if (left) {
    cannon.x -= cannon.s;
  }
  if (cannon.x < 0) {
    cannon.x = 0;
  }
  if (cannon.x > canvas.width - cannon.w) {
    cannon.x = canvas.width - cannon.w;
  }
  context.fillStyle = '#FF0000';
  cannon.draw();
  if (shooting) {
    bullet.y -= bullet.s;    
    enemies.forEach(function(enemy, i) {
      if (isColliding(bullet, enemy)) {
         if(enemy.num>1){
           enemy.num--;
         }
         else{
          var enemyX=enemy.x;
          var enemyxspeed = Math.floor((Math.random()*3)+1);
          var enemyY=enemy.y;
          var enemyyspeed = Math.floor((Math.random()*3)+1);
          var enemysize = 15;
          if(enemy.num%2==0){
               var strength=enemy.num1/2;}
               else{
                var strength=Math.floor((enemy.num1-1)/2);
               }
               if(strength!=0){
              enemies.push(makeenemy(enemyX,enemyY,enemysize,enemyxspeed,enemyyspeed,strength));
              enemies.push(makeenemy(enemyX,enemyY,enemysize,-enemyxspeed,enemyyspeed,strength));
               }
       enemies.splice(i, 1);
         }
        score++;
        shooting = false;
        bullet.s+= 0.35;
      }
    });
        if(bullet.y<0){
          shooting= false;
        }

    context.fillStyle = '#0000FF';
    bullet.draw();
  }
  context.fillStyle = '#000000';
  context.font = '24px Arial';
  context.textAlign = 'left';
  context.fillText('Score: ' + score, 10, 50)
  if (gameOver) {
    endGame();
  } else {
    window.requestAnimationFrame(draw);
  }
}
menu();
canvas.focus();
