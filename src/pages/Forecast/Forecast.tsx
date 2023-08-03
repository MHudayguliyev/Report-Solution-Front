import React, { useState, useRef } from "react";
import AvatarEditor from 'react-avatar-editor';
const Forecast = () => {

  const [image, setImage] = useState<any>(null);
  const [crop, setCrop] = useState<any>({ scale: 1 });
  const [croppedImage, setCroppedImage] = useState<any>("");
  const editorRef:any = useRef(null);

  const handleImageUpload = (event:any) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };
  const handleImageCrop = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
      setCroppedImage(canvas);
    }
  };

  return (
    <div style={{marginTop: '160px'}}>
      <input type="file" onChange={handleImageUpload} />
      {image && (
        <AvatarEditor
          ref={editorRef}
          image={image}
          width={250}
          height={250}
          border={50}
          color={[255, 255, 255, 0.6]}
          scale={crop.scale}
          rotate={0}
        />
      )}
      <input
        type="range"
        min="1"
        max="2"
        step="0.01"
        value={crop.scale}
        onChange={(e) => setCrop({ scale: parseFloat(e.target.value) })}
      />
      <button onClick={handleImageCrop}>Crop Image</button>
      {croppedImage && (
        <img src={croppedImage} alt="Cropped" />
      )}
    </div>
  )
}

export default Forecast