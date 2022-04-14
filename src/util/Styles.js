export default {
    cardForm: {
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: 'white',
        padding: 20,
        fontWeight: '600',
    },
    cardFormHeader: {
        background: 'white',
        padding: 10,
        fontWeight: 500,
        fontSize: '1em',
        borderBottom: 'none',
    },
    cardHeaderAction: {
        background: 'white',
    },
    cardHeaderActionButton: {
        margin: '0 20px 10px 20px',
        color: '#FFFFFF',
        fontSize: '.8em',
    },

    cardHeader: {
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        display: 'flex',
        padding: 20,
        alignItems: 'center',
        fontWeight: '600',
    },

    cardFooter: {
      backgroundColor: 'white',
      padding: '1rem',
      alignItems: 'center',
      fontWeight: 600,
      position: 'sticky',
      bottom: 0,
    },

    cardHeaderText: {
        flex: 1,
    },
    searchTableText: {
        fontSize: '.9em',
    },
    searchTableInput: {
        fontSize: '.9em',
        marginLeft: 15,
        width: 180,
        border: '1px solid #C4C4C4',
    },
    dataTable: {
        table: {
            style: {
                // padding: 20,
                paddingTop: 0,
            },
        },
        rows: {
            style: {
                minHeight: '72px', // override the row height
            },
        },
        headCells: {
            style: {
                fontWeight: '600',
                color: '#7FC4D4',

            },
        },
        pagination: {
            style: {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
            },
        },
        cells: {
            style: {
                // paddingLeft: '4px', // override the cell padding for data cells
                paddingRight: '4px',
                fontWeight: '500',
              width : "100%",
              display  :"flex",
            },
        },
      scrollX: true,
      overflowX: "scroll",
    },
    tableBtn: {
      width : 150,
        borderWidth: 0,
        fontWeight: '700',
        fontSize: '.9em',
      marginBottom : 2,
      marginTop : 2
    },
    tableBtn2: {
      width: 150,
      borderWidth: 0,
      fontWeight: '700',
      fontSize: '.9em',
      margin: 5,
      color: '#FFFFFF',
    },
    buttonLink: {
        textDecoration: 'none',
        fontSize: '1em',
    },
    approveBtn: {
        backgroundColor: '#E2E7EB',
        color: '#474A4F',
    },
    rejectBtn: {
        backgroundColor: '#882533',
        color: '#FFFFFF',
    },
    verifiedBtn: {
        backgroundColor: '#4dc374',
        color: '#FFFFFF',
    },
    detailBtn: {
        backgroundColor: '#e2e0f1',
        color: '#000000',
    },
    formLabel: {
        fontSize: '.9em',
    },
    formLabel2: {
      fontSize: '.7em',
      color: '#aaaaaa'
    },
    successIcon: {
        color: 'green',
    },
    errorIcon: {
        color: 'red',
    },
    ml10: {
        marginLeft: 10,
    },
    // ml16: {
    //   marginLeft: 16,
    // },
    ModalDetailLabel: {
        fontWeight: 600,
        lineHeight: 3,
        color: '#1a476c',
    },
    ModalDetailText: {
        fontSize: '.9em',
    },
    ModalDetailRows: {
        marginBottom: '20px',
    },
    ModalDetailTitle: {
        borderBottom: '1px solid #fcf3f3',
        fontSize: '1em',
        color: '#ababab',
        fontWeight: '600',
    },
    CustomTabs : {
        color: '#533a9f !important',
        backgroundColor: 'transparent',
        borderColor: 'transparent transparent #f3f3f3',
        borderBottom: '4px solid !important',
        fontSize: '0.9em',
        fontWeight: 'bold',
    },
    datePicker : {
      cursor: "pointer",
      fontSize: '0.9em',
    }
}
