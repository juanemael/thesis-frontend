import React, {useEffect} from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import {useHistory} from "react-router-dom";

const DefaultLayout = () => {

  // const history = useHistory()

  // useEffect(() => {
  //
  //   if(!localStorage.token && !sessionStorage.token){
  //     history.push('/login')
  //   }else if(localStorage.token === undefined && sessionStorage.token === undefined){
  //     history.push('/login')
  //   }
  // }, [])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
