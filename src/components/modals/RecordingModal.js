import {CButton, CCol, CFormInput, CModal, CModalBody, CModalHeader, CRow} from "@coreui/react";
import Styles from "../../util/Styles";
import FileUpload from "../../reusable/FileUpload";
import React, {useState} from "react";
import Attachment from "../../models/Attachment";

export default function RecordingModal(props) {

  const {show, onClose, data, setData} = props

  const [isUploading, setIsUploading] = useState(false)

  const closeModal = () => {
    onClose()
  }

  const onUploaded = async (addedFile, key) => {

    setIsUploading(true)

    try {

      let result = await new Attachment().addAttachment(addedFile[0])

      let temp = [...data]
      temp[key].url = result.location
      setData(temp)

      setIsUploading(false)

    } catch (e) {
      let tempMessage = "Error Occurred. "

      if (e.msg) {
        if (e.msg.message) {
          tempMessage = e.msg.message
        }
      }
      alert(tempMessage)
      console.log(e)

      setIsUploading(false)

    }

  }

  return <CModal
    visible={show}
    size={'lg'}
    onClose={() => closeModal()}
  >
    <CModalHeader style={Styles.ModalDetailTitle}>
      Manage Recording
    </CModalHeader>
    <CModalBody>
      <CRow className='mb-3' style={Styles.ModalDetailRows}>
        {
          (data && Array.isArray(data)) && data.map((obj, key) => {
            return <>
              <CRow key={key} className='mb-3' style={Styles.ModalDetailRows}>
                <CCol xs="12" md="12">
                  <label style={Styles.ModalDetailLabel} htmlFor="label-input">Recording Name</label>
                  <CFormInput
                    onChange={(e) => {
                      let temp = (data && data.length) ? [...data] : []
                      temp[key].title = e.target.value
                      setData(temp)
                    }}
                    value={obj.title}
                    type="text" id="editFileName" placeholder="Enter ... "/>
                </CCol>
              </CRow>
              <CRow>
                <CCol md={12}>
                  <label style={Styles.ModalDetailLabel} htmlFor="label-input">Recording URL/File</label>
                </CCol>
                <CCol xs="10" md="10">
                  <CFormInput
                    onChange={(e) => {
                      let temp = (data && data.length) ? [...data] : []
                      temp[key].url = e.target.value
                      setData(temp)
                    }}
                    value={obj.url}
                    type="text" id="editFileName" placeholder="Enter Manually or use the Upload Button"/>
                </CCol>
                <CCol
                  style={{
                    marginBottom : 15
                  }}
                  xs={"2"} md={"2"}>
                  <FileUpload
                    style={{
                      marginTop: "0.5em"
                    }}
                    text={"Upload"}
                    isLoading={isUploading}
                    onDrop={(dropped) => {
                      onUploaded(dropped, key)
                    }}
                  />
                </CCol>
                <hr/>
              </CRow>
            </>
          })
        }
      </CRow>

      <CRow>
        <CCol
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end"
          }}
          md={12}>
          <CButton color="primary" onClick={() => {

            let temp = (data && data.length) ? [...data] : []

            setData([...temp, {
              title: "",
              url: ""
            }])
          }}>Add Recording</CButton>
          <CButton
            style={{
              marginLeft: 10
            }}
            color="primary" onClick={() => {
            closeModal()
          }}>Close</CButton>
        </CCol>
      </CRow>

    </CModalBody>
  </CModal>

}
