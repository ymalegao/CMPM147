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


function p3_preload() {
// Load piano sound buffers


}
const pianoSounds = {
  "C3": "key01.mp3",
  "D3": "key02.mp3",
  "E3": "key03.mp3",
  "F3": "key04.mp3",
  "G3": "key05.mp3",
  "A3": "key06.mp3",
  "B3": "key07.mp3",
  "C4": "key08.mp3",
  "D4": "key09.mp3",
  "E4": "key10.mp3",
  // "F4": "key11.mp3",
  // "G4": "key12.mp3",
  // "A4": "key13.mp3",
  // "B4": "key14.mp3",
  // "C5": "key15.mp3",
  // "D5": "key16.mp3",
  // "E5": "key17.mp3",
  // "F5": "key18.mp3",
  // "G5": "key19.mp3",
  // "A5": "key20.mp3",
  // "B5": "key21.mp3",
};

for (let note in pianoSounds) {
  let noteName = note.slice(0, -1); // Get the note name without the octave
  let octave = parseInt(note.slice(-1)); // Get the octave

  // Increase the octave for the right side
  if (noteName >= 'G') {
    octave++;
  }

  // Decrease the octave for the left side
  else if (noteName <= 'D') {
    octave--;
  }

  // Update the note name in the object
  pianoSounds[noteName + octave] = pianoSounds[note];
  delete pianoSounds[note];
}


const piano = new Tone.Sampler(pianoSounds, {
  onload: () => {
    console.log("Piano sounds loaded successfully!");
  },
    onerror: (error) => console.error('Error loading sampler:', error),

  baseUrl: "audio/",
}).toDestination();



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
  return 32;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

let notes = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5'];


function isKeyWhite(i, j) {
  let keyPattern = [0, 1, 0, 1, 0, 0, 1, 0];
  return keyPattern[i % 3] === 0;
} 

function isKeyBlack(i) {
  switch ((i + 12) % 12) {
    case 1:
    case 3:
    case 6:
    case 8:
    case 10:
      return true; // The key is black
    default:
      return false; // The key is white
  }
}

function p3_tileClicked(i, j) {
  // Check if the clicked tile is a white or black key
  if (!isKeyWhite(i, j) && !isKeyBlack(i)) {
    return; // If it's not, exit the function without playing a sound
  }

  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);

  // Calculate a unique index for each key based on its i and j values
  let noteIndex = (Math.abs(i) + Math.abs(j)) % notes.length;  
  let note = notes[noteIndex];
  let noteValue = notes.indexOf(note);
  let combinedValue = (noteValue + parseInt(worldSeed)) % notes.length;
  let resultingNote = notes[combinedValue];

  // Play the note
  // console.log(i, j, noteIndex, resultingNote);
  piano.triggerAttackRelease(resultingNote, '8n', Tone.now());
}

function p3_drawBefore() {}
function p3_drawTile(i, j, offsetX) {
  // Determine if the current key is a white key or a black key
  let keyPattern = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0]; // 0 for white keys, 1 for black keys
  let isWhiteKey = keyPattern[i % 12] === 0;
  let black  = isKeyBlack(i);

  // Set the fill color based on whether it's a white or black key

  // Calculate the position of the tile based on its index
  let x = (i - j) * tw + offsetX; // Include the camera offset and adjust for diagonal grid
  let y = (i + j) * th / 2; // Adjust for diagonal grid

  // Draw the white key shape
  push();
  beginShape();
  fill(255);
  vertex(x, y); // Bottom left corner
  vertex(x + tw * 2, y); // Bottom right corner
  vertex(x + tw * 2, y - th * 4); // Top right corner
  vertex(x, y - th * 4); // Top left corner
  endShape(CLOSE);
  pop();

  // Draw the black key shape
  if (!isWhiteKey) {
    let blackKeyWidth = tw/2; // Adjust the width of the black keys
    let blackKeyHeight = th*2; // Adjust the height of the black keys
    let blackKeyX = x + tw - blackKeyWidth*2; // Adjust the x-position of the black keys
    let blackKeyY = y - th * 2; // Adjust the y-position of the black keys

    push();
    fill(0);
    beginShape();
    vertex(blackKeyX, blackKeyY); // Bottom left corner
    vertex(blackKeyX + blackKeyWidth, blackKeyY); // Bottom right corner
    vertex(blackKeyX + blackKeyWidth, blackKeyY - blackKeyHeight); // Top right corner
    vertex(blackKeyX, blackKeyY - blackKeyHeight); // Top left corner
    endShape(CLOSE);
    pop();
  }
}



function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);
  
  
  noStroke();
  fill(0);
  text("tile " + [i, j], i * tw, j * th); // Adjust the position of the text
}

function p3_drawAfter() {}
