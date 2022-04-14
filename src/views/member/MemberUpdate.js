import React, { useState, useEffect } from 'react'
import {Link, useParams} from 'react-router-dom';
import {
    CCard,
    CCardBody,
    CCardHeader,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CInputGroup,
    CInputGroupText,
    CFormFeedback,
    CFormSelect,
    CButton,
    CContainer,
    CCol,
    CRow,
    CSelect
} from "@coreui/react"
import Styles from '../../util/Styles'
import { Tabs, Tab } from 'react-bootstrap';
import swal from 'sweetalert';
import Member from '../../models/Member'
import parse from "html-react-parser";
const MemberUpdate = () => {
    const { id } = useParams();
    const [validated, setValidated] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)
    const [memberData, setMemberData] = useState({})

    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        setValidated(true)
    }

    const getMemberData = async () => {
      let MemberModel = new Member()
      try {
        let memberUpdate = await MemberModel.getById(id)
        setMemberData(memberUpdate)
        console.log("MEMBER DATA", memberData)
      } catch (e) {
        console.log(e)
      }
    }

    useEffect(()=>{
      getMemberData()
    },[])

    const changePassword = async () => {
        setError(null)

        if(password.length <= 0) {
            swal({
              title: "",
              text: "Password baru tidak boleh kosong",
              icon: "warning",
              dangerMode: true,
            });
            return
          }

        if(password !== confirmPassword) {
          await swal({
            title: "",
            text: "Silahkan konfirmasi ulang password baru",
            icon: "warning",
            dangerMode: true,
          });
          return
        }

        const body = {
          member_id: id,
          new_password: password
        }

        const submitConfirm = await swal({
          title: "",
          text: "Apakah anda yakin ingin mengganti password member ini?",
          icon: "warning",
          buttons: ["Batal", "Ya, Simpan"],
          dangerMode: true,
        });

        if (submitConfirm) {

          try {

            let result = await Member.changePassword(body)
            if (result.success) {
              swal('', "Password berhasil diganti", 'success')
                // .then((value) => {
                //   // history.push('/admin');
                //   getAdmin()
                // });
            } else {
              swal('', "Password gagal diganti", 'error')
              return
            }

          } catch (e) {
            console.log(e)
            swal('', e.error_message ? e.error_message : "Terjadi Kesalahan", 'error')
          }
        }
      }

    return (
        <>
            <CRow>
                <CCol xs="12" md="12">
                    <CCard>
                        <CCardHeader>
                            Member Update
                            <div className={'white-lines'}>
                              <Link to={`/member-detail/${id}`}><small>Back to members detail</small></Link>
                            </div>
                        </CCardHeader>
                        <CCardBody>

                            <CForm className="row g-3 needs-validation" validated={validated} onSubmit={handleSubmit}>
                                <Tabs
                                    defaultActiveKey="home"
                                    transition={false}
                                    id="memberTabs"
                                    className="mb-3 customTabs"
                                >
                                    <Tab eventKey="home" title="Member Profile">
                                      <CRow className='mb-2'>
                                        <CCol md={12}>
                                          <CFormLabel htmlFor="hpi_id">HPI Id</CFormLabel>
                                          <CInputGroup className="has-validation">
                                            <CFormInput
                                              type="text"
                                              id="hpi_id"
                                              value={memberData.hpi_id}
                                              required
                                            />
                                            <CFormFeedback invalid>Please choose a HPI ID.</CFormFeedback>
                                          </CInputGroup>
                                        </CCol>
                                      </CRow>
                                        <CRow className='mb-2'>
                                            <CCol md={12}>
                                                <CFormLabel htmlFor="honorific">Honorific</CFormLabel>
                                                <CInputGroup className="has-validation">
                                                    <CFormInput
                                                        type="text"
                                                        id="username"
                                                        value={memberData.honorific}
                                                        required
                                                    />
                                                    <CFormFeedback invalid>Please choose a Honorific.</CFormFeedback>
                                                </CInputGroup>
                                            </CCol>
                                        </CRow>
                                        <CRow>
                                            <CCol md={12} className='mb-2'>
                                                <CFormLabel htmlFor="full_name">Fullname</CFormLabel>
                                                <CInputGroup className="has-validation">
                                                    <CFormInput
                                                        type="text"
                                                        id="full_name"
                                                        value={memberData.full_name}
                                                        required
                                                    />
                                                    <CFormFeedback invalid>Please choose a Fullname.</CFormFeedback>
                                                </CInputGroup>
                                            </CCol>
                                        </CRow>
                                        <CRow>
                                            <CCol md={12} className='mb-2'>
                                                <CFormLabel htmlFor="email">Email</CFormLabel>
                                                <CInputGroup className="has-validation">
                                                    <CFormInput
                                                        type="text"
                                                        id="email"
                                                        value={memberData.email}
                                                        required
                                                    />
                                                    <CFormFeedback invalid>Please choose a username.</CFormFeedback>
                                                </CInputGroup>
                                            </CCol>
                                        </CRow>
                                        <CRow>
                                            <CCol md={12} className='mb-2'>
                                                <CFormLabel htmlFor="type">Type</CFormLabel>
                                                <CInputGroup className="has-validation">
                                                    <CFormInput
                                                        type="text"
                                                        id="type"
                                                        value={memberData.type}
                                                        required
                                                    />
                                                    <CFormFeedback invalid>Please choose a type.</CFormFeedback>
                                                </CInputGroup>
                                            </CCol>
                                        </CRow>
                                      <CRow>
                                        <CCol md={12} className='mb-2'>
                                          <CFormLabel htmlFor="gender">Gender</CFormLabel>
                                          <CInputGroup className="has-validation">
                                            <CFormInput
                                              type="text"
                                              id="gender"
                                              value={memberData.gender}
                                              required
                                            />
                                            <CFormFeedback invalid>Please choose a type.</CFormFeedback>
                                          </CInputGroup>
                                        </CCol>
                                      </CRow>
                                      <CRow>
                                        <CCol md={12} className='mb-2'>
                                          <CFormLabel htmlFor="gender">Birth Date</CFormLabel>
                                          <CInputGroup className="has-validation">
                                            <CFormInput
                                              type="text"
                                              id="gender"
                                              value={memberData.birth_date}
                                              required
                                            />
                                            <CFormFeedback invalid>Please choose a birth date.</CFormFeedback>
                                          </CInputGroup>
                                        </CCol>
                                      </CRow>
                                      <CRow>
                                        <CCol md={12} className='mb-2'>
                                          <CFormLabel htmlFor="birth_place">Birth Place</CFormLabel>
                                          <CInputGroup className="has-validation">
                                            <CFormInput
                                              type="text"
                                              id="birth_place"
                                              value={memberData.birth_place}
                                              required
                                            />
                                            <CFormFeedback invalid>Please choose a birth place.</CFormFeedback>
                                          </CInputGroup>
                                        </CCol>
                                      </CRow>
                                      <CRow>
                                        <CCol md={12} className='mb-2'>
                                          <CFormLabel htmlFor="address">Address</CFormLabel>
                                          <CInputGroup className="has-validation">
                                            <CFormInput
                                              type="text"
                                              id="address"
                                              value={memberData.address}
                                              required
                                            />
                                            <CFormFeedback invalid>Please choose a address.</CFormFeedback>
                                          </CInputGroup>
                                        </CCol>
                                      </CRow>
                                      <CRow>
                                        <CCol md={12} className='mb-2'>
                                          <CFormLabel htmlFor="specialization">Specialization</CFormLabel>
                                          <CInputGroup className="has-validation">
                                            <CFormInput
                                              type="text"
                                              id="specialization"
                                              value={memberData.specialization}
                                              required
                                            />
                                            <CFormFeedback invalid>Please choose a specialization.</CFormFeedback>
                                          </CInputGroup>
                                        </CCol>
                                      </CRow>
                                      <CRow>
                                        <CCol md={12} className='mb-2'>
                                          <CFormLabel htmlFor="language">Language</CFormLabel>
                                          <CInputGroup className="has-validation">
                                            <CFormInput
                                              type="text"
                                              id="language"
                                              value={memberData.language}
                                              required
                                            />
                                            <CFormFeedback invalid>Please choose a language.</CFormFeedback>
                                          </CInputGroup>
                                        </CCol>
                                      </CRow>
                                    </Tab>
                                    <Tab eventKey="password" title="New Password">
                                        <CRow className='mb-2'>
                                            <CCol md={12}>
                                                <CFormLabel htmlFor="password">New Password</CFormLabel>
                                                <CInputGroup className="has-validation">
                                                    <CFormInput
                                                        type="password"
                                                        id="password"
                                                        required
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                    <CFormFeedback invalid>Please type a new password.</CFormFeedback>
                                                </CInputGroup>
                                            </CCol>

                                        </CRow>
                                        <CRow>
                                            <CCol md={12} className='mb-2'>
                                                <CFormLabel htmlFor="confirmPassword">Confirm Password</CFormLabel>
                                                <CInputGroup className="has-validation">
                                                    <CFormInput
                                                        type="password"
                                                        id="confirmPassword"
                                                        required
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                    />
                                                    <CFormFeedback invalid>Please confirm the new password.</CFormFeedback>
                                                </CInputGroup>
                                            </CCol>
                                        </CRow>
                                        <CButton
                                            onClick={() => {
                                                changePassword()
                                            }}
                                            style={{
                                                ...Styles.detailBtn,
                                            }}>Save New Password</CButton>
                                    </Tab>
                                    <Tab eventKey="experience" title="Experience">
                                      <CRow>
                                      <CCol md="3">
                                        <CFormLabel className="label-verfication-view" htmlFor="email-input">Education</CFormLabel>
                                        <CInputGroup className="has-validation">
                                          <CFormInput
                                            type="text"
                                            id="address"
                                            value={memberData.education}
                                          />
                                          <CFormFeedback invalid>Please choose an Education.</CFormFeedback>
                                        </CInputGroup>
                                      </CCol>
                                    </CRow>
                                      <CRow>
                                        <CCol md="3">
                                          <CFormLabel className="label-verfication-view" htmlFor="note-input">Note</CFormLabel>
                                          <CInputGroup className="has-validation">
                                            <CFormInput
                                              type="text"
                                              id="note"
                                              value={memberData.note}
                                            />
                                            <CFormFeedback invalid>Please choose an Note.</CFormFeedback>
                                          </CInputGroup>
                                        </CCol>
                                      </CRow>
                                      <CRow>
                                        <CCol md="3">
                                          <CFormLabel className="label-verfication-view" htmlFor="occupation-input">Occupation</CFormLabel>
                                          <CInputGroup className="has-validation">
                                            <CFormInput
                                              type="text"
                                              id="occupation"
                                              value={memberData.occupation}
                                            />
                                            <CFormFeedback invalid>Please choose an Occupation.</CFormFeedback>
                                          </CInputGroup>
                                        </CCol>
                                      </CRow>
                                      {/*<CRow>*/}
                                      {/*  <CCol md="3">*/}
                                      {/*    <CFormLabel className="label-verfication-view" htmlFor="specialization_description-input">Specializtion Offered</CFormLabel>*/}
                                      {/*    <CInputGroup className="has-validation">*/}
                                      {/*      <CFormInput*/}
                                      {/*        type="text"*/}
                                      {/*        id="specialization_description"*/}
                                      {/*        value={memberData.specialization_description}*/}
                                      {/*      />*/}
                                      {/*      <CFormFeedback invalid>Please choose an Specialization.</CFormFeedback>*/}
                                      {/*    </CInputGroup>*/}
                                      {/*  </CCol>*/}
                                      {/*  <CCol xs="12" md="9">*/}
                                      {/*    {memberData && memberData.specialization_description || '-'}*/}
                                      {/*  </CCol>*/}
                                      {/*</CRow>*/}
                                      <CRow>
                                        <CCol md="3">
                                          <CFormLabel className="label-verfication-view" htmlFor="specialization_description-input">Specialization Description</CFormLabel>
                                          <CInputGroup className="has-validation">
                                            <CFormInput
                                              type="text"
                                              id="specialization_description"
                                              value={memberData.specialization_description}
                                            />
                                            <CFormFeedback invalid>Please choose an Specialization Description.</CFormFeedback>
                                          </CInputGroup>
                                        </CCol>
                                      </CRow>
                                      <CRow>
                                        <CCol md="3">
                                          <CFormLabel className="label-verfication-view" htmlFor="translator_since-input">Translator Since</CFormLabel>
                                          <CInputGroup className="has-validation">
                                            <CFormInput
                                              type="text"
                                              id="translator_since"
                                              value={memberData.translator_since}
                                            />
                                            <CFormFeedback invalid>Please choose an Translator Since.</CFormFeedback>
                                          </CInputGroup>
                                        </CCol>
                                      </CRow>
                                      <CRow>
                                        <CCol md="3">
                                          <CFormLabel className="label-verfication-view" htmlFor="email-input">Interpreter Since</CFormLabel>
                                          <CInputGroup className="has-validation">
                                            <CFormInput
                                              type="text"
                                              id="interpreter_since"
                                              value={memberData.interpreter_since}
                                            />
                                            <CFormFeedback invalid>Please choose an Interpreter Since.</CFormFeedback>
                                          </CInputGroup>
                                        </CCol>
                                      </CRow>
                                    </Tab>
                                </Tabs>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        </>
    )
}

export default MemberUpdate;
