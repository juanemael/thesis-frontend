import React, { useEffect, useState } from 'react'
import Styles from '../../util/Styles'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CHeader,
  CHeaderText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Tabs, Tab } from 'react-bootstrap'
import { cilCalendar, cilClock, cilSave, cilWarning } from '@coreui/icons'
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'
import ImageDropzone from '../../reusable/ImageDropzone'
import { FaTrash, MdFileDownload, FaTimes } from 'react-icons/all'
import Button from '@material-ui/core/Button'
import textFormatter from '../../util/textFormatter'
import FileUpload from '../../reusable/FileUpload'
import Attachment from '../../models/Attachment'
import ActivityModels from '../../models/Activity'
import Swal from 'sweetalert2'
import moment from 'moment'
import { useHistory, useParams } from 'react-router-dom'
import Palette from '../../util/Palette'
import RecordingModal from '../../components/modals/RecordingModal'
import {animateScroll as scroll} from "react-scroll";
import {Alert, Collapse} from "@mui/material";
import IconButton from "@material-ui/core/IconButton";

const ActivityFormUpdate = (props) => {
  const { id } = useParams()

  const history = useHistory()

  const handleSelect = (route) => {
    history.push(`/activity/${props.match.params.id}/${route}`)
  }

  const [classObj, setClassObj] = useState({
    code: '',
    name: '',
    topic_code: '0',
    event_id: 0,
    zoom_id: '',
    ios_product_id: '',

    description: '',
    speaker: '',
    source: '',
    stream_url: '',
    recording_url: '',
    recording_url_array: [],
    documentation_url: '',
    whatsapp_url: '',
    attachment_url: '',
    attachment_urls: '',
    class_image_url: '',
    class_image_url_ios: '',

    start_time: '',
    end_time: '',
    start_date: '',
    // registration_start_date: "",
    // registration_end_date: "",
    registration_start_time: null,
    registration_end_time: '',
    question_end_time: '',
    display_time: '',

    quota: 100,
    price: 150000,
    show_price: true,
  })

  const [enableDiscount, setEnableDiscount] = useState(true)
  const [selectedTopic, setSelectedTopic] = useState(0)
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false)
  const [isUploadingDocumentation, setIsUploadingDocumentation] = useState(false)
  const [isUploadingRecording, setIsUploadingRecording] = useState(false)
  const [attachment, setAttachment] = useState({})
  let [iconLoading, setIconLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [isUploadingClassImage, setIsUploadingClassImage] = useState(false)
  const [showRecordingModal, setShowRecordingModal] = useState(false)
  const [detailsTitle, setDetailsTitle] = useState(null)
  const [fileName, setFileName] = useState('')
  const [errorMsg,setErrorMsg] = useState(null)

  const [attachmentArray, setAttachmentArray] = useState({
    attach_url: '',
  })

  const [topics, setTopics] = useState([
    {
      code: 'T001',
      name: 'BGM',
    },
    {
      code: 'T002',
      name: 'YTVID',
    },
  ])

  let ActivityModel = new ActivityModels()
  const changeValue = (value, key) => {
    setClassObj({
      ...classObj,
      [key]: value,
    })
  }

  const resetModal = () => {
    setShowRecordingModal(false)
    setDetailsTitle(null)
  }

  useEffect(() => {
    getActivityData()
  }, [])

  const getActivityData = async () => {
    try {
      let activityDetail = await ActivityModel.getById(id)

      // return console.log("ADETAIL", activityDetail)

      setClassObj(activityDetail)

      setStartDate(activityDetail.start_time)
      setEndDate(activityDetail.end_time)

      setStartRegDate(activityDetail.registration_start_time)
      setEndRegDate(activityDetail.registration_end_time)

      console.log('ad', activityDetail)
    } catch (e) {
      console.log(e)
    }
  }

  const addAttachmentNew = async function (addedFile) {
    setIsUploadingAttachment(true)

    try {
      console.log('ADDED' + addedFile)
      let result = await new Attachment().addAttachment(addedFile[0])

      console.log(result)

      let temp = { ...classObj }

      let anotherArray = []

      let attachmentUrls = []

      if (temp.attachment_urls && Array.isArray(temp.attachment_urls)) {
        attachmentUrls = temp.attachment_urls
      }

      let name = []

      name = result.location.split('/')[6]

      console.log(name)

      attachmentUrls.push({ url: result.location, title: name })

      console.log('CEK DEH INI ISINYA APA', attachmentUrls)

      setClassObj({
        ...classObj,
        attachment_urls: attachmentUrls,
      })

      setIsUploadingAttachment(false)
    } catch (e) {
      let tempMessage = 'Error Occurred. '

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

  const addDocumentation = async function (addedFile) {
    setIsUploadingDocumentation(true)

    try {
      console.log(addedFile)
      let result = await new Attachment().addAttachment(addedFile[0])

      console.log(result)

      setAttachment({
        value: result.location,
        label: addedFile[0].name,
      })

      let temp = { ...classObj }

      let documentationUrls = []

      if (temp.documentation_url && Array.isArray(temp.documentation_url)) {
        documentationUrls = temp.documentation_url
      }

      documentationUrls.push(result.location)

      setClassObj({
        ...classObj,
        documentation_url: documentationUrls,
      })

      console.error(classObj.documentation_url)

      setIsUploadingDocumentation(false)
    } catch (e) {
      let tempMessage = 'Error Occurred. '

      if (e.msg) {
        if (e.msg.message) {
          tempMessage = e.msg.message
        }
      }
      alert(tempMessage)
      console.log(e)

      setIsUploadingDocumentation(false)
    }
  }

  const promptError = (msg) => {
    setErrorMsg(msg)
    scroll.scrollTo(0)
  }

  const handleSave = async function () {
    setErrorMsg(null)
    console.log("TES SAVE BEFORE")
    if(new Date(classObj.start_date).getTime() > new Date(classObj.end_date).getTime()){
      return promptError('Activity tart time must be earlier than the activity end time')
    } else if (new Date(classObj.registration_start_time).getTime() > new Date(classObj.registration_end_time).getTime()){
      return promptError('Activity registration start time must be earlier than the activity registration end time')
    } else if (new Date(classObj.registration_start_time).getTime() > new Date(classObj.start_date).getTime()){
      return promptError('Registration start time must be earlier than the activity start time')
    } else if (new Date(classObj.registration_start_time).getTime() > new Date(classObj.end_date).getTime()){
      return promptError('Registration start time must be earlier than the activity end time')
    } else if (new Date(classObj.registration_end_time).getTime() > new Date(classObj.end_date).getTime()){
      return promptError('Registration end time must be earlier than the activity end time')
    } else if (new Date(classObj.registration_end_time).getTime() > new Date(classObj.start_date).getTime()){
      return promptError('Registration end time must be earlier than the activity start time')
    } else {
      try {
        console.log(classObj)
        console.log("TES SAVE INSIDE 3")

        let result = await ActivityModel.update(id, {
          ...classObj,
        })
        console.log(result)

        if (result) {
          await Swal.fire({
            title: 'Save Successful',
            icon: 'success',
            confirmButtonText: 'OK',
          })
        }
      } catch (e) {
        console.error(e)
        await Swal.fire({
          title: 'The class has not successfully created',
          icon: 'error',
          confirmButtonText: 'OK',
        })
      }
    }
  }

  const onBannerPicked = async function (image) {
    setIsUploadingClassImage(true)
    try {
      console.log('CHECK IMAGE', image)

      const result = await new Attachment().addAttachment(image)

      console.log(result)
      setClassObj({
        ...classObj,
        class_image_url: result.location,
      })
      setIsUploadingClassImage(false)
    } catch (e) {
      console.error(e)
      setIsUploadingClassImage(false)
    }
  }

  const addRecordingUrl = async (addedFile, idx) => {
    if (addedFile[0].type !== 'video/mp4') {
      return alert('Please upload the video with the format MP4')
    }
  }

  const [selectedDate, handleDateChange] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  const [startRegDate, setStartRegDate] = useState(new Date())
  const [endRegDate, setEndRegDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [startTime, setStartTime] = useState(new Date())

  useEffect(() => {
    setClassObj({
      ...classObj,
      end_time: endDate,
      start_time: startDate,
      registration_start_time: startRegDate,
      registration_end_time: endRegDate,
    })
  }, [])

  return (
    <>
      <Tabs
        defaultActiveKey="edit"
        transition={false}
        id="noanim-tab-example"
        className="mb-3 customTabs"
        onSelect={(eventKey) => handleSelect(eventKey)}
      >
        <Tab eventKey="edit" title="Edit Activity">
          <RecordingModal
            show={showRecordingModal}
            onClose={() => setShowRecordingModal(false)}
            data={classObj.recording_url_array}
            setData={(data) => {
              setClassObj({
                ...classObj,
                recording_url_array: data,
              })
            }}
          />

          <CCard style={{ ...Styles.cardForm }} className={'mb-4 pb-0'}>
            <CCardHeader style={{ ...Styles.cardFormHeader }}>
              <strong>Edit Activity</strong>
            </CCardHeader>
            <CForm
              action=""
              method="POST"
              encType="multipart/form-data"
              className="form-horizontal"
            >
              <CRow>
                <div style={{marginBottom: "1em"}}>
                  <Collapse in={errorMsg}>
                    <Alert
                    severity={"error"}
                    action={
                      <IconButton
                        aria-label="close"
                        color={"inherit"}
                        size={"small"}
                        onClick={()=>{
                        setErrorMsg("")}
                        }>
                        <FaTimes fontSize={"inherit"}/>
                      </IconButton>
                    }>
                      {errorMsg}
                    </Alert>
                  </Collapse>
                </div>
              </CRow>
              <CCardBody className={'p-0'}>
                <CContainer className={'mb-4'}>
                  {/*<CHeader className={'mb-2'}>*/}
                  {/*  <CHeaderText>Activity Details</CHeaderText>*/}
                  {/*</CHeader>*/}
                  <CRow className={'px-3 mb-3'}>
                    <CFormLabel
                      style={{ ...Styles.formLabel }}
                      htmlFor="inputPoster"
                      className="col-sm-12 col-form-label"
                    >
                      Poster
                    </CFormLabel>
                    <div className="col-sm-12">
                      <ImageDropzone
                        height={'500px'}
                        width={'500px'}
                        aspect={1}
                        imageSrc={classObj.class_image_url}
                        loading={iconLoading}
                        prompt={
                          <>
                            Add Poster <br /> (Recommendation 800*800)
                          </>
                        }
                        onDrop={(acceptedFiles) => onBannerPicked(acceptedFiles)}
                      />
                    </div>
                  </CRow>

                  <CRow className={'px-3 mb-3'}>
                    <CFormLabel
                      style={{ ...Styles.formLabel }}
                      htmlFor="inputActivityCode"
                      className="col-sm-12 col-form-label"
                    >
                      Activity Code
                      <span style={{ ...Styles.formLabel2 }} className="ms-2">
                        (Leave empty to generate random code)
                      </span>
                    </CFormLabel>
                    <div className="col-sm-12">
                      <CFormInput
                        value={classObj.code}
                        onChange={(e) => changeValue(e.target.value, 'code')}
                        type="text"
                        id="inputActivityCode"
                        placeholder="Activity Code"
                      />
                    </div>
                  </CRow>

                  <CRow className={'px-3 mb-3'}>
                    <CFormLabel
                      style={{ ...Styles.formLabel }}
                      htmlFor="inputStreamLink"
                      className="col-sm-12 col-form-label"
                    >
                      Stream Link
                      <span style={{ ...Styles.formLabel2 }} className="ms-2">
                        (Leave empty if not available)
                      </span>
                    </CFormLabel>
                    <div className="col-sm-12">
                      <CFormInput
                        value={classObj.stream_url}
                        onChange={(e) => changeValue(e.target.value, 'stream_url')}
                        type="text"
                        id="inputStreamLink"
                        placeholder="Stream Link"
                      />
                    </div>
                    <CFormLabel
                      style={{ ...Styles.formLabel2 }}
                      htmlFor="inputStreamLink"
                      className="col-sm-12 col-form-label"
                    >
                      <CIcon icon={cilWarning} className={'me-2'} />
                      Note: Enter a valid link (e.g. https://us02web.zoom.us/j/1234567890)
                    </CFormLabel>
                  </CRow>

                  <CRow className={'px-3 mb-3'}>
                    <CFormLabel
                      style={{ ...Styles.formLabel }}
                      htmlFor="inputRecordingLink"
                      className="col-sm-12 col-form-label"
                    >
                      Recording File
                      <span style={{ ...Styles.formLabel2 }} className="ms-2">
                        (Leave empty if not available)
                      </span>
                    </CFormLabel>

                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      {Array.isArray(classObj.recording_url_array) ? (
                        classObj.recording_url_array?.map((recording, key) => {
                          return (
                            <CCard
                              key={key}
                              style={{
                                fontSize: '0.8em',
                                textTransform: 'none',
                                color: Palette.PRIMARY,
                                padding: 4,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginRight: 5,
                              }}
                              variant={'outlined'}
                            >
                              <a href={recording.url} style={{ marginRight: 5 }} key={key}>
                                {recording.title}
                              </a>
                              <FaTimes
                                style={{
                                  cursor: 'pointer',
                                }}
                                onClick={(e) => {
                                  // e.stopPropagation()
                                  let temp = [...classObj.recording_url_array]

                                  temp.splice(key, 1)

                                  setClassObj({
                                    ...classObj,
                                    recording_url_array: temp,
                                  })
                                }}
                              />
                            </CCard>
                          )
                        })
                      ) : (
                        <></>
                      )}

                      <CButton
                        onClick={() => {
                          setShowRecordingModal(true)
                          setDetailsTitle('Edit Recording')
                        }}
                      >
                        Edit
                      </CButton>
                    </div>
                  </CRow>

                  <CRow className={'px-3 mb-3'}>
                    <CFormLabel
                      style={{ ...Styles.formLabel }}
                      htmlFor="inputWhatsAppLink"
                      className="col-sm-12 col-form-label"
                    >
                      WhatsApp Link
                      <span style={{ ...Styles.formLabel2 }} className="ms-2">
                        (Leave empty if not available)
                      </span>
                    </CFormLabel>
                    <div className="col-sm-12">
                      <CFormInput
                        value={classObj.whatsapp_url}
                        onChange={(e) => changeValue(e.target.value, 'whatsapp_url')}
                        type="text"
                        id="inputWhatsAppLink"
                        placeholder="WhatsApp Link"
                      />
                    </div>
                    <CFormLabel
                      style={{ ...Styles.formLabel2 }}
                      htmlFor="inputWhatsAppLink"
                      className="col-sm-12 col-form-label"
                    >
                      <CIcon icon={cilWarning} className={'me-2'} />
                      Note: Enter a valid link (e.g. https://wa.me/6281234567890)
                    </CFormLabel>
                  </CRow>

                  <CRow className={'px-3 mb-3'}>
                    <CFormLabel
                      style={{ ...Styles.formLabel }}
                      htmlFor="inputName"
                      className="col-sm-12 col-form-label"
                    >
                      Activity Name
                    </CFormLabel>
                    <div className="col-sm-12">
                      <CFormInput
                        required
                        value={classObj.name}
                        onChange={(e) => changeValue(e.target.value, 'name')}
                        type="text"
                        id="inputName"
                        placeholder="Activity Name"
                      />
                    </div>
                  </CRow>

                  <CRow className={'px-3 mb-3'}>
                    <CFormLabel
                      style={{ ...Styles.formLabel }}
                      htmlFor="inputSpeaker"
                      className="col-sm-12 col-form-label"
                    >
                      Speaker
                    </CFormLabel>
                    <div className="col-sm-12">
                      <CFormInput
                        required
                        value={classObj.speaker}
                        onChange={(e) => changeValue(e.target.value, 'speaker')}
                        type="text"
                        id="inputSpeaker"
                        placeholder="Speaker"
                      />
                    </div>
                  </CRow>

                  <CRow className={'px-3 mb-3'}>
                    <CFormLabel
                      style={{ ...Styles.formLabel }}
                      htmlFor="inputDescription"
                      className="col-sm-12 col-form-label"
                    >
                      Description
                    </CFormLabel>
                    <div className="col-sm-12">
                      <CFormTextarea
                        required
                        style={{ resize: 'none' }}
                        value={classObj.description}
                        onChange={(e) => changeValue(e.target.value, 'description')}
                        type="text"
                        id="inputDescription"
                        rows={5}
                        placeholder="Description"
                      />
                    </div>
                  </CRow>

                  {/*<CRow className={'px-3 mb-3'}>*/}
                  {/*<CFormLabel style={{ ...Styles.formLabel }} htmlFor="inputTopic" className="col-sm-12 col-form-label">*/}
                  {/*  Topic*/}
                  {/*</CFormLabel>*/}
                  {/*<CCol md={12} sm={12} style={{*/}
                  {/*  display: "flex",*/}
                  {/*  alignItems: "flex-end"*/}
                  {/*}}>*/}
                  {/*<Select*/}
                  {/*  fullWidth*/}
                  {/*  value={selectedTopic ? selectedTopic : 0}*/}
                  {/*  onChange={evt => {*/}
                  {/*    setClassObj({*/}
                  {/*      ...classObj,*/}
                  {/*      topic_code: evt.target.value*/}
                  {/*    })*/}
                  {/*    setSelectedTopic(evt.target.value)*/}
                  {/*  }}*/}
                  {/*  style={{*/}
                  {/*    marginLeft: "0.5em",*/}
                  {/*    fontFamily: 'OpenSans-Regular',*/}
                  {/*    fontSize: "1.2em",*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  <MenuItem style={{fontFamily: 'OpenSans-Regular', }} value={0} disabled>Choose Topic</MenuItem>*/}

                  {/*  {topics.map((topik,key) => {*/}
                  {/*    return (*/}
                  {/*      <MenuItem style={{fontFamily: 'OpenSans-Regular',}}*/}
                  {/*                value={topik.code} key={key} >{topik.name}</MenuItem>*/}
                  {/*    )*/}
                  {/*  })}*/}
                  {/*</Select>*/}
                  {/*</CCol>*/}

                  {/*</CRow>*/}

                  <CRow className={'px-3 mb-3'}>
                    <CFormLabel
                      style={{ ...Styles.formLabel }}
                      htmlFor="inputMaterials"
                      className="col-sm-12 col-form-label"
                    >
                      Materials
                    </CFormLabel>
                    <div className="col-sm-12">
                      {Array.isArray(classObj?.attachment_urls) ? (
                        classObj.attachment_urls?.map((url, key) => {
                          return (
                            <div
                              style={{
                                marginRight: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: '1em',
                              }}
                              key={key}
                            >
                              <a
                                style={{
                                  display: url ? null : 'none',
                                }}
                                href={url.url}
                                target={'_blank'}
                                download
                                rel="noreferrer"
                              >
                                <Button
                                  style={{
                                    fontSize: '0.85em',
                                    fontFamily: 'Poppins',
                                    textTransform: 'none',
                                    marginRight: 5,
                                  }}
                                  variant={'outlined'}
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  {url ? textFormatter.getAttachmentURL(url.title) : ''}
                                  <MdFileDownload style={{ marginLeft: '0.5em' }} />
                                </Button>
                              </a>
                              <FaTrash
                                onClick={() => {
                                  console.error('THIS IS KEY', key)
                                  let temp = [...classObj.attachment_urls]
                                  let newTemp = temp.splice(key, 1)
                                  console.log(temp, key, newTemp)
                                  setClassObj({
                                    ...classObj,
                                    attachment_urls: temp,
                                  })
                                }}
                                style={{
                                  cursor: 'pointer',
                                }}
                              />
                            </div>
                          )
                        })
                      ) : (
                        <></>
                      )}
                      {/*<CButton style={Styles.cardHeaderActionButton} onClick={() => {}}>*/}
                      {/*  <CIcon icon={cilPlus} className={"me-2"}/>*/}
                      {/*  Upload File*/}
                      {/*</CButton>*/}

                      <FileUpload
                        style={{
                          marginTop: '0.5em',
                        }}
                        label={'+ Documentations Upload'}
                        isLoading={isUploadingAttachment}
                        onDrop={addAttachmentNew}
                      />
                    </div>
                  </CRow>
                </CContainer>

                <CContainer className={'mb-4'}>
                  <CHeader className={'mb-2'}>
                    <CHeaderText>Quota</CHeaderText>
                  </CHeader>
                  <CRow className={'px-3 mb-3'}>
                    <CCol md={3}>
                      <CFormLabel
                        style={{ ...Styles.formLabel }}
                        htmlFor="inputQuota"
                        className="col-form-label"
                      >
                        Quota
                      </CFormLabel>
                      <div className="col-sm-12">
                        <CFormInput
                          value={classObj.quota}
                          onChange={(e) => changeValue(e.target.value, 'quota')}
                          onWheel={(e) => e.target.blur()}
                          type="number"
                          id="inputQuota"
                          placeholder="100"
                        />
                      </div>
                    </CCol>
                  </CRow>
                </CContainer>

                <CContainer className={'mb-4'}>
                  <CHeader className={'mb-2'}>
                    <CHeaderText>Activity Schedule</CHeaderText>
                  </CHeader>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <CRow className={'px-3 mb-3'}>
                      <CCol md={4}>
                        <CFormLabel
                          style={{ ...Styles.formLabel }}
                          htmlFor="inputStartDate"
                          className="col-sm-12 col-form-label"
                        >
                          Start Date
                        </CFormLabel>
                        <DatePicker
                          allowKeyboardControl={false}
                          autoOk={true}
                          className="col-sm-12"
                          format="MMMM DD, YYYY"
                          maxDate={endDate}
                          InputProps={{
                            style: {
                              fontFamily: 'Open Sans',
                              cursor: 'pointer',
                            },
                            endAdornment: <CIcon icon={cilCalendar} />,
                          }}
                          style={{ ...Styles.datePicker }}
                          onChange={(date) => {
                            let temp = new moment(date)

                            temp.set({
                              hour: startDate.hour,
                              minute: startDate.minute,
                            })

                            console.log('temp', temp)
                            setStartDate(temp.toDate())

                            setClassObj({
                              ...classObj,
                              start_time: temp.toDate(),
                            })
                          }}
                          value={startDate}
                        />
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel
                          style={{ ...Styles.formLabel }}
                          htmlFor="inputEndDate"
                          className="col-sm-12 col-form-label"
                        >
                          End Date
                        </CFormLabel>
                        <DatePicker
                          allowKeyboardControl={false}
                          autoOk={true}
                          className="col-sm-12"
                          format="MMMM DD, YYYY"
                          InputProps={{
                            style: {
                              fontFamily: 'Open Sans',
                              cursor: 'pointer',
                            },
                            endAdornment: <CIcon icon={cilCalendar} />,
                          }}
                          placeholder="Activities Start Date"
                          style={{ ...Styles.datePicker }}
                          minDate={startDate}
                          onChange={(date) => {
                            let temp = new moment(date)

                            temp.set({
                              hour: endDate.hour,
                              minute: endDate.minute,
                            })

                            console.log('temp', temp)
                            setEndDate(temp.toDate())

                            setClassObj({
                              ...classObj,
                              end_time: temp.toDate(),
                            })
                          }}
                          value={endDate}
                        />
                      </CCol>
                    </CRow>
                    <CRow className={'px-3 mb-3'}>
                      <CCol md={4}>
                        <CFormLabel
                          style={{ ...Styles.formLabel }}
                          htmlFor="inputStartTime"
                          className="col-sm-12 col-form-label"
                        >
                          Start Time
                        </CFormLabel>
                        <TimePicker
                          allowKeyboardControl={false}
                          autoOk={true}
                          className="col-sm-12"
                          format="HH:mm"
                          InputProps={{
                            style: {
                              fontFamily: 'Open Sans',
                              cursor: 'pointer',
                            },
                            endAdornment: <CIcon icon={cilClock} />,
                          }}
                          style={{ ...Styles.datePicker }}
                          placeholder={'Registration Start Time'}
                          onChange={(time) => {
                            let start = new moment(startDate)
                            start.set({
                              hour: time.hour(),
                              minute: time.minute(),
                            })
                            setStartDate(start.toDate())
                            console.log(start.toDate())

                            setClassObj({
                              ...classObj,
                              start_time: start.toDate(),
                            })
                            // setClassObj({
                            //   ...classObj,
                            //   registration_start_time: time
                            // })
                          }}
                          value={startDate}
                        />
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel
                          style={{ ...Styles.formLabel }}
                          htmlFor="inputEndTime"
                          className="col-sm-12 col-form-label"
                        >
                          End Time
                        </CFormLabel>
                        <TimePicker
                          allowKeyboardControl={false}
                          autoOk={true}
                          className="col-sm-12"
                          format="HH:mm"
                          InputProps={{
                            style: {
                              fontFamily: 'Open Sans',
                              cursor: 'pointer',
                            },
                            endAdornment: <CIcon icon={cilClock} />,
                          }}
                          style={{ ...Styles.datePicker }}
                          onChange={(time) => {
                            let end = new moment(endDate)
                            end.set({
                              hour: time.hour(),
                              minute: time.minute(),
                            })
                            setEndDate(end.toDate())
                            console.log(end.toDate())
                            setClassObj({
                              ...classObj,
                              end_time: end.toDate(),
                            })
                          }}
                          value={endDate}
                        />
                      </CCol>
                    </CRow>
                  </MuiPickersUtilsProvider>
                </CContainer>

                <CContainer className={'mb-4'}>
                  <CHeader className={'mb-2'}>
                    <CHeaderText>Registration Schedule</CHeaderText>
                  </CHeader>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <CRow className={'px-3 mb-3'}>
                      <CCol md={4}>
                        <CFormLabel
                          style={{ ...Styles.formLabel }}
                          htmlFor="inputRegStartDate"
                          className="col-sm-12 col-form-label"
                        >
                          Registration Start Date
                        </CFormLabel>
                        <DatePicker
                          allowKeyboardControl={false}
                          autoOk={true}
                          className="col-sm-12"
                          format="MMMM DD, YYYY"
                          maxDate={endRegDate}
                          InputProps={{
                            style: {
                              fontFamily: 'Open Sans',
                              cursor: 'pointer',
                            },
                            endAdornment: <CIcon icon={cilCalendar} />,
                          }}
                          style={{ ...Styles.datePicker }}
                          onChange={(date) => {
                            let temp = new moment(date)

                            temp.set({
                              hour: startRegDate.hour,
                              minute: startRegDate.minute,
                            })

                            setStartRegDate(temp.toDate())

                            setClassObj({
                              ...classObj,
                              registration_start_time: temp.toDate(),
                            })
                          }}
                          value={startRegDate}
                        />
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel
                          style={{ ...Styles.formLabel }}
                          htmlFor="inputRegEndDate"
                          className="col-sm-12 col-form-label"
                        >
                          Registration End Date
                        </CFormLabel>
                        <DatePicker
                          allowKeyboardControl={false}
                          autoOk={true}
                          className="col-sm-12"
                          format="MMMM DD, YYYY"
                          minDate={startRegDate}
                          InputProps={{
                            style: {
                              fontFamily: 'Open Sans',
                              cursor: 'pointer',
                            },
                            endAdornment: <CIcon icon={cilCalendar} />,
                          }}
                          style={{ ...Styles.datePicker }}
                          onChange={(date) => {
                            let temp = new moment(date)
                            temp.set({
                              hour: endRegDate.hour,
                              minute: endRegDate.minute,
                            })
                            setEndRegDate(temp.toDate())
                            console.log(endRegDate)

                            setClassObj({
                              ...classObj,
                              registration_end_time: temp.toDate(),
                            })
                          }}
                          value={endRegDate}
                        />
                      </CCol>
                    </CRow>
                    <CRow className={'px-3 mb-3'}>
                      <CCol md={4}>
                        <CFormLabel
                          style={{ ...Styles.formLabel }}
                          htmlFor="inputRegStartTime"
                          className="col-sm-12 col-form-label"
                        >
                          Registration Start Time
                        </CFormLabel>
                        <TimePicker
                          allowKeyboardControl={false}
                          autoOk={true}
                          className="col-sm-12"
                          format="HH:mm"
                          InputProps={{
                            style: {
                              fontFamily: 'Open Sans',
                              cursor: 'pointer',
                            },
                            endAdornment: <CIcon icon={cilClock} />,
                          }}
                          style={{ ...Styles.datePicker }}
                          onChange={(time) => {
                            let start = new moment(startRegDate)
                            start.set({
                              hour: time.hour(),
                              minute: time.minute(),
                            })
                            setStartRegDate(start.toDate())
                            setClassObj({
                              ...classObj,
                              registration_start_time: start.toDate(),
                            })
                          }}
                          value={startRegDate}
                        />
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel
                          style={{ ...Styles.formLabel }}
                          htmlFor="inputRegEndTime"
                          className="col-sm-12 col-form-label"
                        >
                          Registration End Time
                        </CFormLabel>
                        <TimePicker
                          allowKeyboardControl={false}
                          autoOk={true}
                          className="col-sm-12"
                          format="HH:mm"
                          InputProps={{
                            style: {
                              fontFamily: 'Open Sans',
                              cursor: 'pointer',
                            },
                            endAdornment: <CIcon icon={cilClock} />,
                          }}
                          style={{ ...Styles.datePicker }}
                          placeholder={'Registration End Time'}
                          onChange={(time) => {
                            let end = new moment(endRegDate)
                            end.set({
                              hour: time.hour(),
                              minute: time.minute(),
                            })
                            setEndRegDate(end.toDate())
                            console.log(endRegDate)
                            setClassObj({
                              ...classObj,
                              registration_end_time: end.toDate(),
                            })
                          }}
                          value={endRegDate}
                        />
                      </CCol>
                    </CRow>
                  </MuiPickersUtilsProvider>
                </CContainer>
              </CCardBody>
              <CCardFooter style={{ ...Styles.cardFooter }}>
                <CRow className={'px-3 justify-content-end'}>
                  <CCol sm={2} className={'text-end'}>
                    <CButton
                      className={'m-0'}
                      // onClick={() => console.log(classObj)}
                      onClick={handleSave}
                      style={{ ...Styles.cardHeaderActionButton }}
                    >
                      <CIcon icon={cilSave} className={'me-2'} />
                      Save
                    </CButton>
                  </CCol>
                </CRow>
              </CCardFooter>
            </CForm>
          </CCard>
        </Tab>
        <Tab eventKey="participants" title="Participants"></Tab>
        <Tab eventKey="certificates" title="Certificates"></Tab>
      </Tabs>
    </>
  )
}

export default ActivityFormUpdate
