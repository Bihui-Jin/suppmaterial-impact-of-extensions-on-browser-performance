var initialized = false;

// video controls and related properties
var videoMode = 'qvga';
var youtubeVideoControl = undefined;  // control that displays youtube video
var videoInputControl = undefined;  // control that captures live camera input
var isYoutubeVideoPaused = false;
var firstCameraStart = false;

// canvas related properties
var canvasRaw = undefined;  
var canvasNoZoom = undefined;  
var canvasMessage = undefined;  
var canvasMessageFontSize = 14;
const canvasFontface = "Roboto,sans-serif";

// video capture related properties
var cap = undefined;      // Video capture
var liveStream = undefined;
var onCameraStartedCallback = undefined;
var showEntireBackground = false;
var stopVideoRequested = false;
var prevFrameVideoClipCoord = undefined;
var insetVideoCaptureStartTime = undefined;
var numFrames = 0;
var workoutURL = '';
//var src_rgb = undefined;  // CV matrix

// person properties
var heightMeasurements = [];
var cXArray = [];
var cYArray = [];
const heightMeasurementBufferSize = 20;
var personEstimatedHeight = 0; 
var personHeightEstimationStartTime = undefined;

// the model
var model = undefined;

//others
const DisplayModeEnum = Object.freeze({"FULLVIEW":1, "ESTIMATING":2, "PARTIALVIEW":3});
function getCurrentDisplayMode() {
  if (showEntireBackground) {
    return DisplayModeEnum.FULLVIEW;
  }
  else if (personEstimatedHeight <= 0) {
    return DisplayModeEnum.ESTIMATING;
  }
  else {
    return DisplayModeEnum.PARTIALVIEW;
  }
}


// load the model
async function loadModel() {
  let architecture = 'MobileNetV1';
  let outputStride = 16;
  let multiplier = 0.75;
  let quantBytes = 2;

  if (model) delete model;
  model = undefined;

  model = await bodyPix.load({
    architecture: architecture,
    outputStride: outputStride,
    multiplier: multiplier,
    quantBytes: quantBytes
  });

  getValueFromStorage("showEntireBackground").then(function(value) {
    if (showEntireBackground != value) {
      showEntireBackground = value;
      setCanvasPositionSize();
    }
  });

  initialized = true;
}

// This function identifies the person on the video capture and estimates
// the bounding box coordinates
function getPersonBoundaries(src_image_raw_data, height, width, getCenter=false) {
  let src_image_mat = cv.matFromArray(height, width, cv.CV_8UC1, src_image_raw_data);

  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(src_image_mat, contours, hierarchy, cv.RETR_CCOMP, cv.CHAIN_APPROX_SIMPLE);

  let maxArea = -1;
  let personContour = undefined;
  let minX = width; // Last pixel is 'width-1' (zero based). Hence set it to one pixel outside of video width.
  let minY = height;  // Last pixel is 'height-1' (zero based). Hence set it to one pixel outside of video height.
  let maxX = -1 ;
  let maxY = -1 ;

  for (let i = 0; i < contours.size(); i++) {
    let cnt = contours.get(i);
    let area = cv.contourArea(cnt, false);
    if (area > maxArea) {
      maxArea = area;
      personContour = cnt;
    }
  }

  if (personContour == undefined) {
    src_image_mat.delete();
    contours.delete();
    hierarchy.delete();    
    return [];
  }

  for (let j = 0; j < personContour.data32S.length; j += 2) {
    let p = {};
    p.x = personContour.data32S[j];
    p.y = personContour.data32S[j+1];
    if (minX > p.x) minX = p.x;
    if (minY > p.y) minY = p.y;
    if (maxX < p.x) maxX = p.x;
    if (maxY < p.y) maxY = p.y;
  }

  let M = undefined;
  let cX = undefined;
  let cY = undefined;

  if (getCenter) {
    M = cv.moments(personContour, false)
    cX = parseInt(M["m10"] / M["m00"])
    cY = parseInt(M["m01"] / M["m00"])
  }
  
  src_image_mat.delete();
  contours.delete();
  hierarchy.delete();

  if (getCenter) {
    return [minX, minY, maxX, maxY, cX, cY];
  }
  else {
    return [minX, minY, maxX, maxY];
  }
}

