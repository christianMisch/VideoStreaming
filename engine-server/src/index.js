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

  // engine.displayLoadingUI();
  var stream1 = "https://irtdashreference-i.akamaihd.net/dash/live/901161/bfs/manifestARD.mpd";
  var stream2 = "https://irtdashreference-i.akamaihd.net/dash/live/901161/bfs/manifestBR.mpd";
  var stream3 = "http://localhost:8080/playlist.mpd";
  var stream4 = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd";

  var video = $("<video data-dashjs-player autoplay src='" + stream3 + "'></video>");
  $("body").append(video);
  console.log("Adding HTML video element");
  // Create the scene space
  var scene = new BABYLON.Scene(engine);

  // Add a camera to the scene and attach it to the canvas
  var cam_position = new BABYLON.Vector3(0, 5, -6);
  var camera = new BABYLON.ArcRotateCamera("Camera", 270 * Math.PI / 180, Math.PI / 2, 2, cam_position, scene);
  // camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 1;
  camera.attachControl(canvas, true);

  // Add lights to the scene
  var light = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(0, -1.5, 0), scene);

  // This is where you create and manipulate meshes
  var myPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", { width: 5.1, height: 3 }, scene);
  myPlane.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.WORLD);

  // Video material
  var videoMat = new BABYLON.StandardMaterial("textVid", scene);
  var video = document.querySelector('video');
  var videoTexture = new BABYLON.VideoTexture('video', video, scene, true, true);

  BABYLON.VideoTexture.CreateFromWebCam(scene, function (videoTexture) {
    videoMat.diffuseTexture = videoTexture;
    videoMat.emissiveColor = BABYLON.Color3.White();
    myPlane.material = videoMat;
  }, { maxWidth: 256, maxHeight: 256 });

  videoMat.backFaceCulling = false;
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
    if (isRunning) {
      videoMat.diffuseTexture = videoTexture;
      videoMat.emissiveColor = BABYLON.Color3.White();
      myPlane.material = videoMat;
      isRunning = false;
    } else {
      BABYLON.VideoTexture.CreateFromWebCam(scene, function (videoTexture) {
        videoMat.diffuseTexture = videoTexture;
        myPlane.material = videoMat;
      }, { maxWidth: 256, maxHeight: 256 });
      isRunning = true;
    }
    // if (htmlVideo.paused) {
    //   htmlVideo.play();
    // } else {
    //   htmlVideo.pause();
    // }
  }

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