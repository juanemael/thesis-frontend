import DataTable from 'react-data-table-component'
import {CButton, CFormInput} from '@coreui/react'
import Styles from '../../util/Styles'
import React, {useEffect, useState, useRef} from "react";
import ConsultationModels from '../../models/Consultation'
import {Link, useHistory, useLocation} from 'react-router-dom';
import {Exception} from 'sass'
import swal from 'sweetalert';
import moment from "moment";

const Consultation = () => {
  const history = useHistory()
  const [consultation, setCardiologist] = useState([])
  const [keyword, setKeyword] = useState("")

  let consultationModel = new ConsultationModels()
  const getConsultation = async () => {
    try {
      let result = await consultationModel.getAll()
      console.log(result)
      setCardiologist(result)
    } catch (e) {
    }

  }

  useEffect(() => {
    getConsultation()
  }, [])


  return (
    <>
      <div style={Styles.cardHeader}>
        <div style={Styles.cardHeaderText}>Consultation</div>
        <div style={Styles.searchTableText}>Search
        </div
          >
        <CFormInput
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter Keyword" style={Styles.searchTableInput}/>
      </div>

      <DataTable
        customStyles={Styles.dataTable}

        columns={[

          {
            name: 'User',
            selector: (row) => row.user_name,
            sortable: true,
            width: '20%'
          },
          {
            name: 'Cardiologist',
            selector: (row) => row.cardiologist_name,
            sortable: true,
            width: '20%'
          },
          {
            name: 'Status',
            selector: (row) => row.status,
            sortable: true,
            width: '10%'
          },
          {
            name: 'Payment',
            selector: (row) => row.payment,
            width: '10%'
          },
          {
            name: 'Start At',
            selector: (row) => moment(row.start_at).format('DD-MM-YYYY HH:mm'),
            sortable: true,
            width: '15%'
          },
          {
            name: 'End At',
            selector: (row) => moment(row.end_at).format('DD-MM-YYYY HH:mm'),
            sortable: true,
            width: '15%'
          },

        ]}
        data={consultation.filter((item) => {
          return item.user_name.toLowerCase().includes(keyword.toLowerCase()) || item.cardiologist_name.toLowerCase().includes(keyword.toLowerCase())
        })}
        pagination
      />
    </>
  )
}

export default Consultation
