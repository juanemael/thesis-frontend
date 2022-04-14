import DataTable from 'react-data-table-component'
import {
  CButton,
  CCol,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CNav,
  CNavItem,
  CNavLink,
  CRow
} from '@coreui/react'
import Styles from '../../util/Styles'
import React, {useEffect, useState} from 'react'
import {Link, useHistory, useLocation} from 'react-router-dom';
import userModel from '../../models/Member'
import swal from 'sweetalert';
import MemberModels from "../../models/Member";

const Member = () => {
  const [members, setMembers] = useState([])
  const [showDetails, setShowDetails] = useState(false)
  const [showForgotPassword, setForgotPassword] = useState(false)
  const [detailsTitle, setDetailsTitle] = useState(null)
  const [selectedMember, setSelectedMember] = useState({});
  const [error, setError] = useState({});
  const [keyword, setKeyword] = useState('')
  const [details, setDetails] = useState(null)
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState([])
  const history = useHistory();
  const [selectedStatus, setSelectedStatus] = useState("all")

  let memberModel = new MemberModels()

  const getMembers = async () => {
    let membersModel = new MemberModels()
    try {
      let result = await membersModel.getAll()
      console.log(result)
      let filtered_member;
      switch (selectedStatus) {
        case 'all':
          filtered_member = result
          break;
        case 'inactive':
          filtered_member = result.filter((data) => {
            return !data.status
          })
          break;
        case 'active':
          filtered_member = result.filter((data) => {
            return data.status
          })
          break;
        case 'waiting-verification':
          filtered_member = result.filter((data) => {
            return !data.approval_date && !data.rejection_date
          })
          break;
        case 'verified':
          filtered_member = result.filter((data) => {
            return data.status && data.approval_date
          })
          break;
        case 'rejected':
          filtered_member = result.filter((data) => {
            return !data.status && data.rejection_date
          })
          break;
        default:
      }
      setMembers(filtered_member)
    } catch (e) {
    }
  }

  const deleteMember = async (id) => {
    const confirm = await swal({
      title: "",
      text: "Are you sure want delete this item?",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
      dangerMode: true,
    });
    if (confirm) {
      try {
        let result = await memberModel.deleteMember(id);
        if (result.id || result.success) {
          swal('', "Delete Successful", 'success')
            .then((value) => {
              getMembers();
            });
        } else {
          swal('', "Failed to delete", 'error')
          return
        }
      } catch (e) {
        console.log(e)
        swal('', e.error_message ? e.error_message : "Something Wrong", 'error')
      }
    }
  }

  useEffect(() => {
    getMembers()
  }, [selectedStatus])

  const resetModal = () => {
    setDetailsTitle(null)
    setShowDetails(false)
    setForgotPassword(false)
  }

  const approvalStatus = (value) => {
    if (!value.approval_date && !value.rejection_date) {
      return 'Waiting Verification'
    } else if (value.approval_date && value.status) {
      return 'Verified'
    } else if (!value.approval_date && value.rejection_date) {
      return 'Rejected'
    }
  }
  const submissionForgotPassword = async (email) => {
    setError(null)

    const body = {
      email: email
    }

    const submitConfirm = await swal({
      title: "",
      text: "Apakah anda yakin akan menyimpan data ini?",
      icon: "warning",
      buttons: ["Batal", "Ya, Simpan"],
      dangerMode: true,
    });

    if (submitConfirm) {
      try {
        console.log("TEST ID : " + body.email)
        let result = await memberModel.forgotPassword(body)
        if (result.id || result.success) {
          swal('', "Data berhasil di simpan", 'success')
            .then((value) => {
              // history.push('/admin');
              getMembers()
            });
        } else {
          swal('', "Data gagal disimpan", 'error')
          return
        }

      } catch (e) {
        console.log(e)
        swal('', e.error_message ? e.error_message : "Terjadi Kesalahan", 'error')
      }
    }
  }


  return (
    <>
      <CModal
        visible={showDetails}
        size={'lg'}
        onClose={() => resetModal()}
      >
        <CModalHeader style={Styles.ModalDetailTitle}>
          {detailsTitle}
        </CModalHeader>
        <CModalBody>
          <CRow className='mb-3' style={Styles.ModalDetailRows}>
            <CCol xs="6" md="6">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Member ID</label>
              <div style={Styles.ModalDetailText}>
                {details && details.id}
              </div>

            </CCol>
            <CCol xs="6" md="6">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Member Name</label>
              {/*<div style={Styles.ModalDetailText}>*/}
              {/*  {details && details.username}*/}
              {/*</div>*/}
              <CFormInput
                defaultValue={details && details.username}
                // onChange={(e) => setUsername(e.target.value)}
                type="text" id="editUsername"/>
            </CCol>
          </CRow>
          <CButton color="primary" onClick={() => {
            // submission(details.id)
          }}>Save changes</CButton>
        </CModalBody>
      </CModal>
      <CModal
        visible={showForgotPassword}
        size={'lg'}
        onClose={() => resetModal()}
      >
        <CModalHeader style={Styles.ModalDetailTitle}>
          {detailsTitle}
        </CModalHeader>
        <CModalBody>
          <CRow className='mb-3' style={Styles.ModalDetailRows}>
            <CCol xs="6" md="6">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Member ID</label>
              <div style={Styles.ModalDetailText}>
                {details && details.id}
              </div>

            </CCol>
            <CCol xs="6" md="6">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Member Email</label>
              {/*<div style={Styles.ModalDetailText}>*/}
              {/*  {details && details.username}*/}
              {/*</div>*/}
              <CFormInput
                defaultValue={details && details.email}
                onChange={(e) => setEmail(e.target.value)}
                type="text" id="editEmail"/>
            </CCol>
          </CRow>
          <CButton color="primary" onClick={() => {
            console.error(details.email)
            setEmail(details.email)
            console.error(email)
            submissionForgotPassword(details.email)
          }}>Save changes</CButton>
        </CModalBody>
      </CModal>
      <div style={Styles.cardHeader}>
        <div style={Styles.cardHeaderText}>Member</div>
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
            color={selectedStatus === "waiting-verification" ? 'danger' : 'secondary'}
            shape='pill'
            variant={selectedStatus === "waiting-verification" ? '' : "outline"}
            onClick={() => {
              setSelectedStatus("waiting-verification")
            }}
            className="m-2"
          >
            Waiting Verification
          </CButton>
          <CButton
            color={selectedStatus === "verified" ? 'danger' : 'secondary'}
            shape='pill'
            variant={selectedStatus === "verified" ? '' : "outline"}
            onClick={() => {
              setSelectedStatus("verified")
            }}
            className="m-2"
          >
            Verified
          </CButton>
          <CButton
            color={selectedStatus === "rejected" ? 'danger' : 'secondary'}
            shape='pill'
            variant={selectedStatus === "rejected" ? '' : "outline"}
            onClick={() => {
              setSelectedStatus("rejected")
            }}
            className="m-2"
          >
            Rejected
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
          // {
          //   name: 'Profession',
          //   selector: (row) => row.profession,
          //   sortable: true,
          // },
          {
            name: 'Approval Status',
            selector: (row) => approvalStatus(row),
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
              }}>

                {(row.approval_date || row.rejection_date) &&
                <CButton
                  onClick={() => {
                    history.push(`/member-detail/${row.id}`)
                  }}
                  style={{
                    ...Styles.tableBtn,
                    ...Styles.detailBtn,
                  }}>Detail</CButton>
                }

                {/*<CButton*/}
                {/*  onClick={() => {*/}
                {/*    history.push(`/member-update/${row.id}`)*/}
                {/*  }}*/}
                {/*  style={{*/}
                {/*    ...Styles.tableBtn,*/}
                {/*    ...Styles.detailBtn,*/}
                {/*  }}>Update</CButton>*/}

                {/*<CButton*/}

                {/*  onClick={() => {*/}
                {/*    setDetails(row)*/}
                {/*    setForgotPassword(true)*/}
                {/*    setDetailsTitle(`Update Detail: ${row}`)*/}
                {/*  }}*/}
                {/*  block*/}
                {/*  style={{*/}
                {/*    ...Styles.tableBtn,*/}
                {/*  }}*/}
                {/*>*/}
                {/*  Reset Password*/}
                {/*</CButton>*/}

                <CButton
                  onClick={() => {
                    deleteMember(row.id)
                  }}
                  style={{
                    ...Styles.tableBtn,
                    ...Styles.rejectBtn,
                  }}>
                  Delete
                </CButton>
                {

                  <>
                    {!row.approval_date && !row.rejection_date &&
                    <CButton
                      onClick={() => {
                        history.push(`/member-verification/${row.id}`)
                      }}
                      style={{
                        ...Styles.tableBtn,
                        ...Styles.verifiedBtn,
                      }}>Approve/Reject</CButton>

                    }
                  </>

                }


              </div>
            )
          }
        ]}

        data={members.filter((item) => {
          return (
            item.full_name.toLowerCase().includes(keyword.toLowerCase()) ||
            item.email.toLowerCase().includes(keyword.toLowerCase())
          )
        })}
        pagination
      />
    </>
  )
}

export default Member
