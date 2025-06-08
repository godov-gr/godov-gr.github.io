let suns = [];
let planet;
let brightMode = false;
let bgEnabled = false;
let t = 0;
let stars = [];
let comets = [];
let parallaxOffset = { x: 0, y: 0 };

function setup() {
  let cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.id("spaceCanvas");

  for (let i = 0; i < 200; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1.5, 2.5),
      alpha: random(50, 150),
      pulseSpeed: random(0.005, 0.02),
      pulsePhase: random(TWO_PI),
      vx: 0,
      vy: 0
    });
  }

  suns.push(new Body(0, 0, 80, 3e5));
  suns.push(new Body(0, 0, 60, 2e5));
  suns.push(new Body(0, 0, 40, 1.5e5));
  planet = new Body(width / 2 + 100, height / 2 + 100, 10, 1);
  planet.vx = -0.3;
  planet.vy = 0.15;

  for (let i = 0; i < 5; i++) {
    comets.push({ x: random(-width, 0), y: random(height), vx: random(4, 8), vy: random(-1, 1), tail: [], depth: random(0.5, 1.2) });
  }

  const toggleBtn = document.getElementById("toggleBG");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      bgEnabled = !bgEnabled;
      const canvas = document.getElementById("spaceCanvas");
      if (canvas) {
        canvas.style.filter = bgEnabled ? "none" : "blur(6px)";
      }
      toggleBtn.innerText = bgEnabled ? "Normal Mode" : "Only BG Mode";
    });
  }

  const canvas = document.getElementById("spaceCanvas");
  if (canvas) {
    canvas.style.filter = "blur(6px)";
  }
}

function draw() {
  background(0);

  t += 1;
  parallaxOffset.x = (mouseX - width / 2) * 0.01;
  parallaxOffset.y = (mouseY - height / 2) * 0.01;

  noStroke();
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    let flicker = sin(t * s.pulseSpeed + s.pulsePhase);
    let alpha = map(flicker, -1, 1, 30, 255);

    // Oтталкивание от курсора.
    let dx = s.x - mouseX;
    let dy = s.y - mouseY;
    let dist = sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      let strength = map(dist, 0, 100, 3, 0);
      s.vx += (dx / dist) * strength;
      s.vy += (dy / dist) * strength;
    }

    s.vx *= 0.9;
    s.vy *= 0.9;
    s.x += s.vx;
    s.y += s.vy;

    if (s.x < 0) s.x = 0;
    if (s.x > width) s.x = width;
    if (s.y < 0) s.y = 0;
    if (s.y > height) s.y = height;

    fill(255, alpha);
    circle(s.x + parallaxOffset.x, s.y + parallaxOffset.y, s.size);
  }

  for (let comet of comets) {
    comet.tail.push({ x: comet.x, y: comet.y });
    if (comet.tail.length > 30) comet.tail.shift();

    for (let i = 0; i < comet.tail.length; i++) {
      let p = comet.tail[i];
      fill(255, 255, 255, map(i, 0, comet.tail.length, 0, 100));
      ellipse(p.x, p.y, 2 * comet.depth);
    }

    fill(255);
    ellipse(comet.x, comet.y, 6 * comet.depth);
    comet.x += comet.vx * comet.depth;
    comet.y += comet.vy * comet.depth;

    if (comet.x > width || comet.y < 0 || comet.y > height) {
      comet.x = random(-width, 0);
      comet.y = random(height);
      comet.vx = random(4, 8);
      comet.vy = random(-1, 1);
      comet.tail = [];
      comet.depth = random(0.5, 1.2);
    }
  }

  suns[0].x = width / 2 + cos(t * 0.01) * 300;
  suns[0].y = height / 2 + sin(t * 0.01) * 180;
  suns[1].x = width / 2 + cos(t * 0.01 + PI / 2) * 350;
  suns[1].y = height / 2 + sin(t * 0.01 + PI / 2) * 200;
  suns[2].x = width / 2 + cos(t * 0.01 + PI) * 280;
  suns[2].y = height / 2 + sin(t * 0.01 + PI) * 160;

  for (let sun of suns) {
    sun.show(brightMode ? 'rgba(255,255,100,0.9)' : 'yellow');
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
    let dist = sqrt(distSq);

    const minDist = (this.r + other.r) * 1.2;
    if (dist < minDist) dist = minDist;

    let force = (G * this.m * other.m) / (dist * dist);
    force = constrain(force, 0, 1.5);

    let angle = atan2(dy, dx);
    let fx = cos(angle) * force;
    let fy = sin(angle) * force;

    this.vx += fx / this.m;
    this.vy += fy / this.m;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    const damp = 0.8;
    if (this.x < this.r) {
      this.x = this.r;
      this.vx *= -damp;
    }
    if (this.x > width - this.r) {
      this.x = width - this.r;
      this.vx *= -damp;
    }
    if (this.y < this.r) {
      this.y = this.r;
      this.vy *= -damp;
    }
    if (this.y > height - this.r) {
      this.y = height - this.r;
      this.vy *= -damp;
    }
  }

  show(col) {
    noStroke();
    fill(col);
    ellipse(this.x, this.y, this.r);
  }
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  starLayer = createGraphics(window.innerWidth, window.innerHeight);
  starLayer.noStroke();
  for (let star of stars) {
    starLayer.fill(255, star.alpha);
    starLayer.circle(star.baseX, star.baseY, star.size);
  }

  fogLayer = createGraphics(window.innerWidth, window.innerHeight);
  fogLayer.noStroke();
  for (let i = 0; i < 100; i++) {
    let x = random(width);
    let y = random(height);
    let radius = random(200, 400);
    let alpha = random(10, 30);
    fogLayer.fill(150, 200, 255, alpha);
    fogLayer.ellipse(x, y, radius);
  }
}