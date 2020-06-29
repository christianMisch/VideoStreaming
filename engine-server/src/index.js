import 'babylonjs-inspector';

var canvas = document.getElementById("renderCanvas");

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };
var url = "https://cdn.dashjs.org/latest/dash.all.min.js";
var s = document.createElement("script");
s.src = url;
document.head.appendChild(s);

var createScene = function () {

  let activeVideoIdx = 1;

  // engine.displayLoadingUI();
  var stream1 = "http://localhost:8080/playlist.mpd";
  var stream2 = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";
  // var stream3 = "https://irtdashreference-i.akamaihd.net/dash/live/901161/bfs/manifestARD.mpd";
  // var stream4 = "https://irtdashreference-i.akamaihd.net/dash/live/901161/bfs/manifestBR.mpd";

  var video1 = $("<video data-dashjs-player autoplay src='" + stream1 + "'></video>");
  var video2 = $("<video data-dashjs-player src='" + stream2 + "'></video>");

  $("body").append(video1);
  $("body").append(video2);
  console.log("Adding HTML video element");
  // Create the scene space
  var scene = new BABYLON.Scene(engine);

  // Add a camera to the scene and attach it to the canvas
  var cam_position = new BABYLON.Vector3(0, 5, -6);
  // var camera = new BABYLON.ArcRotateCamera("Camera", 270 * Math.PI / 180, Math.PI / 2, 2, cam_position, scene);
  var camera = new BABYLON.UniversalCamera("MyCamera", cam_position, scene);
  camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 1;
  camera.attachControl(canvas, true);
  camera.speed = 0.02;
  camera.angularSpeed = 0.05;
  camera.angle = Math.PI/2;
  camera.direction = new BABYLON.Vector3(Math.cos(camera.angle), 0, Math.sin(camera.angle));

  /* New Input Management for Camera
    __________________________________*/
    
    //First remove the default management.
    camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
    camera.inputs.removeByType("FreeCameraMouseInput");
     
    //Key Input Manager To Use Keys to Move Forward and BackWard and Look to the Left or Right
    var FreeCameraKeyboardWalkInput = function () {
        this._keys = [];
        this.keysUp = [38];
        this.keysDown = [40];
        this.keysLeft = [37];
        this.keysRight = [39];
    }

    //Add attachment controls
    FreeCameraKeyboardWalkInput.prototype.attachControl = function (element, noPreventDefault) {
      var _this = this;
      if (!this._onKeyDown) {
          element.tabIndex = 1;
          this._onKeyDown = function (evt) {                 
              if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
                  _this.keysDown.indexOf(evt.keyCode) !== -1 ||
                  _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                  _this.keysRight.indexOf(evt.keyCode) !== -1) {
                  var index = _this._keys.indexOf(evt.keyCode);
                  if (index === -1) {
                      _this._keys.push(evt.keyCode);
                  }
                  if (!noPreventDefault) {
                      evt.preventDefault();
                  }
              }
          };
          this._onKeyUp = function (evt) {
              if (_this.keysUp.indexOf(evt.keyCode) !== -1 ||
                  _this.keysDown.indexOf(evt.keyCode) !== -1 ||
                  _this.keysLeft.indexOf(evt.keyCode) !== -1 ||
                  _this.keysRight.indexOf(evt.keyCode) !== -1) {
                  var index = _this._keys.indexOf(evt.keyCode);
                  if (index >= 0) {
                      _this._keys.splice(index, 1);
                  }
                  if (!noPreventDefault) {
                      evt.preventDefault();
                  }
              }
          };
          element.addEventListener("keydown", this._onKeyDown, false);
          element.addEventListener("keyup", this._onKeyUp, false);
      }
  };


  //Add detachment controls
  FreeCameraKeyboardWalkInput.prototype.detachControl = function (element) {
      if (this._onKeyDown) {
          element.removeEventListener("keydown", this._onKeyDown);
          element.removeEventListener("keyup", this._onKeyUp);
          BABYLON.Tools.UnregisterTopRootEvents([
              { name: "blur", handler: this._onLostFocus }
          ]);
          this._keys = [];
          this._onKeyDown = null;
          this._onKeyUp = null;
      }
  };

  //Keys movement control by checking inputs
  FreeCameraKeyboardWalkInput.prototype.checkInputs = function () {
      if (this._onKeyDown) {
          var camera = this.camera;
          for (var index = 0; index < this._keys.length; index++) {
              var keyCode = this._keys[index];
              var speed = camera.speed;
              if (this.keysLeft.indexOf(keyCode) !== -1) {
                  camera.rotation.y -= camera.angularSpeed;
                  camera.direction.copyFromFloats(0, 0, 0);                
              }
              else if (this.keysUp.indexOf(keyCode) !== -1) {
                  camera.direction.copyFromFloats(0, 0, speed);               
              }
              else if (this.keysRight.indexOf(keyCode) !== -1) {
                  camera.rotation.y += camera.angularSpeed;
                  camera.direction.copyFromFloats(0, 0, 0);
              }
              else if (this.keysDown.indexOf(keyCode) !== -1) {
                  camera.direction.copyFromFloats(0, 0, -speed);
              }
              if (camera.getScene().useRightHandedSystem) {
                  camera.direction.z *= -1;
              }
              camera.getViewMatrix().invertToRef(camera._cameraTransformMatrix);
              BABYLON.Vector3.TransformNormalToRef(camera.direction, camera._cameraTransformMatrix, camera._transformedDirection);
              camera.cameraDirection.addInPlace(camera._transformedDirection);
          }
      }
  };

  //Add the onLostFocus function
  FreeCameraKeyboardWalkInput.prototype._onLostFocus = function (e) {
    this._keys = [];
  };

  //Add the two required functions for the control Name
  FreeCameraKeyboardWalkInput.prototype.getTypeName = function () {
      return "FreeCameraKeyboardWalkInput";
  };

  FreeCameraKeyboardWalkInput.prototype.getSimpleName = function () {
      return "keyboard";
  };
    
  //Add the new keys input manager to the camera.
   camera.inputs.add(new FreeCameraKeyboardWalkInput());


  // Add lights to the scene
  var light = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(0, -1.5, 0), scene);

  // This is where you create and manipulate meshes
  var myPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", { width: 5.1, height: 3 }, scene);
  myPlane.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.WORLD);

  // Video material
  var videoMat = new BABYLON.StandardMaterial("textVid", scene);
  var video = document.querySelector('video');
  var videoTexture = new BABYLON.VideoTexture('video', video, scene, true, true);

  videoMat.backFaceCulling = false;
  videoMat.diffuseTexture = videoTexture;
  videoMat.emissiveColor = BABYLON.Color3.White();
  myPlane.material = videoMat;
  myPlane.position = new BABYLON.Vector3(-0.2, 5.23, 5.37);

  var htmlVideo = videoTexture.video;
  htmlVideo.setAttribute('webkit-playsinline', 'webkit-playsinline');
  htmlVideo.setAttribute('playsinline', 'true');
  htmlVideo.setAttribute('muted', 'true');
  htmlVideo.setAttribute('autoplay', 'false');

  videoTexture.onLoadObservable.add(function () {
    engine.hideLoadingUI();
  });

  let isRunning = true;

  scene.onPointerUp = function () {
    // activeVideoIdx++;
    // if (activeVideoIdx === 1) {

    // } else if (activeVideoIdx === 2) {

    // } else {

    // }
    if (isRunning) {
      BABYLON.VideoTexture.CreateFromWebCam(scene, function (videoTexture) {
        videoMat.diffuseTexture = videoTexture;
        videoMat.diffuseColor = BABYLON.Color3.White();
        myPlane.material = videoMat;
      }, { maxWidth: 256, maxHeight: 256 });
      htmlVideo.pause();
      isRunning = false;
    } else {
      videoMat.diffuseTexture = videoTexture;
      videoMat.emissiveColor = BABYLON.Color3.White();
      htmlVideo.play();
      isRunning = true;
    }
  }

  // var plane = BABYLON.Mesh.CreatePlane("sphere1", 7, scene);
  // plane.rotation.z = Math.PI;

  //   // Move the sphere upward 1/2 its height
  //   plane.position.y = 1;

  // var mat = new BABYLON.StandardMaterial("mat", scene);
  //   mat.diffuseColor = BABYLON.Color3.White();

  // BABYLON.VideoTexture.CreateFromWebCam(scene, function (videoTexture) {
  //   mat.emissiveTexture = videoTexture;
  //   plane.material = mat;
  // }, { maxWidth: 256, maxHeight: 256 });

  const blenderPath = 'http://localhost:8080/blender/';
  BABYLON.SceneLoader.Append(
    blenderPath,
    'TVroom.babylon',
    scene, function (scene) {
      console.log('level loaded!');
    }
  );

  // with assets manager
  // var assetsManager = new BABYLON.AssetsManager(scene);
  // var blenderTask = assetsManager.addMeshTask('blender level', '', blenderPath, 'TVroom.babylon');
  // blenderTask.onSuccess = function(task) { console.log('success', task) };
  // blenderTask.onError = function(task, message, exception) { console.log('error', task, message, exception) };
  // assetsManager.load();


  return scene;
};

var engine;
try {
  engine = createDefaultEngine();
} catch (e) {
  console.log("the available createEngine function failed. Creating the default engine instead");
  engine = createDefaultEngine();
}
if (!engine) throw 'engine should not be null.';
scene = createScene();
sceneToRender = scene;

engine.runRenderLoop(function () {
  if (sceneToRender) {
    sceneToRender.render();
  }
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});