// This function identifies the person on the video capture and estimates
// the height and centre of mass of the body
function getPersonHeightAndCenterOfMass(src_image_raw_data, height, width) {
  let boundingBox = getPersonBoundaries(src_image_raw_data, height, width, true);
  if (boundingBox.length == 0) {
    return []
  }

  let bbWidth = boundingBox[2] - boundingBox[0];
  let bbHeight = boundingBox[3] - boundingBox[1];
  let maxLength = bbWidth > bbHeight? bbWidth : bbHeight;
  let cX = boundingBox[4];
  let cY = boundingBox[5];

  return [maxLength, cX, cY];
}

async function estimatePersonHeight() {
  let ctxRaw = canvasRaw.getContext('2d');
  canvasNoZoom.style.display = "none";
  canvasRaw.style.display = "block";
  ctxRaw.drawImage(videoInputControl, 0, 0, canvasRaw.width, canvasRaw.height);

  let personNotFound = false;
  let height = -1;
  let center_X = -1;
  let center_Y = -1;

  if (model) {
    if (!personHeightEstimationStartTime) {
      personHeightEstimationStartTime = Date.now();
    }

    let internalResolution = 'medium';
    let segmentationThreshold = 0.7;

    const segmentation = await model.segmentPerson(videoInputControl, {
      flipHorizontal: false,
      internalResolution: internalResolution,
      segmentationThreshold: segmentationThreshold
    });

    let results = getPersonHeightAndCenterOfMass(segmentation.data, videoInputControl.videoHeight, videoInputControl.videoWidth);

    if (results.length == 0) {
      personNotFound = true;
    }
    else {
      height = results[0];
      center_X = results[1];
      center_Y = results[2];

      if ((center_X < 0) || (center_Y < 0)) {
        personNotFound = true
      }
    }
  }
  else {
    personNotFound = true;
  }

  if ((Date.now() - personHeightEstimationStartTime) < 3000) {
    displayMessage("Please move to a comfortable position and remain steady for few moments!")
    return;
  }
  
  if (personNotFound) {
    displayMessage("I don't see you. You there?")
    return;
  }
  else {
      heightMeasurements.push(height);
      cXArray.push(center_X);
      cYArray.push(center_Y);

      if (heightMeasurements.length < heightMeasurementBufferSize)  {
        displayMessage("Please move to a comfortable position and remain steady for few moments!")
        return;
      }
      if (heightMeasurements.length > heightMeasurementBufferSize) {
        heightMeasurements.shift();
        cXArray.shift();
        cYArray.shift();
      }

      let avg_height = average(heightMeasurements);
      let avg_cX = average(cXArray);
      let avg_cY = average(cYArray);
      let std_dev_height = standardDeviation(heightMeasurements);
      let std_dev_cX = standardDeviation(cXArray);
      let std_dev_cY = standardDeviation(cYArray);

      if (std_dev_height > 5) {
        displayMessage("Please remain steady for few moments.")
        return;
      }
      if (std_dev_cX > 5) {
        displayMessage("Please remain steady for few moments.")
        return;
      }
      if (std_dev_cY > 5) {
        displayMessage("Please remain steady for few moments.")
        return;
      }
      if (Math.abs(videoInputControl.width / 2 - avg_cX) > videoInputControl.width * 0.1) {
        if ((videoInputControl.width / 2 - avg_cX) > 0) {
          displayMessage("Please move to your left towards middle.")

        }
        else {
          displayMessage("Please move to your right towards middle.")
        }
        return;
      }
      displayMessage("Great! I am done. We will start workouts in a moment!")
      await sleep(3000);
      displayMessage("");
      setPersonEstimatedHeight(avg_height);
    }
}

