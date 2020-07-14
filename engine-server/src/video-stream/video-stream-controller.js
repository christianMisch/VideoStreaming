/** Singleton class which manages the video streaming */
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
  }

  appendVideoElements() {
    const stream1 = 'http://localhost:8080/playlist.mpd';
    const stream2 = 'http://www.bok.net/dash/tears_of_steel/cleartext/stream.mpd';
    const stream3 = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
    const stream4 = 'http://rdmedia.bbc.co.uk/dash/ondemand/bbb/2/client_manifest-common_init.mpd'
    const stream5 = 'http://hrdash-i.akamaihd.net/dash/live/265226/hrfernsehen/manifest.mpd';
    const stream6 = 'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd';
    const stream7 = 'http://streaming.austria24.tv:1935/live/mp4:stream_720p/manifest.mpd';
    
    this.urls = [
      {url: stream1, name: 'Barcelona - static file from localhost'}, 
      {url: stream2, name: 'Tears of steel - external link: bok.net'}, 
      {url: stream3, name: 'Big Buck Bunny - external link: akamaihd.net'}, 
      {url: stream4, name: 'Big Buck Bunny - external link: bbc.co.uk'},
      {url: stream5, name: 'Hessischer Rundfunk (HR) - live TV'},
      {url: stream6, name: 'Parkour - external link: bitmovin.net'},
      {url: stream7, name: 'Austria24 - live TV'}
    ];
    this.numOfChannels = this.urls.length;
    console.log('Adding HTML video elements', this);
  }

  playVideo(idx) {
    const urlObject = this.urls[idx]
    $('video').remove();
    $('body').append($('<video/>'));

    const url = urlObject.url;
    const player = dashjs.MediaPlayer().create();
    player.initialize($('video')[0], url, true);
    
    this.isWebcamEnabled = false;
    this.currVideoIdx = idx;
    this.myPlane.position = new BABYLON.Vector3(-0.2, 5.23, 5.37);
    // Video material
    this.videoMat = new BABYLON.StandardMaterial("textVid", this.scene);
    const video = $('video')[0];
    const videoTexture = new BABYLON.VideoTexture('video', video, this.scene, true, true);

    this.videoMat.backFaceCulling = false;
    this.videoMat.diffuseTexture = videoTexture;
    this.videoMat.emissiveColor = BABYLON.Color3.White();
    this.myPlane.material = this.videoMat;

    const htmlVideo = videoTexture.video;
    htmlVideo.setAttribute('webkit-playsinline', 'webkit-playsinline');
    htmlVideo.setAttribute('playsinline', 'true');
    htmlVideo.setAttribute('autoplay', 'true');

    return videoTexture;
  }

  playWebcam() {
    this.isWebcamEnabled = true;
    BABYLON.VideoTexture.CreateFromWebCam(this.scene, (videoTexture) => {
      this.videoMat.diffuseTexture = videoTexture;
      this.videoMat.diffuseColor = BABYLON.Color3.White();
      this.myPlane.material = this.videoMat;
    }, { maxWidth: 1920, maxHeight: 1080 });
  }

}

