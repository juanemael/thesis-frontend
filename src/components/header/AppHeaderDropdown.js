import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser, cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'


import userImages from './../../assets/images/default_user.png'
import { FiChevronDown } from 'react-icons/all'
import { useHistory } from "react-router-dom";

const AppHeaderDropdown = () => {

  const history = useHistory()
  const _username = localStorage.getItem('username') ? localStorage.getItem('username') : ''

  const logout = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    sessionStorage.removeItem("loginAs");
    localStorage.removeItem("loginAs");
    sessionStorage.removeItem("id");
    localStorage.removeItem("id");
    history.push("/login");
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>


        <span style={{ marginLeft: 10, fontWeight: '600', fontSize: '.9em', color: '#000000' }}>
          {_username}
        </span>

        <FiChevronDown style={{ marginLeft: 5, color: '#0000004d8a' }} />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem
          onClick={() => {
            logout()
          }}
          href="#">
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
