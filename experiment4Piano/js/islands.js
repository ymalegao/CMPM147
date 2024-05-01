"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/


class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.alpha = 255;
  }

  update() {
    this.radius += 2;
    this.alpha -= 2;
  }

  draw() {
    noFill();
    stroke(255, this.alpha);
    
    push();
    translate(this.x, this.y);
    rotate(this.direction); // Rotate the ripple based on its direction
    ellipse(0, 0, this.radius * 2, this.radius); // Draw a flattened ellipse
    pop();
  }

  isDone() {
    return this.alpha <= 0;
  }
  getDistance(x, y) {
    let dx = this.x - x;
    let dy = this.y - y;
    return sqrt(dx * dx + dy * dy);
  }

}

let ripples = [];

let worldSeed;
let tileColors = {};

  
  
// Seeded random number generator
function seededRandom(worldSeed) {
  let x = Math.sin(worldSeed++) * 10000;
  return x - Math.floor(x);
}

function p3_preload() {}

function p3_setup() {}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}

function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  ripples.push(new Ripple(mouseX, mouseY));
  
}

function p3_drawBefore() {
  
}
function p3_drawTile(i, j) {
  noStroke();

  // Calculate the height of the terrain at this tile using Perlin noise
  let terrainHeight = noise(i * 0.1, j * 0.1) * 100; // Adjust the noise parameters for different terrain patterns
  
  // Define ocean and island parameters
  const waterLevel = 30; // Adjust as needed
  let leftIsWater = noise((i - 1) * 0.1, j * 0.1) * 100 < waterLevel;
  let rightIsWater = noise((i + 1) * 0.1, j * 0.1) * 100 < waterLevel;
  let topIsWater = noise(i * 0.1, (j - 1) * 0.1) * 100 < waterLevel;
  let bottomIsWater = noise(i * 0.1, (j + 1) * 0.1) * 100 < waterLevel;

  // Determine tile type based on terrain height
  let tileColor;
  if (terrainHeight >= waterLevel && (leftIsWater || rightIsWater || topIsWater || bottomIsWater)) {
    // Draw a rounded rectangle
    beginShape();
    let noiseValue = noise(i * 0.1, j * 0.1);
    let lightness = map(noiseValue, 0, 1, 200, 255); // Adjust the range as needed
    fill(255+ lightness, 255+ lightness, 0);
    vertex(-tw + 10, -th); // top left corner
    bezierVertex(-tw, -th, -tw, -th + 10, -tw, 0); // top left curve
    vertex(-tw, th - 10); // bottom left corner
    bezierVertex(-tw, th, -tw + 10, th, 0, th); // bottom left curve
    vertex(tw - 10, th); // bottom right corner
    bezierVertex(tw, th, tw, th - 10, tw, 0); // bottom right curve
    vertex(tw, -th + 10); // top right corner
    bezierVertex(tw, -th, tw - 10, -th, 0, -th); // top right curve
    endShape(CLOSE);
  } else {
  if (terrainHeight < waterLevel) {
    let noiseValue = noise(i * 0.1, j * 0.1);
    let lightness = map(noiseValue, 0, 1, 200, 255); // Adjust the range as needed
    tileColor = color(255 + lightness, 255 + lightness, 0); // land color
  } else {
    let noiseValue = noise(i * 0.1, j * 0.1);
    let darkness = map(noiseValue, 0, 1, 0, 255);


    tileColor = color(50, 150 - darkness, 255 - darkness); // water
  }

  fill(tileColor);
}

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  


  
  if (terrainHeight <= waterLevel && seededRandom(i*1000+ j) < 0.1) {
    // Draw the trunk
    fill(139, 69, 19); // brown color for the tree trunk
    rect(-tw/8, -th/4, tw/4, th*2); // draw the tree trunk
  
    // Draw the leaves
    fill(34, 139, 34); // green color for the tree leaves
    for (let angle = -45; angle <= 45; angle += 30) {
      push();
      rotate(radians(angle));
      ellipse(0, -th+10, tw*1.5, th/2); // draw a leaf
      pop();
    }
  }

  let n = clicks[[i, j]] | 0;
  // if (n % 2 == 1) {
  //   fill(0, 0, 0, 32);
  //   ellipse(0, 0, 10, 5);
  //   translate(0, -10);
  //   fill(255, 255, 100, 128);
  //   ellipse(0, 0, 10, 10);
  // }

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    ripple.update();
    ripple.draw();
    if (ripple.isDone()) {
      ripples.splice(i, 1);
    }
  }
}
