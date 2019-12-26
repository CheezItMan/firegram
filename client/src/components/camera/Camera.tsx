import React, { useRef, useEffect } from 'react';
import { useUserMedia } from '../../hooks/useUserMedia';
import './Camera.module.scss';
import { storage } from '../../firebase/firebase.utils';

interface ICameraProps {
  setImageUrl: (imgUrl: string) => void;
}

const Camera = (props: ICameraProps) => {
  const videoRef = useRef<any>();
  const canvasRef = useRef<any>();

  const mediaStream = useUserMedia({ audio: false, video: { width: 300, height: 300}});

  if (mediaStream && videoRef.current && !videoRef.current.srcObject){
    videoRef.current.srcObject = mediaStream;
  }

  // Stop the video stream when component is unmount
  useEffect(() => {
    return () => {
      if(mediaStream){
        mediaStream.getTracks()[0].stop();
      }
    }
  }, [mediaStream]);

  const onCapture= async (blob: any) => {
    const imageUrl = await storage.ref('images/prueba1.png').put(blob).snapshot.ref.getDownloadURL();
    props.setImageUrl(imageUrl);
    console.log(imageUrl);
    //console.log('URL', myPromise);
    if(mediaStream){
      mediaStream.getTracks()[0].stop();
    }
  };

  return(
    <div>
      <video ref={videoRef} autoPlay muted/>
      <canvas ref={canvasRef} width={300} height={300}/>
      <button onClick={() => {
        if(canvasRef){
          const context = canvasRef.current.getContext('2d');
          // This is for rotate the photo
          context.translate(300,0);
          context.scale(-1,1);

          context.drawImage(videoRef.current, 0,0, 300, 300);          
          canvasRef.current.toBlob((blob: any) => onCapture(blob), "image/jpeg", 1);
          context.clearRect(0,0, 300, 300);
        }
      }}>
        Take photo
      </button>
    </div>
  )
}

export default Camera;