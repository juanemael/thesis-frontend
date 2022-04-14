import React, { useEffect, useState, useRef } from "react";
import SertifikatHalalModels from '../../models/Content'
import DataTable from "react-data-table-component";
import Styles from '../../util/Styles'
import {CButton, CFormInput} from "@coreui/react";
import RichTextEditor from 'react-rte'
import parse from "html-react-parser";
import {useHistory} from "react-router-dom";
import swal from 'sweetalert2'
import moment from "moment";
import {FaArrowRight, FaPlus, FaTimes} from "react-icons/fa";


const Sertfikasi_Halal = () => {

  let SertifikatHalalModel = new SertifikatHalalModels()
  let history  = useHistory()

  const [content,setContent] = useState([])
  const [keyword,setKeyword] = useState('')
  const [detailContent,setDetailContent] = useState(() => RichTextEditor.createEmptyValue())
  const row = [{
    id : 1,
    title: 'Tes',
  },{
    id: 2,
    title: 'Tes2'
  }]



  const getSertifikasiHalal = async () => {
    try{
      let result = await SertifikatHalalModel.getAll()
      console.log(result)
      setContent(result)
      setDetailContent(RichTextEditor.createValueFromString(result.content, 'html'))
      console.log(detailContent)
    } catch (e){
      console.log(e)
    }
  }

  useEffect(()=>{
    getSertifikasiHalal()
  },[])

  const deleteSertifikasiHalal = async (id) =>{
    swal.fire({
      title: "Delete",
      text: `Are you sure you want to delete data #? ${id}`,
      icon: "warning",
      showCancelButton: true,
      confirmButton: "Yes",
      confirmButtonColor: '#3085d6',
      cancelButton: "Cancel",
      cancelButtonColor: '#d33'
    }).then(async(res)=>{
      try {
        let result = await SertifikatHalalModel.deleteContent(id)
        if(result.id || result.success && res.value){
          await swal.fire('', "Data successfully deleted", 'success')
            .then(()=>{
              history.go(0)
            })
        } else{
          await swal.fire ('', "Data failed to be deleted", "error")
            .then(()=>{
              history.go(0)
            })
          console.log('Cancel')
        }
      } catch (e) {
        console.log(e)
        await swal.fire ('', e.error_message ? e.error_message : "Error happened", "error")
      }
    })
  }

  return(
    <>

      <div style={Styles.cardHeader}>
        <div style={Styles.cardHeaderText}>Sertifikasi Halal</div>
        <div style={Styles.searchTableText}>Search</div>
        <CFormInput
          name={'searchAdminQuery'}
          autoComplete={"off"}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter Keyword" style={Styles.searchTableInput} />
      </div>
      <DataTable
        customStyles={Styles.dataTable}
        columns={[
          {name: 'ID',
            selector: (row)=> row.id,
            sortable: true
          },
          {
            name: 'Title',
            selector: (row)=> row.title
          },
          // {
          //   name: 'Created At',
          //   selector: (row) => moment(row.created_at).format("HH MMM YYYY hh:mm")
          // },
          // {
          //   name: 'Modified At',
          //   selector: (row) => moment(row.modified_at).format("HH MMM YYYY hh:mm")
          // },
          {
            name: '',
            width: '40%',
            selector: (row)=> (
              <div style={{display: 'inline-block'}}>
                <>
                  <CButton
                    onClick={() => {
                      history.push(`/sertifikasi_halal/update/${row.id}`)
                    }
                    }
                    style={{...Styles.tableBtn2,
                      ...Styles.ml10}}
                    color={'warning'}
                  >
                    Update
                  </CButton>
                  <CButton
                    onClick={() => {
                      deleteSertifikasiHalal(row.id)
                    }}
                    style={{...Styles.tableBtn2,
                      ...Styles.rejectBtn,
                      ...Styles.ml10}}
                  >
                    Delete
                  </CButton>
                </>
              </div>
            )
          }
        ]}
        data={row.filter((item) => {
          console.log(item.title.toLowerCase().includes(keyword.toLowerCase()))
          return item.title.toLowerCase().includes(keyword.toLowerCase())
        })}
        pagination
      />
      <div style={{...Styles.cardHeaderAction}}>
        <CButton onClick={()=>{history.push('/sertifikasi_halal/create')}} style={{...Styles.cardHeaderActionButton}}>
          <FaPlus fontSize="inherit" style={{paddingBottom: 2}}/> Tambah
        </CButton>
        <div style={{float: "right"}}>
          <CButton color={'info'} onClick={()=>{history.push('/sertifikasi_halal/create')}} style={{...Styles.cardHeaderActionButton}}>
             Next <FaArrowRight fontSize="inherit" style={{paddingBottom: 2, paddingTop: 2}}/>
          </CButton>
        </div>
      </div>
    </>
  )
}

export default Sertfikasi_Halal
