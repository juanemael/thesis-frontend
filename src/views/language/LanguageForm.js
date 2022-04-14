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
import LanguageModels from '../../models/Language'
import swal from 'sweetalert';
const LanguageForm = () => {
  const params_url = useParams();
  const [mode] = useState(params_url.id ? 'update' : 'create')
  console.log(mode)
  const history = useHistory();
  const [error, setError] = useState({});
  const [language, setLanguage] = useState(null)
  // const [password, setPassword] = useState(null)
  // const [passwordConfirm, setPasswordConfirm] = useState(null)

  const languageModel = new LanguageModels();

  const getLanguage = async () => {
    try {
      if (mode === 'update') {
        let result = await languageModel.getById(params_url.id)
        setLanguage(result.language)
      }

    } catch (e) {

    }
  }
  useEffect(() => {
    getLanguage()
  }, [])

  const submission = async () => {
    setError(null)
    const body = {
      language: language,
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

        let result = await languageModel.create(body)
        if (result.id || result.success) {
          swal('', "Data berhasil di simpan", 'success')
            .then((value) => {
              history.push('/languages');
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
            <strong>Language Create</strong>
          </CCardHeader>

          <CCardBody>
            <CForm
              action=""
              method="post"
              encType="multipart/form-data"
              className="form-horizontal"
            >
              <CRow className="mb-3">
                <CFormLabel style={{ ...Styles.formLabel }} htmlFor="inputLanguage" className="col-sm-2 col-form-label">
                  Language
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormInput
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    type="text" id="inputLanguage" />
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

export default LanguageForm
