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
import {cilSave} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import Styles from '../../util/Styles'
import React, {useEffect, useState, useRef} from "react";
import {Link, useHistory, useParams} from 'react-router-dom';
import AdminModels from '../../models/Admin'
import swal from 'sweetalert';

import Select, {components} from "react-select";
import {FaAngleDown, MdErrorOutline} from "react-icons/all";

const adminRolesSelection = [
  {
    label: "Admin",
    value: "ADMIN"
  },
  {
    label: "Bendahara",
    value: "BENDAHARA"
  },
  {
    label: "Keanggotaan",
    value: "KEANGGOTAAN"
  },
  {
    label: "Profesi",
    value: "PROFESI"
  },
]

const DropdownIndicator = props => {
  return (
    components.DropdownIndicator && (
      <components.DropdownIndicator {...props}>
        <FaAngleDown color={'grey'}/>
      </components.DropdownIndicator>
    )
  );
};

const AdminForm = () => {
  const params_url = useParams();
  const [mode] = useState(params_url.id ? 'update' : 'create')
  console.log(mode)
  const history = useHistory();
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState(null)
  const [passwordConfirm, setPasswordConfirm] = useState(null)

  const [role, setRole] = useState(null)

  const adminModel = new AdminModels();

  const getAdmin = async () => {
    try {
      if (mode === 'update') {
        let result = await adminModel.getById(params_url.id)
        setUsername(result.username)
      }

    } catch (e) {

    }
  }
  useEffect(() => {
    getAdmin()
  }, [])

  const submission = async () => {
    setError(null)

    if (!username){
      setError("Please fill username")
    } else if(!password) {
      setError("Please fill the password")
    } else if(!passwordConfirm){
      setError("Please fill the password confirmation")
    } else if (password !== passwordConfirm){
      setError("Confirmation password is not the same")
    } else if (!role) {
      setError("Please choose the role")
    } else {
      const body = {
        username: username,
        password: password,
        role : role.value
      }

      const submitConfirm = await swal({
        title: "",
        text: "Are you sure you want to store this data ?",
        icon: "warning",
        buttons: ["Cancel", "Yes, Save"],
        dangerMode: true,
      });

      if (submitConfirm) {
        try {
          let result = await adminModel.register(body)
          if (result.id || result.success) {
            swal('', "Data successfully stored", 'success')
              .then((value) => {
                history.push('/admins');
              });
          } else {
            swal('', "Data failed to be stored", 'error')
            return
          }

        } catch (e) {
          console.log(e)
          swal('', e.error_message ? e.error_message : "Error Happened", 'error')
        }
      }
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard style={{...Styles.cardForm}} className="mb-4">
          <CCardHeader style={{...Styles.cardFormHeader}}>
            <strong>Admin Register</strong>
          </CCardHeader>

          <CCardBody>
            <CForm
              action=""
              method="post"
              encType="multipart/form-data"
              className="form-horizontal"
            >
              <CRow style={{marginTop: 20}}>
                <CCol xl={5} lg={5} md={6} xs={12} className={'m-auto'}>
                {error ? (
                  <CRow
                    style={{
                      backgroundColor: '#ffc9cf',
                      color: '#e3192d',
                      alignItems: 'center',
                      border: '1px solid #d5bab9',
                      paddingRight: 10,
                      paddingTop: 7,
                      paddingBottom: 7,
                      marginBottom: 20,
                      borderRadius: 5,
                    }}
                  >
                    <CCol xs={1}>
                      <MdErrorOutline size={27} color={'#a25b5d'}/>
                    </CCol>
                    <CCol
                      style={{
                        color: '#a25b5d',
                        fontFamily: 'Signika',
                        fontWeight: '600',
                        marginLeft: 5,
                      }}
                    >
                      {error}
                    </CCol>
                  </CRow>
                ) : null}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel style={{...Styles.formLabel}} htmlFor="inputPassword" className="col-sm-2 col-form-label">
                  Username
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormInput
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text" id="inputUsername"/>
                </div>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel style={{...Styles.formLabel}} htmlFor="inputPassword" className="col-sm-2 col-form-label">
                  Role
                </CFormLabel>
                <div className="col-sm-10">
                  <Select
                    onChange={async (option) => {
                      setRole(option)
                    }}
                    value={role}
                    options={adminRolesSelection}
                    styles={{
                      option: (provided, state) => ({
                        ...provided,
                        cursor: 'pointer',
                      }),
                      control: provided => ({
                        ...provided,
                        borderColor: '#e6e6e6',
                        fontFamily: 'Open Sans',
                        fontWeight: '600',
                        fontSize: 14,
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center'
                      })
                    }}
                    placeholder={'Select...'}
                    components={{DropdownIndicator, IndicatorSeparator: () => null}}
                  />
                </div>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel style={{...Styles.formLabel}} htmlFor="inputPassword" className="col-sm-2 col-form-label">
                  Password
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormInput

                    onChange={(e) => setPassword(e.target.value)}
                    type="password" id="inputPassword"/>
                </div>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel style={{...Styles.formLabel}} htmlFor="inputPassword" className="col-sm-2 col-form-label">
                  Confirm Password
                </CFormLabel>
                <div className="col-sm-10">
                  <CFormInput

                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    type="password" id="inputPasswordConfirm"/>
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
              <CIcon icon={cilSave}/> Save
            </CButton>
          </CCardFooter>

        </CCard>
      </CCol>

    </CRow>
  )
}

export default AdminForm

