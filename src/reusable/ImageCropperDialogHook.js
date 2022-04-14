import React, {useState, useCallback, useRef} from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {Dialog,Button} from "@material-ui/core";
import {DialogActions, DialogContent, DialogTitle} from '@material-ui/core';
// import CustomButton from "./CustomButton";
import {Row} from "react-bootstrap";
import {FaSave} from "react-icons/fa";
// import {} from "react-bootstrap";

export default function ImageCropperDialogHook(props) {
  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const [crop, setCrop] = useState({...props.crop});
  const [percentageCrop, setPercentageCrop] = useState({})
  const [previewUrl, setPreviewUrl] = useState();

  const onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = useCallback(img => {
    imgRef.current = img;
  }, []);

  const makeClientCrop = async() => {
    if (imgRef.current && crop.width && crop.height) {
      await createCropPercentagePreview(imgRef.current, crop, "file.png");
    }
  };

  const onSubmit =()=> {
    props.onSubmit()
  }

  const createCropPreview = async (image,crop,name) => {

    const canvas = document.createElement('canvas');

    // console.log(image.naturalWidth + " / " + image.width)

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }

        blob.name = name;

        // console.log("blobbie is ", blob)

        props.onSubmit(blob)

        // window.URL.revokeObjectURL(previewUrl);
        // setPreviewUrl(window.URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  };


  const createCropPercentagePreview = async (image,crop,name) => {

    const canvas = document.createElement('canvas');

    // console.log(image.naturalWidth + " / " + image.width)

    const scaleX = percentageCrop.width
    const scaleY = percentageCrop.height

    const ratioX = scaleX / 100
    const ratioY = scaleY / 100

    const imageWidthPx = image.naturalWidth * ratioX
    const imageHeightPx = image.naturalHeight * ratioY

    const xCoords = percentageCrop.x * image.naturalWidth / 100
    const yCoords = percentageCrop.y * image.naturalHeight / 100

    // console.log("params", imageWidthPx, imageHeightPx, xCoords, yCoords, percentageCrop)
    // params 1296 647.876923076923 0 26579.566074950686
    // params 1296 647.876923076923 0 8970.603550295858
    canvas.width = image.naturalWidth * scaleX / 100;
    canvas.height = image.naturalHeight * scaleY / 100

    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      xCoords,
      yCoords,
      imageWidthPx,
      imageHeightPx,
      0,
      0,
      imageWidthPx,
      imageHeightPx,
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }

        blob.name = name;

        // console.log("blobbie is ", blob)

        props.onSubmit(blob)

        // window.URL.revokeObjectURL(previewUrl);
        // setPreviewUrl(window.URL.createObjectURL(blob));
      }, 'image/jpeg');
    });
  };

  // console.log("currcrop" , crop)

  return (
    <Dialog
      open={props.isOpen}
      maxWidth="xl"
      fullWidth={true}>
      <DialogTitle onClose={props.onClose}>
        Image Crop
      </DialogTitle>
      <DialogContent>
        <div style={{
          width : "100%",
          display :"flex",
          justifyContent :"center",
          alignItems :"center"
        }}>

        </div>
        <ReactCrop
          src={props.src}
          onImageLoaded={onLoad}
          crop={crop}
          ruleOfThirds
          style={{
            height: '70vh',
            overflow: false,
            display : "flex",
            backgroundColor : "lightgrey",
          }}
          imageStyle={{
            objectFit: 'contain',
            height : "70vh",
          }}
          onChange={(c,pc) => {
            setCrop(c)
            setPercentageCrop(pc)
            // console.log(pc)
          }}
        />
      </DialogContent>
      <DialogActions style={{paddingTop: 15, marginBottom: 12, marginRight: 15}}>
        <Button
          onClick={props.onNegativeButtonPressed}
          style={{borderWidth: 0, marginRight: 10, width: 120, }}
          variant={"outlined"} color="primary">
          Cancel
        </Button>

        <Button
          onClick={()=>makeClientCrop()}
          style={{color: 'white', width: 120, }}
          variant={"contained"} color="primary">
          <>Save&nbsp;&nbsp;<FaSave/></>
        </Button>

        {/*<Button*/}
        {/*    color="primary"*/}
        {/*    onClick={props.onNegativeButtonPressed}>*/}
        {/*    Batal*/}
        {/*</Button>*/}

        {/*<Button*/}
        {/*    color="primary"*/}
        {/*    disabled={crop.width === 0  || crop.length === 0}*/}
        {/*    onClick={()=>makeClientCrop()}>*/}
        {/*    Simpan*/}
        {/*</Button>*/}
      </DialogActions>
    </Dialog>

  );
}
