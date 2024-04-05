// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  // create an instance of the class
    const fillers = {
      message: [
        "Hear ye, Hear ye",
        "Attention, fellow citizens",
        "My fellow countrymen",
        "Gentlemen and ladies",
      ],
      emotion: ["sad", "appalled", "terrified", "horrified", "mortified"],
      emotion2: ["happy", "glad", "delighted", "encouraged", "hopeful"],
      twitterhandle: [
        "@JamesMadison",
        "@KingofFrance",
        "@Englandh8er",
        "@JohnAdams",
        "@ThomasJefferson",
      ],
      enemies: [
        "the British",
        "King George",
        "foreign invaders",
        "tyranny",
        "oppression",
        "injustice",
      ],
      adjective: [
        "great",
        "lousy",
        "young",
        "developing",
        "flourishing",
        "struggling",
        "prosperous",
        "free",
      ],
      senator: [
        "@AaronBurr",
        "@JohnHancock",
        "@BenjaminFranklin",
        "@GeorgeWashington",
        "@PhillipSchuyler",
      ],
      tweeter: [
        "@AlexanderHamilton",
        "@ThomasPaine",
        "@JohnJay",
        "@AbigailAdams",
        "@MarquisdeLafayette",
      ],
    };
    
    const template = `$message!
                      I am $emotion yet $emotion2 by the actions committed by $enemies. We must rally together as a nation.
                      I beseech thee, $twitterhandle, to stand with me in this hour of need. I seek only the welfare of our $adjective land.
                      Let it be known to $senator that we shall draft laws to avenge these transgressions.
                      Your obedient servant,
                      $tweeter`;
    
    // STUDENTS: You don't need to edit code below this line.
    
    const slotPattern = /\$(\w+)/;
    
    function replacer(match, name) {
      let options = fillers[name];
      if (options) {
        return options[Math.floor(Math.random() * options.length)];
      } else {
        return `<UNKNOWN:${name}>`;
      }
    }
    
    function generate() {
      let story = template;
      while (story.match(slotPattern)) {
        story = story.replace(slotPattern, replacer);
      }
    
      /* global box */
      $("#box").text(story);


    }
    
    /* global clicker */
    $("#clicker").click(generate);    
    generate();
  }

// let's get this party started - uncomment me
main();