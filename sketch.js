"use strict";

var frame = 0;
//how many frames to capture
var totalFrames = 800;

var canvas;
var capturer;
var spacing = 1; //how close can they get?
var dr = 0.5;
var spawnProbability = 90;
var maxAge = 500;

var colors = ["#fc0","#ff5c00","#0066ff","#ee1111","#ff2e00"];
//var colors = ["#eee","#aaa","#111","#333"];

var circs = [];

function setup() {
  //square
  var canvasHeight, canvasWidth;
  canvasHeight = canvasWidth = window.innerHeight * 0.8;
  
  //use the shorter of the two dimensions
  if( window.innerHeight > window.innerWidth) {
    canvasHeight = canvasWidth = window.innerWidth * 0.9;
  }  
  
  canvas = createCanvas(canvasWidth, canvasHeight);
  //canvas = createCanvas(window.innerWidth, window.innerHeight);
  
  if(totalFrames > 0) {
    //capturer = new CCapture( { format: 'webm', verbose: true } );
    capturer = new CCapture( { format: 'png' } );
    //capturer = new CCapture( { format: 'gif', workersPath: '' } );
    
    capturer.start();
    
  }
  
}

function draw() {
  
  frame++;
  
  if(totalFrames > 0 && frame > totalFrames){
    return;
  }
  
  background(0);
  
  //debug(frame);
  
  
  //make new ones in the first half... then let them decay
  //if(frame < totalFrames * 0.5 || totalFrames == 0) {
    var c = new Circle(random(width),random(height));
    
    if(c.hasSpace(circs,-1) && random(100) < spawnProbability) {
      circs.push(c);
    }    
  //}
  
  
  //see if any need to be removed.
  for(var i in circs) {
    c = circs[i];
    //remove tiny or any overlapping ones
    if(c.rad < 1) {
      circs.splice(i,1);
    }
  }
  
  //now step & draw the ones that are left
  for(var i in circs) {
    c = circs[i];
    //otherwise, step through
    c.step(circs,i);
    
    //then draw
    c.draw();      
  }
  
  if(totalFrames > 0) {
    capturer.capture( document.getElementById('defaultCanvas0') );
  }
  
  //stop and save after x frames
  if(frame == totalFrames && totalFrames > 0) {
    capturer.stop();
    capturer.save();
  }
  
}


function debug(msg){
  console.log(msg);
}

class Circle{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.growing = true;
    this.alive = true;
    this.rad = 1;
    //splice random colours out of a copy so we don't get the same one for both fill and stroke
    var cs = colors.slice(0);
    this.fill = cs.splice(random(cs.length),1);
    this.stroke = cs.splice(random(cs.length),1);
    this.strokeWeightFactor = random(0.5,0.8);
    /*this.fill = random(255);
    this.stroke = random(255);*/
    this.strokeWeight = this.strokeWeightFactor * this.rad;
    this.age = 0;
  }
  
  draw() {
      fill(this.fill);
      stroke(this.stroke);
      strokeWeight(this.strokeWeight);
      //noStroke();
      ellipse(this.x,this.y,this.rad * 2,this.rad * 2);
  }
  
  fullRad(){
    return(this.rad + this.strokeWeight);
    //return(this.rad);
  }
  
  hasSpace(circ_array,myIndex) {
    //copy
    var others = circ_array.slice(0);
    
    //remove this element from our copy (unless we pass a negative value)
    if(myIndex >= 0) {
      others.splice(myIndex,1);
    }
    
    //touching the edge?
    if ((this.x + this.fullRad() + spacing > width) || (this.x - this.fullRad() - spacing < 0) || (this.y + this.fullRad() + spacing > height) || (this.y - this.fullRad() - spacing < 0)) {
      return(false);
    }
    
    for(var j in others) {
      var distance = Math.sqrt(Math.pow(this.x - others[j].x,2) + Math.pow(this.y - others[j].y,2));
      
      //console.log(others.length);
      
      //too close?
      if(distance < this.fullRad() + others[j].fullRad() + spacing){  
        return(false);  
      }
    }
    return(true);
  }
  
  step(circs, myIndex){
    this.age++;
    
    if(!this.hasSpace(circs, myIndex)) {
      this.growing = false;
    }
    
    if(this.growing) {
      this.rad += dr;
    }
    
    if(random(100) < 2) {
      this.alive = false;
    }
    
    if(!this.alive) {
      this.rad -= dr;
    }
    
    this.strokeWeight = this.strokeWeightFactor * this.rad;
  }
}
