/*
Title: Kiki do you love me?
Author: Youcy Chen
This code uses a camera and a microphone. 
The camera captures the position of the user's head to change the position of the generated model. 
The microphone captures what the user says, and the code counts the number of A, I, U, P, T letters in the speech, 
each letter represents a model, and is generated on the screen。
how to play: speak something and move your head
*/
let range = 100;
let offsetX = 0;
let video, poseNet;
let poses = [];
let pose;
let noseX, noseY;

let trumpet;
let modelDisplay;

let speechRec, continuous, interimResults;

let statusPrompt, modelListPrompt;

let spc,numIters,a,block,gape,sc;
let v = [],c = [];; 
let f = 1;
let f2 = 2;
let txt = [];
let num, num2,num3,num4,num5,num6,num7,num8,num9,num10;


//count the number of AbeginDrawLinecters
let counti=0, counta=0, countu=0, countp=0, countt=0;
let fontRegular, count;

let AbeginDrawLine,
    IbeginDrawLine,
    UbeginDrawLine,
    PbeginDrawLine,
    TbeginDrawLine;
let inkPattern1,inkPattern2,inkPattern3;

let Ai = 0,Ii = 0,Ui = 0,Pi = 0, Ti =0;

function preload() {
  bg = loadImage('assets/papertexture-2061710_1920.jpeg');//background the paper texture
  material = loadImage('3d/texture/3d_manga-standard_BaseColor.png');//texture of the model
  //the 5 model
  A = loadModel('3d/A.obj', true);
  I = loadModel('3d/I.obj', true);
  U = loadModel('3d/U.obj', true);
  P = loadModel('3d/P.obj', true);
  T = loadModel('3d/T.obj', true);
  
}

function setup() {
  frameRate(10);
  createElement('h1', 'Tell me something you afraid to speak to others');
  createCanvas(1800,1200, WEBGL);
  angleMode(DEGREES);
  smooth();
  noStroke();
  modelDisplay = 0;
  
  numIters = 10;
  spc = 595 / numIters;
  a = spc / 2;
  sc = 1;

  //reference: https://editor.p5js.org/leoyouyang/sketches/l75RM8el1
  //Set up speech recognition 
  speechRec = new p5.SpeechRec('en-US', gotSpeech);
  continuous = true;
  interimResults = false;
  speechRec.start(continuous, interimResults);
  speechRec.onEnd = speechRestart;

  //Set up video capture
  video = createCapture(VIDEO);
  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
  
  //setTimeout(detectPose, 4000);
  
  noseX = width / 2;
  noseY = height / 2;
  video.hide();
  statusPrompt = createElement('h2', 'Loading...');

  //background
  background(255);
  push();
  texture(bg);
  plane(windowWidth, windowHeight);
  pop();
  
}

