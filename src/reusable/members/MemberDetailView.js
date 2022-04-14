import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard, CCardBody, CCardHeader,
  CCol, CFormInput,
  CFormLabel, CModal, CModalBody, CModalHeader,
  CRow,
} from "@coreui/react"
import { Tabs, Tab } from 'react-bootstrap';
import moment from "moment"
import parse from 'html-react-parser';
import Styles from "../../util/Styles";
import profilePicture from '../../assets/user.png'
/* eslint-disable */
const MemberDetailView = (props) => {
    const { members } = props
  const [activeMemberData, setActiveMemberData] = useState(false)
  const [profileData, setProfileData] = useState({})
  const [latestExtensionData, setLatestExtensionData] = useState(null)
  const [detailsTitle, setDetailsTitle] = useState(null)
  const [details, setDetails] = useState(null)
  const [showForgotPassword, setForgotPassword] = useState(false)
    console.log(members)

  const {id} = useParams()

  const history = useHistory()

  useEffect(()=>{
    setActiveMemberData(members.membership_confirmation)
    setLatestExtensionData(members.renewal_date)
  },[])
    return (
        <>
          <CModal
            visible={showForgotPassword}
            size={'lg'}
            onClose={() => resetModal()}
          >
            <CModalHeader style={Styles.ModalDetailTitle}>
              {detailsTitle}
            </CModalHeader>
            <CModalBody>
              <CRow className='mb-3' style={Styles.ModalDetailRows}>
                <CCol xs="6" md="6">
                  <label style={Styles.ModalDetailLabel} htmlFor="label-input">Member ID</label>
                  <div style={Styles.ModalDetailText}>
                    {details && details.id}
                  </div>

                </CCol>
                <CCol xs="6" md="6">
                  <label style={Styles.ModalDetailLabel} htmlFor="label-input">Member Email</label>
                  {/*<div style={Styles.ModalDetailText}>*/}
                  {/*  {details && details.username}*/}
                  {/*</div>*/}
                  <CFormInput
                    defaultValue={details && details.email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text" id="editEmail"/>
                </CCol>
              </CRow>
              <CButton color="primary" onClick={() => {
                console.error(details.email)
                setEmail(details.email)
                console.error(email)
                submissionForgotPassword(details.email)
              }}>Save changes</CButton>
            </CModalBody>
          </CModal>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <CRow>
              <CCol md={'2'} right>
                <img src={members?.profile_picture_url ? members.profile_picture_url : profilePicture}
                     style={{
                       width: 166,
                       objectFit: 'contain'
                     }}
                     alt={"member"}/>
              </CCol>
              <CCol md={'6'}>
                <CCard>
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: 10,
                    height: "100%"
                  }}>
                    <div style={{
                      fontWeight: '600',
                      color: '#8e8e8e'
                    }}>
                      Membership Status : <b style={{color: !!members.membership_confirmation ? 'lightgreen' : 'red'}}>{!!members.membership_confirmation ? 'Active' : 'Non Active'}</b>
                    </div>
                    <div style={{
                      fontWeight: '600',
                      color: '#8e8e8e',
                    }}>
                      Member Since : <b style={{color : 'black'}}>{moment(members?.entry_date).format("DD MMM YYYY")}</b>
                    </div>
                    <div style={{
                      fontWeight: '600',
                      color: '#8e8e8e',
                    }}>
                      Active Until : <b style={{color : 'black'}}>{members.renewal_date ? moment(members.renewal_date).format("DD MMM YYYY") : "-"}</b>
                    </div>
                  </div>
                </CCard>
              </CCol>
              <CCol md={'3'}>
                <CRow>
                  <CButton
                    onClick={() => {
                      console.log("ID",id)
                      history.push({
                        pathname: `/member-update/${id}`,
                        state: props})
                    }}
                    style={{
                      ...Styles.tableBtn2,
                      float:"right"
                    }}
                    color="primary">Update
                  </CButton>
                </CRow>
                <CRow>
                  <CButton
                    onClick={() => {
                      setDetails(row)
                      setForgotPassword(true)
                      setDetailsTitle(`Update Detail: ${row}`)
                    }}
                    block
                    style={{
                      ...Styles.tableBtn2,
                      float:"right"
                    }}
                  >
                    Reset Password
                  </CButton>
                </CRow>
              </CCol>
            </CRow>
            <Tabs
              defaultActiveKey="home"
              transition={false}
              id="noanim-tab-example"
              className="mb-3 customTabs"
            >
              <Tab eventKey="home" title="Member Profile">
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">HPI Id</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.hpi_id || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Honorific</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.honorific || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Full Name</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.full_name || '-'}
                  </CCol>
                </CRow>

                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Email</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.email || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Type</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.type || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Gender</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.gender || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Birth Date</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.birth_date && moment(members.birth_date).format('DD/MM/YYYY')}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Birth Place</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {
                      members && members.birth_locality && members.birth_region && members.birth_region ?
                        <>
                          <div className={'white-lines'}>
                            {members && members.birth_locality},
                          </div>
                          <div className={'white-lines'}>
                            {members && members.birth_region},
                          </div>
                          <div className={'white-lines'}>
                            {members && members.birth_region}
                          </div>
                        </>
                        : '-'
                    }
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Address</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {
                      members && members.address_street && members.address_locality && members.address_region ?
                        <>
                        <div className={"white-line"}>
                          {members && members.address_street}</div>
                        <div className={"white-line"}>
                          {members && members.address_locality},</div>
                        <div className={"white-line"}>
                          {members && members.address_region},</div>
                        <div className={"white-line"}>
                          {members && members.address_country},</div>
                        <div className={"white-line"}>
                          {members && members.address_postal} </div>
                        </>
                        : '-'
                    }
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Specialization</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.specializations && members.specializations.map((obj, idx) => {
                      return <div className={'white-line'}> - {obj.specialization}</div>
                    })}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Files</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.files &&  members.files.map((v, key) => {
                      return (
                        <>
                          <a href={v.location} target="_blank">{v.name}</a>
                        </>
                      );
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
              </Tab>
              <Tab eventKey="experience" title="Experience">
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Education</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.education && parse(`${members.education}`)  || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Note</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.note || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Resume</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.resume && parse(`${members.resume}`) || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Occupation</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.occupation || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Specializtion Offered</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.specialization_offered || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Specialization Description</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.specialization_description || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Resume</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.translator_since || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Interpreter Since</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.interpreter_since || '-'}
                  </CCol>
                </CRow>
              </Tab>
              <Tab eventKey="payment" title="Membership Information">
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Entry Date</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && new moment(members.entry_date).format("DD MM YYYY") || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Profession</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.profession || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Payment Method</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.payment_method || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Occupation</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.profession || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Software</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.software || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Approval Date</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.approved_date || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Approval By</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.approved_by || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Commencement Date</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && new moment(members.commencement_date).format("DD MM YYYY") || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Renewal Date</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && new moment(members.renewal_date).format("DD MM YYYY") || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Rejection Date</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.rejection_date || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Rejected By</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.rejected_by || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Rejected Reason</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.rejected_reason || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Status</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.status || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Deactivation Type</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.deactivation_type || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Membership Confirmation</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.membership_confirmation || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Availability</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.availability || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Credential</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.credential || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Translator Since</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.translator_since || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Preferred Currency</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.preferred_currency || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Is Public</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.is_public || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Memberscol</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.memberscol || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">Commencement Date</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.status || '-'}
                  </CCol>
                </CRow>
                <CRow>
                  <CCol md="3">
                    <CFormLabel className="label-verfication-view" htmlFor="email-input">About Me</CFormLabel>
                  </CCol>
                  <CCol xs="12" md="9">
                    {members && members.about_me && parse(`${members.about_me}`) || '-'}
                  </CCol>
                </CRow>
              </Tab>
            </Tabs>
          </div>

        </>
    )
}
export default MemberDetailView
