import React from 'react'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CWidgetStatsF, CLink
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {cilArrowBottom, cilArrowRight, cilArrowTop, cilOptions, cilUser} from '@coreui/icons'
import moment from "moment"
import textFormatter from "../../util/textFormatter";
import {AiOutlineUsergroupAdd, BsGraphUp, MdOutlineCancel} from "react-icons/all";

const WidgetsDropdown = (props) => {

  const {dashboardHighlight} = props

  return (
    <CRow>
        <CCol md={6}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<CIcon icon={cilUser} height={24} />}
            title="Total Active Members "
            value={dashboardHighlight?.activeMemberCount}/>
        </CCol>
        <CCol md={6}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<AiOutlineUsergroupAdd size={"24"}/>}
            title={`New Membership/Extension (${moment().format("MMMM")})`}
            value={dashboardHighlight?.newMembershipCount30D}
          />
        </CCol>
        <CCol md={6}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<MdOutlineCancel size={24}/>}
            // padding={false}
            title="Total Non-Active Members"
            value={dashboardHighlight?.allInActiveMemberCount}
          />
        </CCol>
        <CCol md={6}>
          <CWidgetStatsF
            className="mb-3"
            color="primary"
            icon={<BsGraphUp size={24}/>}
            title={`Total Income (${moment().format("MMMM")})`}
            value={"Rp" + textFormatter.moneyFormatter(dashboardHighlight?.newMembershipAmount30D)}
          />
        </CCol>
    </CRow>
  )
}

export default WidgetsDropdown
