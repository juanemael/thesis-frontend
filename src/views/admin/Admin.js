import DataTable from 'react-data-table-component'
import {CButton, CCardFooter, CCol, CFormInput, CModal, CModalBody, CModalHeader, CRow} from '@coreui/react'
import Styles from '../../util/Styles'
import React, {useEffect, useState, useRef} from "react";
import {Link, useHistory, useLocation} from 'react-router-dom';
import AdminModels from '../../models/Admin'
import {Exception} from 'sass'
import swal from 'sweetalert';
import moment from "moment";
import {FaCheck, FaTimes} from "react-icons/fa";
import CIcon from "@coreui/icons-react";
import {cilCheck} from "@coreui/icons";
import Select, {components} from "react-select";
import {FaAngleDown} from "react-icons/all";


const Admin = () => {
  const history = useHistory();

  const [keyword, setKeyword] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [detailsTitle, setDetailsTitle] = useState(null)
  const [admin, setAdmin] = useState([])
  const [error, setError] = useState({});
  const [username, setUsername] = useState([])
  const [details, setDetails] = useState(null)
  const [selectedAdmin, setSelectedAdmin] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [role, setRole] = useState(null)

  const DropdownIndicator = props => {
    return (
      components.DropdownIndicator && (
        <components.DropdownIndicator {...props}>
          <FaAngleDown color={'grey'}/>
        </components.DropdownIndicator>
      )
    );
  };

  let adminModel = new AdminModels()
  const getAdmin = async () => {
    try {
      console.log("TES")
      let result = await adminModel.getAll()
      console.log(result)
      setUsername(result.username)
      setAdmin(result)
      console.log(admin.username)
    } catch (e) {

    }
  }

  const adminRolesSelection = [
    {
      label: "Admin",
      value: "ADMIN"
    },
    {
      label: "Bendahara",
      value: "BENDAHARA"
    },
    {
      label: "Keanggotaan",
      value: "KEANGGOTAAN"
    },
    {
      label: "Profesi",
      value: "PROFESI"
    },
  ]

  useEffect(() => {
    getAdmin()
  }, [])

  const deleteAdmin = async (id) => {
    const confirm = await swal({
      title: "",
      text: "Are you sure want delete this item?",
      icon: "warning",
      buttons: ["Cancel", "Yes"],
      dangerMode: true,
    });
    if (confirm) {
      try {

        let result = await adminModel.deleteAdmin(id);

        if (result.id || result.success) {
          swal('', "Delete Successfull", 'success')
            .then((value) => {
              getAdmin();
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

  const resetModal = () => {
    setDetails(null)
    setDetailsTitle(null)
    setShowDetails(false)
    setShowChangePassword(false)
  }

  const submission = async (id) => {
    setError(null)

    const body = {
      username: username,
      role: role.value
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
        console.log("TEST ID : " + id)
        console.log("TEST USERNAME : " + username)
        let result = await adminModel.updateAdmin(id, body)
        if (result.id || result.success) {
          swal('', "Data berhasil di simpan", 'success')
            .then((value) => {
              // history.push('/admin');
              getAdmin()
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

  const changePassword = async (id) => {
    setError(null)

    if (password !== confirmPassword) {
      swal({
        title: "",
        text: "Silahkan konfirmasi ulang password baru",
        icon: "warning",
        dangerMode: true,
      });
      return
    }

    const body = {
      new_password: password
    }

    const submitConfirm = await swal({
      title: "",
      text: "Apakah anda yakin ingin mengganti password admin ini?",
      icon: "warning",
      buttons: ["Batal", "Ya, Simpan"],
      dangerMode: true,
    });

    if (submitConfirm) {
      try {

        let result = await adminModel.changePassword(id, body)
        if (result.success) {
          setShowChangePassword(false)
          swal('', "Password berhasil diganti", 'success')
            .then((value) => {
              // history.push('/admin');
              getAdmin()
            });
        } else {
          swal('', "Password gagal diganti", 'error')
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
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Admin ID</label>
              <div style={Styles.ModalDetailText}>
                {details && details.id}
              </div>

            </CCol>
            <CCol xs="6" md="6">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Admin Username</label>
              {/*<div style={Styles.ModalDetailText}>*/}
              {/*  {details && details.username}*/}
              {/*</div>*/}
              <CFormInput
                defaultValue={details && details.username}
                onChange={(e) => setUsername(e.target.value)}
                type="text" id="editUsername"/>
            </CCol>
          </CRow>
          <CRow className='mb-3' style={Styles.ModalDetailRows}>
            <Select
              onChange={async (option) => {
                setRole(option)
              }}
              value={role}
              options={adminRolesSelection}
              styles={{
                option: (provided, state) => ({
                  ...provided,
                  cursor: 'pointer',
                }),
                control: provided => ({
                  ...provided,
                  borderColor: '#e6e6e6',
                  fontFamily: 'Open Sans',
                  fontWeight: '600',
                  fontSize: 14,
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center'
                })
              }}
              placeholder={'Select...'}
              components={{DropdownIndicator, IndicatorSeparator: () => null}}
            />
          </CRow>
          <CButton color="primary" onClick={() => {
            submission(details.id)
          }}>Save changes</CButton>
        </CModalBody>
      </CModal>

      {/*<CModal*/}
      {/*  visible={showChangePassword}*/}
      {/*  size={'lg'}*/}
      {/*  onClose={() => resetModal()}*/}
      {/*>*/}
      {/*  <CModalHeader style={Styles.ModalDetailTitle}>*/}
      {/*    {detailsTitle}*/}
      {/*  </CModalHeader>*/}
      {/*  <CModalBody>*/}
      {/*    <CRow className='mb-3' style={Styles.ModalDetailRows}>*/}
      {/*      <CCol xs="6" md="6">*/}
      {/*        <label style={Styles.ModalDetailLabel} htmlFor="label-input">Admin ID</label>*/}
      {/*        <div style={Styles.ModalDetailText}>*/}
      {/*          {details && details.id}*/}
      {/*        </div>*/}

      {/*      </CCol>*/}
      {/*      <CCol xs="6" md="6">*/}
      {/*        <label style={Styles.ModalDetailLabel} htmlFor="label-input">Admin Username</label>*/}
      {/*        /!*<div style={Styles.ModalDetailText}>*!/*/}
      {/*        /!*  {details && details.username}*!/*/}
      {/*        /!*</div>*!/*/}
      {/*        <CFormInput*/}
      {/*          defaultValue={details && details.username}*/}
      {/*          onChange={(e) => setUsername(e.target.value)}*/}
      {/*          type="text" id="editUsername" />*/}
      {/*      </CCol>*/}
      {/*    </CRow>*/}
      {/*    <CButton color="primary" onClick={()=>{*/}
      {/*      submission(details.id)*/}
      {/*    }}>Save changes</CButton>*/}
      {/*  </CModalBody>*/}
      {/*</CModal>*/}

      <CModal
        visible={showChangePassword}
        size={'lg'}
        onClose={() => resetModal()}
      >
        <CModalHeader style={Styles.ModalDetailTitle}>
          {detailsTitle}
        </CModalHeader>
        <CModalBody>
          <CRow className='mb-3' style={Styles.ModalDetailRows}>
            <CCol xs="6" md="6">
              <label style={Styles.ModalDetailLabel} htmlFor="label-input">Admin ID</label>
              <div style={Styles.ModalDetailText}>
                {details && details.id}
              </div>
            </CCol>
            <CRow className='mb-3' style={Styles.ModalDetailRows}>
              <CCol xs="6" md="6">
                <label style={Styles.ModalDetailLabel} htmlFor="label-input">New Password</label>
                <CFormInput
                  onChange={(e) => setPassword(e.target.value)}
                  type="password" id="editPassword" placeholder="Enter new Password.."/>
              </CCol>
              <CCol xs="6" md="6">
                <label style={Styles.ModalDetailLabel} htmlFor="label-input">Confirm New Password</label>
                <CFormInput
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password" id="confirmPassword" placeholder="Confirm new Password.."/>
              </CCol>
            </CRow>

          </CRow>

          <CButton color="primary" onClick={() => {
            changePassword(details.id)
          }}>Save changes</CButton>
        </CModalBody>
      </CModal>
      <div style={Styles.cardHeader}>
        <div style={Styles.cardHeaderText}>Admin</div>
        <div style={Styles.searchTableText}>Search</div>
        <CFormInput
          name={'searchAdminQuery'}
          autoComplete={"off"}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter Keyword" style={Styles.searchTableInput}/>
      </div>
      <div style={{...Styles.cardHeaderAction}}>
        <CButton onClick={() => {
          history.push('/admin/create')
        }} style={{...Styles.cardHeaderActionButton}}>
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
            name: 'Username',
            selector: (row) => row.username,
            sortable: true,
          },
          {
            name: 'Role',
            selector: (row) => row.role,
            sortable: true,
          },
          {
            name: 'Created At',
            selector: (row) => moment(row.created_at).format("DD MMM YYYY HH:mm"),
            sortable: true,
          },
          {
            name: '',
            width: '40%',
            selector: (row) => (
              <div style={{display: 'inline-block'}}>
                <>
                  <CButton
                    // onClick={() => {
                    //   setDetails(row)
                    //   setShowDetails(true)
                    //   setDetailsTitle(`Detail Cardiologist : ${row.full_name}`)
                    // }}

                    onClick={() => {
                      setDetails(row)
                      setShowDetails(true)
                      setDetailsTitle(`Update Detail: ${row.username}`)

                      // history.push(`/admin/update/${row.id}`)
                    }}
                    block
                    style={{
                      ...Styles.tableBtn2,
                    }}
                  >
                    Update
                  </CButton>

                  {/*<CButton*/}
                  {/*  onClick={() => { deleteAdmin(row.id) }}*/}
                  {/*  style={{*/}
                  {/*    ...Styles.tableBtn2,*/}
                  {/*    ...Styles.rejectBtn,*/}
                  {/*    ...Styles.ml10,*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  Change Password*/}
                  {/*</CButton>*/}

                  <CButton
                    onClick={() => {
                      deleteAdmin(row.id)
                    }}
                    style={{
                      ...Styles.tableBtn2,
                      ...Styles.rejectBtn,
                      ...Styles.ml10,
                    }}
                  >
                    Delete
                  </CButton>
                  <CButton
                    // onClick={() => {
                    //   setDetails(row)
                    //   setShowDetails(true)
                    //   setDetailsTitle(`Detail Cardiologist : ${row.full_name}`)
                    // }}
                    kdarER
                    onClick={() => {
                      setShowChangePassword(true)
                      setDetails(row)
                      setDetailsTitle(`Change Password: ${row.username}`)

                      // history.push(`/admin/update/${row.id}`)
                    }}
                    block
                    style={{
                      ...Styles.tableBtn2,
                      ...Styles.rejectBtn,
                      ...Styles.ml10,
                    }}
                  >
                    Change Password
                  </CButton>
                </>
              </div>
            ),
          },
        ]}
        data={admin.filter((item) => {
          return item.username.toLowerCase().includes(keyword.toLowerCase())
        })}
        pagination
      />
    </>
  )
}

export default Admin
