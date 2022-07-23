import React, { useEffect, useRef, useState } from "react";

const CameraPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const [stream, setStream] = useState<MediaStream | null>();

  useEffect(() => {
    const getMedia = async () => {
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (error) {}
      setStream(stream);
    };
    getMedia();
  }, []);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const takePicture = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d")!;

    const width = stream?.getVideoTracks()[0]?.getSettings().width;
    const height = stream?.getVideoTracks()[0]?.getSettings().height;

    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(videoRef.current!, 0, 0, width, height);

      const photo = canvas.toDataURL("image/png");

      photoRef.current!.setAttribute("src", photo);
    }
  };

  return (
    <>
      <video ref={videoRef} autoPlay />
      <button onClick={takePicture} className="bg-slate-400 rounded-lg p-4">
        ZRÓB ZDJĘCIE
      </button> 
      <canvas ref={canvasRef} className="hidden" />
      <img ref={photoRef} alt="" src="" />
    </>
  );
};

export default CameraPage;
