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
import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory, useParams } from 'react-router-dom';
import MemberModels from '../../models/Member'
import swal from 'sweetalert';
const MemberForm = () => {
  const params_url = useParams();
  const [mode] = useState(params_url.id ? 'update' : 'create')
  console.log(mode)
  const history = useHistory();
  const [error, setError] = useState({});
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [passwordConfirm, setPasswordConfirm] = useState(null)

  const memberModel = new MemberModels();

  const getMember = async () => {
    try {
      if (mode === 'update') {
        let result = await memberModel.getById(params_url.id)
        setUsername(result.username)
      }

    } catch (e) {

    }
  }
  useEffect(() => {
    getMember()
  }, [])

  const submission = async () => {
    setError(null)
    const body = {
      username: username,
      password: password,
    }

    const submitConfirm = await swal({
      title: "",
      text: "Apakah anda yakin akan menyimpan data ini?",
      icon: "warning",
      buttons: ["Batal", "Ya, Simpan"],
      dangerMode: true,
    });

    if (submitConfirm) {
      try {

        let result = await memberModel.register(body)
        if (result.id || result.success) {
          swal('', "Data berhasil di simpan", 'success')
            .then((value) => {
              history.push('/member');
            });
        } else {
          swal('', "Data gagal disimpan", 'error')
          return
        }

      } catch (e) {
        console.log(e)
        swal('', e.error_message ? e.error_message : "Terjadi Kesalahan", 'error')
      }
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard style={{ ...Styles.cardForm }} className="mb-4">
          <CCardHeader style={{ ...Styles.cardFormHeader }}>
            <strong>Member Register</strong>
          </CCardHeader>

          <CCardBody>
            <CForm
              action=""
              method="post"
              encType="multipart/form-data"
              className="form-horizontal"
            >
              <CRow className="mb-3">
                <CFormLabel style={{ ...Styles.formLabel }} htmlFor="inputPassword" className="col-sm-2 col-form-label">
                  Username
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormInput
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text" id="inputUsername" />
                </div>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel style={{ ...Styles.formLabel }} htmlFor="inputPassword" className="col-sm-2 col-form-label">
                  Password
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormInput

                    onChange={(e) => setPassword(e.target.value)}
                    type="password" id="inputPassword" />
                </div>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel style={{ ...Styles.formLabel }} htmlFor="inputPassword" className="col-sm-2 col-form-label">
                  Confirm Password
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormInput

                    onChange={(e) => setPasswordConfirm()}
                    type="password" id="inputPasswordConfirm" />
                </div>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <CButton
              type="submit"
              size="sm"
              color="primary"
              className="float-right"
              onClick={() => {
                submission()
              }}
            >
              <CIcon icon={cilSave} /> Simpan
            </CButton>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default MemberForm
