import React, { useEffect } from 'react'
import { Tabs, Tab } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import ActivityDetail from './ActivityDetail'
import CertificateList from '../certificate/CertificateList'
import ActivityFormUpdate from './ActivityFormUpdate'

const ActivityTab = (props) => {
  const history = useHistory()
  const handleSelect = (route) => {
    history.push({
      pathname: route,
      state: { props },
    })
  }

  return (
    <>
      <Tabs
        defaultActiveKey="editProfile"
        transition={false}
        id="noanim-tab-example"
        className="mb-3 customTabs"
        onSelect={handleSelect.bind(this)}
      >
        <Tab eventKey="editProfile" title="Edit Activity">
          <ActivityFormUpdate />
        </Tab>
        <Tab eventKey="participants" title="Participants">
          <ActivityDetail props={props} />
        </Tab>
        <Tab eventKey="/activity/certificates" title="Certificates" mountOnEnter={true}>
          <CertificateList props={props} />
        </Tab>
      </Tabs>
    </>
  )
}

export default ActivityTab
