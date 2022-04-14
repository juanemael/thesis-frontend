import React, {lazy, useEffect, useMemo, useState} from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol, CFormInput, CModal, CModalBody, CModalHeader,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import {CChart, CChartLine} from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import Styles from "../../util/Styles";
import DataTable from "react-data-table-component";
import specialization from "../specialization/Specialization";
import {useHistory} from "react-router-dom";
import TransactionModel from "../../models/Transaction";

import moment from "moment"
import TransactionDetailModal from "./TransactionDetailModal";

const TransactionList = () =>{

  const [selectedDetail, setSelectedDetail] = useState(null)

  const [memberships, setMemberships] = useState([])
  const [keyword, setKeyword] = useState('')
  const history = useHistory();
  const [selectedStatus, setSelectedStatus] = useState("all")

  let transactionModel = new TransactionModel()

  useEffect(()=>{
    getTransactions()
  },[])

  let getTransactions = async() =>{
    try{
      let result = await transactionModel.getAll();
      setMemberships(result.map(obj=>{
        return {
          ...obj.member,
          ...obj
        }
      }))
      console.log("r",result)
    }catch(error){
      console.error(error)
    }
  }

  let filteredTransaction = memberships.filter((data) => {
    switch (selectedStatus) {
      case "all" :
        return true
      case "paid" :
        return data.paid_status === "SETTLEMENT" || data.paid_status === "CAPTURE"
      case "waiting" :
        return data.paid_status === "pending" || data.paid_status === "WAIT_SNAP_NOTIFICATION"
      case "expired" :
        return data.paid_status === "EXPIRE"
      default :
        return true
    }
  })

  return (
    <>
      <div style={Styles.cardHeader}>
        <div style={Styles.cardHeaderText}>Transaction</div>
        <div style={Styles.searchTableText}>Search</div>
        <CFormInput
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter Keyword" style={Styles.searchTableInput}/>
      </div>
      <div style={{...Styles.cardHeaderAction}}>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          /* align-content: center; */
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
          width: '100%',
          // position: windowWidth > 718 ? 'absolute' : undefined,
          right: '2%'
        }}>
          <CButton
            style={{
              color : selectedStatus === "all" ? 'white' : null
            }}
            color={selectedStatus === "all" ? 'danger' : 'secondary'}
            shape='pill'
            variant={selectedStatus === "all" ? '' : "outline"}
            className="m-2"
            onClick={() => {
              setSelectedStatus("all")
            }}
          >
            All
          </CButton>
          <CButton
            style={{
              color : selectedStatus === "paid" ? 'white' : null
            }}
            color={selectedStatus === "paid" ? 'danger' : 'secondary'}
            shape='pill'
            variant={selectedStatus === "paid" ? '' : "outline"}
            onClick={() => {
              setSelectedStatus("paid")
            }}
            className="m-2"
          >
            Paid
          </CButton>
          <CButton
            style={{
              color : selectedStatus === "waiting" ? 'white' : null
            }}
            color={selectedStatus === "waiting" ? 'danger' : 'secondary'}
            shape='pill'
            variant={selectedStatus === "waiting" ? '' : "outline"}
            onClick={() => {
              setSelectedStatus("waiting")
            }}
            className="m-2"
          >
            Waiting for Payment
          </CButton>
          <CButton
            style={{
              color : selectedStatus === "expired" ? 'white' : null
            }}
            color={selectedStatus === "expired" ? 'danger' : 'secondary'}
            shape='pill'
            variant={selectedStatus === "expired" ? '' : "outline"}
            onClick={() => {
              setSelectedStatus("expired")
            }}
            className="m-2"
          >
            Expired
          </CButton>


        </div>
      </div>

      <DataTable
        customStyles={Styles.dataTable}
        columns={[
          {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
            width: '10%',
          },
          {
            name: 'Full Name',
            selector: (row) => row.full_name,
            sortable: true,
          },
          {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
          },
          {
            name: 'Created Time',
            selector: (row) =>moment(row.created_at).format("DD MMM YYYY HH:mm"),
            sortable: true,
          },
          {
            name: 'Status',
            selector: (row) =>{
              return row.paid_status
            },
            sortable: true,
          },
          {
            name: '',
            style: {
              width: "100%",
              display: "flex"
            },
            selector: (row) => (
              <div style={{
                display: 'flex',
                flexDirection: "column",
                width: "100%"
              }}
              >

                <CButton
                  onClick={() => {
                    setSelectedDetail(row)
                    console.log(row)
                  }}
                  style={{
                    ...Styles.tableBtn,
                    ...Styles.detailBtn,
                  }}>Detail</CButton>
              </div>
            )
          }
        ]}

        data={filteredTransaction.filter((item) => {
          return (
            item.full_name.toLowerCase().includes(keyword.toLowerCase()) ||
            item.email.toLowerCase().includes(keyword.toLowerCase())
            // item.user_email.toLowerCase().includes(keyword.toLowerCase())
          )
        })}
        pagination
      />

      <TransactionDetailModal
        visible={!!selectedDetail}
        close={()=>setSelectedDetail(null)}
        details={selectedDetail}
      />

    </>
  )

}


export default TransactionList
