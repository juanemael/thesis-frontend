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
  // {
  //     component: CNavItem,
  //     name: 'Account',
  //     to: '/account',
  //     icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  //     className: 'customSidebar',
  //     id: 'customSidebar'
  // },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilScreenDesktop} customClassName="nav-icon" />,
    id: 'customSidebar'
  },
  {
    component: CNavItem,
    name: 'Transaction',
    to: '/transaction',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
    id: 'customSidebar'

  },
]

export default _nav
