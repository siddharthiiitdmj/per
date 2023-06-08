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
  id: 'id' | 'name' | 'email' | 'role' | 'createdAt'
  label: string
  minWidth?: number
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'id', label: 'id' },
  { id: 'name', label: 'name' },
  {
    id: 'email',
    label: 'email',
    format: (value: number) => value.toLocaleString('en-US')
  },
  {
    id: 'role',
    label: 'role',
    format: (value: number) => value.toLocaleString('en-US')
  },
  {
    id: 'createdAt',
    label: 'createdAt',
    format: (value: number) => value.toFixed(2)
  }
]

interface Data {
  id: string
  name: string
  email: string
  createdAt: Date
  role: boolean
}

function createData(id: string, name: string, email: string, role: boolean, createdAt: Date): Data {
  return { id, name, email, role, createdAt }
}

const TableStickyHeader = () => {
  const [rows, setRows] = useState<Data[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsLoading(true)
    axios
      .get('http://localhost:3000/api/fakedata/getusers')
      .then(res => {
        const fetchedData = res.data as Data[]

        return fetchedData
      })
      .then(fetchedData => {
        const newRows = fetchedData.map(item => createData(item.id, item.name, item.email, item.role, item.createdAt))

        return Promise.all(newRows)
      })
      .then(newRows => {
        setRows(newRows)
        setIsLoading(false)
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

export default TableStickyHeader
