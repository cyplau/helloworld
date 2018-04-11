const cv = require('opencv4nodejs');

// camera properties
var camWidth = 320;
var camHeight = 240;
var camFps = 5;
var camInterval = 1000 / camFps;

// face detection properties
const rectColor = new cv.Vec(0, 255, 0);
var rectThickness = 2;

// initialize camera
//var camera = new cv.VideoCapture(0);
//camera.setWidth(camWidth);
//camera.setHeight(camHeight);
const wCap = new cv.VideoCapture(0);

module.exports = function (socket) {
  const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
  //const classifier = new cv.CascadeClassifier(cv.HAAR_EYE_TREE_EYEGLASSES);
  setInterval(() => {

    wCap.readAsync((err, frame) => {
      if (err) throw err;

      frame = frame.resizeToMax(240).flip(1);
      frame = frame.channels === 1
        ? frame.cvtColor(cv.COLOR_GRAY2RGBA)
        : frame.cvtColor(cv.COLOR_BGR2RGBA);

      //const grayFrame = frame.bgrToGray();

      classifier.detectMultiScaleAsync(frame, (err, res) => {
        if (err) { return console.error(err); }
        const { objects, numDetections } = res;
        let face;
        for (var i = 0; i < objects.length; i++) {
          face = objects[i];
          var rect = new cv.Rect(face.x, face.y, face.width, face.height);
          frame.drawRectangle(rect, rectColor, rectThickness);
        }
        socket.emit('mat', {
          rows: frame.rows,
          cols: frame.cols,
          data: frame.getData()
        });
      });
    });
  }, camInterval);
};
