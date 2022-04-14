import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react'
import swal from 'sweetalert';
import { FaTimes, FaCheck } from "react-icons/fa";
import CIcon from "@coreui/icons-react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CCollapse,
  CRow,
  CAlert,
  CModal,
  CModalHeader,
  CModalTitle,
  CFormTextarea,
  CModalBody,
  CModalFooter,
  CContainer, CFormLabel
} from "@coreui/react"

import MemberDetailView from 'src/reusable/members/MemberDetailView';
import MemberModels from "../../models/Member";
import moment from "moment";
import {Tab} from "react-bootstrap";
export default function MemberVerification() {
  const modelMember = new MemberModels();
  const { id } = useParams();
  const [members, setmembers] = useState(null)
  const history = useHistory();
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [visibleReject, setVisibleReject] = useState(false)
  const [rejection_reason, setRejectionReason] = useState(null)

  const getMember = async () => {
    try {
      let result = await modelMember.getById(id);
      console.log("result", result.specializations, result)
      setmembers(result)
    } catch (e) {
      alert('Error occured! Please check your connection.')
      console.log(e)
    }
  }

  function thousandSeparator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  useEffect(() => {
    getMember()
  }, [])

  const approve = async () => {
    const submitConfirm = await swal({
      title: "",
      text: "Do you want to verify this member?",
      icon: "warning",
      buttons: ["Cancel", "Yes, Verify"],
      dangerMode: true,
    });

    if (submitConfirm) {
      try {
        const body = {
          member_id: id,
        }
        let result = await modelMember.approveMember(id, body);

        if (result.memberId) {
          swal('', "Member is verified", 'success')
            .then((value) => {
              history.push('/members');
            });
        } else {
          swal('', "Verification failed", 'error')
          return
        }
      } catch (e) {
        console.log(e)
        swal('', e.error_message ? e.error_message : "Terjadi Kesalahan", 'error')
      }
    }
  }

    const reject = async () => {
        if (!rejection_reason) {
            alert("Please fill rejection reason")
        }
        try {
            const body = {
                member_id: id,
                rejection_reason: rejection_reason
            }
            let result = await modelMember.rejectMember(id,body);
            console.log(result)
            if (result.memberId) {
                swal('', "Member has been rejected", 'success')
                    .then((value) => {
                        history.push('/members');
                    });
            } else {
                swal('', "An Error Occured", 'error')
                setRejectionReason(null)
                setVisibleReject(false)
                return
            }
        } catch (e) {
            console.log(e)
            swal('', e.error_message ? e.error_message : "Terjadi Kesalahan", 'error')
        }
    }


  return (
    <>

      <CModal
        fade
        show={visibleReject}
        alignment="center" scrollable visible={visibleReject} onDismiss={() => {
          setRejectionReason(null)
          setVisibleReject(false)
        }}>

        <CModalHeader>
          <CModalTitle>Reject Member</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CCol xs="12" md="12">
            <CFormTextarea
              id="reject-input"
              type="number"
              name="reject-input"
              value={rejection_reason}
              rows="5"
              placeholder="Input reason..."
              onChange={(e) => {
                setRejectionReason(e.target.value)
              }}
            />
          </CCol>

        </CModalBody>
        <CModalFooter>
          <CButton onClick={(e) => {
            setVisibleReject(false)
            setRejectionReason(null)

          }} color="secondary">Cancel</CButton>
          <CButton onClick={() => {
            reject()
          }} color="primary">Send</CButton>
        </CModalFooter>
      </CModal>

      <CCollapse show={error} timeout={1000}>
        <CAlert color="danger">
          {error}
        </CAlert>
      </CCollapse>

      <CCollapse show={success} timeout={1000}>
        <CAlert color="success">
          {success}
        </CAlert>
      </CCollapse>

      <CRow>
        <CCol xs="12" md="12">

          <CCard>

            <CCardHeader>
              <div className='d-flex'>
                <div style={{ flex: 1 }}>
                  Member Verification<br></br>
                  <Link to={"/members"}><small>Back to members list</small></Link>
                </div>
              </div>


            </CCardHeader>

            <CCardBody style={{ lineHeight: 3 }}>
              <CContainer>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Honorific</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.honorific}
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Full Name</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.full_name}
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Email</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.email}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Type</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.type}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Gender</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.gender === "M" ? "Male" : "Female"}
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Profession</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.profession}
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Address</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.address_street}, {members && members.address_postal}, {members && members.address_region}, {members && members.address_locality}, Indonesia
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Specialization</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.specializations && members.specializations.map((obj, idx) => {
                      return `${obj.specialization}${idx < members.specializations.length-1 ? "," : ""} `
                    })}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Language</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.languages && members.languages.map((obj, idx) => {
                      return <>{obj.language_from} - {obj.language_to}<br /></>
                    })}
                  </CCol>
                </CRow>
              </CContainer>
              <CCardFooter style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end"
              }}>
                <CButton style={{ marginRight: '3px' }} className="float-right mr-2"
                  onClick={() => approve()}
                  size="sm" color="success">
                  <FaCheck />  Approve
                </CButton>
                <CButton
                  onClick={() => {
                    setVisibleReject(true)
                  }}
                  className="float-right ml-3" size="sm" color="primary">
                  <FaTimes /> Reject
                </CButton>
              </CCardFooter>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </>
  )
}
