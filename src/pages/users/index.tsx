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
  createdAt: string // Update the type to string
  role: boolean
}

function createData(id: string, name: string, email: string, role: boolean, createdAt: string): Data {
  return { id, name, email, role, createdAt }
}

interface Props {
  rows: Data[]
}

const TableStickyHeader = ({ rows }: Props) => {
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
                <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
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
                          String(value) // Convert Date to string
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
    const res = await axios.get('http://localhost:3000/api/users/all')
    const fetchedData = res.data as Data[]

    const rows = fetchedData.map(item => {
      const createdAt = new Date(item.createdAt).toISOString() // Convert to ISO 8601 string

      return createData(item.id, item.name, item.email, item.role, createdAt)
    })

    return {
      props: {
        rows: JSON.parse(JSON.stringify(rows)) // Serialize rows as JSON
      }
    }
  } catch (error) {
    console.error('Error fetching user data:', error)

    return {
      props: { rows: [] }
    }
  }
}

export default TableStickyHeader