function gotPoses(poses) {
  //console.log(poses); 
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function draw() {
  //the default models in the middle(when you say I love you,I miss you...)
  push();
  texture(material);
  if (modelDisplay != 0)
    model(modelDisplay);
  pop(); 

  //*use head to move the perception
  let rX = map(noseY, 0, height, -range*0.75, range*0.75);
  let rY = map(noseX, 0, width, -range, range);
  rotateX(rX - offsetX);
  if (modelDisplay == trumpet)
    rotateY(rY - 90);
    else
    rotateY(rY);
    rotateZ(90);
  
  if (pose) {
  noseX = width - (pose.nose.x);
  noseY = pose.nose.y;  
  print("noseX="+ noseX);
  print("noseY="+ noseY);
     }  
  
  //draw stave here
  drawStave();
  
  
//draw A per 10 frame
  if (AbeginDrawLine) {   
    //call drawAFunction, draw drawAFunction one by one    
    if (frameCount %  10 == 0) {
      num = int(random(10));
      num2 = int(random(10));
      drawAFunction();
      Ai++;
    }
  }
  if (Ai == counta) {
    AbeginDrawLine = false;
    Ai = 0;
  }
 //draw I per 20 frame
 if (IbeginDrawLine) {
     if (frameCount %  20 == 0) {
      num3 = int(random(10));
      num4 = int(random(10));
      drawIFunction();
      Ii++;     
    }
  }
  if (Ii == counti) {
    IbeginDrawLine = false;
    Ii = 0;
  }
  
//draw U per 40 frame
if (UbeginDrawLine) {
    if (frameCount % 40 == 0) {
      num5 = int(random(10));
      num6 = int(random(10));
      drawUFunction();
      Ui++;
    }
  }
  if (Ui == countu) {
    UbeginDrawLine = false;
    Ui = 0;
  }
//draw P per 60 frame
if (PbeginDrawLine) {
    if (frameCount % 60 == 0) {
      num7 = int(random(10));
      num8 = int(random(10));
      drawPFunction();
      Pi++;
    }
  }
  if (Pi == countp) {
    PbeginDrawLine = false;
    Pi = 0;
  }
  
//draw T per 30 frame
if (TbeginDrawLine) {
    if (frameCount % 30 == 0) {
      num9 = int(random(10));
      num10 = int(random(10)); 
      drawTFunction();
      Ti++;
    }
  }
  if (Ti == countt) {
    TbeginDrawLine = false;
    Ti = 0;
  }
   
}

 // draw stave（ the box in the middle which can move by you head position)
function drawStave(){
   for (let i = 0; i < numIters; i++) {
    for (let j = 0; j < numIters; j++) {
     
      //position of stave(same with the pattern in drawLine function)
      push();
      rotateX(90);
      translate(-595/2,595/2,-400);
      
      //A
      push();
      rotateZ(0);      
      push();
      gape = (sqrt(3) * a) / 2;
      translate(i * spc,0, j * sqrt(3) * a + j * gape);
      drawStaveBlock();
      pop();
      pop();

      //I
      push();
      rotateZ(0);
      translate(0,-595,0);
      push();
      gape = (sqrt(3) * a) / 2;
      translate(i * spc,0, j * sqrt(3) * a + j * gape);
      drawStaveBlock();
      pop();
      pop();

      //U
      push();
      rotateZ(-90);
      push();
      gape = (sqrt(3) * a) / 2;
      translate(i * spc,0, j * sqrt(3) * a + j * gape);
      drawStaveBlock();
      pop();
      pop();

      //P
      push();
      rotateZ(-90);
      translate(0,595,0);
      push();
      gape = (sqrt(3) * a) / 2;
      translate(i * spc,0, j * sqrt(3) * a + j * gape);
      drawStaveBlock();
      
      pop();
      pop();
      pop();
      
    }
    
}
}
//*draw one block of stave*//
function drawStaveBlock(){
   
   for (let k = 0; k < 5; k++) {
    stroke(150,50);
    strokeWeight(1);
    line(2,0,((k * sqrt(3)) / 4) * a + 1, spc - 2,0,((k * sqrt(3)) / 4) * a + 1);
   }
}

function drawAFunction() { 
  //position of parttern 
  push();
      rotateX(90);
      translate(-595/2,595/2,-400);    
  push();
     rotateZ(0);
  push();
     gape = (sqrt(3) * a) / 2;
     translate(num * spc,0, num2 * sqrt(3) * a + num2 * gape);
     scale(0.8,0.8,0.8);//the scale
  // draw model here
  texture(material);
  model(A);
  pop();
  pop();
  pop();

}

function drawIFunction() { 
  //position of parttern
  push();
      rotateX(90);
      translate(-595/2,595/2,-400);  
  push();
    rotateZ(-90);
    translate(0,595,0);
  push();
     gape = (sqrt(3) * a) / 2;
     translate(num3 * spc,0, num4 * sqrt(3) * a + num4 * gape);
     scale(0.8,0.8,0.8);
  //draw model here
  texture(material);
  model(I);
  pop();
  pop();
  pop();

}

function drawUFunction() { 
  //position of parttern
  push();
      rotateX(90);
      translate(-595/2,595/2,-400);    
  push();
    rotateZ(-90);
  push();
     gape = (sqrt(3) * a) / 2;
     translate(num5 * spc,0, num6 * sqrt(3) * a + num6 * gape);
     scale(0.8,0.8,0.8);
  // draw model here
  texture(material);
  model(U);
  pop();
  pop();
  pop();

}

function drawPFunction() { 
  //position of parttern
  texture(material);
  push();
      rotateX(90);
      translate(-595/2,595/2,-400);    
  push();
    rotateZ(-90);
    translate(0,595,0);
  push();
     gape = (sqrt(3) * a) / 2;
     translate(num7 * spc,0, num7 * sqrt(3) * a + num8 * gape);
     scale(0.8,0.8,0.8);
  // draw model here
  texture(material);
  model(P);
  pop();
  pop();
  pop();

}

function drawTFunction() { 
  //position of parttern
  push();
      rotateX(90);
      translate(-595/2,595/2,-400);     
  push();
    rotateZ(-90);
    translate(0,595,0);
  push();
     gape = (sqrt(3) * a) / 2;
     translate(num9 * spc,0, num10 * sqrt(3) * a + num10 * gape);
     scale(0.8,0.8,0.8);
  // draw model here
  texture(material);
  model(T);
  pop();
  pop();
  pop();

}



//say something to start
function modelReady() {
  statusPrompt.html('Ready!<br>Say something to start.');
  modelListPrompt = createP('Try to say<br>I love you, I miss you, I love you more, I hate you');
}

// //detect my head position
// function detectPose() {
//   poseNet.on('pose', function(results) {
//     poses = results;
//     noseX = width - (poses[0].pose.nose.x);
//     noseY = poses[0].pose.nose.y;
//      console.log("noseX="+ noseX);
//      console.log("noseY="+ noseY);
//   });
// }

//show model in the middle
function gotSpeech() {
  if (speechRec.resultValue) {
    let said = speechRec.resultString;
    
    //*countForDraw: count the number of "A,I,U,P,T" characters in what you said.
   count_occur(said);
    
    
    if (said == 'I love you')
      modelDisplay = A;
    else if (said == 'I miss you')
      modelDisplay = I;
    else if (said == 'I hate you')
      modelDisplay = U;
    else if (said == 'I love you more')
      modelDisplay = P;
    else if (said == 'Thank You')
      modelDisplay = T;
    else
      modelDisplay = 0;

    //Update status prompt
    // if (modelDisplay == 0) {
      statusPrompt.html("I am sure you will be OK soon :-( <br>You just said: " + capitalLetter(said));
    } else {
      statusPrompt.html(capitalLetter(said) + '<br>Move your head to observe it.');
    }
    
}

function speechRestart() {
  speechRec.start(continuous, interimResults);
}

function capitalLetter(str) {
  str = str.split(" ");
  for (let i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }
  return str.join(" ");
}

//fullscreen
function mousePressed() {
  if(mouseButton === RIGHT) {
    if (mouseX > 0 && mouseX < windowWidth && mouseY > 0 && mouseY < windowHeight) {
      let fs = fullscreen();
      fullscreen(!fs);
    }
}
  
}

function keyPressed() {
  if (key === "s") {
    save("img.png");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  //setup();
  
  createCanvas(windowWidth, windowHeight-300, WEBGL);
  noStroke();
  push();
  texture(bg);
  plane(windowWidth, windowHeight);
  pop();
}

// count the number of the AbeginDrawLinecter: i,a,u,p,t;
function count_occur(str) {
  // checking string is valid or not
  if (str.length == 0) {
    console.log("Invalid string");
    return;
  }
  //cor loop to iterate over string
  for (let i = 0; i < str.length; i++) {
    //variable counting occurrence
    let count = 0;

    for (let j = 0; j < str.length; j++) {
      if (str[i] == str[j] && i > j) {
        break;
      }
      if (str[i] == str[j]) {
        count++;
      }
    }
    if (count > 0) {
      //console.log(`${str[i]} occurs ${count} times`);

      if (str[i] == "i") {
        counti = count;
        console.log(`${str[i]} occurs ${counti} times`);
        IbeginDrawLine = true;
        print("IbeginDrawLine= "+IbeginDrawLine);
      }
      if (str[i] == "a") {
        counta = count;
        console.log(`${str[i]} occurs ${counta} times`);
        AbeginDrawLine = true;
      }
      if (str[i] == "u") {
        countu = count;
        console.log(`${str[i]} occurs ${countu} times`);
        UbeginDrawLine = true;
      }
      if (str[i] == "p") {
        countp = count;
        console.log(`${str[i]} occurs ${countp} times`);
        PbeginDrawLine = true;
      }
      if (str[i] == "t") {
        countt = count;
        console.log(`${str[i]} occurs ${countt} times`);
        TbeginDrawLine = true;
      }
    }
  }
}