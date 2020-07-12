import { VideoStreamController } from '../video-stream/video-stream-controller';

export class GUIController {

  constructor() {
    this.videoController = new VideoStreamController();
    console.log('gui', this.videoController)
  }
  
  initGUI(scene) {
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

    var grid = new BABYLON.GUI.Grid();    
    advancedTexture.addControl(grid); 
    
    grid.width = "100%";
    grid.addColumnDefinition(50, true);
    grid.addColumnDefinition(100, true);
    grid.addRowDefinition(60, true);
    grid.addRowDefinition(60, true);

    const button = BABYLON.GUI.Button.CreateImageWithCenterTextButton('but', 'Click me', '');
    button.width = '100px';
    button.height = '40px';
    button.color = 'white';
    button.background = 'grey';
    button.onPointerUpObservable.add(() => {
      console.log('channel btn', this.videoController)
      let currChannelIdx = this.videoController.currVideoIdx;
      const numOfChannels = this.videoController.numOfChannels;
      if (currChannelIdx === numOfChannels-1) {
        this.videoController.playVideo(0)
      } else {
        this.videoController.playVideo(++currChannelIdx)     
      }
    });
    // params: mesh, row, column
    grid.addControl(button, 0, 1);

    const webcamButton = BABYLON.GUI.Button.CreateImageWithCenterTextButton('webcamBut', 'Toggle Webcam', '');
    webcamButton.width = '100px';
    webcamButton.height = '60px';
    webcamButton.color = 'white';
    webcamButton.background = 'grey';
    webcamButton.onPointerUpObservable.add(() => {
      if (!this.videoController.isWebcamEnabled) {
        this.videoController.playWebcam();
      } else {
        let currChannelIdx = this.videoController.currVideoIdx;
        this.videoController.playVideo(currChannelIdx);
      }
    });
    grid.addControl(webcamButton, 1, 1);
  }
}