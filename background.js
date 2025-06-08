let suns = [];
let planet;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  suns.push(new Body(width / 2 - 200, height / 2, 80, 3e5));
  suns.push(new Body(width / 2 + 200, height / 2, 60, 2e5));
  suns.push(new Body(width / 2, height / 2 - 150, 40, 1.5e5));
  planet = new Body(width / 2 + 100, height / 2 + 100, 10, 1);
  planet.vx = -0.8;
  planet.vy = 0.4;
}

function draw() {
  background(0, 0, 0, 20);

  for (let sun of suns) {
    sun.show('yellow');
  }

  for (let sun of suns) {
    planet.attract(sun);
  }

  planet.update();
  planet.show('aqua');
}

class Body {
  constructor(x, y, r, m) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.m = m;
    this.vx = 0;
    this.vy = 0;
  }

  attract(other) {
    let G = 6.674e-2;
    let dx = other.x - this.x;
    let dy = other.y - this.y;
    let distSq = dx * dx + dy * dy;
    let force = (G * this.m * other.m) / distSq;
    let angle = atan2(dy, dx);
    let fx = cos(angle) * force;
    let fy = sin(angle) * force;

    this.vx += fx / this.m;
    this.vy += fy / this.m;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }

  show(col) {
    noStroke();
    fill(col);
    ellipse(this.x, this.y, this.r);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}