function setPersonEstimatedHeight(h) {
  personEstimatedHeight = parseInt(h);
  personHeightEstimationStartTime = undefined;
  setCanvasPositionSize();
}

async function showPersonInInset() {
  let ctxNoZoom = canvasNoZoom.getContext('2d');
    
  if (model) {
    let internalResolution = 'medium';
    let segmentationThreshold = 0.7;

    const segmentation = await model.segmentPerson(videoInputControl, {
      flipHorizontal: false,
      internalResolution: internalResolution,
      segmentationThreshold: segmentationThreshold
    });

    let minX = -1;
    let minY = -1;
    let maxX = -1;
    let maxY = -1;
    let center_X = -1;
    let center_Y = -1;
    
    let results = getPersonBoundaries(segmentation.data, videoInputControl.videoHeight, videoInputControl.videoWidth);
    let personNotFound = false;

    if (results.length == 0) {
      personNotFound = true;
    }
    else {
      minX = results[0];
      minY = results[1];
      maxX = results[2];
      maxY = results[3];
      center_X = parseInt((minX + maxX) / 2.0);
      center_Y = parseInt((minY + maxY) / 2.0);

      if ((center_X < 0) || (center_Y < 0)) {
        personNotFound = true
      }
    }
    
    if (personNotFound) {
      if (prevFrameVideoClipCoord != undefined) {
        let tl_x = prevFrameVideoClipCoord[0];
        let tl_y = prevFrameVideoClipCoord[1];
        let br_x = prevFrameVideoClipCoord[2];
        let br_y = prevFrameVideoClipCoord[3];
        canvasRaw.style.display = "none";
        canvasMessage.style.display = "none";
        canvasNoZoom.style.display = "block";

        ctxNoZoom.drawImage(videoInputControl, tl_x, tl_y, br_x - tl_x, br_y - tl_y,
          0, 0, canvasNoZoom.width, canvasNoZoom.height);
      }
      return;
    }

    let image_width = parseInt(personEstimatedHeight * 1.0);
    let image_height = parseInt(image_width * 1.35);
    if (image_height > videoInputControl.videoHeight) image_height = videoInputControl.videoHeight - 1;

    let bottom_margin = parseInt(canvasNoZoom.height * 0.1);

    let top_left_x = parseInt(center_X - image_width / 2.0);
    let bottom_right_x = parseInt(center_X + image_width / 2.0);
    let bottom_right_y = maxY + bottom_margin;
    let top_left_y = bottom_right_y - image_height;

    if (top_left_x < 0) {
      bottom_right_x -= top_left_x;
      top_left_x = 0;
    }
    if (bottom_right_x > videoInputControl.videoWidth - 1) {
      top_left_x -= bottom_right_x - videoInputControl.videoWidth + 1;
      bottom_right_x = videoInputControl.videoWidth - 1;
    }
    if (top_left_y < 0) {
      bottom_right_y -= top_left_y;
      top_left_y = 0;
    }
    if (bottom_right_y > videoInputControl.videoHeight - 1) {
      top_left_y -= bottom_right_y - videoInputControl.videoHeight + 1;
      bottom_right_y = videoInputControl.videoHeight - 1;
    }
    ctxNoZoom.drawImage(videoInputControl, top_left_x, top_left_y, bottom_right_x - top_left_x, bottom_right_y - top_left_y,
      0, 0, canvasNoZoom.width, canvasNoZoom.height);
    canvasNoZoom.style.display = "block";
    canvasRaw.style.display = "none";
    canvasMessage.style.display = "none";

    prevFrameVideoClipCoord = [top_left_x, top_left_y, bottom_right_x, bottom_right_y];
  }
  else {
    ctxNoZoom.clearRect(0, 0, canvasNoZoom.width, canvasNoZoom.height);
  }
}

