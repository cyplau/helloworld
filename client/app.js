// MODIFY THIS TO THE APPROPRIATE URL IF IT IS NOT BEING RUN LOCALLY
var socket = io.connect();

var canvas = document.getElementById('canvas-video');
var log = document.getElementById('socket-log');
var context = canvas.getContext('2d');
//var img = new Image();
var img = document.getElementById('socket-image');

// show loading notice
context.fillStyle = '#333';
context.fillText('Loading...', canvas.width/2-30, canvas.height/3);

socket.on('console', (data) => {
  log.appendChild(document.createTextNode(data));
});

socket.on('mat', function (img) {
  const imgData = new ImageData(
    new Uint8ClampedArray(img.data),
    img.cols,
    img.rows
  );

  // set canvas dimensions
  canvas.height = img.rows;
  canvas.width = img.cols;

  // set image data
  const ctx = canvas.getContext('2d');
  ctx.putImageData(imgData, 0, 0);
});

socket.on('frame', function (data) {
  // Reference: http://stackoverflow.com/questions/24107378/socket-io-began-to-support-binary-stream-from-1-0-is-there-a-complete-example-e/24124966#24124966
  var uint8Arr = new Uint8Array(data.buffer);
  var str = String.fromCharCode.apply(null, uint8Arr);
  var base64String = btoa(str);

  img.src = 'data:image/png;base64,' + base64String;
});
