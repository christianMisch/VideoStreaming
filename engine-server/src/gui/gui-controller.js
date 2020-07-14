import { VideoStreamController } from '../video-stream/video-stream-controller';

export class GUIController {

  constructor() {
    this.videoController = new VideoStreamController();
  }
  
  initGUI() {
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI');

    var grid = new BABYLON.GUI.Grid();   
    advancedTexture.addControl(grid); 
    
    grid.width = "100%";
    grid.addColumnDefinition(50, true);
    grid.addColumnDefinition(100, true);
    grid.addColumnDefinition(400, true);
    grid.addRowDefinition(10, true);
    grid.addRowDefinition(60, true);
    grid.addRowDefinition(20, true);
    grid.addRowDefinition(60, true);
    grid.addRowDefinition(30, true);

    const button = BABYLON.GUI.Button.CreateImageWithCenterTextButton('but', 'Change Channel', '');
    button.width = '100px';
    button.height = '60px';
    button.color = 'white';
    button.background = 'grey';
    button.onPointerUpObservable.add(() => {
      let currChannelIdx = ++this.videoController.currVideoIdx;
      const numOfChannels = this.videoController.numOfChannels;
      if (currChannelIdx === numOfChannels) {
        textField.text = 'You are watching: \n' + this.videoController.urls[0].name;
        this.videoController.playVideo(0);
      } else {
        textField.text = 'You are watching: \n' + this.videoController.urls[currChannelIdx].name;
        this.videoController.playVideo(currChannelIdx);
      }
    });
    // params: mesh, row, column
    grid.addControl(button, 1, 1);

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
    grid.addControl(webcamButton, 3, 1);

    const textField = new BABYLON.GUI.TextBlock();
    textField.text = 'You are watching: \n' + this.videoController.urls[0].name;
    textField.color = "white";
    textField.fontSize = 18;
    textField.textHorizontalAlignment = 'left';
    textField.paddingLeft = '20px';
    grid.addControl(textField, 1, 2);
  }
}