// process live stream and get the person's picture
async function processVideo() {
  try {
    if (stopVideoRequested) {
      onVideoStopped();
      return;
    }

    if (videoInputControl == undefined) {
      return;
    }

    if (cap == undefined) {
      return;
    }

    if (liveStream) {
      //cap.read(src_rgb);
      
      if (getCurrentDisplayMode() == DisplayModeEnum.FULLVIEW) {
        canvasNoZoom.style.display = "none";
        canvasMessage.style.display = "none";
        canvasRaw.style.display = "block";
        var ctxRaw = canvasRaw.getContext('2d');
        if (!insetVideoCaptureStartTime) {
          // first frame since workout started
          insetVideoCaptureStartTime = new Date();
        }
        ctxRaw.drawImage(videoInputControl, 0, 0, canvasRaw.width, canvasRaw.height);
        requestAnimationFrame(processVideo);
        return;
      }

      if (getCurrentDisplayMode() == DisplayModeEnum.PARTIALVIEW) {
        if (isYoutubeVideoPaused) {
          youtubeVideoControl.play();
          isYoutubeVideoPaused = false;
          insetVideoCaptureStartTime = new Date();
        }
        await showPersonInInset();
        numFrames++;
        let fps = numFrames * 1000.0 / (Date.now() - insetVideoCaptureStartTime.getTime());
        if (numFrames % 100 == 0) {
          console.log("FPS =", fps);
        }
      }
      else {
        // Current display mode is: DisplayModeEnum.ESTIMATING
        if (! isYoutubeVideoPaused) {
          youtubeVideoControl.pause();
          isYoutubeVideoPaused = true;
        }
        await estimatePersonHeight();
      }
    }

    if (liveStream) {
      requestAnimationFrame(processVideo);
    }
  }
  catch (err) {
    console.log(err);
  }
};

