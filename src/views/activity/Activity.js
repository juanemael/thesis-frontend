import React, {useEffect, useState} from 'react';
import Styles from "../../util/Styles";
import {CButton, CCol, CFormInput, CModal, CModalBody, CModalHeader, CRow} from "@coreui/react";
import DataTable from "react-data-table-component";
import { Link, useHistory, useLocation } from 'react-router-dom';
import ActivityModels from '../../models/Activity'
import Swal from 'sweetalert2'
import {Container} from "react-bootstrap";
import swal from "sweetalert";
import moment from "moment";

const Activity = () => {
  const history = useHistory();
  const activities = [
    {
      id: 1,
      name: "Kelas1"
    },
    {
      id: 2,
      name: "Kelas2"
    }
  ];

  const [keyword, setKeyword] = useState("");
  const [activity, setActivity] = useState([])
  const [note, setNote] = useState(false)
  const [noteTitle, setNoteTitle] = useState("")
  const [showNote,setShowNote] = useState(false)
  const [data,setData] = useState([])

  const [error, setError] = useState({});

  let ActivityModel = new ActivityModels()

  const getActivity = async () => {
    try {
      console.log("ASDASDAS")
      let result = await ActivityModel.getAll()
      console.log(result)
      console.log("SADAS")
      setActivity(result)
    } catch (e){
      console.error(e)
    }
  }

  useEffect(()=>{
    getActivity()
  },[])

  const deleteActivity = async (id) =>{
    console.log("BUTTON P[RESSED")
    Swal.fire({
      title: "",
      text: "Are you sure you want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButton: "Yes",
      confirmButtonColor: '#3085d6',
      cancelButton: "Cancel",
      cancelButtonColor: '#d33',
      // dangerMode: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let result = await ActivityModel.delete(id);

          if (result.id || result.success) {
            Swal.fire("", "Delete Successful", "success")
              .then(() => {
                getActivity()
              })
          } else {
            await Swal.fire('Failed', 'Failed to delete', 'error')

          }
        } catch (e) {
          console.error(e)
          await Swal.fire('', e.error_message ? e.error_message : "Something Wrong", 'error')
        }
      }
    })
  }

  const resetModal = () =>{
    setNoteTitle(null)
    setNote(null)
    setShowNote(false)
  }

  const submission = async (id) => {
    setError (null)

    const body = {
      note
    }

    Swal.fire({
      title: "",
      text: "Are you sure to store this note?",
      icon: "warning",
      showCancelButton: true,
      confirmButton: "Yes",
      confirmButtonColor: '#3085d6',
      cancelButton: "Cancel",
      cancelButtonColor: '#d33',
    }).then(async () => {
      try {
        let result = await ActivityModel.update(id, body)
        console.log("THISIS RESULT" + result)
        if (result.id || result.success) {
          swal('', "Data berhasil di simpan", 'success')
            .then(() => {
              getActivity()
            });
        } else {
          swal('', "Data gagal disimpan", 'error')
        }

      } catch (e) {
        console.log(e)
        swal('', e.error_message ? e.error_message : "Terjadi Kesalahan", 'error')
      }
    })
  }

  return (
    <>
      <CModal
        visible={showNote}
        size={'md'}
        onClose={()=> resetModal() }>
        <CModalHeader style={Styles.ModalDetailTitle}>
          {noteTitle}
        </CModalHeader>
        <CModalBody>
          <CRow className='mb-3' style={Styles.ModalDetailRows}>
            <CCol xs="12">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">
              Notes
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
            submission(data.id)
          }}>Save changes</CButton>
        </CModalBody>
      </CModal>
      <div style={Styles.cardHeader}>
        <div style={Styles.cardHeaderText}>Activities</div>
        <div style={Styles.searchTableText}>Search</div>
        <CFormInput
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter Keyword" style={Styles.searchTableInput} />
      </div>
      <div style={{ ...Styles.cardHeaderAction }}>
        <CButton onClick={() => { history.push('activity/create') }} style={{ ...Styles.cardHeaderActionButton }}>
          Create
        </CButton>
      </div>
      <DataTable
        customStyles={Styles.dataTable}
        columns={[
          {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
          },
          {
            name: ' Class Name',
            selector: (row) => row.name,
            sortable: true,
          },
          {
            name: 'Date & Time',
            selector: (row) => moment(row.start_time).format("HH MMM YYYY hh:mm"),
            sortable: true,
          },
          {
            name: 'Attendees',
            selector: (row) => row.quota,
            sortable: true,
          },
          {
            name: 'Notes',
            selector: (row) => row.note,
            sortable: true,
          },
          {
            name: 'Options',
            selector: (row) => (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}>
                <>
                  <CButton
                    onClick={() => history.push(`activity/${row.id}`)}
                    block
                    style={{
                      ...Styles.tableBtn2,

                    }}
                  >
                    Detail
                  </CButton>
                  <CButton
                    onClick={() => {
                      setData(row)
                      setShowNote(true)
                      setNoteTitle(`Edit Note with Class ID: ${row.id}`)
                      setNote(row.note)
                    }}
                    block
                    style={{
                      ...Styles.tableBtn2,
                    }}
                  >
                    Notes
                  </CButton>
                  <CButton
                    onClick={() => { deleteActivity(row.id) }}
                    style={{
                      ...Styles.tableBtn2,
                      ...Styles.rejectBtn,
                      // ...Styles.ml10,
                    }}
                  >
                    Delete
                  </CButton>
                </>
              </div>
            ),
          },
        ]}
        data={activity.filter((item) => {
          console.log(item.name.toLowerCase().includes(keyword.toLowerCase()))
          return item.name.toLowerCase().includes(keyword.toLowerCase())
        })}
        pagination
      />
    </>
  )
}

export default Activity;
