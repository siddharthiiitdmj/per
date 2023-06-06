// ** React Imports
import { useState, ChangeEvent, useEffect } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import axios from 'axios'

interface Column {
  id:
    | 'uid'
    | 'deviceId'
    | 'os'
    | 'kernel'
    | 'isVPNSpoofed'
    | 'isVirtualOS'
    | 'isAPPSpoofed'
    | 'timestamp'
    | 'deviceModel'
  label: string
  minWidth?: number
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'uid', label: 'uid' },
  { id: 'deviceId', label: 'deviceId' },
  {
    id: 'os',
    label: 'os',
    format: (value: number) => value.toLocaleString('en-US')
  },
  {
    id: 'kernel',
    label: 'kernel',
    format: (value: number) => value.toLocaleString('en-US')
  },
  {
    id: 'isVPNSpoofed',
    label: 'isVPNSpoofed',
    format: (value: number) => value.toFixed(2)
  },
  { id: 'isVirtualOS', label: 'isVirtualOS' },
  { id: 'isAPPSpoofed', label: 'isAPPSpoofed' },
  {
    id: 'deviceModel',
    label: 'deviceModel',
    format: (value: number) => value.toLocaleString('en-US')
  },
  { id: 'timestamp', label: 'timestamp' }
]

interface Data {
  uid: string
  deviceId: string
  os: string
  kernel: number
  isVPNSpoofed: boolean
  isVirtualOS: boolean
  isAPPSpoofed: boolean
  deviceModel: string
  timestamp: Date
}

function createData(
  uid: string,
  deviceId: string,
  os: string,
  kernel: number,
  isVPNSpoofed: boolean,
  isVirtualOS: boolean,
  isAPPSpoofed: boolean,
  deviceModel: string,
  timestamp: Date
): Data {
  return { uid, deviceId, os, kernel, isVPNSpoofed, isVirtualOS, isAPPSpoofed, deviceModel, timestamp }
}

const TableStickyHeader = () => {
  // const rows = [createData('uid_01', 'd_01', 'iOS', 4.45, true, true, false, 'iPhone', '2021-07-20T18:31:30.084Z')]
  const [deviceData, setDeviceData] = useState<Data[]>([])
  const [rows, setRows] = useState<Data[]>([])

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/devices/')
      .then(res => {
        const fetchedData = res.data as Data[]
        setDeviceData(fetchedData)

        return fetchedData
      })
      .then(fetchedData => {
        const newRows = fetchedData.map(item =>
          createData(
            item.uid,
            item.deviceId,
            item.os,
            item.kernel,
            item.isVPNSpoofed,
            item.isVirtualOS,
            item.isAPPSpoofed,
            item.deviceModel,
            item.timestamp
          )
        )

        return Promise.all(newRows)
      })
      .then(newRows => {
        setRows(newRows)
        console.log('deviceData: ', typeof deviceData[0].timestamp)
        console.log('typeof timestamp: ', typeof newRows[0].timestamp)
      })
      .catch(error => {
        console.error('Error fetching device data:', error)
      })
  }, [])

  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

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
                  {column.label === 'timestamp' ? <button>filter</button> : null}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.uid}>
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

export default TableStickyHeader
