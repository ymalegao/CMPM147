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

function p3_preload() {}

function p3_setup() {}

let worldSeed;

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
let dadJokes = [
  "Why couldn't the bicycle stand up by itself? It was two-tired!",
  "I'm reading a book on anti-gravity. It's impossible to put down!",
  "What do you call fake spaghetti? An impasta!",
  "Why don't skeletons fight each other? They don't have the guts!",
  "What do you call a fake noodle? An impasta!",
  "I told my wife she should embrace her mistakes. She gave me a hug!",
  "I'm reading a book on the history of glue. I just can't seem to put it down!",
  "I'm terrified of elevators, so I'm taking steps to avoid them!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "Parallel lines have so much in common. It’s a shame they’ll never meet!",
  "Why did the math book look sad? Because it had too many problems!",
  "I used to play piano by ear, but now I use my hands!",
  "What do you call an alligator in a vest? An investigator!",
  "I'm on a seafood diet. I see food and I eat it!",
  "What's orange and sounds like a parrot? A carrot!",
  "I'm reading a book about anti-gravity. It's impossible to put down!",
  "Why don’t scientists trust atoms? Because they make up everything!",
  "What's orange and sounds like a parrot? A carrot!",
  "I wouldn't buy anything with velcro. It's a total rip-off!",
  "What do you call fake spaghetti? An impasta!",
  "I told my wife she should embrace her mistakes. She gave me a hug!",
  "I'm terrified of elevators, so I'm taking steps to avoid them!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "Parallel lines have so much in common. It’s a shame they’ll never meet!",
  "Why did the math book look sad? Because it had too many problems!",
  "I used to play piano by ear, but now I use my hands!",
  "What do you call an alligator in a vest? An investigator!",
  "I'm on a seafood diet. I see food and I eat it!",
  "What's orange and sounds like a parrot? A carrot!",
  "I'm reading a book about anti-gravity. It's impossible to put down!",
  "Why don’t scientists trust atoms? Because they make up everything!",
  "What's orange and sounds like a parrot? A carrot!",
  "I wouldn't buy anything with velcro. It's a total rip-off!",
  "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later.",
  "Did you hear about the guy whose whole left side was cut off? He's all right now.",
  "Why didn’t the skeleton cross the road? Because he had no guts.",
  "What did one nut say as he chased another nut?  I'm a cashew!",
  "Where do fish keep their money? In the riverbank",
  "I accidentally took my cats meds last night. Don’t ask meow.",
  "Chances are if you' ve seen one shopping center, you've seen a mall.",
  "Dermatologists are always in a hurry. They spend all day making rash decisions. ",
  "I knew I shouldn't steal a mixer from work, but it was a whisk I was illing to take.",
  "I won an argument with a weather forecaster once. His logic was cloudy...",
  "How come the stadium got hot after the game? Because all of the fans left.",
  "Why do seagulls fly over the ocean? Because if they flew over the bay, we'd call them bagels.",
  "Why was it called the dark ages? Because of all the knights. ",
  "A steak pun is a rare medium well done.",
  "Why did the tomato blush? Because it saw the salad dressing.",
  "Did you hear the joke about the wandering nun? She was a roman catholic.",
  "What creature is smarter than a talking parrot? A spelling bee.",
  "I'll tell you what often gets over looked... garden fences.",
  "Why did the kid cross the playground? To get to the other slide.",
  "Why do birds fly south for the winter? Because it's too far to walk.",
  
];
let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};
let jokes = {}; // Object to store the jokes and their positions


function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  let joke = dadJokes[Math.floor(random(dadJokes.length))];
  jokes[[i, j]] = joke;




}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  // noStroke();

  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    fill(300);
  } else {
    fill(300);
  }

  push();

  // beginShape();
  // vertex(-tw, 0);
  // vertex(0, th);
  // vertex(tw, 0);
  // vertex(0, -th);
  // endShape(CLOSE);

  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    fill(0, 0, 0, 32);
    if (jokes[[i, j]]) {
      textSize(12);
      textAlign(CENTER);
      fill(1);
      //make text float up and down using time
      let offset = (i + j) * 0.1;
      //make text go up
      let brightness = (sin(millis() * 0.001) * 0.2 + 0.2) * 20;

      
      text(jokes[[i, j]], 0, brightness);
    }
    translate(0, -10);
    fill(255, 255, 100, 128);
    // ellipse(0, 0, 10, 5);
    // translate(0, -10);
    // fill(255, 255, 100, 128);
    // ellipse(0, 0, 10, 10);
  }

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

function p3_drawAfter() {}
