import { useState, useEffect, useRef } from 'react';
import './UploadButton.css';
import Hls from 'hls.js';
import Plyr, { APITypes, PlyrProps } from 'plyr-react';
import 'plyr-react/plyr.css';
import PlayerComponent from './PlayerComponent';

const UploadButton = () => {
  const [error, setError] = useState('');
  const [file, setFile] = useState<{ name: string } | null>(null);
  const [src, setSrc] = useState<string>('');
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [count , setCount] = useState(0);
  const [showSource , setShowSource] = useState<any>(false);
  const [showLoadingState , setShowLoadingState] = useState<any>(true);

    console.log(count);
//   useEffect(() => {
//     console.log("rerunning :" , count++)
//     const video = document.getElementById('plyr') as HTMLVideoElement;
//     let hls: Hls | null = null;

//     const loadVideo = async () => {
//       if (hls) {
//         hls.destroy(); // Clean up the previous HLS instance
//       }

//       if (Hls.isSupported()) {
//         hls = new Hls();
//         hls.loadSource('https://xlr8-video-segmentation-files.s3.ap-south-1.amazonaws.com/eleven.mp4/eleven.mp4_output/index.m3u8');
//         hls.attachMedia(video);

//         hls.on(Hls.Events.MANIFEST_PARSED, function () {
//             console.log("running only this part")
//           // Ensure the video plays after the manifest is loaded
//           video.play();
//         });

//         // Attach the Plyr instance to the video
//         if (ref.current) {
//           // @ts-ignore
//           ref.current.plyr.media = video;
//         }
//       }
//     };

//     loadVideo();

//     return () => {
//       if (hls) {
//         console.log("destroying");
//         hls.detachMedia();
//         // hls.destroy(); // Cleanup on component unmount or src change
//       }
//     };
//   }, []);; // Dependency on src to re-run when it changes






  useEffect(() => {
    if (file?.name) {
      console.log("setting source");
      setSrc(`https://xlr8-video-segmentation-files.s3.ap-south-1.amazonaws.com/${file.name}/${file.name}_output/index.m3u8`);
    }
  }, [file?.name]);

  useEffect(() => {
    if (file && file?.name) {
      setShowUploadButton(true);

      const fetchPresignedUrl = async () => {
        try {
          const response = await fetch(`http://ec2-13-232-212-28.ap-south-1.compute.amazonaws.com/get-s3-presigned-url/${file.name}`);
          const data = await response.json();
          setUploadUrl(data.uploadURL);
        } catch (err) {
          setError('Failed to fetch presigned URL');
        }
      };

      fetchPresignedUrl();
    } else {
      setShowUploadButton(false);
    }
  }, [file]);


    useEffect(() => {
        let id : any;
        console.log("requesting source : " , src)
        if(src.length !== 0){
             id =  setInterval(() => {
                fetch(src)
                .then(res => {
                    if(res.status === 200){
                        console.log(src , res.status , res)
                        clearInterval(id);
                        setShowSource(true)
                        setShowLoadingState(false);
                    }
                }) 
            } , 3000);
        }


        return () => {
            clearInterval(id);
        }
    } , [src]);




  const handleLimitCheck = (e: any) => {
    const selectedFile = e.target.files[0];
    const maxFileSize = 10 * 1024 * 1024;

    if (selectedFile && selectedFile.size > maxFileSize) {
      setError('Maximum allowed size for file is 10MB');
      setFile(null);
      console.log("setting file null")
      e.target.value = '';
    } else {
      setError('');
      setFile(selectedFile);

    }
  };

  const handleFileUpload = async () => {
    if (!uploadUrl) {
      setError('Upload URL not available');
      return;
    }

    try {
      setShowLoadingState(true);
      const response = await fetch(uploadUrl, {

        method: 'PUT',
        // @ts-ignore 
        body: file,
      });
      console.log('File uploaded successfully', response);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  return (
    <div className="upload-button">
      <form className="form">
        <label htmlFor="fileUpload" className="label">
          Upload your file
        </label>
        <input
          type="file"
          id="fileUpload"
          accept="video/mp4"
          className="u-button"
          onChange={handleLimitCheck}
        />
        {error && <div className="error">{error}</div>}
      </form>
      {showUploadButton && (
        <button className="upload-file-button" onClick={handleFileUpload}>
          {showLoadingState ? "Upload File" : "Processing" }
        </button>
      )}
      <PlayerComponent source={src} count={count} uploadUrl={uploadUrl} showUploadButton={showUploadButton} file={file} error={error} showSource={showSource}/>
      <div>
      </div>
    </div>
  );
};

export default UploadButton;
