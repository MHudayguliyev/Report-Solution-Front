import React, { useState, useRef } from "react";
import AvatarEditor from 'react-avatar-editor';
import { Button, Modal } from "@app/compLibrary";

// styles
import styles from './ImageCropper.module.scss'

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
    onSuccess: (canvas: string) => void
    translate: Function
    params: Settings<T>
    image: any | undefined
    inputRef?: any, 
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
        onSuccess,
        translate,
        inputRef
    } = props

    const { width = 250, height = 250, border = 20 } = props.params

    const [crop, setCrop] = useState<CropType>({ scale: 1, rotation: 0 });
    const editorRef:any = useRef(null);
    const rotateInterval = useRef<any>(null);

    const handleImageCrop = () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
            onSuccess(canvas)
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
            style={{width: '50vh', minHeight: '50vh'}}
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