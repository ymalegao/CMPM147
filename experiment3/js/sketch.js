
/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

let sketch1 = function(p) {
  p.seed = 0;
  p.tilesetImage;
  p.currentGrid = [];
  p.numRows, p.numCols;
  p.clouds = [];
  p.cloudImage;

  p.preload = function() {
    p.tilesetImage = p.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
    );
    p.cloudImage = p.loadImage("cloud.png");
  };

  p.reseed = function() {
    p.seed = (p.seed | 0) + 1109;
    p.randomSeed(p.seed);
    p.noiseSeed(p.seed);
    p.select("#seedReport").html("seed " + p.seed);
    p.regenerateGrid();
  };

  p.regenerateGrid = function() {
    p.select("#asciiBox").value(p.gridToString(p.generateGrid(p.numCols, p.numRows)));
    p.reparseGrid();

};

p.reparseGrid = function() {
    p.currentGrid = p.stringToGrid(p.select("#asciiBox").value());
}

p.gridToString = function(grid) {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
        rows.push(grid[i].join(""));
    }
    return rows.join("\n");
}

p.stringToGrid = function(str) {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
        let row = [];
        let chars = lines[i].split("");
        for (let j = 0; j < chars.length; j++) {
            row.push(chars[j]);
        }
        grid.push(row);
    }
    return grid;
}

p.setup = function() {
    p.canvasContainer = $("#canvas-container");
    let canvas = p.createCanvas(16*30, 16*30);
    canvas.parent("canvas-container1");
    
    p.numCols = p.select("#asciiBox").attribute("rows") | 0;
    p.numRows = p.select("#asciiBox").attribute("cols") | 0;
    console.log("Parent element:", document.getElementById("canvas-container2"));
    
    
    p.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

    p.select("#reseedButton").mousePressed(p.reseed);
    p.select("#asciiBox").input(p.reparseGrid);
    
    
    for (let i = 0; i < 5; i++) {
        p.clouds.push(p.createCloud());
    }
    

    p.reseed();
}

p.draw = function() {

    p.randomSeed(p.seed);
    p.drawGrid(p.currentGrid);

    for (let i = 0; i < p.clouds.length; i++) {

        let cloud = p.clouds[i];
        p.drawCloud(cloud.x, cloud.y, cloud.size);
        p.drawCloudShadow(cloud.x, cloud.y, cloud.size);
        cloud.x += cloud.speed;
        if (cloud.x > p.width) {
            p.clouds[i] = p.createCloud();
        }
    }
}

p.createCloud = function(initialX = -200, ) {
      
      return {
          x: initialX,
          y: p.random() * p.height,
          
          size: p.random(100, 300),
          speed: p.random(0.25,0.5) 
      };
  }

p.drawCloud = function(x, y, size) {

    p.tint(255, 100);
    p.image(p.cloudImage, x, y, size, size * 0.6);
    p.noTint();
}

p.drawCloudShadow = function(x, y, size) {
    //set transparency for the shadow
    
    // image(cloudShadowImage, x - size * 0.75, height - size * 0.15, size * 1.5, size * 0.3, );
}

p.placeTile = function(i, j, ti, tj) {
    p.image(p.tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}

p.generateGrid = function(numCols, numRows) {
    let grid = [];
    const biomeNoiseScale = 0.1;

    for (let i = 0; i < numRows; i++) {
        let row = [];
        for (let j = 0; j < numCols; j++) {
            let biomeNoise = p.noise(i * biomeNoiseScale , j  * biomeNoiseScale)

            if (biomeNoise < 0.33) {
                row.push("W"); // water
            } else if (biomeNoise < 0.55) {
                row.push(":"); // ground 
            } else {
                row.push("_"); //grass
            }
        }
        grid.push(row);
    }

    return grid;
}

p.drawGrid = function(grid) {
    p.background(1);

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "W") {
                p.placeTile(i, j, p.random(3), 14); // Draw water tile
                p.drawGlowingRune(i, j);
            }
        }
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === ":") {
                p.placeTile(i, j, p.random(3), 3); // Draw eath tile
            }
            if(grid[i][j] == "W"){
                p.drawContext_ground(grid, i, j, ":", 0,0); //for ground with water
            }
        }
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "_") {
                p.placeTile(i, j, p.random(3), 0); // Draw leaf tile
            }
            if (grid[i][j] == ":"){
                p.drawContext(grid, i, j, "_", 0, 0); //draw for leaf interacting with dirt 
            }
        }
    }

}

