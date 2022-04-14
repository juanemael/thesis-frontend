import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'


import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// import logoHPI from 'src/assets/hpi-logo.png'
import userImage from 'src/assets/user.png'

// sidebar nav config
import navigation from '../_nav'
import navigationProfesi from '../_nav_profesi'
import SihapeiUtils from "../util/SihapeiUtils";

const AppSidebar = () => {

  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  let selectedNav = SihapeiUtils.getActiveNav(localStorage.role)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      colorScheme={'dark'}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-grid justify-content-center text-center" to="/">
        {/*<img src={logoHPI} alt='HPI' style={{ height: 90 }} className='m-auto my-1'/>*/}
        <div style={{height: 90}}></div>
        <img src={userImage} alt='avatar' style={{ height: 120 }} className='my-1'/>
        {/*<span className='text-black'>Livin Like Larry</span>*/}
        <span className='text-secondary'>Admin</span>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={selectedNav} />
        </SimpleBar>
      </CSidebarNav>
      {/*<CSidebarToggler*/}
      {/*  className="d-none d-lg-flex"*/}
      {/*  onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}*/}
      {/*/>*/}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
