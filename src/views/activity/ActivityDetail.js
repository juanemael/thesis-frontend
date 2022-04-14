import React, { useEffect, useState } from 'react'
import {CButton, CCol, CFormInput, CModal, CModalBody, CModalHeader, CRow} from '@coreui/react'
import DataTable from 'react-data-table-component'
import moment from 'moment'
import { Tabs, Tab, Button } from 'react-bootstrap'
import { CSVLink } from 'react-csv'
import {useHistory, useParams} from 'react-router-dom'

import CIcon from '@coreui/icons-react'
import {FaBullhorn, FaFileDownload, FaNotesMedical, FaUserPlus, FaUsers} from 'react-icons/all'

import { cilUser } from '@coreui/icons'

import ActivityModels from '../../models/Activity'
import Styles from '../../util/Styles'
import InviteUserModal from "../../components/modals/InviteUserModal";
import Swal from "sweetalert2";

const ActivityDetail = (props) => {

  let activityId = props.match.params.id
  const history = useHistory()

  const handleSelect = (route) => {
    history.push(`/activity/${props.match.params.id}/${route}`)
  }

  const [keyword, setKeyword] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  const [activityUsers, setActivityUsers] = useState([])
  const [showNote, setShowNote] = useState(false)
  const [noteTitle, setNoteTitle] = useState('')
  const [note,setNote] = useState('')
  const [data,setData] = useState([])
  const [error,setError] = useState('')
  const [details,setDetails] = useState('')
  const {id} = useParams()

  let ActivityModel = new ActivityModels()

  const getActivityParticipants = async () => {
    try {
      let result = await ActivityModel.getClassParticipants(props.match.params.id)
      console.log(result)
      setActivityUsers(result)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    getActivityParticipants()
  }, [])

  const resetModal = () => {
    setNoteTitle(null)
    setNote(null)
    setShowNote(false)
  }

  const submissionNote = () => {
    setError (null)

    console.log("INI NOTE", note)
    const body = {
      note
    }
    console.log("INI NOTE", body)
    Swal.fire({
      title: "",
      text: `Are you to store this note? ${details.id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#3085d6",
      cancelButton: "Cancel",
      cancelButtonColor: '#d33',
    }).then(async (res)=>{
      try {
        let result = await ActivityModel.updateNote(details.id, body)
        console.log("THISIS RESULT", result)
        if (result.id && res.value || result.success && res.value) {
          await Swal.fire('',"Data successfully saved","success")
            .then(()=>{
              history.go(0)
            })
        } else {
          await Swal.fire('', "Data failed to be stored", "error")
          // history.go(0)
        }
      }catch (e) {
        await Swal.fire('',e.error_message ? e.error_message : "Error Occured. ","error")
      }
    })
  }

  let tabContent = (tableData) => {
    return (
      <DataTable
        customStyles={Styles.dataTable}
        columns={[
          {
            name: 'ID Registrasi',
            selector: (row) => row.member_id,
            sortable: true,
          },
          {
            name: 'Nama Lengkap',
            selector: (row) => row.member.full_name,
            sortable: true,
          },
          {
            name: 'Email',
            selector: (row) => row.member.email,
            sortable: true,
          },
          {
            name: 'Register Date',
            selector: (row) => moment(row.created_at).format('DD-MM-YYYY HH:mm'),
            sortable: true,
          },
          {
            name: 'Note',
            selector: (row) => row.note,
            sortable: true,
          },

          {
            name: 'Status',
            selector: (row) => row.status,
            sortable: true,
            conditionalCellStyles: [
              {
                when: (row) => row.status.toLowerCase() === 'accepted',
                style: {
                  backgroundColor: 'green',
                  color: 'white',
                },
              },
              {
                when: (row) => row.status.toLowerCase() !== 'accepted',
                style: {
                  backgroundColor: 'red',
                  color: 'white',
                },
              },
            ],
          },
          {
            name: '',
            width: '20%',
            selector: (row) => (
              <div style={{display: 'inline-block'}}>
                <>
                  <CButton
                    onClick={() => {
                      setDetails(row)
                      setShowNote(true)
                      // setDetailsTitle(`Update Detail: ${row.username}`)
                    }}
                    block
                    style={{
                      ...Styles.tableBtn2,
                    }}
                  >
                    Note
                  </CButton>
                </>
              </div>
            ),
          },
          // {
          //   name: 'Options',
          //   selector: (row) => (
          //     <div
          //       style={{
          //         width: '100%',
          //       }}
          //       className="d-flex"
          //     >
          //       <>
          //         <CButton
          //           onClick={() => {}}
          //           block
          //           style={{
          //             ...Styles.tableBtn2,
          //           }}
          //         >
          //           INFO
          //         </CButton>
          //         <CButton
          //           onClick={() => {}}
          //           block
          //           style={{
          //             ...Styles.tableBtn2,
          //           }}
          //         >
          //           CATATAN
          //         </CButton>
          //       </>
          //     </div>
          //   ),
          // },
        ]}
        data={tableData}
        pagination
      />
    )
  }
  return (
    <>
      <CModal
        visible={showNote}
        size={'md'}
        onClose={()=> resetModal() }>
        <CModalHeader style={Styles.ModalDetailTitle}>
          {"Note Edit"}
        </CModalHeader>
        <CModalBody>
          <CRow className='mb-3' style={Styles.ModalDetailRows}>
            <CCol xs="12">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">
                Note
              </label>
              <div style={Styles.ModalDetailText}>
                <CFormInput
                  defaultValue={data && data.note}
                  onChange={(e) => setNote(e.target.value)}
                  type="text" id="editNote" />
              </div>
            </CCol>
          </CRow>
          <CButton color="primary" onClick={()=>{
            submissionNote()
          }}>Save changes</CButton>
        </CModalBody>
      </CModal>
      <Tabs
        defaultActiveKey="participants"
        transition={false}
        id="noanim-tab-example"
        className="mb-3 customTabs"
        onSelect={(eventKey) => handleSelect(eventKey)}
      >
        <Tab eventKey="edit" title="Edit Activity"></Tab>
        <Tab eventKey="participants" title="Participants">
          <div style={Styles.cardHeader}>
            <div style={Styles.cardHeaderText}>Peserta Sesi {activityUsers.length} </div>
            <CFormInput
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter Keyword"
              style={Styles.searchTableInput}
            />
          </div>
          <div style={Styles.cardHeader} className="d-block">
            <div style={{ fontWeight: 'bold' }}>Ringkasan</div>
            <div>
              <CIcon icon={cilUser} />
              Pendaftar: {activityUsers.length}
            </div>
            <div>
              Terdaftar:{' '}
              {activityUsers.filter((user) => user.status.toLowerCase() === 'accepted').length}
            </div>
            <div>
              Pending:{' '}
              {activityUsers.filter((user) => user.status.toLowerCase() === 'pending').length}
            </div>
            <div>
              Ditolak:{' '}
              {activityUsers.filter((user) => user.status.toLowerCase() === 'rejected').length}
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
              className="my-3"
            >
              {
                <CSVLink
                  style={{ marginRight: '1em', color: 'white', marginBottom: 10, fontSize: '.8em' }}
                  separator={';'}
                  data={activityUsers.map((obj, key) => {
                    return {
                      class_id: obj.class_id,
                      'Nama Lengkap': obj.member?.full_name,
                      Email: obj.member?.email,
                      'Tanggal Daftar': new moment(obj.created_at).format('MM/DD/YYYY HH:mm:ss'),
                    }
                  })}
                  filename={`daftar-peserta.csv`}
                  className="btn btn-primary"
                  target="_blank"
                >
                  Download Semua Data&nbsp;&nbsp;
                  <FaFileDownload />
                </CSVLink>
              }
              <div>
                <Button
                  style={{
                    marginRight: 10,
                    color: 'white',
                    marginBottom: 10,
                    fontSize: '.8em',
                  }}
                  variant={'primary'}
                  onClick={() => {
                    setIsInviting(true)
                  }}
                >
                  Undang Peserta&nbsp;&nbsp;
                  <FaUserPlus />
                </Button>
              </div>
              <div>
                <Button
                  style={{
                    marginRight: 10,
                    color: 'white',
                    marginBottom: 10,
                    fontSize: '.8em',
                  }}
                  variant={'primary'}
                  onClick={() => {}}
                >
                  Undang Banyak Peserta&nbsp;&nbsp;
                  <FaUsers />
                </Button>
              </div>
              <div>
                <Button
                  style={{
                    marginRight: 10,
                    color: 'white',
                    marginBottom: 10,
                    fontSize: '.8em',
                  }}
                  variant={'primary'}
                  onClick={() => {
                    setShowNote(true)
                  }}
                >
                  Notes&nbsp;&nbsp;
                  <FaNotesMedical />
                </Button>
              </div>
            </div>
          </div>
          <Tabs
            defaultActiveKey="all"
            transition={false}
            id="noanim-tab-example"
            className="mb-3 customTabs"
          >
            <Tab eventKey="all" title="Semua">
              {tabContent(activityUsers)}
            </Tab>
            <Tab eventKey="accepted" title="Diterima">
              {tabContent(activityUsers.filter((user) => user.status.toLowerCase() === 'accepted'))}
            </Tab>
            <Tab eventKey="pending" title="Pending">
              {tabContent(activityUsers.filter((user) => user.status.toLowerCase() === 'pending'))}
            </Tab>
            <Tab eventKey="rejected" title="Ditolak">
              {tabContent(activityUsers.filter((user) => user.status.toLowerCase() === 'rejected'))}
            </Tab>
          </Tabs>
        </Tab>
        <Tab eventKey="certificates" title="Certificates"></Tab>
      </Tabs>

      <InviteUserModal
        isOpen={isInviting}
        onClose={() => {
          setIsInviting(false)
          getActivityParticipants()
        }}
        activityId={activityId}
      />

    </>
  )
}

export default ActivityDetail
