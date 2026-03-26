function drawIt() {
var x = 150;
var y = 150;
var dx = 2;
var dy = 4;
var WIDTH;
var HEIGHT;
var r=10;
var ctx;
var paddlex;
var paddleh;
var paddlew;
function init() {
  ctx = $('#canvas')[0].getContext("2d");
  WIDTH = $("#canvas").width();
  HEIGHT = $("#canvas").height();
  return setInterval(draw, 10);
}

function circle(x,y,r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}
function init_paddle() {
  paddlex = WIDTH / 2;
  paddleh = 10;
  paddlew = 75;
}
function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

function clear() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}
//END LIBRARY CODE
function draw() {
  clear();
  circle(x, y, 10);
  x += dx;
  y += dy;
  clear();
rect(paddlex, HEIGHT-paddleh, paddlew, paddleh);
circle(x, y, 10);

  if (x + dx > WIDTH-r || x + dx < 0+r)
    dx = -dx;

  if (y + dy < 0+r)
    dy = -dy;
  else if (y + dy > HEIGHT-r) {
    if (x > paddlex && x < paddlex + paddlew)
      dy = -dy;
    else
      clearInterval(intervalId);
  }


x += dx;

y += dy;
}

init();
init_paddle();

}