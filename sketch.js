var x = 1;
var i = 0;
var canvas;
var capturer;
//capturer = new CCapture( { format: 'webm', verbose: true } );
capturer = new CCapture( { format: 'png' } );
//capturer = new CCapture( { format: 'gif', workersPath: '' } );

function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  capturer.start();
}

function draw() {
  i++;
  x++;
  x = x % width;
  ellipse(x, 50, 80, 80);
  //start capturing
  capturer.capture( document.getElementById('defaultCanvas0') );
  
  //stop and save after 50 iterations
  if(i == 50) {
    capturer.stop();
    capturer.save();
  }
  exit();
}
