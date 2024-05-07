/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function p4_inspirations() {
    //create an image object with name and src attributes
    let imgO = {}
    imgO.assetUrl = 'https://cdn.glitch.global/0081e994-f827-44aa-a22a-599a0bedf893/Luffys-Awakening-Sun-God-Nika-Gear-5.jpeg?v=1714621714713'
    imgO.name = 'Sun God Nika Gear 5';
    imgO.credit = 'One Piece : https://hdlivewall.com/anime/luffys-awakening-sun-god-nika-gear-5-live-wallpaper/';
    console.log(imgO);
    let imgT = {}
    imgT.assetUrl = 'https://cdn.glitch.global/0081e994-f827-44aa-a22a-599a0bedf893/image_2024-05-03_181638537.png?v=1714785399489'
    imgT.name = 'Tree';
    imgT.credit = 'Tree: https://cdn.tutsplus.com/photo/uploads/legacy/278_blackandwhite/moiseslevy.jpg';
    let imgF = {}
    imgF.assetUrl = "https://cdn.glitch.global/0081e994-f827-44aa-a22a-599a0bedf893/8061731c-5e05-4eb4-a8c4-b1e8d89ca4ab.image.png?v=1714789284189"
    imgF.name = 'Freddie Mercury';
    imgF.credit = 'Freddie Mercury: https://c.wallhere.com/photos/ab/86/Queen_Freddie_Mercury-214777.jpg!d';
    let imgC = {}
    imgC.assetUrl = "https://cdn.glitch.global/0081e994-f827-44aa-a22a-599a0bedf893/f4beb845-3fba-4832-a1dd-2cf8691dd670.image.png?v=1715034624330"
    imgC.name = 'Lunch atop a Skyscraper';
    imgC.credit = 'Lunch atop a Skyscraper, Charles Clyde Ebbets, 1932';
    let imgG = {}
    imgG.assetUrl = "https://cdn.glitch.global/0081e994-f827-44aa-a22a-599a0bedf893/de4b0034-d130-4093-99cc-432266cf2fa7.image.png?v=1715053884780"
    imgG.name = 'Galaxy';
    imgG.credit = 'Galaxy: https://astrophotography-telescope.com/25-years-of-hubble-the-best-images-of-the-space-telescope/';
    
    return [imgO, imgT, imgF, imgC , imgG];

    return [];
  }
  
  function p4_initialize(inspiration) {
    let canvasContainer = $('.image-container'); // Select the container using jQuery
    let canvasWidth = canvasContainer.width(); // Get the width of the container
    let aspectRatio = inspiration.image.height / inspiration.image.width;
    let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
    resizeCanvas(canvasWidth, canvasHeight);
    $(".caption").text(inspiration.credit); // Set the caption text

  // add the original image to #original
    const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
    $('#original').empty();
    $('#original').append(imgHTML);
    
    resizeCanvas(inspiration.image.width/4, inspiration.image.height/4);
    let imgX = Math.round(map(0, 0, width, 0, inspiration.image.width));
    let imgY = Math.round(map(0, 0, height, 0, inspiration.image.height));
    let c = inspiration.image.get(imgX, imgY);
    
    let design = {
      color: ([random(255), random(255), random(255)]), // Random color
      size: random(10, 100), // Random size between 10 and 100
      shape: random(['circle', 'square', 'triangle']), // Random shape
      fg: [],
      bg: c
    };

    for(let i = 0; i < 2500; i++) {
      design.fg.push({x: random(width),
                      y: random(height),
                      w: random(width/2),
                      h: random(height/2),
                      fill: ""})
    }
  
    console.log(design);
    // console.log(design.color[0]);
    // console.log(design.color[1]);
    // console.log(design.color[2]);

    return design;
  }
  
  let shapesDrawn = 0;
  let maxShapes = 1000; // Adjust this value based on the size of your shapes and the size of your canvas
  //if restart is clicked, the shapesDrawn is reset to 0
  
  function p4_render(design, inspiration) {
    noStroke();
    background(design.bg);

    let numShapes = maxShapes // Draw up to 100 shapes at a time
    // for (let box of design.fg) {
    //   //get color from design and apply to the shape
    //   let posX = box.x;
    //   let posY = box.y;
    //   let imgX = Math.round(map(posX, 0, width, 0, inspiration.image.width));
    //   let imgY = Math.round(map(posY, 0, height, 0, inspiration.image.height));
    //   let c = inspiration.image.get(imgX, imgY);
    //   box.fill = c;
    //   fill(c);
    //   if (design.shape === 'circle') {
    //     ellipse(posX, posY, box.w);
    //   }
    //   else if (design.shape === 'square') {
    //     rect(posX, posY, box.w, box.h);
    //   }
    //   else if (design.shape === 'triangle') {
    //     triangle(posX, posY, posX - box.w / 2, posY + box.h / 2, posX + box.w / 2, posY + box.h / 2);
    //   }
    // }


    for (let i = 0; i < 2500; i++) {
    // Sample a color from a random position in the inspiration image
    // let posX = random(width);
    // let posY = random(height);
    let posX = design.fg[i].x;
    let posY = design.fg[i].y;

    // Map the position to the corresponding position in the inspiration image
    let imgX = Math.round(map(posX, 0, width, 0, inspiration.image.width));
    let imgY = Math.round(map(posY, 0, height, 0, inspiration.image.height));

    // Sample the color from the mapped position in the inspiration image
    let c = inspiration.image.get(imgX, imgY);

    // Set the fill color to the sampled color
    fill(c);

    // Draw the shape at the calculated position
    if (design.shape === 'circle') {
      ellipse(posX, posY, design.size);
    } else if (design.shape === 'square') {
      rect(posX, posY, design.size, design.size);
    } else if (design.shape === 'triangle') {
      triangle(posX, posY, posX - design.size / 2, posY + design.size / 2, posX + design.size / 2, posY + design.size / 2);
    }

    // shapesDrawn++;
    // if (shapesDrawn >= maxShapes) {
    //   break;
    // }
  }

}
  let MshapesDrawn = 0;
  let MmaxShapes = 10000;   

  
  function p4_mutate(design, inspiration, rate) {
    // Mutate the size
    design.size = mut(design.size, 10, 100, rate);


  //   for (let box of design.fg) {
      
  //     let posX = box.x;
  //     let posY = box.y;
  //     let imgX = Math.round(map(posX, 0, width, 0, inspiration.image.width));
  //     let imgY = Math.round(map(posY, 0, height, 0, inspiration.image.height));
  //     let c = inspiration.image.get(imgX, imgY);
  //     box.fill = c;
  //     fill(c);
  //     box.x = mut(box.x, 0, width, rate);
  //     box.y = mut(box.y, 0, height, rate);
  //     box.w = mut(box.w, 0, width/2, rate);
  //     box.h = mut(box.h, 0, height/2, rate);
  //   }
  // }
    // Mutate the color (if needed)
  
    // Draw the shapes
  //   let MnumShapes = min(MmaxShapes - MshapesDrawn, 100); // Draw up to 10 shapes at a time
    for (let i = 0; i < 2500; i++) {

      // Mutate the position of the shape
      // let posX = mut(random(width), 0, width, rate);
      // let posY = mut(random(height), 0, height, rate);
      // let posX = random(width);
      // let posY = random(height);
      let posX = design.fg[i].x;
      let posY = design.fg[i].y;
  
      // Sample a color from a random position in the inspiration image
      let imgX = Math.round(map(posX, 0, width, 0, inspiration.image.width));
      let imgY = Math.round(map(posY, 0, height, 0, inspiration.image.height));
  
      // Sample the color from the mapped position in the inspiration image
      let c = inspiration.image.get(imgX, imgY);
  
      // Set the fill color to the sampled color
      fill(c);
  
      // Draw the shape at the calculated position
      if (design.shape === 'circle') {
        design.fg[i].x = mut(design.fg[i].x, 0, width, rate);
        design.fg[i].y = mut(design.fg[i].y, 0, height, rate);
        design.fg[i].w = mut(design.fg[i].w, 0, width/2, rate);
        design.fg[i].h = mut(design.fg[i].h, 0, height/2, rate);
        ellipse(posX, posY, design.size);
      } else if (design.shape === 'square') {
        design.fg[i].x = mut(design.fg[i].x, 0, width, rate);
        design.fg[i].y = mut(design.fg[i].y, 0, height, rate);
        design.fg[i].w = mut(design.fg[i].w, 0, width/2, rate);
        design.fg[i].h = mut(design.fg[i].h, 0, height/2, rate);
        rect(posX, posY, design.size, design.size);
      } else if (design.shape === 'triangle') {
        design.fg[i].x = mut(design.fg[i].x, 0, width, rate);
        design.fg[i].y = mut(design.fg[i].y, 0, height, rate);
        design.fg[i].w = mut(design.fg[i].w, 0, width/2, rate);
        design.fg[i].h = mut(design.fg[i].h, 0, height/2, rate);
        triangle(posX, posY, posX - design.size / 2, posY + design.size / 2, posX + design.size / 2, posY + design.size / 2);
      }
  
      // MshapesDrawn++;
      // if (MshapesDrawn >= MmaxShapes) {
      //   break;
      // }
    }
  }
  
      
    
    function mut(num, min, max, rate) {
      // console.log("mutating: " + num + " at rate: " + rate + " between " + min + " and " + max)
      return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
    }