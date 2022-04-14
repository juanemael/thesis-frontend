import DataTable from 'react-data-table-component'
import {CButton, CCardFooter, CCol, CFormInput, CModal, CModalBody, CModalHeader, CRow} from '@coreui/react'
import Styles from '../../util/Styles'
import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory, useLocation } from 'react-router-dom';
import LanguageModels from '../../models/Language'
import { Exception } from 'sass'
import swal from 'sweetalert';
import moment from "moment";
import {FaCheck, FaTimes} from "react-icons/fa";
import CIcon from "@coreui/icons-react";
import {cilCheck} from "@coreui/icons";
const Language = () => {
  const history = useHistory();

  const [keyword, setKeyword] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [detailsTitle, setDetailsTitle] = useState(null)
  const [language, setLanguage] = useState([])
  const [languageName, setLanguageName] = useState([])
  const [error, setError] = useState({});
  // const [username, setUsername] = useState([])
  const [details, setDetails] = useState(null)
  const [selectedLanguage, setSelectedLanguage] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  let LanguageModel = new LanguageModels()
  const getLanguage = async () => {
    try {
      console.log("TES")
      let result = await LanguageModel.getAll()
      console.log(result)
      setLanguage(result)
      console.log(language)
    } catch (e) {

    }
  }

  useEffect(() => {
    getLanguage()
  }, [])

  const deleteLanguage = async (id) => {
    const confirm = await swal({
      title: "",
      text: "Are you sure want delete this item?",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
      dangerMode: true,
    });
    if (confirm) {
      try {

        let result = await LanguageModel.deleteLanguage(id);

        if (result.id || result.success) {
          swal('', "Delete Successfull", 'success')
            .then((value) => {
              getLanguage();
            });
        } else {
          swal('', "Failed to delete", 'error')
          return
        }
      } catch (e) {
        console.log(e)
        swal('', e.error_message ? e.error_message : "Something Wrong", 'error')
      }
    }
  }
  const updateLanguage = async (id) => {
    const confirm = await swal({
      title: "",
      text: "Are you sure want delete this item?",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
      dangerMode: true,
    });
    if (confirm) {
      try {

        let result = await LanguageModel.updateLanguage(id);

        if (result.id || result.success) {
          swal('', "Delete Successfull", 'success')
            .then((value) => {
              getLanguage();
            });
        } else {
          swal('', "Failed to delete", 'error')
          return
        }
      } catch (e) {
        console.log(e)
        swal('', e.error_message ? e.error_message : "Something Wrong", 'error')
      }
    }
  }

  const resetModal = () => {
    setDetailsTitle(null)
    setShowDetails(false)
  }

  const submission = async (id) => {
    setError(null)

    const body = {
      language: languageName
      // username: username
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
        console.log("TEST ID : "+ id)
        // console.log("TEST USERNAME : "+ username)
        let result = await LanguageModel.updateLanguage(id,body)
        if (result.id || result.success) {
          swal('', "Data berhasil di simpan", 'success')
            .then((value) => {
              // history.push('/specializatons');
              getLanguage()
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
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Language ID</label>
              <div style={Styles.ModalDetailText}>
                {details && details.id}
              </div>

            </CCol>
            <CCol xs="6" md="6">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Language </label>
              {/*<div style={Styles.ModalDetailText}>*/}
              {/*  {details && details.username}*/}
              {/*</div>*/}
              <CFormInput
                defaultValue={details && details.language}
                onChange={(e) => setLanguageName(e.target.value)}
                type="text" id="editLanguage" />
            </CCol>
          </CRow>
          <CButton color="primary" onClick={()=>{
            submission(details.id)
          }}>Save changes</CButton>
        </CModalBody>
      </CModal>
      <div style={Styles.cardHeader}>
        <div style={Styles.cardHeaderText}>Language</div>
        <div style={Styles.searchTableText}>Search</div>
        <CFormInput
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter Keyword" style={Styles.searchTableInput} />
      </div>
      <div style={{ ...Styles.cardHeaderAction }}>
        <CButton onClick={() => { history.push('/language/create') }} style={{ ...Styles.cardHeaderActionButton }}>
          Create
        </CButton>
      </div>
      <DataTable
        customStyles={Styles.dataTable}
        columns={[
          {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
          },
          {
            name: 'Language',
            selector: (row) => row.language,
            sortable: true,
          },
          {
            name: '',
            width: '40%',
            selector: (row) => (
              <div style={{ display: 'inline-block' }}>
                <>
                  <CButton

                    onClick={() => {
                      setDetails(row)
                      setShowDetails(true)
                      setDetailsTitle(`Update Detail: ${row.language}`)

                      // history.push(`/language/update/${row.id}`)
                    }}
                    block
                    style={{
                      ...Styles.tableBtn2,
                    }}
                  >
                    Update
                  </CButton>

                  <CButton
                    onClick={() => { deleteLanguage(row.id) }}
                    style={{
                      ...Styles.tableBtn2,
                      ...Styles.rejectBtn,
                      ...Styles.ml10,
                    }}
                  >
                    Delete
                  </CButton>
                </>
              </div>
            ),
          },
        ]}
        data={language.filter((item) => {
          return item.language.toLowerCase().includes(keyword.toLowerCase())
        })}
        pagination
      />
    </>
  )
}

export default Language
