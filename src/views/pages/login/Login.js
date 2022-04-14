import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import Admin from "../../../models/Admin";
import swal from "sweetalert"
import { useHistory } from 'react-router-dom'

import logoHPI from 'src/assets/pasporumkm.png'

import nav from "../../../_nav"
import navProfesi from "../../../_nav_profesi"
import navigationProfesi from "../../../_nav_profesi";
import navigation from "../../../_nav";
import SihapeiUtils from "../../../util/SihapeiUtils";

const Login = () => {

  const history = useHistory()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const attemptLogin = async () => {
    try {
      let result = await Admin.login(username, password)

      console.log(result.username)
      localStorage.token = result.token;
      localStorage.username = result.username;
      localStorage.role = result.role;
      sessionStorage.token = result.token;
      sessionStorage.username = result.username;
      sessionStorage.id = result.id;

      let selectedNav = SihapeiUtils.getActiveNav(localStorage.role)
      history.push(selectedNav[0].to)

    } catch (e) {
      console.log(e)

      let errorMessage = "An Error Occured"
      if (e.error_message) {
        if (e.code === "ADMIN_NOT_FOUND" || e.error_message === "Wrong Password") {
          errorMessage = "Wrong Credential"
        } else {
          errorMessage = e.error_message
        }
      }
      swal(errorMessage, "", "error")

    }
  }


  const onKeyPress = (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();

      attemptLogin()
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <div className='text-center'>
                      <h1>Login</h1>
                      <img src={logoHPI} />
                      <p className="text-medium-emphasis">Sign In to your account</p>
                    </div>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        value={username}
                        onKeyPress={onKeyPress}
                        onChange={(e) => {
                          setUsername(e.target.value)
                        }}
                        placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        onKeyPress={onKeyPress}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                        }}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol>
                        <CButton
                          onClick={() => {
                            attemptLogin()
                          }}
                          color="primary" className="w-100">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
