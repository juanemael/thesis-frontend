import React, { useEffect, useState } from 'react'
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table'
import {
  BsArrowDown,
  BsArrowUp,
  BsChevronLeft,
  BsChevronRight,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/all'
import { Table, Button } from 'react-bootstrap'
import { Input, Select } from '@material-ui/core'
import CustomButton from '../CustomButton'
import MenuItem from '@material-ui/core/MenuItem'
import Palette from '../../util/Palette'

//Created using guide from: https://blog.logrocket.com/complete-guide-building-smart-data-table-react/ at this chapter: Building a smart table UI using React

let filterInputSaver

export default function MobTable({ columns, data, interactions, hidePagination, hideSearch }) {
  const [filterInput, setFilterInput] = useState('')
  //useTable instance content
  const {
    getTableProps,
    getTableBodyProps,
    rows,
    headers,
    prepareRow,
    setGlobalFilter,
    pageOptions,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
    useGlobalFilter, //https://github.com/tannerlinsley/react-table/blob/master/docs/api/useGlobalFilter.md
    useSortBy, //https://github.com/tannerlinsley/react-table/blob/master/docs/api/useSortBy.md,
    usePagination, //https://github.com/tannerlinsley/react-table/blob/master/docs/api/usePagination.md
  )

  useEffect(() => {
    console.log('data is changed from ' + filterInput + '  /  ' + filterInputSaver)
    setFilterInput(filterInput)
    setGlobalFilter(filterInput)
  }, [data])

  const [isFieldHovered, setFieldHovered] = useState(new Array(headers.length).fill(false))

  // console.log("filter " + filterInputSaver)

  return (
    <div>
      {!hideSearch && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              marginRight: '1em',
              fontFamily: 'Open Sans',
            }}
          >
            Cari :
          </span>
          <Input
            value={filterInput}
            onChange={(e) => {
              filterInputSaver = e.target.value
              setFilterInput(e.target.value)
              setGlobalFilter(e.target.value)
            }}
            inputProps={{
              style: {
                fontFamily: 'Open Sans',
                textAlign: 'right',
              },
            }}
            placeholder={'Masukan Kata Pencarian'}
          />
        </div>
      )}
      <Table striped hover {...getTableProps} style={{ width: '100%' }}>
        <thead>
          <tr>
            {headers.map((column, idx) => {
              const props = column.filterable
                ? { ...column.getHeaderProps(column.getSortByToggleProps()) }
                : {}

              let icon = column.isSorted ? (
                column.isSortedDesc ? (
                  <BsArrowDown />
                ) : (
                  <BsArrowUp />
                )
              ) : (
                <></>
              )
              return (
                <th
                  onMouseOver={() => {
                    const temp = [...isFieldHovered]
                    temp[idx] = true
                    setFieldHovered(temp)
                  }}
                  key={idx}
                  onMouseOut={() => {
                    const temp = [...isFieldHovered]
                    temp[idx] = false
                    setFieldHovered(temp)
                  }}
                  {...props}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    fontFamily:
                      column.isSorted || isFieldHovered[idx] ? 'Open Sans-SemiBold' : 'Open Sans',
                    cursor: 'pointer',
                    color: column.isSorted || isFieldHovered[idx] ? Palette.PRIMARY : 'black',
                  }}
                >
                  {column.render('Header')} {icon}
                </th>
              )
            })}
            {interactions && <th>Opsi</th>}
          </tr>
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row, idx) => {
            // This line is necessary to prepare the rows and get the row props from react-table dynamically
            prepareRow(row)

            //getting the original instance of ob ject
            let rowInfo = row.original
            // Each row can be rendered directly as a string using the react-table render method
            return (
              <tr {...row.getRowProps()} key={idx}>
                {row.cells.map((cell, idx) => {
                  return (
                    <td {...cell.getCellProps()} style={{ fontFamily: 'Open Sans' }} key={idx}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
                <td>
                  {interactions &&
                    interactions.map((interaction, i) => {
                      if (!interaction.condition || interaction.condition(rowInfo)) {
                        return (
                          <Button
                            variant={interaction.variant}
                            style={{
                              marginLeft: '5px',
                              marginRight: '5px',
                              color: 'white',
                              marginBottom: 6,
                              fontFamily: 'Open Sans-SemiBold',
                              ...interaction.style,
                            }}
                            key={`interact-button-${i}`}
                            onClick={() => {
                              interaction.action(rowInfo, idx)
                            }}
                          >
                            {interaction.name}
                          </Button>
                        )
                      } else {
                        return <></>
                      }
                    })}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      {!hidePagination && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            fontFamily: 'Open Sans',
          }}
        >
          {/**https://github.com/tannerlinsley/react-table/tree/master/examples/pagination**/}
          Halaman
          <CustomButton onClick={() => previousPage()} disabled={!canPreviousPage}>
            <span
              style={{
                color: canPreviousPage ? Palette.PRIMARY : 'lightGray',
              }}
            >
              <FaChevronLeft />
            </span>
          </CustomButton>
          <span>
            {pageIndex + 1} dari {pageOptions.length}
          </span>
          <CustomButton
            onClick={() => nextPage()}
            disabled={!canNextPage}
            style={{ marginRight: '40px' }}
          >
            <span
              style={{
                color: canNextPage ? Palette.PRIMARY : 'lightGray',
              }}
            >
              <FaChevronRight />
            </span>
          </CustomButton>
          <span>Ke Halaman: </span>
          <Input
            type="number"
            defaultValue={pageIndex + 1 || 1}
            style={{ width: '50px', marginRight: '40px' }}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
          />
          <span
            style={{
              marginRight: '1em',
            }}
          >
            Data per Halaman :
          </span>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[5, 10, 50, 100].map((pageSize) => (
              <MenuItem value={pageSize} key={pageSize}>
                {pageSize}
              </MenuItem>
            ))}
          </Select>
        </div>
      )}
    </div>
  )
}
