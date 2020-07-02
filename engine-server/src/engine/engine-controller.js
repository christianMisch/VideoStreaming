import 'babylonjs-inspector';
import { CameraController } from '../camera/camera-controller';
import { VideoStreamController } from '../video-stream/video-stream-controller';

export class EngineController {

  constructor() {
    if (!EngineController.instance) {
      EngineController.instance = this;
      this.canvas = document.getElementById("renderCanvas");
      console.log(this.canvas);
      this.engine = {};
      this.scene = {};
    } else {
      return EngineController.instance;
    }
  }

  launchApp() {
    this.createEngine();
  }

  createEngine() {
    let sceneToRender;
    try {
      this.engine = this.createDefaultEngine();
    } catch (e) {
      console.log("the available createEngine function failed. Creating the default engine instead");
      this.engine = this.createDefaultEngine();
    }
    if (!this.engine) throw 'engine should not be null.';
    this.scene = this.createScene(this.engine);
    sceneToRender = this.scene;

    this.engine.runRenderLoop(function () {
      if (sceneToRender) {
        sceneToRender.render();
      }
    });

    // Resize
    window.addEventListener("resize", function () {
      console.log(this.engine)
      this.engine.resize();
    });
  }

  createDefaultEngine() { 
    return new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true }); 
  };

  createScene() {
    // Create the scene space
    this.scene = new BABYLON.Scene(this.engine);
    console.log('create scene', this.engine, this.scene)
    let cameraController = new CameraController(this.scene, this.canvas);
    cameraController.initCamera();
  
    // Add lights to the scene
    var light = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(0, -1.5, 0), this.scene);
  
    const blenderPath = 'http://localhost:8080/blender/';
    BABYLON.SceneLoader.Append(
      blenderPath,
      'TVroom.babylon',
      this.scene, function (scene) {
        console.log('level loaded!');
      }
    );

    let videoController = new VideoStreamController();
    videoController.initVideoStream();
  
    // with assets manager
    // var assetsManager = new BABYLON.AssetsManager(scene);
    // var blenderTask = assetsManager.addMeshTask('blender level', '', blenderPath, 'TVroom.babylon');
    // blenderTask.onSuccess = function(task) { console.log('success', task) };
    // blenderTask.onError = function(task, message, exception) { console.log('error', task, message, exception) };
    // assetsManager.load();
  }
}