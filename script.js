var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');


function makeSquare(x, y, length, speed) {
  return {
    x: x,
    y: y,
    l: length,
    s: speed,
    draw: function() {
      context.fillRect(this.x, this.y, this.l, this.l);
    }
  };
}

var cannon = makeSquare(canvas.width / 2, 380, 30, 10);
var left = false;
var right = false;
var space = false;
var shooting = false;
var bullet = makeSquare(0, 0, 5, 7);
var enemies = [];
var name;
var arscore[];
var score = 0;
var timeBetweenEnemies = 3 * 1000;
var timeoutId;

function makeenemy(x,y,radius,xspeed,yspeed,strength) {
  return{
    x: x,
    y: y,
    r: radius,
    sx: xspeed,
    sy: yspeed,
    num: strength,
    num2: strength

      draw: function() {
        context.beginPath();
        context.arc(this.x,this.y,this.r,0,2*Math.PI,true);
        context.fill();
        context.fillStyle="#FFFFFF";
        context.font = '10px Georgia';
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
  var enemysize = 10;
  var enemyY=Math.floor(Math.random()*(3*canvas.height/4));
  var enemyxspeed = Math.floor((Math.random()*5)+1);
  var enemyyspeed = Math.floor((Math.random()*5)+1);
  var strength = Math.floor((Math.random()*25)+1);
  enemies.push(makeenemy(enemyX,enemyY,enemysize,enemyxspeed,enemyyspeed,strength));
}

function isWithin(a, b, c) {
  return (a > b && a < c);
}

function isColliding(a, b) {
  var result = false;
  if (isWithin(a.x, (b.x-b.r), (b.x + b.r)) || isWithin(a.x + a.l, (b.x-b.r), (b.x + b.r))) {
    if (isWithin(a.y, b.y-b.r, b.y + b.r) || isWithin(a.y + a.l, b.y-b.r, b.y + b.r)) {
      result = true;
    }
  }
  return result;
}
function menu() {
  erase();
  context.fillStyle = '#000000';
  context.font = '36px Arial';
  context.textAlign = 'center';
  context.fillText('Shoot \'Em!', canvas.width / 2, canvas.height / 4);
  context.font = '24px Arial';
  context.fillText('Click to Start', canvas.width / 2, canvas.height / 2);
  context.font = '18px Arial';
  context.fillText('Left/A to move left,Right/D to move right, Space to shoot.', canvas.width / 2, (canvas.height / 4) * 3);
  canvas.addEventListener('click', startGame);
}


function startGame() {
  timeoutId = setInterval(makeenemyarray, timeBetweenEnemies);
  draw();
}

function endGame() {
  context.clearRect(0,0,canvas.width,canvas.height);
  clearInterval(timeoutId);
  erase();
  context.fillStyle = '#000000';
  context.font = '24px Arial';
  context.textAlign = 'center';
  context.fillText('Game Over. Final Score: ' + score, canvas.width / 2, canvas.height / 2);
  arscore=JSON.parse(localStorage.getItem('sta'));
  arscore.sort(function(b,a){return a.sc-b.sc});
  
    x=70;
    dx=12.5;
  for( i=0;i<6;i++){
    context.fillText((i+1)+"."+arscore[i].nam+" : "+arscore[i].sc,10,x);
    x=x+dx;
}

canvas.addEventListener('keyleft', function(event) {
  event.preventDefault();
  if ((event.keyCode === 37)||(event.keyCode === 65)) { // left
    left = true;
  }
  if ((event.keyCode === 39)||(event.keyCode === 68)) { // right
    right = true;
  }
  if ((event.keyCode === 32)||(event.keyCode === 87)||(event.keyCode === 38)) { // SPACE
    shoot();
  }
});

canvas.addEventListener('keyright', function(event) {
  event.preventDefault();
  if ((event.keyCode === 37)||(event.keyCode === 65)) { // left
    left = false;
  }
  if ((event.keyCode === 39)||(event.keyCode === 68)) { // right
    right = false;
  }
});   



function shoot() {
  if (!shooting) {
    shooting = true;
    bullet.x = cannon.x + cannon.l / 2;
    bullet.y = cannon.y + cannon.l;
  }
}

function draw() {
  var gameOver = false;
  context.clearRect(0,0,canvas.width,canvas.height);
  enemies.forEach(function(enemy) {
    enemy.x += enemy.sx;
    enemy.y += enemy.sy;
    if (enemy.x<0||enemy.x>(enemy.r+canvas.width)) {
      enemy.sx=-enemy.sx;
    }
    if (enemy.y<0||enemy.y>(enemy.r+canvas.height) ){
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
  if (cannon.x > canvas.width - cannon.l) {
    cannon.x = canvas.width - cannon.l;
  }
  context.fillStyle = '#FF0000';
  cannon.draw();
  if (shooting) {
    bullet.y -= bullet.s;    enemies.forEach(function(enemy, i) {
      if (isColliding(bullet, enemy)) {
         if(enemy.num>1){
           enemy.num--;
         }
         else{
          var enemyX=enemy.x;
          var enemyxspeed = Math.floor((Math.random()*5)+1);
          var enemyY=enemy.y;
          var enemyyspeed = Math.floor((Math.random()*5)+1);
          var enemysize = 10;
          if(enemy.num%2==0){
               var strength=enemy.num2/2;}
               else{
                var strength=(enemy.num2-1)/2;
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
  context.fillText('Score: ' + score, 1, 25)
  if (gameOver) {
    endGame();
  } else {
    window.requestAnimationFrame(draw);
  }
}
menu();
canvas.focus();