function setCanvasPositionSize() {
  if (canvasNoZoom == undefined) {
    return;
  }

  let videoPlayer = youtubeVideoControl.closest(".html5-video-player");
  if (!videoPlayer) {
    return;
  }
  
  let videoPlayerRect = videoPlayer.getBoundingClientRect();
  let videoDisplayRect = youtubeVideoControl.getBoundingClientRect();
  let offset = {};
  offset.top = videoDisplayRect.top - videoPlayerRect.top;
  offset.left = videoDisplayRect.left - videoPlayerRect.left;

  if (getCurrentDisplayMode() == DisplayModeEnum.FULLVIEW) {
    let h = parseInt(parseInt(youtubeVideoControl.style.height, 10) * 0.30);
    let w = parseInt(h * 4.0 / 3.0);
    let t = parseInt(parseInt(youtubeVideoControl.style.height, 10) * 0.95) - h + offset.top;
    let l = parseInt(parseInt(youtubeVideoControl.style.width, 10) * 0.95) - w + offset.left;

    canvasRaw.style.position = 'absolute';
    canvasRaw.style.width = w.toString() + "px";
    canvasRaw.style.height = h.toString() + "px";
    canvasRaw.style.top = t.toString() + "px";
    canvasRaw.style.left = l.toString() + "px";
    canvasRaw.width = w;
    canvasRaw.height = h;
 
    canvasNoZoom.style.display = "none";
    canvasRaw.style.display = "block";
    canvasMessage.style.display = "none";

    canvasRawHeight = canvasRaw.height
    canvasRawWidth = canvasRaw.width
    let ctxRaw = canvasRaw.getContext('2d');
    // ctxRaw.restore();
    ctxRaw.translate(canvasRaw.width, 0);
    ctxRaw.scale(-1, 1);
    // ctxRaw.save();
  }
  else if (getCurrentDisplayMode() == DisplayModeEnum.PARTIALVIEW) {
    let h = parseInt(parseInt(youtubeVideoControl.style.height, 10) * 0.30);
    let w = parseInt(h / 1.35);
    let t = parseInt(parseInt(youtubeVideoControl.style.height, 10) * 0.95) - h + offset.top;
    let l = parseInt(parseInt(youtubeVideoControl.style.width, 10) * 0.95) - w + offset.left;

    canvasNoZoom.style.position = 'absolute';
    canvasNoZoom.style.width = w.toString() + "px";
    canvasNoZoom.style.height = h.toString() + "px";
    canvasNoZoom.style.top = t.toString() + "px";
    canvasNoZoom.style.left = l.toString() + "px";
    canvasNoZoom.width = w;
    canvasNoZoom.height = h;

    canvasNoZoom.style.display = "block";
    canvasRaw.style.display = "none";
    canvasMessage.style.display = "none";

    canvasNoZoomHeight = canvasNoZoom.height
    canvasNoZoomWidth = canvasNoZoom.width
    let ctxNoZoom = canvasNoZoom.getContext('2d');
    // ctxNoZoom.restore();
    ctxNoZoom.translate(canvasNoZoom.width, 0);
    ctxNoZoom.scale(-1, 1);
    // ctxNoZoom.save();
  }
  else {  //if (getCurrentDisplayMode == DisplayModeEnum.ESTIMATING)
    let h = parseInt(parseInt(youtubeVideoControl.style.height, 10) * 0.50);
    let w = parseInt(h * 4.0 / 3.0);
    let t = parseInt((parseInt(youtubeVideoControl.style.height, 10) - h) / 2.0 );
    let l = parseInt((parseInt(youtubeVideoControl.style.width, 10) - w)  / 2.0);

    canvasRaw.style.position = 'absolute';
    canvasRaw.style.width = w.toString() + "px";
    canvasRaw.style.height = h.toString() + "px";
    canvasRaw.style.top = t.toString() + "px";
    canvasRaw.style.left = l.toString() + "px";
    canvasRaw.width = w;
    canvasRaw.height = h;

    h = parseInt(parseInt(canvasRaw.style.height, 10) * 0.15);
    w = parseInt(canvasRaw.style.width, 10) * 2.5;
    t = parseInt(canvasRaw.style.top, 10) + parseInt(canvasRaw.style.height, 10) + 10; //+10 for green border of canvasRaw
    l = parseInt((parseInt(canvasRaw.style.left, 10) + parseInt(canvasRaw.style.width, 10) / 2.0 - w / 2.0));

    canvasMessage.style.position = 'absolute';
    canvasMessage.style.width = w.toString() + "px";
    canvasMessage.style.height = h.toString() + "px";
    canvasMessage.style.top = t.toString() + "px";
    canvasMessage.style.left = l.toString() + "px";
    canvasMessage.width = w;
    canvasMessage.height = h;
    
    var ctxMessage = canvasMessage.getContext('2d');
    ctxMessage.clearRect(0, 0, canvasMessage.width, canvasMessage.height);

    canvasNoZoom.style.display = "none";
    canvasRaw.style.display = "block";
    //canvasMessage.style.display = "none";

    canvasRawHeight = canvasRaw.height
    canvasRawWidth = canvasRaw.width
    let ctxRaw = canvasRaw.getContext('2d');
    // ctxRaw.restore();
    ctxRaw.translate(canvasRaw.width, 0);
    ctxRaw.scale(-1, 1);
    // ctxRaw.save();

    setFontForCanvasMessage();

  }
}

function setFontForCanvasMessage() {
  let ctxMessage = canvasMessage.getContext('2d');

  let expectedFontHeight = parseInt(parseInt(canvasMessage.style.height, 10) * 0.80);
  let fontSize = 14;
  
  let actualFontHeight = ctxMessage.measureText('M').width;
  while (actualFontHeight < expectedFontHeight) {
    fontSize += 2;
    ctxMessage.font = fontSize.toString() + "px " + canvasFontface;
    let actualFontHeightTemp = ctxMessage.measureText('M').width;

    if (actualFontHeightTemp > expectedFontHeight) {
      fontSize -= 2;
      canvasMessageFontSize = fontSize;
      break;
    }
    else {
      actualFontHeight = actualFontHeightTemp;
    }
  }
}

