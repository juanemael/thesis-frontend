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

} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilCheck,
} from '@coreui/icons'

import Styles from "../../util/Styles";
import PropTypes from "prop-types";
import moment from "moment"

const TransactionDetailModal = (props) => {

  const {visible, close, details} = props

  const onClose = () => {
    close()
  }

  return <CModal
    visible={visible}
    size={'lg'}
    onClose={() => onClose()}
  >
    <CModalHeader style={Styles.ModalDetailTitle}>
      Transaction Info
    </CModalHeader>
    <CModalBody>
      <CRow className='mb-3' style={Styles.ModalDetailRows}>
        <CCol xs="12" md="6">
          <label style={Styles.ModalDetailLabel} htmlFor="label-input">Transaction ID</label>
          <div style={Styles.ModalDetailText}>
            {details && details.id}
          </div>
        </CCol>
        <CCol xs="12" md="6">
          <label style={Styles.ModalDetailLabel} htmlFor="label-input">Midtrans Order ID</label>
          <div style={Styles.ModalDetailText}>
            {details && details.order_id}
          </div>
        </CCol>
        <CCol xs="12" md="6">
          <label style={Styles.ModalDetailLabel} htmlFor="label-input">Payment Status</label>
          <div style={Styles.ModalDetailText}>
            {details && details?.paid_status}
          </div>
        </CCol>
        <CCol xs="12" md="6">
          <label style={Styles.ModalDetailLabel} htmlFor="label-input">Created At</label>
          <div style={Styles.ModalDetailText}>
            {details && new moment(details?.created_at).format("DD MMM YYYY HH:mm")}

          </div>
        </CCol>
        <CCol xs="12" md="6">
          <label style={Styles.ModalDetailLabel} htmlFor="label-input">Should Expired At</label>
          <div style={Styles.ModalDetailText}>
            {details && new moment(details?.should_expire_at).format("DD MMM YYYY HH:mm")}
          </div>
        </CCol>
        <CCol xs="12" md="6">
          <label style={Styles.ModalDetailLabel} htmlFor="label-input">Paid At</label>
          <div style={Styles.ModalDetailText}>
            {details && (details.paid_at ? new moment(details?.paid_at).format("DD MMM YYYY HH:mm") : "-")}
          </div>
        </CCol>
        <CCol xs="12" md="12">
          <label style={Styles.ModalDetailLabel} htmlFor="label-input">URL Midtrans</label>
          <div style={Styles.ModalDetailText}>
            {details && details?.snap_payment_url}
          </div>
        </CCol>
      </CRow>

      <hr/>

      <CRow className='mb-3'>
        <CCol xs="12" md="6">
          <label style={Styles.ModalDetailLabel} htmlFor="label-input">Membership Start Date</label>
          <div style={Styles.ModalDetailText}>
            {details && new moment(details?.membership?.valid_from).format("DD MMM YYYY")}
          </div>
        </CCol>
        <CCol xs="12" md="6">
          <label style={Styles.ModalDetailLabel} htmlFor="label-input">Membership End Date</label>
          <div style={Styles.ModalDetailText}>
            {details && new moment(details?.membership?.valid_until).format("DD MMM YYYY")}
          </div>
        </CCol>
      </CRow>

      <hr/>

      <CRow className='mb-3'>
        <CCol xs="12" md="6">
          <label style={Styles.ModalDetailLabel} htmlFor="label-input">Member ID</label>
          <div style={Styles.ModalDetailText}>
            {details && details?.member?.id}
          </div>
        </CCol>
        <CCol xs="12" md="6">
          <label style={Styles.ModalDetailLabel} htmlFor="label-input">Email</label>
          <div style={Styles.ModalDetailText}>
            {details && details?.member?.email}
          </div>
        </CCol>
      </CRow>

      <CRow className='mb-3'>
        <CCol xs="12" md="6">
          <label style={Styles.ModalDetailLabel} htmlFor="label-input">Member Name</label>
          <div style={Styles.ModalDetailText}>
            {details && details?.full_name}
          </div>
        </CCol>
      </CRow>
    </CModalBody>

    <CCardFooter>
      <CButton
        type="submit"
        size="sm"
        color="primary"
        className="float-right"
        onClick={() => {
          close()
        }}
      >
        Close
      </CButton>
    </CCardFooter>

  </CModal>

}

TransactionDetailModal.propTypes = {
  visible: PropTypes.bool,
  close: PropTypes.func,
  detail : PropTypes.object
}

export default TransactionDetailModal
