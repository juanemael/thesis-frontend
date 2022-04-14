import { Link, useHistory, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
} from "@coreui/react"

import MemberModels from "../../models/Member";
import MemberDetailView from 'src/reusable/members/MemberDetailView';
import moment from "moment";
export default function MemberDetail() {
    const modelMember = new MemberModels();
    const { id } = useParams();
    const [memberData, setMemberData] = useState([])
    const [activeMemberData, setActiveMemberData] = useState([])
    const [profileData, setProfileData] = useState({})
    const [latestExtensionData, setLatestExtensionData] = useState(null)

    const getMember = async () => {
        try {
            let result = await modelMember.getById(id);
            console.log("THISIS RESULT",result)
            setMemberData(result)
        } catch (e) {

        }
    }

    function thousandSeparator(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    useEffect( () => {
        getMember()
    }, [])



    return (
        <>
            <CRow>
                {/*<CCol*/}
                {/*  md={4}>*/}
                {/*  <CCard style={{*/}
                {/*    height: "25%"*/}
                {/*  }}>*/}
                {/*    <div style={{*/}
                {/*      display: "flex",*/}
                {/*      flexDirection: "column",*/}
                {/*      justifyContent: "center",*/}
                {/*      padding: 10,*/}
                {/*      height: "100%"*/}
                {/*    }}>*/}
                {/*      <div style={{*/}
                {/*        fontFamily: 'Signika',*/}
                {/*        fontWeight: '600',*/}
                {/*        color: '#8e8e8e'*/}
                {/*      }}>*/}
                {/*        Membership Status : <b style={{color: !!activeMemberData ? '' : 'red'}}>{!!activeMemberData ? 'Active' : 'Non Active'}</b>*/}
                {/*      </div>*/}
                {/*      <div style={{*/}
                {/*        fontFamily: 'Signika',*/}
                {/*        fontWeight: '600',*/}
                {/*        color: '#8e8e8e',*/}
                {/*      }}>*/}
                {/*        Member Since : <b style={{color : 'black'}}>{moment(profileData?.entry_date).format("DD MMM YYYY")}</b>*/}
                {/*      </div>*/}
                {/*      <div style={{*/}
                {/*        fontFamily: 'Signika',*/}
                {/*        fontWeight: '600',*/}
                {/*        color: '#8e8e8e',*/}
                {/*      }}>*/}
                {/*        Active Until : <b style={{color : 'black'}}>{latestExtensionData ? moment(latestExtensionData?.valid_until).format("DD MMM YYYY") : "-"}</b>*/}
                {/*      </div>*/}
                {/*    </div>*/}

                {/*  </CCard>*/}

                {/*</CCol>*/}
                <CCol xs="12" md="12">
                    <CCard>
                        <CCardHeader>
                            <div className='d-flex'>
                                <div style={{ flex: 1 }}>
                                    Member Detail<br></br>
                                    <Link to={"/members"}><small>Back to members list</small></Link>
                                </div>
                                {/* <div style={{ flex: 1 }}>
                                    <CBadge style={{ position: 'absolute', right: '2%', fontSize: '1.2em' }}
                                        color={'warning'}>Waiting Verification</CBadge>
                                </div> */}
                            </div>
                        </CCardHeader>
                        <CCardBody style={{ lineHeight: 3 }}>
                            <MemberDetailView
                                members={memberData}
                            />
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>

        </>
    )
}