function displayMessage(message) {
  let ctxMessage = canvasMessage.getContext('2d');
  let canvasMessage_h = parseInt(canvasMessage.style.height, 10);
  let canvasMessage_w = parseInt(canvasMessage.style.width, 10);

  let fontSize = canvasMessageFontSize + 2;
  if (message) {
    do {
      fontSize -= 2;
      ctxMessage.font = fontSize.toString() + "px " + canvasFontface;
    } while (ctxMessage.measureText(message).width > canvasMessage_w)

    ctxMessage.textBaseline = 'top';
    ctxMessage.fillStyle = '#337ab7';  // color for background
    ctxMessage.fillRect(0, 0, canvasMessage_w, canvasMessage_h); /// background color
    ctxMessage.fillStyle = '#fff'; /// text color
    ctxMessage.fillText(message, 5, 5); // draw text 
    canvasMessage.style.display = "block";
  }
  else {
    ctxMessage.clearRect(0, 0, canvasMessage_w, canvasMessage_h);
    canvasMessage.style.display = "none";
  }
}

function initialize() {
  if (initialized) {
    console.log("already initialized");
    return;
  }

  let videoObjectList = document.getElementsByTagName("video");
  if (videoObjectList.length == 0) {
    return;
  }

  youtubeVideoControl = videoObjectList[0];

  if (videoInputControl == undefined) {
    videoInputControl = document.createElement('video');
    videoInputControl.id = "aerobiVideoCapture";
    if (videoMode == 'qvga') {
      videoInputControl.width = 320;
      videoInputControl.height = 240;
    }
    else {
      videoInputControl.width = 640;
      videoInputControl.height = 480;
    }
    
    videoInputControl.style.display = "none";
  }

  if (canvasNoZoom == undefined) {
    canvasNoZoom = document.createElement("canvas");
    canvasNoZoom.id = "aerobiCanvasNoZoom";
    canvasNoZoom.style.zIndex = 9999999;
    canvasNoZoom.style.border = "5px solid green";
    canvasNoZoom.style.visibility='hidden';
    // canvasNoZoom.getContext('2d').save();
  }

  if (canvasRaw == undefined) {
    canvasRaw = document.createElement("canvas");
    canvasRaw.id = "aerobiCanvasRaw";
    canvasRaw.style.zIndex = 9999999;
    canvasRaw.style.border = "5px solid green";
    canvasRaw.style.visibility='hidden';
    // canvasRaw.getContext('2d').save();

    canvasMessage = document.createElement("canvas");
    canvasMessage.id = "aerobiCanvasMessage";
    canvasMessage.style.zIndex = 9999999;
    canvasMessage.style.border = "1px solid green";
    canvasMessage.style.visibility='hidden';
  }

  setCanvasPositionSize();

  youtubeVideoControl.parentNode.insertBefore(canvasMessage, youtubeVideoControl.nextSibling);
  youtubeVideoControl.parentNode.insertBefore(canvasRaw, youtubeVideoControl.nextSibling);
  youtubeVideoControl.parentNode.insertBefore(canvasNoZoom, youtubeVideoControl.nextSibling);
  youtubeVideoControl.parentNode.insertBefore(videoInputControl, youtubeVideoControl.nextSibling);

  let ro = new ResizeObserver(setCanvasPositionSize).observe(youtubeVideoControl);

  loadModel();
}

function onVideoCanPlay() {
  if (onCameraStartedCallback) {
    onCameraStartedCallback(liveStream);
  }
};