p.drawGlowingRune = function(i, j) {
    let offset = (i + j) * 0.1;
    let brightness = (p.sin(p.millis() * 0.002 + offset) * 0.5 + 0.5) * 255;  
    p.fill((255), (255), (255), brightness);
    p.noStroke();
    p.tint(255, brightness);
    p.square(j * p.tileSize + p.tileSize / 10, i * p.tileSize + p.tileSize / 10, p.tileSize / 10);
    p.noTint();

}

p.gridCheck = function(grid, i, j, target) {

    if (i < grid.length && i >= 0 && j < grid[0].length && j >= 0) {
        return grid[i][j] === target;
    }
    return false;
}

p.gridCode = function(grid, i, j, target) {
    let northbit = p.gridCheck(grid, i + 1, j, target) ? 1 : 0;
    let southbit = p.gridCheck(grid, i - 1, j, target) ? 1 : 0;
    let westbit = p.gridCheck(grid, i, j - 1, target) ? 1 : 0;
    let eastbit = p.gridCheck(grid, i, j + 1, target) ? 1 : 0;
    let code = (northbit << 0) + (southbit << 1) + (eastbit << 2) + (westbit << 3);
    return code;
}

p.drawContext = function(grid, i, j, target, ti, tj) {
    let code = p.gridCode(grid, i, j, target);
    const [tiOffset, tjOffset] = p.lookup[code];
    p.placeTile(i, j,  tiOffset, tjOffset);
}

p.drawContext_ground = function(grid, i, j, target, ti, tj) {
    let code = p.gridCode(grid, i, j, target);
    const [tiOffset, tjOffset] = p.lookup_ground[code];

    let lookupValue = p.lookup[0];
    if (lookupValue[0] === 0 && lookupValue[1] === 3) {

        lookupValue[1] = p.floor(p.random(3, 14));
    } 

    let lookupValue_ground = p.lookup_ground[0];
    if (lookupValue_ground[0] === 0 && lookupValue_ground[1] === 14) {
        let options = [[0, 14], [1, 14], [2, 14]]; //choose one of these
        lookupValue_ground = p.random(options);
    }

    p.placeTile(i, j,  tiOffset, tjOffset);
    if (tiOffset === 0 && tjOffset === 14) {
        p.drawGlowingRune(i, j);
    }

}

p.lookup = [
    [0, 3],  // 0000: No neighbors neightbors == same block
    [5, 2],  // 0001: North neighbor  
    [5, 0],  // 0010: South neighbor
    [14, 0],  // 0011: North and South neighbors
    [6,1],  // 0100: West neighbor
    [6, 2],  // 0101: West and North neighbors
    [6, 0],  // 0110: West and South neighbors
    [6, 2],  // 0111: West, North, and South neighbors
    [4, 1],  // 1000: East neighbor
    [4, 2],  // 1001: East and North neighbors
    [4, 0],  // 1010: East and South neighbors
    [4, 1],  // 1011: East, North, and South neighbors
    [4, 10],  // 1100: East and West neighbors // hallway
    [0, 3],  // 1101: East, West, and North neighbors
    [4, 0],  // 1110: East, West, and South neighbors
    [9, 0],  // 1111: East, West, North, and South neighbors
];

p.lookup_ground = [
  [0, 14],  // 0000: No neighbors neightbors == same block
  
  [10, 5],  // 0001: North neighbor
  [10, 3],  // 0010: South neighbor
  [11, 5],  // 0011: North and South neighbors
  [11, 4],  // 0100: West neighbor
  [11, 4],  // 0101: West and North neighbors
  [10, 3],  // 0110: West and South neighbors
  [0, 3],  // 0111: West, North, and South neighbors
  [9, 4],  // 1000: East neighbor
  [9, 5],  // 1001: East and North neighbors
  [9, 3],  // 1010: East and South neighbors
  [9, 4],  // 1011: East, North, and South neighbors
  [11, 5],  // 1100: East and West neighbors // hallway
  [10, 5],  // 1101: East, West, and North neighbors
  [10, 3],  // 1110: East, West, and South neighbors
  [0, 3],  // 1111: East, West, North, and South neighbors
];

p.tileSize = 16;
};

let myp52 = new p5(sketch1, 'canvas-container2');
