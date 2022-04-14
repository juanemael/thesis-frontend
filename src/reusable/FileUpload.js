import Dropzone, {useDropzone} from "react-dropzone";
import {FaPlus} from "react-icons/fa";
import {MdEdit} from "react-icons/md";
import {Row, Spinner} from "react-bootstrap";
import React, {useState} from "react";
// import ImageCropperDialog from "./ImageCropperDialog";
// import ImageCropperDialogHook from "./ImageCropperDialogHook";
import IconButton from "@material-ui/core/IconButton";
// import CustomButton from "./CustomButton";
import {FaCloudUploadAlt} from "react-icons/all";
// import Palette from "../../util/Palette";
import PropTypes from "prop-types";
import ImageDropzone from "./ImageDropzone";
import Button from "@material-ui/core/Button";
import Styles from "../util/Styles";
import {grey} from "@mui/material/colors";

// FileUpload.propTypes = {
//   isLoading: PropTypes.string,
//   allowedT: PropTypes.string
// }

export default function FileUpload(props) {

  const isLoading = props.isLoading

  const onDrop = (image) => {

    console.log(image)
    console.log(image[0].type)

    if(props.allowedType){
      if(!props.allowedType.includes(image[0].type)){
        alert("Please upload file with the type  : " + props.allowedType)
        return
      }
    }

    props.onDrop(image)

  }

  return (
    <>

      <Dropzone
        noDrag={true}
        onDrop={onDrop}>
        {({getRootProps, getInputProps}) => (
          <div
            style={{
              display : "flex",
              flexDirection : "row",
              alignItems : "center",
            }}
            {...getRootProps()}>

            <Button
              style={{
                fontSize : "0.8em",
                // fontFamily : "Poppins",
                textTransform : "none",
                ...props.buttonStyle
              }}
              disabled={isLoading}
              variant={"containedPrimary"}>
              <input {
                       ...getInputProps()
                     }
              />
              {props.text ? props.text : "+ Upload File"}
            </Button>


            {
              props.hideSpinner ?
                null
                :
                <Spinner
                  size={"sm"}
                  style={{
                    marginLeft : " 0.5em", color: "white", display: isLoading ? "inline" : "none"
                  }}
                  animation="border"/>
            }

          </div>
        )}
      </Dropzone>

    </>

  )
}
