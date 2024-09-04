import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  document.addEventListener('DOMContentLoaded', () => {
    const source = 'https://xlr8-video-segmentation-files.s3.ap-south-1.amazonaws.com/eleven.mp4/eleven.mp4_output/index.m3u8';
    const video = document.querySelector('video');

    const defaultOptions = {};

    if (!Hls.isSupported()) {
        video.src = source;
        var player = new Plyr(video, defaultOptions);
    } else {
        // For more Hls.js options, see https://github.com/dailymotion/hls.js
        const hls = new Hls();
        hls.loadSource(source);

        // From the m3u8 playlist, hls parses the manifest and returns
                // all available video qualities. This is important, in this approach,
                // we will have one source on the Plyr player.
               hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {

                   // Transform available levels into an array of integers (height values).
                  const availableQualities = hls.levels.map((l) => l.height)
              availableQualities.unshift(0) //prepend 0 to quality array

                  // Add new qualities to option
            defaultOptions.quality = {
                 //Default - AUTO
                options: availableQualities,
                forced: true,        
                onChange: (e) => updateQuality(e),
            }
            // Add Auto Label 
            defaultOptions.i18n = {
                qualityLabel: {
                    0: 'Auto',
                },
            }

            hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
              var span = document.querySelector(".plyr__menu__container [data-plyr='quality'][value='0'] span")
              if (hls.autoLevelEnabled) {
                span.innerHTML = `AUTO (${hls.levels[data.level].height}p)`
              } else {
                span.innerHTML = `AUTO`
              }
            })
    
             // Initialize new Plyr player with quality options
             var player = new Plyr(video, defaultOptions);
         });	

    hls.attachMedia(video);
        //  @ts-ignore 
        window.hls = hls;		 
    }

    function updateQuality(newQuality : any ) {
      if (newQuality === 0) {
        // @ts-ignore 
        window.hls.currentLevel = -1; //Enable AUTO quality if option.value = 0
      } else {
        // @ts-ignore 
        window.hls.levels.forEach((level : any , levelIndex : any) => {
          if (level.height === newQuality) {
            console.log("Found quality match with " + newQuality);
            // @ts-ignore  
            window.hls.currentLevel = levelIndex;
          }
        });
      }
    }
});

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      
    </>
  )
}

export default App
