import { CameraController } from '../camera/camera-controller';
import { VideoStreamController } from '../video-stream/video-stream-controller';
import { canvas } from '../util/canvas-utils';
import { GUIController } from '../gui/gui-controller';

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
    this.initGUI();
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

  initGUI(scene) {
    let guiController = new GUIController();
    guiController.initGUI(scene);
  }

  createDefaultEngine() { 
    return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); 
  }

  createScene(engine) {
    // Create the scene space
    const scene = new BABYLON.Scene(engine);
    // Add lights to the scene
    const light = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(0, -1.5, 0), scene);
    // Add blender level to the scene
    this.addBlenderLevel(scene);
    // Enable Collisions
    scene.collisionsEnabled = true;
    return scene;
  }

  addBlenderLevel(scene) {
    const blenderPath = 'http://localhost:8080/blender/';
    BABYLON.SceneLoader.Append(
      blenderPath,
      'TVroom.babylon',
      scene, function (_) {
        console.log('Blender level successfully loaded!');
        scene.checkCollisions = true;
      }
    );
  }
}