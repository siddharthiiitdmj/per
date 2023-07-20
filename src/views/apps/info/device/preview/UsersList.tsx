// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports

// ** Utils Import

// ** Actions Imports
import { fetchData } from 'src/store/apps/uniqueUsers'

// ** Third Party Imports

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import { EventsType } from 'src/types/apps/eventTypes'

// ** Custom Components Imports

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { styled } from '@mui/material/styles'
import Link from 'next/link'

// ** Custom Table Components Imports

interface CellType {
  row: EventsType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const columns: GridColDef[] = [
  {
    flex: 0.2,
    minWidth: 100,
    field: 'id',
    headerName: 'User ID',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`/info/user/${row.id}`}>{`${row.id}`}</LinkStyled>
    )
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'username',
    headerName: 'username',
    renderCell: ({ row }: CellType) => {
      const { username } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{username}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'email',
    headerName: 'email',
    renderCell: ({ row }: CellType) => {
      const { email } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{email}</Box>
        </Box>
      )
    }
  }
]

interface Props {
  data: any
}

const DeviceEvents = ({ data }: Props) => {
  // ** State
  const [id] = useState<string>(data)
  const [OS] = useState<string>('')
  const [dates] = useState<Date[]>([])
  const [value] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.uniqueUsers)

  useEffect(() => {
    dispatch(
      fetchData({
        id,
        OS,
        q: value,
        dates
      })
    )
  }, [dispatch, OS, value, dates, id])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <Card>
              <CardContent>
                <Grid container spacing={6} sx={{ display: 'flex' }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='h6'>Linked Users</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <DataGrid
              autoHeight
              pagination
              rows={store.allData}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default DeviceEvents
