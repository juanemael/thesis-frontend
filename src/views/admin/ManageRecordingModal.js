import React, {Component, useCallback, useEffect, useRef, useState} from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Modal,
  Nav,
  Navbar,
  NavDropdown,
  Row,
  Spinner,
  Tabs
} from "react-bootstrap"


import 'bootstrap/dist/css/bootstrap.min.css';

import PropTypes from 'prop-types'

import 'moment/locale/id'
import {TextField} from "@material-ui/core"
import Collapse from "@material-ui/core/Collapse";
import Alert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import {FaTimes} from "react-icons/fa";
import {AiFillWarning, MdAdd} from "react-icons/all";
import {animateScroll as scroll} from "react-scroll";

import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Palette from "../../util/Palette";
import {MdDelete} from "react-icons/md";
import Email from "../../models/Email";
import Class from "../../models/Class";
import FileUploadIcon from "./FileUploadNew";
import FileUpload from "../../reusable/FileUpload";
import Attachment from "../../models/Attachment";

export default function ManageRecordingModal(props) {
  const {classObj, setClassObj} = props;
  const [progress, setProgress] = useState(0);

  const mystyle = {
    color: "green",
    backgroundColor: "DodgerBlue",
    padding: "10px",
    fontFamily: "Arial",
  };

  ManageRecordingModal.propTypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func.isRequired,
  }


  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const isUploadingAttachmentTemp = [];

  if (classObj.recording_url_array) {
    classObj.recording_url_array.forEach(recording => {
      isUploadingAttachmentTemp.push(false)
    })
  }

  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false)

  const renderAlertBox = () => {
    return <div style={{
      marginBottom: "1em"
    }}>
      <Collapse in={errorMessage.length > 0}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setErrorMessage("");
              }}
            >
              <FaTimes fontSize="inherit"/>
            </IconButton>
          }
        >
          {errorMessage}
        </Alert>
      </Collapse>
    </div>
  }

  const renderSuccessBox = () => {
    return <div style={{
      marginBottom: "1em"
    }}>
      <Collapse in={successMessage.length > 0}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setSuccessMessage("");
              }}
            >
              <FaTimes fontSize="inherit"/>
            </IconButton>
          }
        >
          {successMessage}
        </Alert>
      </Collapse>
    </div>
  }

  const promptError = (msg) => {
    setErrorMessage(msg)
    scroll.scrollTo(0)
  }

  const promptSuccess = (msg) => {
    setSuccessMessage(msg)
    scroll.scrollTo(0)
  }


  const validURL = (str) => {
    let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }

  const handleClose = () => {
    let allFieldsFilled = true;

    if (classObj.recording_url_array) {
      classObj.recording_url_array.forEach(recording => {
        if (!recording.url || !recording.title) allFieldsFilled = false;
      })
    }

    if (!allFieldsFilled) return promptError('Harap lengkapi semua data');

    setErrorMessage("")
    setSuccessMessage("")
    props.handleClose()
  }

  const addAttachmentGdrive = async function (addedFile, idx) {
    if (addedFile[0].type !== 'video/mp4') {
      return alert('Harap hanya unggah video dengan format MP4');
    }

    const isUploadingAttachmentTemp = [...isUploadingAttachment];

    isUploadingAttachmentTemp[idx] = true

    setIsUploadingAttachment(isUploadingAttachmentTemp)

    try {

      let result = await new Class().uploadVideo(addedFile[0], setProgress)
      // console.log('isinya' + result.web_url_download)

      const classObjTemp = {...classObj};

      classObjTemp.recording_url_array[idx].url = result.location;

      setClassObj(classObjTemp)

      isUploadingAttachmentTemp[idx] = false

      setIsUploadingAttachment(isUploadingAttachmentTemp)

    } catch (e) {
      let tempMessage = "Kesalahan Terjadi"

      if (e.msg) {
        if (e.msg.message) {
          tempMessage = e.msg.message
        }
      }
      alert(tempMessage)
      console.log(e)

      isUploadingAttachmentTemp[idx] = false

      setIsUploadingAttachment(isUploadingAttachmentTemp)

    }

  }

  const addRecording = async function (addedFile) {

    setIsUploadingAttachment(true)

    try {

      console.log(addedFile)
      let result = await new Attachment().addAttachment(addedFile[0])

      //
      console.log(result)

      let temp = {...classObj}

      let recordingUrls = []

      if (temp.recording_url_array && Array.isArray(temp.recording_url_array)) {
        recordingUrls = temp.recording_url_array
      }

      recordingUrls.push(result.location)

      setClassObj({
        ...classObj,
        recording_url_array: recordingUrls
      })

      console.error(classObj.recording_url)

      setIsUploadingAttachment(false)

    } catch (e) {
      let tempMessage = "Error Occurred. "

      if (e.msg) {
        if (e.msg.message) {
          tempMessage = e.msg.message
        }
      }
      alert(tempMessage)
      console.log(e)

      setIsUploadingAttachment(false)

    }

  }

  return (<Modal show={props.show} onHide={handleClose} size={"lg"}>
    <Modal.Header closeButton>
      Sunting Tautan
    </Modal.Header>
    <Modal.Body>
      {renderSuccessBox()}
      {renderAlertBox()}
      <Row style={{marginBottom: 5}}>
        {
          classObj.recording_url_array?.map((recording, idx) => {

            return (
              <>
                <Col xs={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <MdDelete color={'grey'}
                            size={17}
                            onClick={() => {
                              const classObjTemp = {...classObj};

                              classObjTemp.recording_url_array.splice(idx, 1);

                              setClassObj(classObjTemp)
                            }}
                            style={{cursor: 'pointer', marginBottom: 15}}/>
                </Col>
                <Col xs={3} style={{marginBottom: 10}}>Judul</Col>
                <Col xs={9} style={{marginBottom: 10}}>
                  <div style={{
                    marginLeft: "1em",
                  }}>
                    <TextField
                      inputProps={{
                        style: {
                          fontFamily: "Montserrat"
                        }
                      }}
                      size={'small'}
                      fullWidth={true}
                      variant={"outlined"}
                      value={recording.title}
                      onChange={evt => {
                        const classObjTemp = {...classObj};

                        classObjTemp.recording_url_array[idx].title = evt.target.value;

                        setClassObj(classObjTemp)
                      }}
                      placeholder={"Judul"}
                      style={{
                        marginTop: 0,
                        marginBottom: 0,
                        fontFamily: "Montserrat"
                      }}/>

                  </div>
                </Col>

                <Col xs={3} style={{marginTop: 13}}>Tautan</Col>
                <Col xs={9}>
                  <div style={{
                    marginLeft: "1em",
                    display: 'flex',
                    flexDirection: 'row'
                  }}>
                    <TextField
                      inputProps={{
                        style: {
                          fontFamily: "Montserrat"
                        }
                      }}
                      size={'small'}
                      fullWidth={true}
                      variant={"outlined"}
                      value={recording.url}
                      onChange={evt => {
                        const classObjTemp = {...classObj};

                        classObjTemp.recording_url_array[idx].url = evt.target.value;

                        setClassObj(classObjTemp)
                      }}
                      placeholder={"Tautan"}
                      style={{
                        marginTop: 10,
                        marginBottom: 0,
                        fontFamily: "Montserrat"
                      }}/>

                    <div>
                      <FileUpload
                        isLoading={isUploadingAttachment[idx]}
                        onDrop={(addedFile) => {
                          addRecording(addedFile)
                        }}
                        progress={progress}
                      />

                    </div>
                  </div>

                  {
                    !validURL(recording.url) ?
                      <div style={{
                        color: "grey",
                        fontWeight: "lighter"
                      }}>
                        <AiFillWarning
                          style={{
                            marginRight: 5,
                            marginLeft: 10,
                            color: Palette.ORANGE,
                            fontSize: "1.2em"
                          }}/>
                        Peringatan : Pastikan URL yang diketik valid (contoh :
                        https://us02web.zoom.us/j/82590270612)
                      </div>
                      :
                      null
                  }
                </Col>

                {idx !== classObj.recording_url_array.length - 1 && <Col xs={12} style={{
                  height: 1,
                  backgroundColor: '#dee2e6',
                  marginTop: 30,
                  marginBottom: 30
                }}/>}
              </>
            )
          })
        }
      </Row>

    </Modal.Body>
    {<Modal.Footer>
      <div style={{
        position: "absolute",
        bottom: "0.75rem",
        left: 12
      }}>
      </div>

      <Button variant="secondary" onClick={handleClose}>
        Tutup
      </Button>
      <Button variant="primary" onClick={() => {
        const classObjTemp = {...classObj};

        if (classObjTemp.recording_url_array) classObjTemp.recording_url_array.push({url: '', title: ''})
        else classObjTemp.recording_url_array = [{url: '', title: ''}]

        setClassObj(classObjTemp)
      }}>
        + Tambah Tautan
      </Button>
    </Modal.Footer>}
  </Modal>)


}
