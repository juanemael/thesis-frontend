import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilAccountLogout,
  cilUser,
  cilScreenDesktop,
  cilDollar,
  cilGroup,
  cilRunning,
  cilTouchApp, cilStar, cilBook,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
    {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilScreenDesktop} customClassName="nav-icon" />,
        id: 'customSidebar'
    },
    {
      component: CNavItem,
      name: 'Sertifikasi Halal',
      to: '/sertifikasi_halals',
      icon: <CIcon icon={cilBook} customClassName="nav-icon"/>,
      id: 'customSidebar'
    },
]

export default _nav
