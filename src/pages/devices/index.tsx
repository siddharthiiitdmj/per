// ** React Imports
import api from 'src/helper/api'
import { ChangeEvent, useState } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { useTheme } from '@mui/material/styles'
import SelectWithDialog from 'src/views/forms/form-elements/select/SelectWithDialog'

// Third party imports
import { ReactDatePickerProps } from 'react-datepicker'

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
  const [rowData, setRowData] = useState(rows)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  return (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <SelectWithDialog
          popperPlacement={popperPlacement}
          setRowData={setRowData}
          createData={createData}
          type='devices'
        />
      </div>
      <TableContainer component={Paper} sx={{ maxHeight: 650 }}>
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
            {rowData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
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
        count={rowData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export const getServerSideProps = async () => {
  try {
    const res = await api.get('/devices/all')
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
