import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row, Tabs, Tab } from 'react-bootstrap'

import Palette from '../../util/Palette'
import CustomButton from '../../components/CustomButton'
import { FaTimes } from 'react-icons/all'
import LagFreeTextEditor from '../../components/LagFreeTextEditor'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import MobTable from '../../components/table/MobTable'
import Slider from '@material-ui/core/Slider'

import { Stage, Layer, Text, Image } from 'react-konva'
import TextField from '@material-ui/core/TextField'
import ActivityModels from '../../models/Activity'
import { useParams, useHistory } from 'react-router-dom'
import Class from '../../models/Class'
import FileUpload from '../../reusable/FileUpload'
import ColorPicker from 'material-ui-color-picker'

import { jsPDF } from 'jspdf'

import _ from 'lodash'
import textFormatter from '../../util/textFormatter'
import Member from '../../models/Member'
import DownloadSomeCertificateModal from '../../components/DownloadSomeCertificateModal'
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import { FaSave } from 'react-icons/fa'
import MuiAlert from '@material-ui/lab/Alert/Alert'
let stageRef

let imageRef

const CertificateList = (props) => {
  const history = useHistory()

  const handleSelect = (route) => {
    history.push(`/activity/${props.match.params.id}/${route}`)
  }
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingBar, setIsLoadingBar] = useState(false)
  const [imageBG, setImageBG] = useState(null)

  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [top, setTop] = useState(53)
  const [left, setLeft] = useState(50)

  const [topNumber, setTopNumber] = useState(15.5)
  const [leftNumber, setLeftNumber] = useState(50)
  const [fontSizeNumber, setFontSizeNumber] = useState(14)
  const [numberPrefix, setNumberPrefix] = useState('001')
  const [numberSuffix, setNumberSuffix] = useState('/HPI-01/01/02')

  const [fontSize, setFontSize] = useState(16)

  const [predicate, setPredicate] = useState('Istimewa')

  const [canvasWidth, setCanvasWidth] = useState(0)
  const [canvasHeight, setCanvasHeight] = useState(0)

  const { event_url } = useParams()

  const [registrants, setRegistrants] = useState([])

  const [name, setName] = useState()
  // eslint-disable-next-line no-unused-vars
  const [testingName, setTestingName] = useState()
  const [textColor, setTextColor] = useState('#274a9a')

  const [backgroundImageURL, setBackgroundImageURL] = useState(
    require('../../assets/CERTTEMPLATE.png'),
  )
  // eslint-disable-next-line no-unused-vars
  const [templateName, setTemplateName] = useState('')

  const [isUploading, setIsUploading] = useState(false)
  const [successCount, setSuccessCount] = useState(0)

  const [hidePageTwo, setHidePageTwo] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [competencies, setCompetencies] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [competency, setCompetency] = useState('')

  const [isManageCompetencyModalVisible, setManageCompetencyModalVisible] = useState(false)
  const [isDeleteCompetencyModalVisible, setDeleteCompetencyModalVisible] = useState(false)
  const [classObj, setClass] = useState({})
  const [selectedCompetencyIdx, setSelectedCompetencyIdx] = useState(null)

  const [isDownloadingCertificate, setIsDownloadingCertificate] = useState(false)

  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState('pariticpant-certificate')

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
  }

  const getParticipants = async () => {
    setIsLoading(true)

    let activityModel = new ActivityModels()
    let result
    try {
      result = await activityModel.getClassParticipants(props.match.params.id)
    } catch (e) {
      console.log('error: ' + e)
    }
    console.log(result)

    let registeredRegistrants = []

    for (let r of result) {
      if (r.status === 'ACCEPTED') {
        registeredRegistrants.push({
          ...r.member,
          ...r,
          full_name_sorter: r.member?.full_name.toUpperCase(),
        })
        setName(r.member?.full_name)
        setTestingName(r.member?.full_name)
      }
    }

    setIsLoading(false)
    setRegistrants(registeredRegistrants)
  }

  const getCertificates = async () => {
    const memberModel = new Member()
    try {
      const result = await memberModel.getAllCertificates(event_url)
      setRegistrants(result)
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (props.privateClass) {
      getCertificates()
    } else {
      getParticipants()
    }
    initializeImage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getClass = async () => {
    const classModel = new Class()

    try {
      const classObj = await classModel.getByCode(event_url)

      setClass(classObj)

      if (classObj.what_to_learn) {
        let competenciesTemp = JSON.parse(classObj.what_to_learn).map((competency) => {
          return { competency }
        })

        setCompetencies(competenciesTemp)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const renderAlertBox = () => {
    return (
      <div
        style={{
          marginBottom: '1em',
        }}
      >
        <Collapse in={errorMessage.length > 0}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setErrorMessage('')
                }}
              >
                <FaTimes fontSize="inherit" />
              </IconButton>
            }
          >
            {errorMessage}
          </Alert>
        </Collapse>
      </div>
    )
  }

  const renderSuccessBox = () => {
    return (
      <div
        style={{
          marginBottom: '1em',
        }}
      >
        <Collapse in={successMessage.length > 0}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setSuccessMessage('')
                }}
              >
                <FaTimes fontSize="inherit" />
              </IconButton>
            }
          >
            {successMessage}
          </Alert>
        </Collapse>
      </div>
    )
  }

  const columns = [
    {
      Header: 'ID Registrasi',
      accessor: 'id',
    },
    {
      Header: 'Nama Lengkap',
      accessor: 'full_name_sorter',
      Cell: (cellInfo) => {
        let rowInfo = cellInfo.row.values
        let member = rowInfo['member']

        return <>{member.full_name}</>
      },
    },
    {
      Header: 'Email',
      accessor: 'member',
      Cell: (cellInfo) => {
        let rowInfo = cellInfo.row.values
        let member = rowInfo['member']

        return <>{member.email}</>
      },
    },
    {
      Header: 'Presensi',
      accessor: 'is_present',
      Cell: (cellInfo) => {
        let rowInfo = cellInfo.row.values
        let isClaimed = rowInfo['is_present']

        return <>{isClaimed ? 'Ya' : 'Tidak'}</>
      },
    },
    {
      Header: 'Status Sertifikat',
      accessor: 'certificate_url',
      Cell: (cellInfo) => {
        let rowInfo = cellInfo.row.values

        let certificateUrl = rowInfo['certificate_url']

        return (
          <p style={{ color: certificateUrl ? 'LimeGreen' : 'Red' }}>
            {certificateUrl ? 'Terkirim' : 'Belum Dibuat'}
          </p>
        )
      },
    },
    {
      Header: 'Opsi',
      accessor: 'cert',
      Cell: (cellInfo) => {
        let rowInfo = cellInfo.row.values

        let certificateUrl = rowInfo['certificate_url']
        let member = rowInfo.member

        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              fontFamily: 'Open Sans',
            }}
          >
            {/*<FileUpload*/}
            {/*  allowedType={['application/pdf']}*/}
            {/*  hideSpinner={true}*/}
            {/*  text={'Unggah'}*/}
            {/*  isLoading={isLoadingBar}*/}
            {/*  onDrop={async (result) => {*/}
            {/*    setIsLoadingBar(true)*/}

            {/*    console.log(result)*/}
            {/*    let activityModel = new ActivityModels()*/}

            {/*    try {*/}
            {/*      let uploadResult = await activityModel.uploadCertificateUrl(*/}
            {/*        rowInfo.id,*/}
            {/*        member.id,*/}
            {/*        result[0],*/}
            {/*      )*/}
            {/*      console.log(uploadResult)*/}
            {/*      alert('Upload Berhasil')*/}
            {/*      getParticipants()*/}
            {/*      setIsLoadingBar(false)*/}
            {/*    } catch (e) {*/}
            {/*      console.log(e)*/}
            {/*      setIsLoadingBar(false)*/}
            {/*    }*/}
            {/*  }}*/}
            {/*  buttonStyle={{ fontFamily: 'Open Sans' }}*/}
            {/*/>*/}
            {certificateUrl ? (
              <a href={certificateUrl} download>
                <Button style={{ color: 'white', fontFamily: 'Open Sans' }}>Unduh</Button>
              </a>
            ) : null}
          </div>
        )
      },
    },
  ]

  const privateClassColumns = [
    {
      Header: 'ID Registrasi',
      accessor: 'id',
    },
    {
      Header: 'Nama Lengkap',
      accessor: 'full_name',
    },
    {
      Header: 'Email',
      accessor: 'email',
    },
    {
      Header: 'Status Sertifikat',
      accessor: 'certificate_url',
      Cell: (cellInfo) => {
        let rowInfo = cellInfo.row.values

        let certificateUrl = rowInfo['certificate_url']

        return (
          <p style={{ color: certificateUrl ? 'LimeGreen' : 'Red' }}>
            {certificateUrl ? 'Terkirim' : 'Belum Dibuat'}
          </p>
        )
      },
    },
    {
      Header: 'Opsi',
      accessor: 'cert',
      Cell: (cellInfo) => {
        let rowInfo = cellInfo.row.values

        let certificateUrl = rowInfo['certificate_url']
        let member = rowInfo.member

        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <FileUpload
              allowedType={['application/pdf']}
              hideSpinner={true}
              text={'Unggah'}
              isLoading={isLoadingBar}
              onDrop={async (result) => {
                setIsLoadingBar(true)

                console.log(result)
                let activityModel = new ActivityModels()

                try {
                  let uploadResult = await activityModel.uploadCertificateUrl(
                    rowInfo.id,
                    rowInfo.id,
                    result[0],
                  )
                  console.log(uploadResult)
                  alert('Upload Berhasil')
                  getCertificates()

                  setIsLoadingBar(false)
                } catch (e) {
                  console.log(e)
                  setIsLoadingBar(false)
                }
              }}
            />
            {certificateUrl ? (
              <a href={certificateUrl} download>
                <Button style={{ color: 'white', marginLeft: 10 }}>Unduh</Button>
              </a>
            ) : null}
          </div>
        )
      },
    },
  ]

  const initializeImage = (newImage) => {
    const tryImage = new window.Image()
    tryImage.src = newImage
      ? newImage
      : backgroundImageURL.default
      ? backgroundImageURL.default
      : backgroundImageURL
    tryImage.onload = () => {
      setImageBG(tryImage)
      imageRef.getLayer().batchDraw()
    }
    // imgKey = Date.now()
  }

  const handleUploadCertBackground = (result) => {
    let r = URL.createObjectURL(result[0])
    console.log(result)
    setBackgroundImageURL(r)
    setTemplateName(result[0]?.name)

    initializeImage(r)
  }

  const renderNewEditor = () => {
    return (
      <div
        style={{ width: '100%' }}
        ref={(ref) => {
          if (canvasWidth === 0 && ref !== undefined && ref?.clientWidth) {
            setCanvasWidth(ref?.clientWidth)
            setCanvasHeight(ref?.clientWidth * 0.71)
          }
        }}
      >
        <Stage
          ref={(ref) => (stageRef = ref)}
          style={{
            background: '#ffefff',
            width: '100%',
            height: canvasHeight,
          }}
          width={canvasWidth}
          height={canvasHeight}
        >
          <Layer>
            {/*UNTUK DEFINE GAMBAR*/}
            <Image
              ref={(ref) => {
                imageRef = ref
              }}
              width={canvasWidth}
              height={canvasHeight}
              image={imageBG}
            />
            {/*UNTUK MASUKIN TULISAN*/}
            <Text
              align={'center'}
              fontSize={fontSize}
              fontStyle={'bold'}
              fill={textColor}
              x={(canvasWidth * left) / 100}
              y={(canvasHeight * top) / 100}
              offsetY={fontSize / 2}
              offsetX={canvasWidth / 2}
              width={canvasWidth}
              text={name ? name : ''}
            />
            {/*Wibi: UNTUK MASUKKIN NOMOR SURAT*/}
            <Text
              align={'center'}
              fontSize={fontSizeNumber}
              fontStyle={'bold'}
              fontFamily={'Lora'}
              fill={'black'}
              x={(canvasWidth * leftNumber) / 100}
              y={(canvasHeight * topNumber) / 100}
              offsetX={canvasWidth / 2}
              width={canvasWidth}
              text={numberPrefix + numberSuffix}
            />
          </Layer>
        </Stage>
      </div>
    )
  }

  const waitTimeout = (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }

  const generateAllCertificate = async () => {
    let activityModel = new ActivityModels()

    let success = 0

    setIsUploading(true)

    try {
      let number = 0

      let sortedRegistrants = _.orderBy(
        registrants,
        (obj) => {
          return obj?.member?.full_name.toLowerCase()
        },
        ['asc'],
      )

      for (let r of sortedRegistrants) {
        setName(r?.member?.full_name)

        number++

        console.log(number + ' ' + r.id + ' generating for ' + r?.member?.full_name)

        setNumberPrefix(textFormatter.zeroPadder(number, 3))

        await waitTimeout(200)

        const pdf = new jsPDF('l', 'mm', [297, 210])

        let result = stageRef.toDataURL({ pixelRatio: 4 })
        pdf.addImage(result, 'JPEG', 0, 0, 297, 210, undefined, 'FAST')

        let pdfResult = pdf.output('blob')

        console.log(pdfResult)

        try {
          let uploadResult = await activityModel.uploadCertificateUrl(
            props.match.params.id,
            r.id,
            pdfResult,
          )
          console.log('upload result', uploadResult)
          console.log('success ' + r.id)

          success++
          setSuccessCount(success)
        } catch (e) {
          console.log(e)
        }
      }
    } catch (e) {
      setIsUploading(false)
      alert('Sukses mengunggah ' + success + '/' + registrants.length)

      console.log(e)

      getParticipants()

      return
    }

    setIsUploading(false)
    alert('Sukses mengunggah ' + success + '/' + registrants.length)
    getParticipants()
  }

  const renderContent = () => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Open Sans',
          marginTop: 30,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Open Sans' }}>
          <div
            style={{
              color: Palette.PRIMARY,
              fontSize: '1.75em',
              marginRight: 25,
            }}
          >
            Sertifikat
          </div>
        </div>

        {/*<div>*/}
        {/*  <Button*/}
        {/*    onClick={() => {*/}
        {/*      setIsDownloadingCertificate(true)*/}
        {/*    }}*/}
        {/*    disabled={isUploading}*/}
        {/*    variant={'primary'}*/}
        {/*    style={{ marginTop: 25, marginLeft: 10, color: 'white' }}*/}
        {/*  >*/}
        {/*    Unduh Sertifikat*/}
        {/*  </Button>*/}
        {/*</div>*/}

        <div
          style={{
            paddingTop: '1em',
            paddingBottom: '1em',
          }}
        >
          <MobTable
            columns={props.privateClass ? privateClassColumns : columns}
            data={registrants}
            style={{ fontFamily: 'Open Sans' }}
          />
        </div>

        <Container fluid>
          <Row>
            <Col xs={3} />
            <Col md={6} style={{ marginTop: 20 }}>
              {renderNewEditor()}
            </Col>
            <Col xs={3} />
            <Col xs={3} />
            <Col xs={3} />
            <Col md={12}>
              <div style={{ marginTop: '1em' }}>
                <div>
                  <b>Certificate Template</b>
                </div>
                <div>
                  Please Upload Template (A4 Ratio)
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: '1.1em',
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    <FileUpload
                      text={'Upload Template'}
                      onDrop={(result) => {
                        handleUploadCertBackground(result)
                      }}
                      buttonStyle={{ fontFamily: 'Open Sans' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }}>
                  <Button
                    onClick={async () => {
                      console.log(stageRef)
                      const pdf = new jsPDF('l', 'mm', [297, 210])

                      let result = stageRef.toDataURL({ pixelRatio: 4 })

                      pdf.addImage(result, 'JPEG', 0, 0, 297, 210, undefined, 'FAST')

                      pdf.save('download.pdf')

                      let output = pdf.output()
                      console.log(output)
                      //
                      // let a = document.createElement('a') //Create <a>
                      // a.href = result //Image Base64 Goes here
                      // a.download = 'Image.png' //File name Here
                      // a.click() //Downloaded file
                      //
                      // window.location.href = 'data:image/png;base64,' + result
                      // console.log(result)
                    }}
                    disabled={isUploading}
                    variant={'primary'}
                    style={{ color: 'white' }}
                  >
                    Download Preview
                  </Button>
                  <Button
                    onClick={() => {
                      generateAllCertificate()
                    }}
                    disabled={isUploading}
                    variant={'primary'}
                    style={{ marginLeft: 10, color: 'white' }}
                  >
                    Generate and Upload for All
                  </Button>
                  {isUploading ? (
                    <div
                      style={{
                        marginLeft: 10,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      ({successCount}/{registrants.length})
                    </div>
                  ) : null}
                </div>
              </div>
            </Col>
            <Col md={12}>
              <LagFreeTextEditor
                label={'Nama Peserta (Untuk Testing)'}
                fullWidth
                value={name}
                disabled={isUploading}
                placeholder={'Untuk Testing'}
                changeValue={(value) => {
                  setName(value)
                  setTestingName(value)
                }}
              />
            </Col>
            {/*<Col md={6}>*/}
            {/*  <LagFreeTextEditor*/}
            {/*    label={'Predikat (Untuk Testing)'}*/}
            {/*    fullWidth*/}
            {/*    value={predicate}*/}
            {/*    disabled={isUploading}*/}
            {/*    placeholder={'Untuk Testing'}*/}
            {/*    changeValue={(value) => {*/}
            {/*      setPredicate(value)*/}
            {/*    }}*/}
            {/*  />*/}
            {/*</Col>*/}
            <Col md={6}>
              <LagFreeTextEditor
                label={'Depan dari Nomor Surat'}
                fullWidth
                value={numberPrefix}
                disabled={isUploading}
                changeValue={(value) => {
                  setNumberPrefix(value)
                }}
              />
            </Col>
            <Col md={6}>
              <LagFreeTextEditor
                label={'Belakang dari Nomor Surat'}
                fullWidth
                value={numberSuffix}
                disabled={isUploading}
                changeValue={(value) => {
                  setNumberSuffix(value)
                }}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12} style={{ paddingTop: 30 }}>
              <b>Nomor Surat</b>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <div style={{ marginTop: '1em' }}>
                <div>
                  <TextField
                    label={'Ukuran Font'}
                    onChange={(e) => {
                      setFontSizeNumber(e.target.value)
                      // console.log(value + " ! " + fontSize)
                    }}
                    disabled={isUploading}
                    value={fontSizeNumber}
                  />
                  <Slider
                    value={fontSizeNumber}
                    min={1}
                    step={1}
                    max={100}
                    scale={(x) => x}
                    // getAriaValueText={valueLabelFormat}
                    // valueLabelFormat={valueLabelFormat}
                    onChange={(e, value) => {
                      // console.log(value)
                      setFontSizeNumber(value)
                    }}
                    disabled={isUploading}
                    style={{ flex: 1 }}
                    // valueLabelDisplay="auto"
                    // aria-labelledby="non-linear-slider"
                  />
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div style={{ marginTop: '1em' }}>
                <div>
                  <TextField
                    label={'Posisi Horizontal'}
                    onChange={(e) => {
                      setLeftNumber(e.target.value)
                      // console.log(value + " ! " + fontSize)
                    }}
                    disabled={isUploading}
                    value={leftNumber}
                  />
                  <Slider
                    value={leftNumber}
                    min={1}
                    step={0.1}
                    max={100}
                    scale={(x) => x}
                    // getAriaValueText={valueLabelFormat}
                    // valueLabelFormat={valueLabelFormat}
                    onChange={(e, value) => {
                      // console.log(value)
                      setLeftNumber(value)
                    }}
                    disabled={isUploading}
                    style={{ flex: 1 }}
                    // valueLabelDisplay="auto"
                    // aria-labelledby="non-linear-slider"
                  />
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div style={{ marginTop: '1em' }}>
                <div>
                  <TextField
                    label={'Posisi Vertikal'}
                    onChange={(e) => {
                      setTopNumber(e.target.value)
                      // console.log(value + " ! " + fontSize)
                    }}
                    disabled={isUploading}
                    value={topNumber}
                  />
                  <Slider
                    value={topNumber}
                    min={1}
                    step={0.1}
                    max={100}
                    scale={(x) => x}
                    // getAriaValueText={valueLabelFormat}
                    // valueLabelFormat={valueLabelFormat}
                    onChange={(e, value) => {
                      // console.log(value)
                      setTopNumber(value)
                    }}
                    disabled={isUploading}
                    style={{ flex: 1 }}
                    // valueLabelDisplay="auto"
                    // aria-labelledby="non-linear-slider"
                  />
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={12} style={{ paddingTop: 30 }}>
              <b>Halaman 1</b>
            </Col>
            <Col
              md={4}
              style={{
                paddingTop: 20,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}
            >
              <ColorPicker
                label={'Warna Text'}
                name="color"
                fullWidth={true}
                style={{
                  flex: 1,
                }}
                value={textColor}
                defaultValue={'Click to Change Color'}
                // value={this.state.color} - for controlled component
                onChange={(color) => setTextColor(color)}
              />
              {textColor}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <div style={{ marginTop: '1em' }}>
                <div>
                  <TextField
                    label={'Ukuran Font'}
                    onChange={(e) => {
                      setFontSize(e.target.value)
                      // console.log(value + " ! " + fontSize)
                    }}
                    disabled={isUploading}
                    value={fontSize}
                  />
                  <Slider
                    value={fontSize}
                    min={1}
                    step={1}
                    max={100}
                    scale={(x) => x}
                    // getAriaValueText={valueLabelFormat}
                    // valueLabelFormat={valueLabelFormat}
                    onChange={(e, value) => {
                      // console.log(value)
                      setFontSize(value)
                    }}
                    disabled={isUploading}
                    style={{ flex: 1 }}
                    // valueLabelDisplay="auto"
                    // aria-labelledby="non-linear-slider"
                  />
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div style={{ marginTop: '1em' }}>
                <div>
                  <TextField
                    label={'Posisi Horizontal'}
                    onChange={(e) => {
                      setLeft(e.target.value)
                      // console.log(value + " ! " + fontSize)
                    }}
                    disabled={isUploading}
                    value={left}
                  />
                  <Slider
                    value={left}
                    min={1}
                    step={0.1}
                    max={100}
                    scale={(x) => x}
                    // getAriaValueText={valueLabelFormat}
                    // valueLabelFormat={valueLabelFormat}
                    onChange={(e, value) => {
                      // console.log(value)
                      setLeft(value)
                    }}
                    disabled={isUploading}
                    style={{ flex: 1 }}
                    // valueLabelDisplay="auto"
                    // aria-labelledby="non-linear-slider"
                  />
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div style={{ marginTop: '1em' }}>
                <div>
                  <TextField
                    label={'Posisi Vertikal'}
                    onChange={(e) => {
                      setTop(e.target.value)
                      // console.log(value + " ! " + fontSize)
                    }}
                    disabled={isUploading}
                    value={top}
                  />
                  <Slider
                    value={top}
                    min={1}
                    step={0.1}
                    max={100}
                    scale={(x) => x}
                    // getAriaValueText={valueLabelFormat}
                    // valueLabelFormat={valueLabelFormat}
                    onChange={(e, value) => {
                      // console.log(value)
                      setTop(value)
                    }}
                    disabled={isUploading}
                    style={{ flex: 1 }}
                    // valueLabelDisplay="auto"
                    // aria-labelledby="non-linear-slider"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }

  return (
    <>
      <Tabs
        defaultActiveKey="certificates"
        transition={false}
        id="noanim-tab-example"
        className="mb-3 customTabs"
        onSelect={(eventKey) => handleSelect(eventKey)}
      >
        <Tab eventKey="edit" title="Edit Activity"></Tab>
        <Tab eventKey="participants" title="Participants"></Tab>
        <Tab eventKey="certificates" title="Certificates"></Tab>
      </Tabs>
      <Container>
        {renderAlertBox()}
        {renderSuccessBox()}

        <Dialog open={isDeleteCompetencyModalVisible} maxWidth="sm">
          <>
            <DialogTitle onClose={() => this.onClose()}>
              <Row>
                <Col
                  style={{
                    fontFamily: 'Open Sans',
                    color: Palette.PRIMARY,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Konfirmasi Hapus Kompetensi
                </Col>
              </Row>
              <hr />
            </DialogTitle>

            <DialogContent style={{ fontFamily: 'Open Sans', fontSize: '1.1em' }}>
              Apakah anda yakin ingin menghapus kompetensi ini?
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 30,
                  marginRight: 15,
                  marginBottom: 15,
                }}
              >
                <CustomButton
                  onClick={() => {
                    setDeleteCompetencyModalVisible(false)
                  }}
                  style={{
                    borderWidth: 0,
                    width: 120,
                    fontFamily: 'Open Sans',
                    fontWeight: 'bold',
                  }}
                  variant={'outlined'}
                  color="primary"
                >
                  Batal
                </CustomButton>

                <CustomButton
                  style={{
                    marginLeft: 10,
                    width: 120,
                    fontFamily: 'Open Sans',
                    fontWeight: 'bold',
                  }}
                  onClick={async () => {
                    const whatToLearn = JSON.parse(classObj.what_to_learn)

                    whatToLearn.splice(selectedCompetencyIdx, 1)

                    const classModel = new Class()

                    try {
                      // eslint-disable-next-line no-unused-vars
                      const result = await classModel.update(event_url, {
                        what_to_learn: JSON.stringify(whatToLearn),
                      })

                      setDeleteCompetencyModalVisible(false)

                      getClass()
                    } catch (e) {
                      console.log(e)
                    }
                  }}
                  variant={'contained'}
                  color="secondary"
                >
                  Hapus
                </CustomButton>
              </div>
            </DialogContent>
          </>
        </Dialog>

        <Dialog open={isManageCompetencyModalVisible} maxWidth="md" fullWidth={true}>
          <DialogTitle onClose={() => {}}>
            <Row>
              <Col
                style={{
                  fontFamily: 'Open Sans',
                  color: Palette.PRIMARY,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {!selectedCompetencyIdx ? 'Tambah' : 'Sunting'} Kompetensi
              </Col>
            </Row>
            <hr />
          </DialogTitle>
          <DialogContent>
            <Collapse in={errorMsg.length > 0}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setErrorMsg('')
                    }}
                  >
                    <FaTimes fontSize="inherit" />
                  </IconButton>
                }
              >
                {errorMsg}
              </Alert>
            </Collapse>

            <Row
              style={{
                paddingInlineStart: '2%',
                paddingInlineEnd: '2%',
                marginTop: '1em',
              }}
            >
              <Col md={12}>
                <LagFreeTextEditor
                  title={'Kompetensi'}
                  changeValue={(value) => {
                    setCompetency(value)
                  }}
                  value={competency}
                  placeholder={'Kompetensi'}
                />
              </Col>
            </Row>

            <Row
              style={{
                paddingInlineStart: '2%',
                paddingInlineEnd: '2%',
                paddingTop: '3em',
                paddingBottom: '1em',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <CustomButton
                style={{
                  borderWidth: 0,
                  marginRight: 10,
                  width: 120,
                  fontFamily: 'Signika',
                  fontWeight: 'bold',
                }}
                onClick={() => {
                  setCompetency('')
                  setManageCompetencyModalVisible(false)
                  setErrorMsg('')
                  setSelectedCompetencyIdx(null)
                }}
                variant={'outlined'}
                color="primary"
              >
                Batal
              </CustomButton>

              <CustomButton
                onClick={async () => {
                  let whatToLearn = []

                  if (!competency) {
                    setErrorMsg('Kompetensi tidak boleh kosong!')
                  } else {
                    if (classObj.what_to_learn) {
                      whatToLearn = JSON.parse(classObj.what_to_learn)
                    }

                    if (selectedCompetencyIdx !== null) {
                      whatToLearn[selectedCompetencyIdx] = competency
                    } else {
                      whatToLearn.push(competency)
                    }

                    const classModel = new Class()

                    try {
                      // eslint-disable-next-line no-unused-vars
                      const result = await classModel.update(event_url, {
                        what_to_learn: JSON.stringify(whatToLearn),
                      })

                      setCompetency('')
                      setManageCompetencyModalVisible(false)
                      setErrorMsg('')
                      setSelectedCompetencyIdx(null)

                      getClass()
                    } catch (e) {
                      console.log(e)
                    }
                  }
                }}
                style={{ color: 'white', width: 120, fontFamily: 'Open Sans', fontWeight: 'bold' }}
                variant={'contained'}
                color="primary"
              >
                <>
                  Simpan&nbsp;&nbsp;
                  <FaSave />
                </>
              </CustomButton>
            </Row>
          </DialogContent>
        </Dialog>
        {renderContent()}
        <DownloadSomeCertificateModal
          classCode={event_url}
          participants={registrants}
          isOpen={isDownloadingCertificate}
          onClose={(refresh) => {
            setIsDownloadingCertificate(false)
          }}
        />
      </Container>
    </>
  )
}

export default CertificateList
