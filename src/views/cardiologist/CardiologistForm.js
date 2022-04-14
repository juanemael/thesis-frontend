import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CCardFooter,
  CRow,
} from '@coreui/react'
import { cilSave } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Styles from '../../util/Styles'
const CardiologistForm = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard style={{
          backgroundColor: 'white',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderColor: 'white',
          padding: 20,
          fontWeight: '600',
        }} className="mb-4">
          <CCardHeader style={{
            background: 'white',
            padding: 10,
            fontWeight: 500,
            fontSize: '1em',
            borderBottom: 'none'
          }}>
            <strong>Cardiologist</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CFormLabel style={{ ...Styles.formLabel }} htmlFor="inputPassword" className="col-sm-2 col-form-label">
                Full Name
              </CFormLabel>
              <div className="col-sm-10">
                <CFormInput type="text" id="inputPassword" />
              </div>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel style={{ ...Styles.formLabel }} htmlFor="inputPassword" className="col-sm-2 col-form-label">
                Email
              </CFormLabel>
              <div className="col-sm-10">
                <CFormInput type="text" id="inputPassword" />
              </div>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel style={{ ...Styles.formLabel }} htmlFor="inputPassword" className="col-sm-2 col-form-label">
                Phone Number
              </CFormLabel>
              <div className="col-sm-10">
                <CFormInput type="text" id="inputPassword" />
              </div>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel style={{ ...Styles.formLabel }} htmlFor="inputPassword" className="col-sm-2 col-form-label">
                Bank Number
              </CFormLabel>
              <div className="col-sm-10">
                <CFormInput type="text" id="inputPassword" />
              </div>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CButton
              type="submit"
              size="sm"
              color="primary"
              className="float-right"
              onClick={() => {
                // submission()
              }}
            >
              <CIcon icon={cilSave} /> Save
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>

    </CRow>
  )
}

export default CardiologistForm
