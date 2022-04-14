import React, {lazy, useEffect, useMemo, useState} from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol, CFormInput,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow, CWidgetStatsF,
} from '@coreui/react'
import {CChart, CChartLine, CChartPie} from '@coreui/react-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {Pie} from "react-chartjs-2";

import Styles from "../../util/Styles";
import DataTable from "react-data-table-component";
import specialization from "../specialization/Specialization";

import DashboardModel from "../../models/Dashboard"
import moment from "moment"

ChartJS.register(ArcElement,Tooltip,Legend)

const WidgetsDropdown = lazy(() => import('../widgets/WidgetsDropdown.js'))
const WidgetsBrand = lazy(() => import('../widgets/WidgetsBrand.js'))

let dashboardModel = new DashboardModel()

const Dashboard = () => {

  const [keyword, setKeyword] = useState("")
  let [specialization, setSpecialization] = useState([])

  const [dashboardHighlight, setDashboardHighlight] = useState(null)
  const [expiringMembers, setExpiringMembers] = useState([])

  const [weeklyData, setWeeklyData] = useState(null)

  useEffect(()=>{
    getDashboardHighlights()
  },[])

  const getDashboardHighlights = async() =>{
    try{
      let dashboardHighlights = await dashboardModel.getDashboardHighlights()
      console.log("HIGHLIGHT", dashboardHighlights)

      setDashboardHighlight(dashboardHighlights)
      setExpiringMembers(dashboardHighlights.expiringMembers)

      processWeeklyData(dashboardHighlights.weeklyRegistration)

    }catch (e) {
      console.log(e)
    }
  }

  const processWeeklyData = (rawData) =>{

    let labels = []
    let data = []

    for(let r of rawData){
      console.log("rd", rawData)
      labels.push(moment(r.first_day).format("DD MMM YYYY"))
      data.push(r.registration_count)
    }

    setWeeklyData({
      labels, data
    })

  }

  return (
    <>
      <WidgetsDropdown
        dashboardHighlight={dashboardHighlight}
      />

      {/*<CCard className="mb-4" >*/}
      {/*  <CCardBody>*/}
      {/*    <CRow>*/}
      {/*      <CRow>*/}
      {/*        <CCol md={6}>*/}
      {/*          <CWidgetStatsF*/}
      {/*            className="mb-3"*/}
      {/*            color="primary"*/}
      {/*            icon={<CIcon icon={cilUser} height={24} />}*/}
      {/*            title="Total Active Members "*/}
      {/*            value="100"/>*/}
      {/*        </CCol>*/}
      {/*        <CCol md={6}>*/}
      {/*          <CWidgetStatsF*/}
      {/*            className="mb-3"*/}
      {/*            color="primary"*/}
      {/*            icon={<CIcon icon={cilUser} height={24} />}*/}
      {/*            title="Total New Member Registration "*/}
      {/*            value="100"/>*/}
      {/*        </CCol>*/}
      {/*      </CRow>*/}
      {/*      <CRow>*/}
      {/*        <CCol md={6}>*/}
      {/*          <CWidgetStatsF*/}
      {/*            className="mb-3"*/}
      {/*            color="primary"*/}
      {/*            icon={<CIcon icon={cilUser} height={24} />}*/}
      {/*            // padding={false}*/}
      {/*            title="Total Non-Active Members"*/}
      {/*            value="100"/>*/}
      {/*        </CCol>*/}
      {/*        <CCol md={6}>*/}
      {/*          <CWidgetStatsF*/}
      {/*            className="mb-3"*/}
      {/*            color="primary"*/}
      {/*            icon={<CIcon icon={cilUser} height={24} />}*/}
      {/*            title="Total Membership Renewal "*/}
      {/*            value="100"/>*/}
      {/*        </CCol>*/}
      {/*      </CRow>*/}
      {/*    </CRow>*/}

      {/*  </CCardBody></CCard>*/}

      <CRow>
        <CCol>
          <CCard className="mb-4" >
        <CCardBody>
          <div style={Styles.cardHeader}>
            <div style={Styles.cardHeaderText}><h4>Expiring Members</h4></div>
            <div style={Styles.searchTableText}>Search</div>
            <CFormInput
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter Keyword" style={Styles.searchTableInput} />
          </div>
        <DataTable
          customStyles={Styles.dataTable}
          columns={[
            {
              name: 'ID',
              selector: (row,key) => (key+1),
              sortable: true,
            },
            {
              name: 'Name',
              selector: (row) => row.full_name,
              sortable: true,
            },
            {
              name: 'Email',
              selector: (row) => row.email,
              sortable: true,
            },
            {
              name: 'Expiry Date',
              selector: (row) => moment(row.expire_date).format("DD MMM YYYY HH:mm"),
              sortable: true,
            },
            {
              name: 'Expiring In',
              selector: (row) => {return `${row.expiring_in} days`},
              sortable: true,
            },
            {
              name: '',
              // width: '40%',
              selector: (row) => (
                <div style={{ display: 'inline-block' }}>
                </div>
              ),
            },
          ]}
          data={expiringMembers.filter((item) => {
            return item.email.toLowerCase().includes(keyword.toLowerCase())
          })}
          pagination
        />
        </CCardBody>

      </CCard>
        </CCol>
      </CRow>

      {/*<CRow>*/}
      {/*  <CCol>*/}
      {/*    <CCard className="mb-4">*/}
      {/*      <CCardBody>*/}
      {/*        <CRow>*/}
      {/*          <CCol sm={5} style={{paddingLeft: 50, paddingTop: 20}}>*/}
      {/*            <h4 id="sebaranMember" className="card-title mb-0" >*/}
      {/*              MEMBER DEMOGRAPHY*/}
      {/*            </h4>*/}
      {/*          </CCol>*/}
      {/*        </CRow>*/}
      {/*        <CRow>*/}
      {/*          <CCol md={6} style={{paddingTop: 30, paddingLeft: 50}}>*/}
      {/*            <h5 id="specializationPie" className="card-title mb-0">*/}
      {/*              Specialization*/}
      {/*            </h5>*/}
      {/*          </CCol>*/}
      {/*          <CCol md={6} style={{paddingTop: 30, paddingLeft: 50}}>*/}
      {/*            <h5 id="specialization2Pie" className="card-title mb-0">*/}
      {/*              Payment Status*/}
      {/*            </h5>*/}
      {/*          </CCol>*/}
      {/*        </CRow>*/}
      {/*        /!*<WidgetsBrand withCharts />*!/*/}
      {/*        <CRow md={{ cols: 9 }} className="text-center">*/}
      {/*          <CCol md={6}>*/}
      {/*            <Pie*/}
      {/*              data={{*/}
      {/*                labels: ['Accounting', 'Automotive', 'Book Fiction', 'Games & Entertainment'],*/}
      {/*                datasets: [*/}
      {/*                  {*/}
      {/*                    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],*/}
      {/*                    data: [40, 20, 80, 10],*/}
      {/*                  },*/}
      {/*                ],*/}
      {/*              }}*/}
      {/*              options={{maintainAspectRatio: false,plugins: {*/}
      {/*                  legend: {*/}
      {/*                    // display: false,*/}
      {/*                    position: 'bottom',*/}
      {/*                    labels: {*/}
      {/*                      font: {*/}
      {/*                        size: 12,*/}
      {/*                      },*/}
      {/*                    },*/}
      {/*                  },*/}
      {/*                },}}*/}
      {/*            />*/}
      {/*          </CCol>*/}
      {/*          <CCol md={6}>*/}
      {/*            <Pie*/}
      {/*              data={{*/}
      {/*                labels: ['Paid', 'Unpaid'],*/}
      {/*                datasets: [*/}
      {/*                  {*/}
      {/*                    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],*/}
      {/*                    data: [40, 20],*/}
      {/*                  },*/}
      {/*                ],*/}
      {/*              }}*/}
      {/*              options={{maintainAspectRatio: false,plugins: {*/}
      {/*                  legend: {*/}
      {/*                    // display: false,*/}
      {/*                    position: 'bottom',*/}
      {/*                    labels: {*/}
      {/*                      font: {*/}
      {/*                        size: 12,*/}
      {/*                      },*/}
      {/*                    },*/}
      {/*                  },*/}
      {/*                },}}*/}
      {/*            />*/}
      {/*          </CCol>*/}
      {/*        </CRow>*/}
      {/*      </CCardBody>*/}
      {/*    </CCard>*/}
      {/*  </CCol>*/}
      {/*</CRow>*/}

      <CRow>
        <CCol>
          <CCard className="mb-9" >
            <CCardBody>
              <CRow>
                <CCol sm={12} style={{paddingLeft: 50, paddingTop: 20, paddingBottom: 10}}>
                  <h4 id="traffic" className="card-title mb-0">
                    Membership Activation / Extension
                  </h4>
                </CCol>
              </CRow>
              {/*<WidgetsBrand withCharts />*/}
              <CRow className="text-center">
                <CCol md={12}>
                  {
                    weeklyData && <CChart
                      type="line"
                      data={{
                        labels: weeklyData.labels,
                        datasets: [
                          // {
                          //   label: "My First dataset",
                          //   backgroundColor: "rgba(220, 220, 220, 0.2)",
                          //   borderColor: "rgba(220, 220, 220, 1)",
                          //   pointBackgroundColor: "rgba(220, 220, 220, 1)",
                          //   pointBorderColor: "#fff",
                          //   data: [40, 20, 12, 39, 10, 40, 39, 80, 40]
                          // },
                          {
                            label: "Extension / Activation",
                            backgroundColor: "rgba(151, 187, 205, 0.2)",
                            borderColor: "rgba(151, 187, 205, 1)",
                            pointBackgroundColor: "rgba(151, 187, 205, 1)",
                            pointBorderColor: "#fff",
                            data: weeklyData.data
                          },
                        ],
                      }}
                    />
                  }

                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>


      {/*<CCard className="mb-4">*/}
      {/*  <CCardBody>*/}
      {/*    <CRow>*/}
      {/*      <CCol sm={5}>*/}
      {/*        <h4 id="traffic" className="card-title mb-0">*/}
      {/*          SEBARAN USER*/}
      {/*        </h4>*/}
      {/*      </CCol>*/}
      {/*    </CRow>*/}
      {/*    <CRow md={6} className="text-center">*/}
      {/*    <CChart*/}
      {/*      type="bar"*/}
      {/*      data={{*/}
      {/*        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],*/}
      {/*        datasets: [*/}
      {/*          {*/}
      {/*            label: 'GitHub Commits',*/}
      {/*            backgroundColor: '#f87979',*/}
      {/*            data: [40, 20, 12, 39, 10, 40, 39, 80, 40],*/}
      {/*          },*/}
      {/*        ],*/}
      {/*      }}*/}
      {/*      labels="months"*/}
      {/*    />*/}
      {/*    </CRow>*/}
      {/*  </CCardBody>*/}
      {/*</CCard>*/}


    </>
  )
}

export default Dashboard
