// ** React Imports
import { useState, ChangeEvent } from 'react'
import axios from 'axios'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import { NextPageContext } from 'next/types'

interface Column {
  id: 'UID' | 'DeviceID' | 'OS' | 'Kernel' | 'isVPNSpoofed' | 'isVirtualOS' | 'isAppSpoofed' | 'devicemodel'
  label: string
  minWidth?: number
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'UID', label: 'UID' },
  { id: 'DeviceID', label: 'DeviceID' },
  {
    id: 'OS',
    label: 'OS',
    format: (value: number) => value.toLocaleString('en-US')
  },
  {
    id: 'Kernel',
    label: 'Kernel',
    format: (value: number) => value.toLocaleString('en-US')
  },
  {
    id: 'isVPNSpoofed',
    label: 'isVPNSpoofed',
    format: (value: number) => value.toFixed(2)
  },
  { id: 'isVirtualOS', label: 'isVirtualOS' },
  { id: 'isAppSpoofed', label: 'isAppSpoofed' },
  {
    id: 'devicemodel',
    label: 'devicemodel',
    format: (value: number) => value.toLocaleString('en-US')
  }
]

interface Data {
  UID: string
  DeviceID: string
  OS: string
  Kernel: number
  isVPNSpoofed: boolean
  isVirtualOS: boolean
  isAppSpoofed: boolean
  devicemodel: string
}

function createData(
  UID: string,
  DeviceID: string,
  OS: string,
  Kernel: number,
  isVPNSpoofed: boolean,
  isVirtualOS: boolean,
  isAppSpoofed: boolean,
  devicemodel: string
): Data {
  return { UID, DeviceID, OS, Kernel, isVPNSpoofed, isVirtualOS, isAppSpoofed, devicemodel }
}

interface Props {
  rows: Data[]
}

const TableStickyHeader = ({ rows }: Props) => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(25)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 580 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align='left' sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.UID}>
                  {columns.map(column => {
                    const value = row[column.id]

                    return (
                      <TableCell key={column.id} align='left'>
                        {column.format && typeof value === 'number' ? (
                          column.format(value)
                        ) : typeof value === 'boolean' ? (
                          value ? (
                            <p>True</p>
                          ) : (
                            <p>False</p>
                          )
                        ) : (
                          value
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export const getServerSideProps = async (context: NextPageContext) => {
  try {
    const res = await axios.get('http://localhost:3000/api/devices/all')
    const fetchedData = res.data as Data[]

    const rows = fetchedData.map(item =>
      createData(
        item.UID,
        item.DeviceID,
        item.OS,
        item.Kernel,
        item.isVPNSpoofed,
        item.isVirtualOS,
        item.isAppSpoofed,
        item.devicemodel
      )
    )

    return {
      props: { rows }
    }
  } catch (error) {
    console.error('Error fetching device data:', error)

    return {
      props: { rows: [] }
    }
  }
}

export default TableStickyHeader
