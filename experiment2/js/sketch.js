// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

let seed = 239;
const green1 = "#98da38"
const green2 = "#6bbd69"
const green3 = "#68c30e"
const green4 = "#89d551"
const green5 = "#4a6a20"
const green6 = "#3a6304"
const green7 = "#9ec868"
const green8 = "#62a40d"
const fgreen = "#a7fc00"


let greenarr = [green1, green2, green3, green4,green6, green8];
let pos = 0;
let rowHeight = 0; // Height of each row


// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  createButton("reimagine").mousePressed(() => seed++);
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed);
  background(1);
  let mouseForce = createVector(mouseX, mouseY);

 

  for (let i = 0; i < width; i++) {
    let cloverSize = random(10, 35); // Random size between 20 and 40

    let cloverX = pos + cloverSize;
    let cloverY = rowHeight * 1.1 // space them out a bit more
    let d = dist(mouseX, mouseY, cloverX, cloverY);
    
    let force = p5.Vector.sub(createVector(cloverX, cloverY), mouseForce);
    force.mult(50 / (d * d));
    cloverX += force.x;
    cloverY += force.y;
    


    clover(cloverX , cloverY , cloverSize, greenarr);
    pos += cloverSize * 1.8; // Update x-position for the next clover
    if (pos > width){
      pos = 0; //start a new row
      if (rowHeight >= height/1.1){
        rowHeight -= 10 //to make them fit more on screen 
      }
      rowHeight+=25 //go next row
    
    }
    
    
    
    
    fill(255, 255, 255, 20); //fill for eclipse to make them stand out a little in the cluster
    noStroke();
    ellipse(cloverX, cloverY + cloverSize * 0.6, cloverSize * 2, cloverSize * 2);


  }
  
  let fcloverSize = random(10,15)
  let fcloverX = random(width/1,5)
  let fcloverY = random(height/1.5)
  
  let d = dist(mouseX, mouseY, fcloverX, fcloverY);
    
  let fforce = p5.Vector.sub(createVector(fcloverX, fcloverY), mouseForce);
  fforce.mult(50 / (d * d));
  
  fcloverX+= fforce.x;
  fcloverY+= fforce.y;
  four_clover(fcloverX, fcloverY, fcloverSize, fgreen);


  
 
  pos = 0; // Reset x-position for the next row
  rowHeight = 0
}

//code for heart found at 
function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);  
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);  
  endShape();

  
}

function clover(x,y,size, greenarr){
  
  beginShape();
  let color = random(greenarr)
  for (let i = 0; i < 3; i++) {
    
    push();
    
    fill(color);

    let bottomX = x;
    let bottomY = y + size / 3 + size / 2;
    translate(bottomX, bottomY); 
    rotate(PI *2 / 3 * i); 
    translate(-bottomX, -bottomY); 
    heart(x, y-2.5, size);
    endShape(CLOSE);
    
    
    pop();
  }
  
}


function four_clover(x,y,size, greenarr){
  
  beginShape();
  
  for (let i = 0; i < 4; i++) {
    
    push();
    
    fill(greenarr);

    let bottomX = x;
    let bottomY = y + size / 3 + size / 2;
    translate(bottomX, bottomY); 
    rotate(PI *2 / 4 * i); 
    translate(-bottomX, -bottomY); 
    heart(x, y-2.5, size);
    endShape(CLOSE);
    
    
    pop();
  }
  
}

