import React, { useEffect, useState } from 'react'

import { Dialog, Slide, DialogActions } from '@material-ui/core'

import { Col, Container, ModalBody, ModalTitle, Row } from 'react-bootstrap'
import CustomButton from '../CustomButton'
import ModalHeader from 'react-bootstrap/ModalHeader'
import Collapse from '@material-ui/core/Collapse'
import Alert from '@material-ui/lab/Alert'
import IconButton from '@material-ui/core/IconButton'

import { FaTimes } from 'react-icons/all'
import LagFreeTextEditor from '../LagFreeTextEditor'
import Participation from '../../../models/Participation'
import MemberCourse from '../../../models/MemberCourse'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function EditSurveyModal(props) {
  let [predicate, setPredicate] = useState('')
  let [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (props.participant) {
      let currentParticipant = props.participant

      setPredicate(currentParticipant.predicate)
    }
  }, [props.participant])

  const onClose = (refresh) => {
    setPredicate('')
    props.onClose(refresh)
  }

  const onSubmit = async () => {
    try {
      if (props.privateClass) {
        let memberCourseModel = new MemberCourse()

        await memberCourseModel.changePredicate(props.participant?.id, predicate)
      } else {
        let participantModel = new Participation()
        console.log('sending predicate')
        await participantModel.updatePredicate(props.participant?.id, predicate)
      }

      onClose(true)
    } catch (e) {
      if (e.msg) {
        return setErrorMessage(e.msg)
      }
      console.log(e)
      setErrorMessage('Terjadi Kesalahan')
    }
  }

  const renderAlertBox = () => {
    return (
      <div
        style={{
          marginBottom: '1em',
        }}
      >
        <Collapse in={errorMessage.length > 0}>
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setErrorMessage('')
                }}
              >
                <FaTimes fontSize="inherit" />
              </IconButton>
            }
          >
            {errorMessage}
          </Alert>
        </Collapse>
      </div>
    )
  }

  const renderModalFooter = () => {
    return (
      <DialogActions>
        <CustomButton
          color="primary"
          onClick={() => {
            onClose()
          }}
        >
          Batal
        </CustomButton>
        <CustomButton
          color="primary"
          disabled={false}
          onClick={() => {
            onSubmit()
          }}
        >
          Simpan
        </CustomButton>
      </DialogActions>
    )
  }

  const renderContent = () => {
    return (
      <>
        <Row
          style={{
            fontSize: '0.9em',
          }}
        >
          <Col md={12}>Predikat</Col>
        </Row>
        <Row>
          <Col md={12}>
            <LagFreeTextEditor
              fullWidth
              inputProps={{
                style: {
                  fontFamily: 'Montserrat',
                },
              }}
              value={predicate}
              placeholder={'Predikat'}
              changeValue={(value) => setPredicate(value)}
            />
          </Col>
        </Row>
      </>
    )
  }

  return (
    <Dialog
      open={props.show}
      maxWidth="sm"
      fullWidth={true}
      onClose={() => onClose()}
      TransitionComponent={Transition}
    >
      <>
        <ModalHeader>
          <ModalTitle onClose={() => onClose()}>
            <span
              style={{
                fontWeight: 'bold',
              }}
            >
              Ubah Predikat
            </span>
          </ModalTitle>
        </ModalHeader>

        <ModalBody>
          <Container>
            {renderAlertBox()}

            {renderContent()}
          </Container>
        </ModalBody>
        {renderModalFooter()}
      </>
    </Dialog>
  )
}
