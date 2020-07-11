export class GUIController {

  initGUI(scene) {
    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var button = BABYLON.GUI.Button.CreateImageWithCenterTextButton("but", "Click me!", "textures/grass.png");
    button.width = 0.1;
    button.height = "40px";
    button.color = "white";
    button.background = "grey";
    button.onPointerUpObservable.add(function () {
      console.log('button')
    });
    advancedTexture.addControl(button);
  }
}