function startCamera(resolution, callback) {
  if (videoInputControl == undefined) {
    return "Error accessing camera, seems like it is unavailable";
  }

  if (videoInputControl.srcObject != null) {
    // already running
    return "Error accessing camera, may be running already";
  }

  const constraints = {
    'qvga': {width: {exact: 320}, height: {exact: 240}},
    'vga': {width: {exact: 640}, height: {exact: 480}}};

    let videoConstraint = constraints[resolution];
    if (!videoConstraint) {
      videoConstraint = true;
    }

  navigator.mediaDevices.getUserMedia(
    {
      video: videoConstraint, audio: false
    }).then(function(stream) {
      canvasNoZoom.style.visibility='visible';
      canvasRaw.style.visibility='visible';
      canvasMessage.style.visibility='visible';
      if (getCurrentDisplayMode() == DisplayModeEnum.FULLVIEW) {
        canvasNoZoom.style.display = "none";
        canvasRaw.style.display = "block";      
        canvasMessage.style.display = "none";      
      }
      else if (getCurrentDisplayMode() == DisplayModeEnum.PARTIALVIEW) {
        canvasNoZoom.style.display = "block";
        canvasRaw.style.display = "none";
        canvasMessage.style.display = "none";      
      }
      else {  //if (getCurrentDisplayMode() == DisplayModeEnum.ESTIMATING)
        canvasNoZoom.style.display = "none";
        canvasRaw.style.display = "block";
        canvasMessage.style.display = "none";      
      }

      workoutURL = window.location.toString();
      liveStream = stream;
      //src_rgb = new cv.Mat(videoInputControl.height, videoInputControl.width, cv.CV_8UC4);
      onCameraStartedCallback = callback;
      videoInputControl.srcObject = stream;
      videoInputControl.addEventListener('canplay', onVideoCanPlay, false);
      videoInputControl.play();
    }
  ).catch(function(e) {
    return e.name + ": "+ e.message;
  })

  return ""
};

function onVideoStarted() {
  if (!firstCameraStart) {
    firstCameraStart = true;
    sendPageViewToAnalytics();
  }
  cap = new cv.VideoCapture(videoInputControl);
  if (cap) {
    stopVideoRequested = false;
    requestAnimationFrame(processVideo);
  }
}

function onVideoStopped() {
    insetVideoCaptureStartTime = undefined;
    videoInputControl.pause();
    videoInputControl.removeEventListener('canplay', onVideoCanPlay);
    videoInputControl.srcObject = null;
    onCameraStartedCallback = undefined;

    canvasNoZoom.style.visibility='hidden';
    canvasRaw.style.visibility='hidden';
    canvasMessage.style.visibility='hidden';
    prevFrameVideoClipCoord = undefined;
    delete cap;
    cap = undefined;

    //src_rgb.delete();
    //src_rgb = undefined;

    var ctxNoZoom = canvasNoZoom.getContext('2d');
    canvasNoZoom.style.display="none";
    ctxNoZoom.clearRect(0, 0, canvasNoZoom.width, canvasNoZoom.height);

    var ctxRaw = canvasRaw.getContext('2d');
    canvasRaw.style.display="none";
    ctxRaw.clearRect(0, 0, canvasRaw.width, canvasRaw.height);

    var ctxMessage = canvasMessage.getContext('2d');
    canvasMessage.style.display="none";
    ctxMessage.clearRect(0, 0, canvasMessage.width, canvasMessage.height);

    if (liveStream) {
      liveStream.getVideoTracks()[0].stop();
    }
    liveStream = undefined;
    heightMeasurements = [];
    cXArray = [];
    cYArray = [];
    setPersonEstimatedHeight(0);
    numFrames = 0;
    workoutURL = '';

    if (isYoutubeVideoPaused) {
      youtubeVideoControl.play();
      isYoutubeVideoPaused = false;
    }
    workoutVideo = '';
}

function stopCamera() {
  if (videoInputControl) {
    if (videoInputControl.srcObject == null) {
      // already paused
      return;
    }

    sendWorkoutDataToAnalyticsAndStorage();
    stopVideoRequested = true;
  }
};

