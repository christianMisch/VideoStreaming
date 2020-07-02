import { CameraController } from '../camera/camera-controller';
import { VideoStreamController } from '../video-stream/video-stream-controller';
import { canvas } from '../util/canvas-utils';

/** Singleton class which manages the engine */
export class EngineController {

  constructor() {
    if (!EngineController.instance) {
      EngineController.instance = this;
    }
    return EngineController.instance;
  }

  launchApp() {
    let [engine, scene] = this.initEngine();
    this.initCamera(scene, canvas);
    this.initVideoStream(scene, engine);
  }

  initEngine() {
    let engine;
    try {
      engine = this.createDefaultEngine();
    } catch (e) {
      console.log("the available createEngine function failed. Creating the default engine instead");
      engine = this.createDefaultEngine();
    }
    if (!engine) throw 'engine should not be null.';
    let scene = this.createScene(engine);
    let sceneToRender = scene;

    engine.runRenderLoop(function () {
      if (sceneToRender) {
        sceneToRender.render();
      }
    });

    // Resize
    window.addEventListener("resize", function () {
      engine.resize();
    });

    return [engine, scene];
  }

  initVideoStream(scene, engine) {
    let videoController = new VideoStreamController();
    videoController.initVideoStream(scene, engine);
  }

  initCamera(scene, canvas) {
    let cameraController = new CameraController();
    cameraController.initCamera(scene, canvas);
  }

  createDefaultEngine() { 
    return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); 
  }

  createScene(engine) {
    // Create the scene space
    var scene = new BABYLON.Scene(engine);
    // Add lights to the scene
    var light = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(0, -1.5, 0), scene);
    // Add blender level to the scene
    this.addBlenderLevel(scene);
    return scene;
  }

  addBlenderLevel(scene) {
    const blenderPath = 'http://localhost:8080/blender/';
    BABYLON.SceneLoader.Append(
      blenderPath,
      'TVroom.babylon',
      scene, function (_) {
        console.log('Blender level successfully loaded!');
      }
    );

    // with assets manager
    // var assetsManager = new BABYLON.AssetsManager(scene);
    // var blenderTask = assetsManager.addMeshTask('blender level', '', blenderPath, 'TVroom.babylon');
    // blenderTask.onSuccess = function(task) { console.log('success', task) };
    // blenderTask.onError = function(task, message, exception) { console.log('error', task, message, exception) };
    // assetsManager.load();
  }
}