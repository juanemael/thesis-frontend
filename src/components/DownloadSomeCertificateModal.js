import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import { Col, Row } from 'react-bootstrap'
import Palette from '../util/Palette'
import Collapse from '@material-ui/core/Collapse/Collapse'
import Alert from '@material-ui/lab/Alert/Alert'
import IconButton from '@material-ui/core/IconButton'
import { FaTimes } from 'react-icons/fa'
import CustomButton from './CustomButton'
import React, { useEffect, useState } from 'react'
import MobTable from './table/MobTable'
import Checkbox from '@material-ui/core/Checkbox'
import DialogActions from '@material-ui/core/DialogActions'
import CircularProgress from '@material-ui/core/CircularProgress'
import JSZip from 'jszip'

export default function DownloadSomeCertificateModal(props) {
  const [errorMsg, setErrorMsg] = useState('')

  const [checkedParticipant, setCheckedParticipant] = useState([])

  let { participants, isOpen, onClose, classCode } = props
  participants = participants.map((participant) => {
    if (!participant.member) {
      return {
        ...participant,
        member: {
          full_name: participant.full_name,
          email: participant.email,
        },
      }
    }

    return participant
  })

  const [newPrice, setNewPrice] = useState(0)

  const [isDownloadingAll, setIsDownloadingAll] = useState(false)
  const [isDownloadingSome, setIsDownloadingSome] = useState(false)

  const [totalToDownload, setTotalToDownload] = useState(0)
  const [totalDownloaded, setTotalDownloaded] = useState(0)

  const downloadAllCertificateZipNew = async () => {
    let zip = new JSZip()

    let totalDownloaded = 0

    setIsDownloadingAll(true)

    setTotalDownloaded(0)
    setTotalToDownload(participants.length)

    let classCode = ''

    try {
      for (let p of participants) {
        if (p.class_code) {
          classCode = p.class_code
        } else {
          classCode = props.classCode
        }

        let response = await fetch(p.certificate_url)
        let myBlob = await response.blob()

        let objectURL = URL.createObjectURL(myBlob)
        console.log('success', myBlob)

        zip.file(classCode + '-' + p.id + '.pdf', myBlob)

        totalDownloaded += 1
        setTotalDownloaded(totalDownloaded)
      }

      zip
        .generateAsync({
          type: 'blob',
        })
        .then(function (blob) {
          const url = window.URL.createObjectURL(new Blob([blob]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', classCode + `.zip`)

          // Append to html link element page
          document.body.appendChild(link)

          // Start download
          link.click()
        })
    } catch (e) {
      alert('Terjadi kesalahan, harap hubungi developer')
    }

    setTotalToDownload(0)
    setTotalDownloaded(0)
    setIsDownloadingAll(false)
  }

  const downloadSomeCertificateZipNew = async () => {
    let zip = new JSZip()

    let totalDownloaded = 0

    setIsDownloadingSome(true)

    setTotalDownloaded(0)
    setTotalToDownload(checkedParticipant.length)

    let classCode = ''

    try {
      for (let p of participants) {
        if (checkedParticipant.includes(p.id)) {
          if (p.class_code) {
            classCode = p.class_code
          } else {
            classCode = props.classCode
          }

          let response = await fetch(p.certificate_url)
          let myBlob = await response.blob()

          let objectURL = URL.createObjectURL(myBlob)
          console.log('success', myBlob)

          zip.file(classCode + '-' + p.id + '.pdf', myBlob)

          totalDownloaded += 1
          setTotalDownloaded(totalDownloaded)
        }
      }

      zip
        .generateAsync({
          type: 'blob',
        })
        .then(function (blob) {
          const url = window.URL.createObjectURL(new Blob([blob]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', classCode + `.zip`)

          // Append to html link element page
          document.body.appendChild(link)

          // Start download
          link.click()
        })
    } catch (e) {
      alert('Terjadi kesalahan, harap hubungi developer')
    }

    setTotalToDownload(0)
    setTotalDownloaded(0)
    setIsDownloadingSome(false)
  }

  useEffect(() => {
    setCheckedParticipant([])
  }, [isOpen])

  let columns = [
    {
      Header: (
        <>
          <Checkbox
            checked={checkedParticipant.length === participants.length}
            onChange={() => {
              if (participants.length === checkedParticipant.length) {
                setCheckedParticipant([])
              } else {
                let temp = participants.map((obj) => obj.id)
                setCheckedParticipant(temp)
              }
            }}
          />
        </>
      ),
      accessor: 'code',
      Cell: (cellInfo) => {
        let id = cellInfo.row.values.id
        return (
          <Checkbox
            onChange={(value) => {
              let temp = [...checkedParticipant]

              if (checkedParticipant.includes(id)) {
                let index = checkedParticipant.findIndex((obj) => obj === id)

                if (index >= 0) {
                  temp.splice(index, 1)
                }
              } else {
                temp.push(id)
              }
              setCheckedParticipant(temp)
            }}
            checked={checkedParticipant.includes(id)}
          />
        )
      },
      filterable: false,
      disableFilters: true,
      disableSortBy: true,
    },
    {
      Header: 'ID Registrasi',
      accessor: 'id',
    },
    {
      Header: 'Nama Lengkap',
      accessor: 'full_name_sorter',
      Cell: (cellInfo) => {
        let rowInfo = cellInfo.row.values
        let member = rowInfo['member']

        return <>{member.full_name}</>
      },
    },
    {
      Header: 'Email',
      accessor: 'member',
      Cell: (cellInfo) => {
        let rowInfo = cellInfo.row.values
        let member = rowInfo['member']

        return <>{member.email}</>
      },
    },
    {
      Header: 'Predikat',
      accessor: 'predicate',
      Cell: (cellInfo) => {
        let rowInfo = cellInfo.row.values

        let predicate = rowInfo['predicate']

        return <>{predicate}</>
      },
    },
    {
      Header: 'Status Sertifikat',
      accessor: 'certificate_url',
      Cell: (cellInfo) => {
        let rowInfo = cellInfo.row.values

        let certificateUrl = rowInfo['certificate_url']

        return (
          <p style={{ color: certificateUrl ? 'LimeGreen' : 'Red' }}>
            {certificateUrl ? 'Terkirim' : 'Belum Dibuat'}
          </p>
        )
      },
    },
  ]

  return (
    <>
      <Dialog open={props.isOpen} maxWidth="md" fullWidth={true}>
        <>
          <DialogTitle onClose={() => onClose()}>
            <Row>
              <Col
                style={{
                  // fontWeight: "bold",
                  display: 'flex',
                  alignItems: 'center',
                  color: Palette.PRIMARY,
                }}
              >
                Unduh Sertifikat
              </Col>
              <IconButton
                onClick={() => {
                  onClose()
                }}
              >
                <FaTimes size={'0.8em'} />
              </IconButton>
            </Row>
            <hr />
          </DialogTitle>
          <DialogContent>
            <Collapse
              in={errorMsg.length > 0}
              style={{ marginBottom: errorMsg.length > 0 ? '1.5em' : '0em' }}
            >
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setErrorMsg('')
                    }}
                  >
                    <FaTimes fontSize="inherit" />
                  </IconButton>
                }
              >
                {errorMsg}
              </Alert>
            </Collapse>

            <MobTable columns={columns} data={participants} />
          </DialogContent>
          <DialogActions>
            <Row>
              <Col
                md={12}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                }}
              >
                <div>
                  <CustomButton
                    disabled={isDownloadingAll || isDownloadingSome}
                    onClick={() => {
                      // downloadAllCertificatesZip()
                      downloadAllCertificateZipNew()
                    }}
                    style={{ marginRight: 10, marginLeft: 10 }}
                    disableElevation
                    color={'primary'}
                    variant={'contained'}
                  >
                    &nbsp;Unduh Semua&nbsp;
                    {isDownloadingAll && (
                      <>
                        {totalDownloaded}/{totalToDownload}
                        &nbsp;
                        <CircularProgress color={'inherit'} size={'1em'} />
                      </>
                    )}
                  </CustomButton>
                </div>
                <div>
                  <CustomButton
                    disabled={
                      checkedParticipant.length === 0 || isDownloadingAll || isDownloadingSome
                    }
                    onClick={() => {
                      // downloadSomeCertificate()
                      downloadSomeCertificateZipNew()
                    }}
                    style={{ marginRight: 10, marginLeft: 10 }}
                    disableElevation
                    color={'primary'}
                    variant={'contained'}
                  >
                    &nbsp; Unduh Terpilih
                    {checkedParticipant.length > 0 ? `(${checkedParticipant.length})` : ''}&nbsp;
                    {isDownloadingSome && (
                      <>
                        {totalDownloaded}/{totalToDownload}
                        &nbsp;
                        <CircularProgress color={'inherit'} size={'1em'} />
                      </>
                    )}
                  </CustomButton>
                </div>
              </Col>
            </Row>
          </DialogActions>
          {/*{renderModalFooter()}*/}
        </>
      </Dialog>
    </>
  )
}
