export class VideoStreamController {

  constructor() {
    if (!VideoStreamController.instance) {
      this.currVideoIdx = 0;
      this.numOfChannels = 0;
      this.scene = null;
      this.videoMat = null;
      this.myPlane = BABYLON.MeshBuilder.CreatePlane("myPlane", { width: 5.1, height: 3 }, this.scene);
      this.myPlane.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.WORLD);
      this.isWebcamEnabled = false;
      this.urls = [];
      VideoStreamController.instance = this;
    }
    return VideoStreamController.instance;
  }

  initVideoStream(scene, engine) {
    this.appendVideoElements();
    this.scene = scene;

    const videoTexture = this.playVideo(0, this.scene);

    videoTexture.onLoadObservable.add(function () {
      engine.hideLoadingUI();
    });

    let isRunning = true;

    this.scene.onPointerUp = function () {
      const htmlVideo = $('video')[this.currVideoIdx];
      // activeVideoIdx++;
      // if (activeVideoIdx === 1) {

      // } else if (activeVideoIdx === 2) {

      // } else {

      // }
      // if (isRunning) {
      //   htmlVideo.pause();
      //   isRunning = false;
      // } else {
      //   videoMat.diffuseTexture = videoTexture;
      //   videoMat.emissiveColor = BABYLON.Color3.White();
      //   htmlVideo.play();
      //   isRunning = true;
      // }
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

    const stream1 = 'http://localhost:8080/playlist.mpd';
    const stream2 = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
    const stream3 = 'http://hrdash-i.akamaihd.net/dash/live/265226/hrfernsehen/manifest.mpd';
    const stream4 = 'http://streaming.austria24.tv:1935/live/mp4:stream_720p/manifest.mpd';

    this.urls = [
      {url: stream1}, 
      {url: stream2}, 
      {url: stream3}, 
      {url: stream4}
    ];
    this.numOfChannels = this.urls.length;
    // for (let idx in videos) {
    //   $('body').append(videos[idx]);
    // }
    // $('body').append(video1);

    console.log('Adding HTML video elements', this);
  }

  playVideo(idx) {
    const urlObject = this.urls[idx]
    $('video').remove();
    $('body').append($('<video/>'));

    const url = urlObject.url;
    console.log('url', url)
    const player = dashjs.MediaPlayer().create();
    player.initialize($('video')[0], url, true);
    
    this.isWebcamEnabled = false;
    console.log('playVideo', idx);
    this.currVideoIdx = idx;
    this.myPlane.position = new BABYLON.Vector3(-0.2, 5.23, 5.37);
    // Video material
    this.videoMat = new BABYLON.StandardMaterial("textVid", this.scene);
    const video = $('video')[0];
    console.log(video)
    const videoTexture = new BABYLON.VideoTexture('video', video, this.scene, true, true);

    this.videoMat.backFaceCulling = false;
    this.videoMat.diffuseTexture = videoTexture;
    this.videoMat.emissiveColor = BABYLON.Color3.White();
    this.myPlane.material = this.videoMat;

    const htmlVideo = videoTexture.video;
    htmlVideo.setAttribute('webkit-playsinline', 'webkit-playsinline');
    htmlVideo.setAttribute('playsinline', 'true');
    // htmlVideo.setAttribute('muted', 'true');
    htmlVideo.setAttribute('autoplay', 'true');
    // const playPromise = htmlVideo.play();
    // if (playPromise !== undefined) {
    //   playPromise.then(function(elem) {
    //     console.log('Automatic playback started!', elem);
    //   }).catch(function(error) {
    //     console.log('Automatic playback failed with error', error);
    //     // Show a UI element to let the user manually start playback.
    //   });
    // }
    return videoTexture;
  }

  playWebcam() {
    this.isWebcamEnabled = true;
    BABYLON.VideoTexture.CreateFromWebCam(this.scene, (videoTexture) => {
      this.videoMat.diffuseTexture = videoTexture;
      this.videoMat.diffuseColor = BABYLON.Color3.White();
      this.myPlane.material = this.videoMat;
    }, { maxWidth: 256, maxHeight: 256 });
  }

}

