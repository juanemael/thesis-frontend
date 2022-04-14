import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalHeader,
  CRow,
} from '@coreui/react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import React, { useEffect, useState } from 'react'
import RichTextEditor from 'react-rte'
import CIcon from '@coreui/icons-react'
import { cilSave } from '@coreui/icons'
import swal from 'sweetalert2'
import moment from 'moment'
import parse from 'html-react-parser'
import { useHistory, useParams } from 'react-router-dom'
import { MdErrorOutline } from 'react-icons/all'

import Styles from '../../util/Styles'
import ContentModels from '../../models/Content'
import Attachment from '../../models/Attachment'
import ImageDropzone from '../../reusable/ImageDropzone'

let editorState

const ContentUpdate = () => {
  let ContentModel = new ContentModels()
  let history = useHistory()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState(() => RichTextEditor.createEmptyValue())
  const [contentObj, setContentObj] = useState({})
  const [errorMsg, setErrorMsg] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { id } = useParams()

  const [isUploadingThumbnailImage, setIsUploadingThumbnailImage] = useState(false)
  const [thumbnailImage, setThumbnailImage] = useState(null)

  const [isUploadingBannerImage, setIsUploadingBannerImage] = useState(false)
  const [bannerImage, setBannerImage] = useState(null)

  const onThumbnailPicked = async (image) => {
    setIsUploadingThumbnailImage(true)
    try {
      const result = await new Attachment().addAttachment(image)

      console.log(result)
      setThumbnailImage(result.location)

      setIsUploadingThumbnailImage(false)
    } catch (e) {
      console.error(e)
      setIsUploadingThumbnailImage(false)
    }
  }
  const onBannerPicked = async (image) => {
    setIsUploadingBannerImage(true)
    try {
      const result = await new Attachment().addAttachment(image)
      console.log(result)
      setBannerImage(result.location)

      setIsUploadingBannerImage(false)
    } catch (e) {
      console.error(e)
      setIsUploadingBannerImage(false)
    }
  }

  const getContentData = async () => {
    try {
      let contentDetail = await ContentModel.getById(id)

      setContentObj(contentDetail)
      setTitle(contentDetail.title)

      setContent(
        contentDetail && contentDetail.content !== ''
          ? RichTextEditor.createValueFromString(contentDetail.content, 'html')
          : RichTextEditor.createEmptyValue(),
      )

      setBannerImage(contentDetail.banner_url)
      setThumbnailImage(contentDetail.thumbnail_url)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getContentData()
  }, [])

  const submission = async () => {
    setErrorMsg(null)
    if (title.length === 0) {
      setErrorMsg('Please Fill Title')
    } else if (content.length === 0) {
      setErrorMsg('Please Fill Content')
    } else {
      swal
        .fire({
          title: 'Confirmation',
          text: 'Are you sure you want to store this data ?',
          icon: 'warning',
          showCancelButton: true,
          confirmButton: 'Yes',
          confirmButtonColor: '#3085d6',
          cancelButton: 'Cancel',
          cancelButtonColor: '#d33',
        })
        .then(async (res) => {
          if (res.isConfirmed) {
            try {
              let result = await ContentModel.update(id, {
                title,
                content: content.toString('html'),
                banner_url: bannerImage,
                thumbnail_url: thumbnailImage,
              })
              if (result.id || result.success) {
                await swal.fire('', 'Data successfully stored', 'success').then(() => {
                  history.push(`/content/update/${id}`)
                })
              } else await swal.fire('', 'Data failed to be stored', 'error')
            } catch (e) {
              console.log(e)
              await swal.fire('', e.error_message ? e.error_message : 'Error Happened', 'error')
            }
          }
        })
    }
  }

  const previewModal = () => {
    return (
      <CModal visible={showModal} size={'lg'} onClose={() => setShowModal(false)}>
        <CModalHeader style={Styles.ModalDetailTitle} closeButton></CModalHeader>
        <CModalBody>
          <Row>
            <Col className="my-2 h-100 text-center">
              <div className="d-block">
                <h1>{title}</h1>
              </div>
              <div
                style={{
                  fontFamily: 'Open Sans',
                  fontWeight: '600',
                  fontSize: '0.75em',
                  color: '#8e8e8e',
                }}
              >
                {moment(Date.now()).format('dddd, DD MMM YYYY')}
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="my-2 h-100">
              <div className="d-block text-center">
                {bannerImage && (
                  <img
                    src={bannerImage}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                    }}
                    alt={title}
                  ></img>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col className="my-2 h-100">
              <div
                style={{
                  fontWeight: 400,
                }}
                className="d-block"
              >
                {content ? parse(content.toString('html')) : ''}
              </div>
            </Col>
          </Row>
        </CModalBody>
      </CModal>
    )
  }

  const onDrop = async (image, editorState) => {
    console.log(editorState.getSelection().getStartKey())
    console.log(
      editorState
        .getCurrentContent()
        .getBlockMap()
        .keySeq()
        .findIndex((k) => k === editorState.getSelection().getStartKey()),
    )
    try {
      const result = await new Attachment().addAttachment(image)
      insertImage(result.location)
    } catch (e) {
      console.error(e)
    }
  }

  const insertImage = (imgUrl) => {
    let stringContent = content.toString('html')
    stringContent += `<p><img src="${imgUrl}" /> </p>`

    const anchorPosition = editorState.getSelection().getAnchorOffset()

    setContent(RichTextEditor.createValueFromString(stringContent, 'html'))
  }
  return (
    <CRow>
      {previewModal()}
      <CCol xs={12}>
        <CCard style={{ ...Styles.cardForm }} className="mb-4">
          <CCardHeader style={{ ...Styles.cardFormHeader }}>
            <div
              style={{ color: '#007bff', cursor: 'pointer' }}
              className="mb-2"
              onClick={() => history.replace('/contents')}
            >
              {'<'} Back to contents
            </div>
            <strong>Content Update</strong>
          </CCardHeader>
          <CCardBody>
            <CForm
              action=""
              method="post"
              encType="multipart/form-data"
              className="form-horizontal"
            >
              {errorMsg ? (
                <CRow
                  className="mb-3"
                  style={{
                    backgroundColor: '#ffc9cf',
                    color: '#e3192d',
                    alignItems: 'center',
                    border: '1px solid $d5bab9',
                    paddingRight: 10,
                    paddingTop: 7,
                    marginBottom: 20,
                    borderRadius: 5,
                  }}
                >
                  <CCol xs={1}>
                    <MdErrorOutline size={27} color={'#a25b5d'} />
                  </CCol>
                  <CCol
                    style={{
                      color: '#a25b5d',
                      fontFamily: 'Signika',
                      fontWeight: '600',
                      marginLeft: 5,
                    }}
                  >
                    {errorMsg}
                  </CCol>
                </CRow>
              ) : null}

              <CRow className="mb-3">
                <CFormLabel
                  style={{ ...Styles.formLabel }}
                  htmlFor="inputTitle"
                  className="col-sm-2 col-form-label"
                >
                  Title
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormInput
                    defaultValue={contentObj.title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    id="inputTitle"
                  />
                </div>
              </CRow>
              <CRow className={'mb-3'}>
                <div className="col-md-12">
                  <CFormLabel
                    style={{ ...Styles.formLabel }}
                    htmlFor="inputPoster"
                    className="col-sm-12 col-form-label"
                  >
                    Thumbnail
                  </CFormLabel>
                  <ImageDropzone
                    height={'300px'}
                    width={'300px'}
                    aspect={1}
                    imageSrc={thumbnailImage}
                    loading={isUploadingThumbnailImage}
                    prompt={
                      <>
                        Add Thumbnail <br /> (Recommendation 400*400)
                      </>
                    }
                    onDrop={(acceptedFiles) => onThumbnailPicked(acceptedFiles)}
                  />
                </div>
                <div className="col-md-12">
                  <CFormLabel
                    style={{ ...Styles.formLabel }}
                    htmlFor="inputPoster"
                    className="col-sm-12 col-form-label"
                  >
                    Banner
                  </CFormLabel>
                  <ImageDropzone
                    height={'300px'}
                    width={'100%'}
                    imageSrc={bannerImage}
                    loading={isUploadingBannerImage}
                    display="inline-flex"
                    margin={0}
                    prompt={
                      <>
                        Add Banner <br />
                      </>
                    }
                    onDrop={(acceptedFiles) => onBannerPicked(acceptedFiles)}
                  />
                </div>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel
                  style={{ ...Styles.formLabel }}
                  htmlFor="inputContent"
                  className="col-sm-2 col-form-label"
                >
                  Content
                </CFormLabel>
                <div
                  style={{
                    fontWeight: 400,
                  }}
                  className="col-sm-10"
                >
                  <RichTextEditor
                    ref={(ref) => {
                      let blockEditorState = ref?.editor?.props?.editorState
                      if (blockEditorState) {
                        editorState = blockEditorState
                      }
                    }}
                    className="text-editor"
                    onChange={(e) => {
                      setContent(e)
                      // let anchorPosition = editorState.getSelection().getAnchorOffset()
                      // let startPosition = editorState.getSelection().getStartOffset()
                      // let endPosition = editorState.getSelection().getEndOffset()
                      // let focusPosition = editorState.getSelection().getFocusOffset()
                      // console.log("AP", editorState.getSelection(), anchorPosition, startPosition, endPosition, focusPosition)
                    }}
                    value={content}
                    toolbarConfig={{
                      display: [
                        'INLINE_STYLE_BUTTONS',
                        'BLOCK_TYPE_BUTTONS',
                        'LINK_BUTTONS',
                        'BLOCK_TYPE_DROPDOWN',
                        'HISTORY_BUTTONS',
                      ],
                      INLINE_STYLE_BUTTONS: [
                        { label: 'Bold', style: 'BOLD' },
                        { label: 'Italic', style: 'ITALIC' },
                        { label: 'Underline', style: 'UNDERLINE' },
                        { label: 'Strikethrough', style: 'STRIKETHROUGH' },
                        { label: 'Code', style: 'CODE' },
                      ],
                      BLOCK_TYPE_DROPDOWN: [
                        { label: 'Normal', style: 'unstyled' },
                        { label: 'Heading Large', style: 'header-one' },
                        { label: 'Heading Medium', style: 'header-two' },
                        { label: 'Heading Small', style: 'header-three' },
                      ],
                      BLOCK_TYPE_BUTTONS: [
                        { label: 'UL', style: 'unordered-list-item' },
                        { label: 'OL', style: 'ordered-list-item' },
                      ],
                    }}
                    customControls={[
                      (getState, setState, editorState) => {
                        return (
                          <ImageDropzone
                            hideContents={true}
                            noPrompt={true}
                            onDrop={(acceptedFiles) => onDrop(acceptedFiles, editorState)}
                            style={{ display: 'inline' }}
                          />
                        )
                      },
                    ]}
                  />
                </div>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div style={{ float: 'right' }}>
              {/*<CButton*/}
              {/*  size="sm"*/}
              {/*  color="light"*/}
              {/*  onClick={() => {*/}
              {/*    let stringContent = content.toString('html')*/}

              {/*    const anchorPosition = editorState.getSelection().getAnchorOffset()*/}

              {/*    let result = stringContent.substring(0, anchorPosition) + `<p>bruh</p>` + stringContent.substring(anchorPosition, stringContent.length);*/}

              {/*    setContent(RichTextEditor.createValueFromString(result, 'html'))*/}

              {/*  }}*/}
              {/*  className="mx-1"*/}
              {/*>*/}
              {/*  Position*/}
              {/*</CButton>*/}

              {/*<CButton*/}
              {/*  size="sm"*/}
              {/*  color="light"*/}
              {/*  onClick={() => {*/}
              {/*    let text =  "bruh"*/}
              {/*    const currentContent = editorState.getCurrentContent(),*/}
              {/*      currentSelection = editorState.getSelection();*/}

              {/*    const newContent = Modifier.replaceText(*/}
              {/*      currentContent,*/}
              {/*      currentSelection,*/}
              {/*      text*/}
              {/*    );*/}

              {/*    const newEditorState = EditorState.push(editorState, newContent, 'insert-characters');*/}
              {/*    return EditorState.forceSelection(newEditorState, newContent.getSelectionAfter());*/}

              {/*  }}*/}
              {/*  className="mx-1"*/}
              {/*>*/}
              {/*  Position*/}
              {/*</CButton>*/}

              <CButton
                size="sm"
                color="light"
                onClick={() => {
                  setShowModal(true)
                }}
                className="mx-1"
              >
                <CIcon icon={cilSave} /> Preview
              </CButton>

              <CButton
                type="submit"
                size="sm"
                color="primary"
                onClick={() => {
                  submission()
                }}
                className="mx-1"
              >
                <CIcon icon={cilSave} /> Save
              </CButton>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ContentUpdate
