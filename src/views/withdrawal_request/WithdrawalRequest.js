import DataTable from 'react-data-table-component'
import {
  CButton, CFormInput, CModal,
  CModalHeader, CModalTitle,
  CModalBody, CModalFooter,
} from '@coreui/react'
import Styles from '../../util/Styles'
import React, {useEffect, useState, useRef} from "react";
import {Link, useParams, useHistory} from "react-router-dom";
import WithdrawalRequestModel from '../../models/WithdrawalRequest'
// import ImagePopUp from '../../reusable/ImagePopup'
import {Exception} from 'sass'
import swal from 'sweetalert';
import {FaCheck, FaTimes} from "react-icons/fa";

const WithdrawalRequest = () => {
  const [topups, setTopUps] = useState([])
  const [showImage, setShowImage] = useState(false)
  const [showImageUrl, setShowImageUrl] = useState(null)
  const inputFile = useRef(null)
  const [showWithdrawalApprovalModal, setShowWithdrawalApprovalModal] = useState(false);
  const [withdrawalPaymentProofUrl, setWithdrawalPaymentProofUrl] = useState(null);
  let withdrawalRequestModel = new WithdrawalRequestModel()
  const [selectedWithdrawalRequestId, setSelectedWithdrawalRequestId] = useState(null);
  const [showWithdrawalDenialModal, setShowWithdrawalDenialModal] = useState(null);
  const [keyword, setKeyword] = useState("");

  const getWithdrawalRequestList = async () => {

    try {
      let result = await withdrawalRequestModel.getAll()

      console.log('result', result)

      setTopUps(result)
    } catch (e) {
    }

  }
  // const approve = async (id) => {
  //   const submitConfirm = await swal({
  //     title: "",
  //     text: "Are you sure approve this item?",
  //     icon: "warning",
  //     buttons: ["Cancel", "Yes"],
  //     dangerMode: true,
  //   });
  //   if (submitConfirm) {
  //     try {
  //       const result = await topupModel.approve(id)
  //       if (result.id || result.success) {
  //         swal('', "Approve Success", 'success')
  //           .then((value) => {
  //             getWithdrawalRequestList();
  //           });
  //       } else {
  //         swal('', "Failed to Approv", 'error')
  //         return
  //       }
  //     } catch (e) {
  //       swal('', "Something Wrong", 'error')
  //     }
  //   }
  // }

  useEffect(() => {
    getWithdrawalRequestList()
  }, [])

  return (
    <>
      {/* <ImagePopUp
                showImage={showImage}
                toogleShow={showImage => setShowImage(false)}
            ></ImagePopUp> */}
      <input type='file' ref={inputFile} accept={'image/*'}
             onChange={async (e) => {
               try {
                 const response = await withdrawalRequestModel.uploadImage(e.target.files[0]);

                 setShowWithdrawalApprovalModal(true)
                 setWithdrawalPaymentProofUrl(response.location)
               } catch (e) {
                 console.log(e)
               }
             }}
             style={{display: 'none'}}/>

      <CModal
        visible={showWithdrawalDenialModal}
        size={'md'}
        onClose={() => showWithdrawalDenialModal(false)}
      >
        <CModalHeader>
          Deny Withdrawal Request Confirmation
        </CModalHeader>
        <CModalBody>
          Are you sure you want to deny this withdrawal request?
        </CModalBody>

        <CModalFooter>
          <CButton
            onClick={async () => {
              try {
                const response = await withdrawalRequestModel.update(selectedWithdrawalRequestId, {
                  status: 'DENIED'
                })

                swal("Withdrawal request has been denied successfully!", '', 'success')

                setShowWithdrawalApprovalModal(false)
                getWithdrawalRequestList()
                console.log(response)
              } catch (e) {
                console.log(e)
              }
            }}
            style={{
              ...Styles.tableBtn,
              ...Styles.rejectBtn,
            }}
          >
            Deny
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={showWithdrawalApprovalModal}
        size={'md'}
        onClose={() => setShowImage(false)}
      >
        <CModalHeader>
          Payment Proof
        </CModalHeader>
        <CModalBody>
          <img className={'img-fluid mx-auto d-block'} src={withdrawalPaymentProofUrl}/>
        </CModalBody>

        <CModalFooter>
          <CButton
            onClick={async () => {
              try {
                const response = await withdrawalRequestModel.update(selectedWithdrawalRequestId, {
                  status: 'GRANTED',
                  payment_proof: withdrawalPaymentProofUrl
                })

                swal("Withdrawal request has been approved successfully!", '', 'success')

                setShowWithdrawalApprovalModal(false)
                getWithdrawalRequestList()
                console.log(response)
              } catch (e) {
                console.log(e)
              }
            }}
            style={{
              ...Styles.tableBtn,
              ...Styles.approveBtn,
            }}
          >
            Approve
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={showImage}
        size={'md'}
        onClose={() => setShowImage(false)}
      >
        <CModalHeader>

        </CModalHeader>
        <CModalBody>
          <img className={'img-fluid mx-auto d-block'} src={showImageUrl}/>
        </CModalBody>
      </CModal>
      <div style={Styles.cardHeader}>
        <div style={Styles.cardHeaderText}>Withdrawal Request</div>
        <div style={Styles.searchTableText}>Search</div>
        <CFormInput placeholder="Enter Keyword"
                    onChange={(e) => setKeyword(e.target.value)}
                    style={Styles.searchTableInput}/>
      </div>
      <DataTable
        responsive
        customStyles={Styles.dataTable}
        columns={[
          {
            name: 'Cardiologist',
            selector: (row) => {
              return row.cardiologist_name
            },
            sortable: true,
            width: '30%'
          },
          {
            name: 'Amount',
            selector: (row) => row.requested_amount,
            sortable: true,
            width: '20%'
          },
          {
            name: 'Attachment',
            selector: (row) => {
              if (!row.payment_proof) {
                return <div>-</div>
              }

              return (
                <CButton onClick={() => {
                  setShowImage(!showImage)
                  setShowImageUrl(row.payment_proof)
                }} style={{...Styles.buttonLink}} color="link">View Attachment</CButton>
              )
            },
            width: '15%',
            center: true
          },
          {
            name: 'Approved',
            selector: (row) => row.status === 'GRANTED' ?
              <FaCheck style={{...Styles.successIcon}}></FaCheck> : row.status === 'DENIED' ?
                <FaTimes style={{...Styles.errorIcon}}></FaTimes> : <div>-</div>,
            width: '10%'
          },
          {
            name: '',
            selector: (row) => (
              <div>

                {!row.status ?
                  <>
                    <CButton
                      onClick={() => {
                        setSelectedWithdrawalRequestId(row.id)
                        inputFile.current.click()
                      }}
                      style={{
                        ...Styles.tableBtn,
                        ...Styles.approveBtn,
                      }}
                    >
                      Approve
                    </CButton>

                    <CButton
                      onClick={() => {
                        setSelectedWithdrawalRequestId(row.id)
                        setShowWithdrawalDenialModal(true)
                      }}
                      style={{
                        ...Styles.tableBtn,
                        ...Styles.rejectBtn,
                        marginLeft: 10
                      }}
                    >
                      Deny
                    </CButton>
                  </>
                  : ''
                }

              </div>
            ),
          },
        ]}
        data={topups.filter((item) => {
          return item.cardiologist_name.toLowerCase().includes(keyword.toLowerCase())
        })}
        pagination
      />
    </>
  )
}

export default WithdrawalRequest
