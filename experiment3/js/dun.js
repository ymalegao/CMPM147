/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

// let seed = 0;
// let tilesetImage;
// let currentGrid = [];
// let numRows, numCols;

let sketch = function(p) {
    p.seed = 0;
    p.tilesetImage = null;
    p.currentGrid = [];
    p.numRows = 0;
    p.numCols = 0;
    p.canvasContainer = null;
    p.tileSize = 16;
    p.lookupDun = [
        [0, 10],  // 0000: No neighbors
        [6, 23],  // 0001: North neighbor
        [6, 21],  // 0010: South neighbor
        [0, 0],  // 0011: North and South neighbors
        [7, 22],  // 0100: West neighbor
        [7, 23],  // 0101: West and North neighbors
        [7, 21],  // 0110: West and South neighbors
        [5, 29],  // 0111: West, North, and South neighbors
        [5, 22],  // 1000: East neighbor
        [5, 23],  // 1001: East and North neighbors
        [5, 21],  // 1010: East and South neighbors
        [0, 0],  // 1011: East, North, and South neighbors
        [0, 0],  // 1100: East and West neighbors // hallway
        [0, 0],  // 1101: East, West, and North neighbors
        [6, 21],  // 1110: East, West, and South neighbors
        [0, 0],  // 1111: East, West, North, and South neighbors
    ];
    
    p.preload = function() {
        p.tilesetImage = p.loadImage(
        "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
        );
    };
    
    p.reseed = function() {
        p.seed = (p.seed | 0) + 1109;
        p.randomSeed(p.seed);
        p.noiseSeed(p.seed);
        p.select("#seedReport").html("seed " + p.seed);
        p.regenerateGrid();
    };
    
    p.regenerateGrid = function() {
        p.select("#asciiBox2").value(p.gridToString(p.generateGrid(p.numCols, p.numRows)));
        p.reparseGrid();

    };

    p.reparseGrid = function() {
        p.currentGrid = p.stringToGrid(p.select("#asciiBox2").value());
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
        p.numCols = p.select("#asciiBox2").attribute("rows") | 0;
        p.numRows = p.select("#asciiBox2").attribute("cols") | 0;
        let canvas2 = p.createCanvas(16*30, 16*30);
        canvas2.parent("canvas-container2");
    
        p.canvasContainer = $("#canvas-container2");
    
        p.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;
    
        p.select("#reseedButton").mousePressed(p.reseed);
        p.select("#asciiBox2").input(p.reparseGrid);
    
        p.reseed();
    }

    p.draw = function() {
        p.randomSeed(p.seed);
        p.drawGrid(p.currentGrid);
    }

    p.placeTile = function(i, j, ti, tj) {
        p.image(p.tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
    }

    p.generateGrid = function(numCols, numRows) {
        let grid = [];
        for (let i = 0; i < numRows; i++) {
          let row = [];
          for (let j = 0; j < numCols; j++) {
            row.push("_");
          }
          grid.push(row);
        }
        
        let rooms = 10;
        let startcoords = [];
        let endcoords = [];
        
        const minWidth = 5;
        const maxWidth = 10;
        const minHeight = 3;
        const maxHeight = 9;
        const minDistanceFromEdge = 1;
      
      
        for (let r = 0; r < rooms; r++) {
          let roomwidth = p.floor(p.random(minWidth, maxWidth));
          let roomheight = p.floor(p.random(minHeight, maxHeight));
          
          let startX = p.floor(p.random(minDistanceFromEdge, numCols - roomwidth - minDistanceFromEdge));          //generate random coordinates for the room

          let startY = p.floor(p.random(minDistanceFromEdge, numRows - roomheight - minDistanceFromEdge));
          
          
          let overlaps = false; //this is to check if the room overlaps with any previously generated room
          for (let i = 0; i < startcoords.length; i++) {
            let [prevStartX, prevStartY] = startcoords[i];
            let [prevEndX, prevEndY] = endcoords[i];
            if (
              startX < prevEndX &&
              startY < prevEndY &&
              startX + roomwidth > prevStartX &&
              startY + roomheight > prevStartY
            ) {
              overlaps = true;
              break;
            }
          }
          
          //f the room overlaps, generate a new room
          if (overlaps) {
            r--;
            continue;
          }
          
          endcoords.push([startX + roomwidth, startY + roomheight]);  //add coords
          startcoords.push([startX, startY]); 
      
          for (let x = startX; x < startX + roomwidth; x++) {
            for (let y = startY; y < startY + roomheight; y++) {
              grid[x][y] = ".";
            }
          }
        }
        //loop thorugh and generate gallways to connect rooms
      
        for ( let i = 0; i < rooms-1; i++){
          p.calculateHallway(grid, startcoords[i][0], startcoords[i][1], endcoords[i+1][0], endcoords[i+1][1])
        }
        return grid;
    }

    p.drawGrid = function(grid) {
        p.background(1);
      
        for (let i = 0; i < grid.length; i++) {
          for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === "_") {
              p.placeTile(i, j, p.random(3) |0 , 16);
              if (p.random() < 0.2) p.drawGlowingRune(i, j);
            
      
      
            
            } else if (grid[i][j] == 'd'){ // dont need this tbh
              p.placeTile(i, j, 5, 25);
      
            }
            
            else {
              // Draw other context
              p.drawContext(grid, i, j, "_", 4, 0);
            }
          }
        }
    }

    p.drawGlowingRune = function(i, j) {
       
        let brightness = p.noise(i * 0.2, j * 0.2, p.millis() * 0.004) * 255;
        p.fill(p.random(255), p.random(255), p.random(255), brightness); // jewls/
       
        p.noStroke();
        p.square(j * p.tileSize + p.tileSize / 4, i * p.tileSize + p.tileSize / 4, p.tileSize / 4);
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
        let code =
          (northbit << 0) + (southbit << 1) + (eastbit << 2) + (westbit << 3);
        // console.log("code " + code)
        return code;
    }

    p.drawContext = function(grid, i, j, target, ti, tj) {
        let code = p.gridCode(grid, i, j, target);
        const [tiOffset, tjOffset] = p.lookupDun[code];
        // console.log("tiOffset " + tiOffset, "tjOffset " + tjOffset );
        if (code == "0001"){
          if (p.random() < 0.2){
              p.placeTile(i, j,  4, 28); ///spawn treasure 
          
    
          }
         if (p.random() < 0.2){
            p.placeTile(i,j,28,1)
            p.placeTile(i-1,j,28,0) // spawn tower
          }
        }
        p.placeTile(i, j,  tiOffset, tjOffset);
    }

    p.calculateHallway = function(grid, startX, startY, endX, endY) {
        //find direction so that the start and end range is not verticle when you need to go horizaton
        const isHorizontal = Math.abs(startX - endX) > Math.abs(startY - endY);
        
        const rangeStart = isHorizontal ? Math.min(startX, endX) : Math.min(startY, endY);
        const rangeEnd = isHorizontal ? Math.max(startX, endX) : Math.max(startY, endY);
        
        //centers of buildings
        const centerX = Math.floor((startX + endX) / 2);
        const centerY = Math.floor((startY + endY) / 2);
        
      
        for (let i = rangeStart; i <= rangeEnd; i++) {
          //make a 2 narrow hallway if is horizontal, else do for verticle
          if (isHorizontal) {
            
            for (let j = centerY - 1; j <= centerY + 1; j++) {
              if (grid[i][j] !== '.') {
                grid[i][j] = '.';
              }
            }
          } else {
            // Ensure minimum height for vertical hallway
            for (let j = centerX - 1; j <= centerX + 1; j++) {
              if (grid[j][i] !== '.') {
                grid[j][i] = '.';
              }
            }
          }
        }
        
        return grid;
    }
}

let myp5 = new p5(sketch);
