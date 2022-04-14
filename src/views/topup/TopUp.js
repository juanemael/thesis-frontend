import DataTable from 'react-data-table-component'
import {
    CButton, CFormInput, CModal,
    CModalHeader, CModalTitle,
    CModalBody,
} from '@coreui/react'
import Styles from '../../util/Styles'
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import TopUpModel from '../../models/TopUp'
// import ImagePopUp from '../../reusable/ImagePopup'
import { Exception } from 'sass'
import swal from 'sweetalert';
import { FaCheck, FaTimes } from "react-icons/fa";

const TopUp = () => {
    const [topups, setTopUps] = useState([])
    const [showImage, setShowImage] = useState(false)
    const [showImageUrl, setShowImageUrl] = useState(null)
    const [keyword, setKeyword] = useState("");

    let topupModel = new TopUpModel()
    const getTopUpList = async () => {

        try {
            let result = await topupModel.getAll()
            setTopUps(result)
        } catch (e) {
        }

    }
    const approve = async (id) => {
        const submitConfirm = await swal({
            title: "",
            text: "Are you sure approve this item?",
            icon: "warning",
            buttons: ["Cancel", "Yes"],
            dangerMode: true,
        });
        if (submitConfirm) {
            try {
                const result = await topupModel.approve(id)
                if (result.id || result.success) {
                    swal('', "Approve Success", 'success')
                        .then((value) => {
                            getTopUpList();
                        });
                } else {
                    swal('', "Failed to Approv", 'error')
                    return
                }
            } catch (e) {
                swal('', "Something Wrong", 'error')
            }
        }
    }

    useEffect(() => {
        getTopUpList()
    }, [])

    return (
        <>
            {/* <ImagePopUp
                showImage={showImage}
                toogleShow={showImage => setShowImage(false)}
            ></ImagePopUp> */}
            <CModal
                visible={showImage}
                size={'md'}
                onClose={() => setShowImage(false)}
            >
                <CModalHeader>

                </CModalHeader>
                <CModalBody>
                    <img className={'img-fluid mx-auto d-block'} src={showImageUrl} />
                </CModalBody>
            </CModal>
            <div style={Styles.cardHeader}>
                <div style={Styles.cardHeaderText}>Top Up</div>
                <div style={Styles.searchTableText}>Search</div>
                <CFormInput
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Enter Keyword" style={Styles.searchTableInput} />
            </div>
            <DataTable
                responsive
                customStyles={Styles.dataTable}
                columns={[
                    {
                        name: 'User',
                        selector: (row) => {
                          return row.user_name
                        },
                        sortable: true,
                        width: '30%'
                    },
                    {
                        name: 'Amount',
                        selector: (row) => row.amount,
                        sortable: true,
                        width: '20%'
                    },
                    {
                        name: 'Attachment',
                        selector: (row) => {
                            return (
                                <CButton onClick={() => {
                                    setShowImage(!showImage)
                                    setShowImageUrl(row.img_link)
                                }} style={{ ...Styles.buttonLink }} color="link">View Attachment</CButton>
                            )
                        },
                        width: '15%',
                        center: true
                    },
                    {
                        name: 'Verified',
                        selector: (row) => row.approved ? <FaCheck style={{ ...Styles.successIcon }}></FaCheck> : <FaTimes style={{ ...Styles.errorIcon }}></FaTimes>,
                        width: '10%'
                    },
                    {
                        name: '',
                        selector: (row) => (
                            <div>
                                <>
                                    {!row.approved ?

                                        <CButton
                                            style={{
                                                ...Styles.tableBtn,
                                                ...Styles.approveBtn,
                                            }}
                                            onClick={() => {
                                                approve(row.id)
                                            }}
                                        >
                                            Approve
                                        </CButton>
                                        : ''
                                    }
                                </>
                            </div>
                        ),
                    },
                ]}
                data={topups.filter((item) => {
                  return item.user_name.toLowerCase().includes(keyword.toLowerCase())
                })}
                pagination
            />
        </>
    )
}

export default TopUp
