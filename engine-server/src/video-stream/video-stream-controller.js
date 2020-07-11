export class VideoStreamController {

  initVideoStream(scene, engine) {
    this.appendVideoElements();
    // This is where you create and manipulate meshes
    const myPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", { width: 5.1, height: 3 }, scene);
    myPlane.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.WORLD);

    const videoTexture = playVideo(0, myPlane, scene)

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

  appendVideoElements() {
    const url = "https://cdn.dashjs.org/latest/dash.all.min.js";
    const script = $('<script>').attr('src', url);
    $('head').append(script);

    const stream1 = 'http://localhost:8080/playlist.mpd';
    const stream2 = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
    const stream3 = 'http://hrdash-i.akamaihd.net/dash/live/265226/hrfernsehen/manifest.mpd';
    const stream4 = 'http://streaming.austria24.tv:1935/live/mp4:stream_720p/manifest.mpd';

    const video1 = $('<video data-dashjs-player autoplay src="' + stream1 + '"></video>');
    const video2 = $('<video data-dashjs-player src="' + stream2 + '"></video>');
    const video3 = $('<video data-dashjs-player src="' + stream3 + '"></video>');
    const video4 = $('<video data-dashjs-player src="' + stream4 + '"></video>');

    const videos = [video1, video2, video3, video4];
    for (let idx in videos) {
      $('body').append(videos[idx]);
    }

    console.log('Adding HTML video elements');
  }

}

export function playVideo(idx, plane, scene) {
  // Video material
  const videoMat = new BABYLON.StandardMaterial("textVid", scene);
  const video = $('video')[idx];
  console.log(video)
  const videoTexture = new BABYLON.VideoTexture('video', video, scene, true, true);

  videoMat.backFaceCulling = false;
  videoMat.diffuseTexture = videoTexture;
  videoMat.emissiveColor = BABYLON.Color3.White();
  plane.material = videoMat;
  plane.position = new BABYLON.Vector3(-0.2, 5.23, 5.37);

  const htmlVideo = videoTexture.video;
  htmlVideo.setAttribute('webkit-playsinline', 'webkit-playsinline');
  htmlVideo.setAttribute('playsinline', 'true');
  htmlVideo.setAttribute('muted', 'true');
  htmlVideo.setAttribute('autoplay', 'false');

  return videoTexture;
}

