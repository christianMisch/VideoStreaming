export class VideoStreamController {

  initVideoStream(scene, engine) {
    var url = "https://cdn.dashjs.org/latest/dash.all.min.js";
    var s = document.createElement("script");
    s.src = url;
    document.head.appendChild(s);

    // let activeVideoIdx = 1;

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


    // This is where you create and manipulate meshes
    console.log('video-controller', scene)
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
        // BABYLON.VideoTexture.CreateFromWebCam(scene, function (videoTexture) {
        //   videoMat.diffuseTexture = videoTexture;
        //   videoMat.diffuseColor = BABYLON.Color3.White();
        //   myPlane.material = videoMat;
        // }, { maxWidth: 256, maxHeight: 256 });
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
  }

}