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
    // }
    {
        component: CNavItem,
        name: 'Activities',
        to: '/activities',
        icon: <CIcon icon={cilRunning} customClassName="nav-icon" />,
        id: 'customSidebar'
    },
    // {
    //     component: CNavItem,
    //     name: 'Registration',
    //     to: '/register',
    //     icon: <CIcon icon={cilTouchApp} customClassName="nav-icon" />,
    //     id: 'customSidebar'
    //
    // },
    // {
    //     component: CNavItem,
    //     name: 'Logout',
    //     to: '/logout',
    //     icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
    //     id: 'customSidebar'
    //
    // },
]

export default _nav
