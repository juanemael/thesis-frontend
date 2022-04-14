import DataTable from 'react-data-table-component'
import {
  CButton, CFormInput, CCol, CModal,
  CModalHeader, CModalTitle,
  CModalBody,
  CRow, CCardFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheck } from '@coreui/icons'
import Styles from '../../util/Styles'
import React, { useEffect, useState, useRef } from "react";
import CardioLogistModel from '../../models/Cardiologist'
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Exception } from 'sass'
import swal from 'sweetalert';
import { FaCheck, FaTimes } from "react-icons/fa";
const Cardiologist = () => {

  const history = useHistory();
  const [cardiologist, setCardiologist] = useState([])
  const [detailsTitle, setDetailsTitle] = useState(null)
  const [details, setDetails] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showVerification, setVerification] = useState(false)
  const [keyword, setKeyword] = useState("")

  let cardioModel = new CardioLogistModel()
  const getCardioLogist = async () => {

    try {
      let result = await cardioModel.getAll()
      console.log(result)
      setCardiologist(result)
    } catch (e) {

    }

  }

  const resetModal = () => {
    setDetailsTitle(null)
    setShowDetails(false)
    setVerification(false)
    setVerification(null)
  }
  const approve = async (id) => {

    const submitConfirm = await swal({
      title: "",
      text: "Are you sure approve this item?",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
      dangerMode: true,
    });
    if (submitConfirm) {
      try {
        const result = await cardioModel.approve(id)
        if (result.id || result.success) {
          swal('', "Approve Success", 'success')
            .then((value) => {
              getCardioLogist();
              resetModal();
            });
        } else {
          swal('', "Failed to Approv", 'error')
          return
        }
      } catch (e) {
        swal('', "Something Wrong", 'error')
      }
    }
  }

  useEffect(() => {
    getCardioLogist()
  }, [])



  return (
    <>
      <CModal
        visible={showDetails}
        size={'lg'}
        onClose={() => resetModal()}
      >
        <CModalHeader style={Styles.ModalDetailTitle}>
          {detailsTitle}
        </CModalHeader>
        <CModalBody>
          <CRow className='mb-3' style={Styles.ModalDetailRows}>
            <CCol xs="6" md="6">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Doctor ID</label>
              <div style={Styles.ModalDetailText}>
                {details && details.doctor_id}
              </div>

            </CCol>
            <CCol xs="6" md="6">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Full Name</label>
              <div style={Styles.ModalDetailText}>
                {details && details.full_name}
              </div>
            </CCol>
          </CRow>

          <CRow className='mb-3'>
            <CCol xs="12" md="6">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Email</label>
              <div style={Styles.ModalDetailText}>
                {details && details.email}
              </div>
            </CCol>
            <CCol xs="12" md="6">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Phone Number</label>
              <div style={Styles.ModalDetailText}>
                {details && details.phone_num}
              </div>
            </CCol>
          </CRow>
          <CRow className='mb-3'>
            <CCol xs="12" md="6">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Bank Number</label>
              <div style={Styles.ModalDetailText}>
                {details && details.bank_num}
              </div>
            </CCol>
            {
              showVerification &&
              <CCol xs="12" md="6">
                <label style={Styles.ModalDetailLabel} htmlFor="label-input">Verified</label>
                <div style={Styles.ModalDetailText}>
                  {details && details.verified ? <FaCheck style={{ ...Styles.successIcon }}></FaCheck> : <FaTimes style={{ ...Styles.errorIcon }}></FaTimes>}
                </div>
              </CCol>
            }
          </CRow>
        </CModalBody>

        {
          showVerification && <CCardFooter>
            <CButton
              type="submit"
              size="sm"
              color="primary"
              className="float-right"
              onClick={() => {
                approve(details.id)
              }}
            >
              <CIcon icon={cilCheck} /> Approve
            </CButton>  </CCardFooter>
        }


      </CModal>

      <div style={Styles.cardHeader}>
        <div style={Styles.cardHeaderText}>Cardiologist</div>
        <div style={Styles.searchTableText}>Search</div>
        <CFormInput
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter Keyword" style={Styles.searchTableInput} />
      </div>

      <DataTable
        customStyles={Styles.dataTable}
        columns={[
          {
            name: 'Doctor ID',
            selector: (row) => row.doctor_id,
            sortable: true,
            width: '10%'
          },
          {
            name: 'Full Name',
            selector: (row) => row.full_name,
            sortable: true,
            width: '15%'
          },
          {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
            width: '20%'
          },

          {
            name: 'Phone Number',
            selector: (row) => row.phone_num,
            width: '15%'
          },
          {
            name: 'Bank Number',
            selector: (row) => row.bank_num,
            width: '15%'
          },
          {
            name: 'Verified',
            selector: (row) => row.verified ? <FaCheck style={{ ...Styles.successIcon }}></FaCheck> : <FaTimes style={{ ...Styles.errorIcon }}></FaTimes>,
            width: '10%'
          },

          {
            name: '',

            selector: (row) => (
              <div style={{ display: 'inline-block' }}>
                <>

                  {!row.verified ?
                    <CCol md={12} className='mb-2 mt-2'>
                      <CButton

                        style={{
                          ...Styles.tableBtn,
                          ...Styles.approveBtn,
                        }}
                        onClick={() => {
                          setDetails(row)
                          setShowDetails(true)
                          setDetailsTitle(`Verification Cardiologist : ${row.full_name}`)
                          setVerification(true)
                        }}
                      >
                        Approve
                      </CButton>
                    </CCol>
                    : ''
                  }
                  <CCol md={12}>
                    <CButton

                      style={{
                        ...Styles.tableBtn,
                        ...Styles.approveBtn,
                      }}
                      onClick={() => {
                        setDetails(row)
                        setShowDetails(true)
                        setDetailsTitle(`Detail Cardiologist : ${row.full_name}`)
                      }}
                    >
                      Details
                    </CButton>
                  </CCol>

                </>
              </div>
            ),
          },
        ]}
        data={cardiologist.filter((item) => {
          return item.full_name.toLowerCase().includes(keyword.toLowerCase()) || item.email.toLowerCase().includes(keyword.toLowerCase())
        })}
        pagination
      />
    </>
  )
}

export default Cardiologist
