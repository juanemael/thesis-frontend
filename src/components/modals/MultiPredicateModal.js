import React, { useEffect, useState } from 'react'

import { Dialog, Slide, DialogActions } from '@material-ui/core'

import { Col, Container, ModalBody, ModalTitle, Row } from 'react-bootstrap'
import CustomButton from '../CustomButton'
import ModalHeader from 'react-bootstrap/ModalHeader'
import Collapse from '@material-ui/core/Collapse'
import Alert from '@material-ui/lab/Alert'
import IconButton from '@material-ui/core/IconButton'

import { FaTimes } from 'react-icons/all'
import Participation from '../../../models/Participation'
import Radio from '@material-ui/core/Radio'
import MemberCourse from '../../../models/MemberCourse'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function MultiPredicateModal(props) {
  let [errorMessage, setErrorMessage] = useState('')
  let [participations, setParticipations] = useState([])

  useEffect(() => {
    console.log('triggered', props.participations)
    if (props.participations) {
      setParticipations(props.participations)
    }
  }, [props.show])

  const onClose = (refresh) => {
    props.onClose(refresh)
  }

  const onSubmit = async () => {
    try {
      let participantModel = new Participation()
      let memberCourseModel = new MemberCourse()
      console.log('sending predicate')

      let defaultPredicates = ['Terbatas', 'Menengah', 'Istimewa']

      for (let i of defaultPredicates) {
        let selectedParticipant = []

        for (let p of participations) {
          if (p.predicate === i) {
            selectedParticipant.push(p.id)
          }
        }

        if (selectedParticipant.length > 0) {
          if (props.privateClass) {
            await memberCourseModel.updatePredicates(selectedParticipant, i)
          } else {
            await participantModel.updatePredicates(selectedParticipant, i)
          }
        }
      }

      onClose(true)
    } catch (e) {
      if (e.msg) {
        return setErrorMessage(JSON.stringify(e.msg))
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

  const changeAll = (predicate) => {
    setParticipations(
      participations.map((obj) => {
        return {
          ...obj,
          predicate: predicate,
        }
      }),
    )
  }

  const changeOne = (idx, predicate) => {
    let temp = [...participations]
    temp[idx] = {
      ...temp[idx],
      predicate: predicate,
    }
    setParticipations(temp)
  }

  const renderContent = () => {
    let isAllTerbatas = true
    let isAllMenengah = true
    let isAllIstimewa = true

    for (let p of participations) {
      if (p.predicate !== 'Terbatas') {
        isAllTerbatas = false
      }
      if (p.predicate !== 'Menengah') {
        isAllMenengah = false
      }
      if (p.predicate !== 'Istimewa') {
        isAllIstimewa = false
      }
    }

    return (
      <>
        <Row
          style={{
            fontSize: '1em',
          }}
        >
          <Col md={6} />
          <Col
            md={2}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Radio
              checked={isAllTerbatas}
              onChange={() => {
                changeAll('Terbatas')
              }}
            />
          </Col>
          <Col
            md={2}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Radio
              checked={isAllMenengah}
              onChange={() => {
                changeAll('Menengah')
              }}
            />
          </Col>
          <Col
            md={2}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Radio
              checked={isAllIstimewa}
              onChange={() => {
                changeAll('Istimewa')
              }}
            />
          </Col>
        </Row>

        <Row
          style={{
            fontSize: '1em',
            marginBottom: '0.5em',
          }}
        >
          <Col md={6}>
            <b>Nama Lengkap</b>
          </Col>
          <Col md={2}>
            <b>Terbatas</b>
          </Col>
          <Col md={2}>
            <b>Menengah</b>
          </Col>
          <Col md={2}>
            <b>Istimewa</b>
          </Col>
        </Row>
        <Row
          style={{
            marginTop: '0.2em',
            marginBottom: '0.2em',
          }}
        >
          {participations.map((obj, idx) => {
            return (
              <>
                <Col md={6}>{props.privateClass ? obj.full_name : obj?.member?.full_name}</Col>
                <Col
                  md={2}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Radio
                    onChange={() => changeOne(idx, 'Terbatas')}
                    checked={obj.predicate === 'Terbatas'}
                  />
                </Col>
                <Col
                  md={2}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Radio
                    onChange={() => changeOne(idx, 'Menengah')}
                    checked={obj.predicate === 'Menengah'}
                  />
                </Col>
                <Col
                  md={2}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Radio
                    onChange={() => changeOne(idx, 'Istimewa')}
                    checked={obj.predicate === 'Istimewa'}
                  />
                </Col>
              </>
            )
          })}
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
