import React, {useState} from 'react'
import Dropzone from 'react-dropzone'
import PropTypes from "prop-types";
import CIcon from "@coreui/icons-react";
import {cilPlus} from "@coreui/icons";
import Styles from "../util/Styles";
import {Spinner} from "react-bootstrap";
import {FaPlus} from "react-icons/fa";
import {MdEdit,MdImage} from "react-icons/md";
import IconButton from "@material-ui/core/IconButton";
import ImageCropperDialogHook from "./ImageCropperDialogHook";

ImageDropzone.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string
}

export default function ImageDropzone(props) {

  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [cropperImageSrc, setCropperImageSrc] = useState("")

  const defaultCrop = {
    aspect: props.aspect,
    unit: '%',
    width: 30,
  }

  const renderContents = () => {
    let icon = props.noPrompt ? <MdImage pload style={{
      fontSize: "1em",
      marginBottom: "0.2em",
    }}/> : <FaPlus pload style={{
      fontSize: "1em",
      marginBottom: "0.2em",
    }}/>

    if (props.imageSrc && !props.hideContents) {

      return <>
        <img
          style={{
            width: "100%",
            height: "100%",
          }}
          src={props.imageSrc}/>
        {
          props.loading ? <Spinner
              style={{fontSize: "1em", display: true ? "inline" : "none"}}
              animation="border"/>
            :
            <IconButton style={{
              position: "absolute",
              zIndex: 10,
              color: "white"
            }}>
              <MdEdit />
            </IconButton>
        }
      </>
    } else {
      return <>
        {
          props.loading ? <Spinner
              style={{fontSize: "1em", display: true ? "inline" : "none"}}
              animation="border"/>
            :
            icon
        }
       {!props.noPrompt && <p style={{
          fontSize: "0.5em",
          marginBottom: "0em",
          textAlign: "center",

        }}>
          {props.prompt}
        </p>}

      </>
    }
  }

  const onDrop = (image) => {
    setCropperImageSrc(URL.createObjectURL(image[0]))
    setIsCropperOpen(true)

    console.log(URL.createObjectURL(image[0]))

    // props.onDrop(image)
  }


  return (
    <>
      <Dropzone
      accept={'image/jpeg, image/png'}
      onDrop={onDrop}>
        {({getRootProps, getInputProps}) => (
          <div {...getRootProps()} style={{
            height: props.height,
            width: props.width,
            display: props.noPrompt ? 'inline' : 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: "center",
            borderWidth: 2,
            borderRadius: 2,
            margin: props.noPrompt ? 0 : 10,
            borderColor: '#eeeeee',
            borderStyle: 'dashed',
            backgroundColor: props.noPrompt ? 'linear-gradient(180deg,#fdfdfd 0,#f6f7f8)': '#fafafa',
            color: props.noPrompt ? 'black':'#bdbdbd',
            outline: 'none',
            fontSize: "1.5em",
            transition: 'border .24s ease-in-out',
            border: props.noPrompt && '1px solid #999' 
          }}>
            {/*<CIcon icon={cilPlus} size="xxl" className={'mb-2'}/>*/}
            {/*<span style={{fontSize: "0.7em", fontWeight: "normal"}}>Click/Drag to Upload a Picture</span>*/}
            {/*<span style={{fontSize: "0.5em", fontWeight: "normal"}}>Recommended size: 800x800 pixels</span>*/}
            {renderContents()}
            <input {...getInputProps()} />
          </div>
        )}
      </Dropzone>

      <ImageCropperDialogHook
        isOpen={isCropperOpen}
        onClose={() => {
          setIsCropperOpen(false)
        }}
        onNegativeButtonPressed={() => {
          setIsCropperOpen(false)
        }}

        src={cropperImageSrc}
        crop={defaultCrop}
        onSubmit={async(image) => {
          // console.log("image" + image)
          setIsCropperOpen(false)
          props.onDrop(image)
        }}
        negativeButtonText={"Back"}

      />
    </>
  )
}
