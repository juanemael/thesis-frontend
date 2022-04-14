import {Dialog, DialogContent, DialogTitle} from "@material-ui/core";
import {Col, Row} from "react-bootstrap";
import Palette from "../../util/Palette";
import Collapse from "@material-ui/core/Collapse/Collapse";
import Alert from "@material-ui/lab/Alert/Alert";
import IconButton from "@material-ui/core/IconButton";
import {FaSave, FaTimes} from "react-icons/fa";
import React, {useEffect, useState} from "react";
import Class from "../../models/Class";
import LagFreeTextEditor from "../LagFreeTextEditor";
import CustomButton from "../CustomButton";

import Activity from "../../models/Activity"

export default function InviteUserModal(props) {

  const {activityId} = props

  const [errorMsg, setErrorMsg] = useState('');

  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")

  const inviteUser = async () => {
    try{

      let activityModel = new Activity()

      let result = await activityModel.inviteOneMemberToClass(activityId, email, fullName)
      console.log(result)

      props.onClose()
    }catch(e){
      setErrorMsg(JSON.stringify(e))
      console.log(e)
    }

  }

  return <Dialog
    open={props.isOpen}
    maxWidth="sm"
    fullWidth={true}
  >
    <>
      <DialogTitle onClose={() => this.onClose()}>
        <Row>
          <Col style={{
            display: 'flex',
            alignItems: 'center',
            color: Palette.PRIMARY
          }}>
            Undang Peserta
          </Col>
        </Row>
        <hr/>
      </DialogTitle>
      <DialogContent>
        <Collapse
          in={errorMsg.length > 0}
          style={{marginBottom: errorMsg.length > 0 ? '1.5em' : '0em'}}
        >
          <Alert
            severity="error"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setErrorMsg("");
                }}
              >
                <FaTimes fontSize="inherit"/>
              </IconButton>
            }
          >
            {errorMsg}
          </Alert>
        </Collapse>

        <Row style={{
          paddingInlineStart: "2%",
          paddingInlineEnd: "2%",
        }}
        >
          <Col md={12} style={{}}>
            <LagFreeTextEditor
              title={'Surel'}
              changeValue={value => setEmail(value)}
              value={email}
              placeholder={"Surel"}/>
          </Col>
        </Row>

        <Row style={{
          paddingInlineStart: "2%",
          paddingInlineEnd: "2%",
          paddingTop: '1em'
        }}
        >
          <Col md={12}>
            <LagFreeTextEditor
              title={'Nama Lengkap'}
              changeValue={value => setFullName(value)}
              value={fullName}
              placeholder={"Nama Lengkap"}/>
          </Col>
        </Row>

        <Row style={{
          paddingInlineStart: "2%",
          paddingInlineEnd: "2%",
          paddingTop: '1em',
          paddingBottom: '1em',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
        >
          <CustomButton
            style={{borderWidth: 0, marginRight: 10, width: 120, }}
            onClick={() => {
              setFullName("")
              setEmail("")
              props.onClose()
            }}
            variant={"outlined"} color="primary">
            Batal
          </CustomButton>

          <CustomButton
            onClick={inviteUser}
            style={{color: 'white', width: 120, }}
            variant={"contained"} color="primary">
            <>Simpan&nbsp;&nbsp;<FaSave/></>
          </CustomButton>
        </Row>
      </DialogContent>
      {/*{renderModalFooter()}*/}
    </>
  </Dialog>

}
