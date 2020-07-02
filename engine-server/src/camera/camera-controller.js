export class CameraController {

  initCamera(scene, canvas) {

    // Add a camera to the scene and attach it to the canvas
    const cam_position = new BABYLON.Vector3(0, 5, -6);
    // var camera = new BABYLON.ArcRotateCamera("Camera", 270 * Math.PI / 180, Math.PI / 2, 2, cam_position, scene);
    const camera = new BABYLON.FreeCamera("MyCamera", cam_position, scene);
    // camera.lowerRadiusLimit = camera.upperRadiusLimit = camera.radius = 1;
    camera.minZ = .1;
    camera.attachControl(canvas, true);

    //Then apply collisions and gravity to the active camera
    
    camera.checkCollisions = true;
    camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    camera.speed = 0.02;
    camera.angularSpeed = 0.05;
    camera.angle = Math.PI / 2;
    camera.direction = new BABYLON.Vector3(Math.cos(camera.angle), 0, Math.sin(camera.angle));
    this.inputCameraControl(camera);
  }

  inputCameraControl(camera) {
    /* New Input Management for Camera */

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
  }



}