import Hls from "hls.js";
import Plyr, { APITypes, PlyrProps } from "plyr-react";
import { useEffect, useRef, useState } from "react";

const PlayerComponent = ({source , count , uploadUrl , showUploadButton , file, error , showSource} : {source : string , count : number , uploadUrl : string , showUploadButton : boolean , file : any , error : any , showSource : boolean }) => {

    const ref = useRef<APITypes>(null);


  useEffect(() => {
    const video = document.getElementById('plyr') as HTMLVideoElement;
    let hls: Hls | null = null;


    const loadVideo = async () => {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource('https://xlr8-video-segmentation-files.s3.ap-south-1.amazonaws.com/eleven.mp4/eleven.mp4_output/index.m3u8');
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            console.log("running only this part")
          // Ensure the video plays after the manifest is loaded
          video.play();
        });

        // Attach the Plyr instance to the video
        if (ref.current) {
          // @ts-ignore
          ref.current.plyr.media = video;
        }
      }
    };

    loadVideo();
  }, []);; // Dependency on src to re-run when it changes





  useEffect(() => {
    console.log(source , "changing source");
    const video = document.getElementById('plyr') as HTMLVideoElement;
    let hls: Hls | null = null;

    const loadVideo = async () => {

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            console.log("running only this part")
          // Ensure the video plays after the manifest is loaded
          video.play();
        });

        // Attach the Plyr instance to the video
        if (ref.current) {
          // @ts-ignore
          ref.current.plyr.media = video;
        }
      }
    };

    loadVideo();
} , [source ,count , uploadUrl , showUploadButton , file, error , showSource]);



    return(
        <div className="" style={{width: "1000px"}}>
        {showSource ? 
        
        <Plyr
        id="plyr"
        source={{} as PlyrProps['source']}
        options={{
          controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
          settings: ['captions', 'quality', 'speed', 'loop'],
          clickToPlay: true,
          muted: true, // Muted to satisfy autoplay conditions
          autoplay: true, // Set autoplay
          keyboard: { focused: true, global: false },
        //   @ts-ignore 
          quality: { options: [1080, 720, 480, 360] },
          speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 4] },
        }}
        ref={ref}
      />

      : 

      null
        }
        </div>
    )
}

export default PlayerComponent;