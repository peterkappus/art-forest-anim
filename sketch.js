"use strict";

var i = 0;
//how many frames to capture
var totalFrames = 0;

var canvas;
var capturer;
var spacing = 5; //how close can they get?
var dr = spacing/10;

var colors = ["#fc0","#ff5c00","#0066ff","#ee1111","#ff2e00"];

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
    //capturer = new CCapture( { format: 'png' } );
    capturer = new CCapture( { format: 'gif', workersPath: '' } );
    
    capturer.start();
    
  }
  
  circs.push(new Circle(random(width),random(height)));

}

function draw() {
  i++;
  
  if(totalFrames > 0) {
    //capture the frame
    capturer.capture( document.getElementById('defaultCanvas0') );
  }
  
  //stop and save after 50 iterations
  if(i == totalFrames && totalFrames > 0) {
    capturer.stop();
    capturer.save();
    return;
  }
  
  var c = new Circle(random(width),random(height));
  
  if(c.hasSpace(circs,-1) && random(5) < 1) {
    circs.push(c);
  }
  
  //console.log(circs.length);

  background(0);
  
  //iterate our circs
  for(i in circs) {
    c = circs[i];

    //remove tiny or any overlapping ones
    if(c.rad < 1 && !c.hasSpace(circs,i)) {
      console.log("bye");
      //remove this one
      circs.splice(i,1);
    }
    //otherwise, step through
    c.step(circs,i);
    
    //then draw
    c.draw();
  }
}


class Circle{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.alive = true;
    this.rad = 1;
    this.fill = random(colors);
    this.stroke = random(colors);
    this.strokeWeightFactor = random(0.5,0.8);
    this.strokeWeight = this.strokeWeightFactor * this.rad;
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
    if(this.hasSpace(circs, myIndex) && this.alive) {
      this.rad += dr;
    }else{
      this.rad -= dr;
    }
    
    
    

    this.strokeWeight = this.strokeWeightFactor * this.rad;
  }
}