function sendPageViewToAnalytics() {
  let request = {};
  request.type = 'SendPageViewAnalyticsData';
  sendAnalyticsRequest(request);
}

function sendWorkoutDataToAnalyticsAndStorage() {
  if (!insetVideoCaptureStartTime) {
    // no workout - no analytics / storage
    return;
  }

  getValueFromStorage("signedInUserInfo").then(function(value) {
    let request = {};
    request.email = value.email;
    request.type = 'SendUsageAnalyticsData';
    
    let yy = insetVideoCaptureStartTime.getFullYear();
    let mm = insetVideoCaptureStartTime.getMonth() + 1;
    mm = ('00'+mm).slice(-2);
    let dd = insetVideoCaptureStartTime.getDate();
    dd = ('00'+dd).slice(-2);
    request.startDate = yy + "-" + mm + "-" + dd;
    request.startTime = insetVideoCaptureStartTime.getHours() * 60 + insetVideoCaptureStartTime.getMinutes();
    request.duration = (Date.now() - insetVideoCaptureStartTime.getTime()) / 60000.0;
    request.url = workoutURL;
    if (showEntireBackground) {
      request.view = "entire background";
    }
    else {
      request.view = "partial background";
    }
    let duration_sec = request.duration * 60;
    setFeedbackParamsToStorage(value.email, -1, duration_sec, false);
    sendAnalyticsRequest(request);
  });
}

async function sendAnalyticsRequest(request) {
  chrome.runtime.sendMessage(request, function(response) {

  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    try {
      if (request.type == "PingContentScript") {
        sendResponse({success: true});
      }
      else if (request.type == "StartVideoCapture") {
        let response = startCamera(videoMode, onVideoStarted);
        if (response == "") {
          sendResponse({success: true});
        }
        else {
          sendResponse({success: false, error: response});
        }
      }
      else if (request.type == "StopVideoCapture") {
        stopCamera();
        sendResponse({success: true});
      }
      else if (request.type == "ToggleView") {
        getValueFromStorage("showEntireBackground").then(function(value) {
          showEntireBackground = value;
          setCanvasPositionSize();
        });
        sendResponse({success: true}); 
      }
      else if (request.type == "GetVideoCaptureStatus") {
        let status = 'NotReady';
        if (initialized) {
          if (liveStream == undefined) {
            status = 'NotStarted';
          }
          else {
            status = 'Started';
          }
        }
        sendResponse({success: true, videoStatus: status});
      }
      else if (request.type == "ChangeUrl") {
        if (!request.url.includes('.youtube.com/watch?')) {
          stopCamera();
        }
        else {
          sendWorkoutDataToAnalyticsAndStorage();
          if (insetVideoCaptureStartTime) {
            // this means workout is going on already
            insetVideoCaptureStartTime = new Date();
          }
          workoutURL = request.url;
          setCanvasPositionSize();
        }
        sendResponse({success: true});
      }
      else if (request.type == "GetSigninPersonInfo") {
        getValueFromStorage("signedInUserInfo").then(function(value) {
          let firstname = value.firstname;
          let lastname = value.lastname;
          let email = value.email;
          setCanvasPositionSize();
          sendResponse({success: true, firstname: firstname, lastname: lastname, email: email});  
        });
        return true;
      }
      else if (request.type == "SetSigninPersonInfo") {
        let value = {};
        value.firstname = request.firstname;
        value.lastname = request.lastname;
        value.email = request.email;
        
        setValueToStorage("signedInUserInfo", value).then(function() {
          sendResponse({success: true});  
        });
        return true;
      }
      else if (request.type == "ClearStorage") {
        clearStorage().then(function() {
          sendResponse({success: true});  
        });
        return true;
      }
    }
    catch(err) {
      console.log(err); 
      sendResponse({success: false, error: err});
    }
  }
);

initialize();
