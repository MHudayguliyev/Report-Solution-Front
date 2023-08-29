import React, { useState, useRef } from "react";
import AvatarEditor from 'react-avatar-editor';
import { Button, Modal } from "@app/compLibrary";

// styles
import styles from './ImageCropper.module.scss'
async function dataURLtoBlob(dataURL:any, fileName:string) {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab],fileName, {type: mimeString});
}

type Settings<T> = {
    /** @defaultValue 250 */
    width: T, 
    /** @defaultValue 250 */
    height:T, 
    /** @defaultValue 20 */
    border: T
}

type ImageCropperProps<T> = {
    show: boolean
    setShow: (state: boolean) => void
    onSuccess: (formData: FormData) => void
    translate: Function
    params: Settings<T>
    image: any | undefined
    imageFile:{
        fileName:string
    }
    inputRef?: any
}
type CropType = {
    scale: number, 
    rotation: number
}
type DirectionType = 'left' | 'right'
    
const ImageCropper = (props: ImageCropperProps<number>) => {
    const {
        show = false, 
        setShow, 
        image,
        imageFile,
        onSuccess,
        translate,
        inputRef
    } = props

    const { width = 250, height = 250, border = 20 } = props.params

    const [crop, setCrop] = useState<CropType>({ scale: 1, rotation: 0 });
    const editorRef:any = useRef(null);
    const rotateInterval = useRef<any>(null);

    const handleImageCrop = async () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
            const file = await dataURLtoBlob(canvas,imageFile.fileName)
            const formData = new FormData()
            formData.append('userAvatar', file)
            onSuccess(formData)
            setShow(false)
            setCrop(prev => ({...prev, scale: 1, rotation: 0}))
        }
    };
    const rotateImage = (direction: DirectionType) => {
        setCrop(prev => ({
            ...prev,
            rotation: direction === 'left' ? prev.rotation - 1 : prev.rotation + 1
        }));
    };

    const startRotation = (direction: DirectionType) => {
        rotateInterval.current = setInterval(() => rotateImage(direction), 50);
    };

    const stopRotation = () => {
        return clearInterval(rotateInterval.current);
    };


  return (
    <>
        <Modal 
            isOpen={show}
            close={() => setShow(false)}
            style={{width: '400px'}}
        >
            <div className={styles.container}>
                <div className={styles.modal__header}>
                    <h1>{translate('cropPhoto')}</h1>
                </div>

                <div 
                    className={styles.modal__body}  
                >
                    <AvatarEditor
                        ref={editorRef}
                        image={image}
                        width={width}
                        height={height}
                        border={border}
                        color={[255, 255, 255, 0.6]}
                        scale={crop.scale}
                        rotate={crop.rotation}
                        backgroundColor="transparent"
                    />
                    <div className={styles.cropping}>
                        <input
                            type="range"
                            min="1"
                            max="2"
                            step="0.01"
                            value={crop.scale}
                            onChange={(e) => setCrop({ scale: parseFloat(e.target.value), rotation: crop.rotation })}
                        />
                        <div className={styles.rotation__buttons}>
                            <i className="bx bx-rotate-left" title="rotate right" onMouseDown={() => startRotation('left')} onMouseUp={stopRotation} onMouseLeave={stopRotation}></i>
                            <i className="bx bx-rotate-right" title="rotate right" onMouseDown={() => startRotation('right')} onMouseUp={stopRotation} onMouseLeave={stopRotation}></i>
                            <i className="bx bx-reset" title="reset" onClick={() => setCrop(prev => ({...prev, scale: 1, rotation: 0}))}></i>
                        </div>
                    </div>
                </div>

                <div className={styles.modal__footer}>
                    <Button id="userImg" color="theme"  type="contained" rounded onClick={() => {
                        setShow(false);                        
                        setCrop(prev => ({...prev, scale: 1, rotation: 0}))
                        inputRef?.current?.click();
                    }}>{translate('goBack')}</Button>
                    <Button color="theme" type="contained" rounded onClick={handleImageCrop}>{translate('saveNote')}</Button>
                </div>
            </div>
        </Modal>
    </>
  )
}

export default ImageCropper