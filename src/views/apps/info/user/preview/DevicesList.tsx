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

// ** Third Party Imports

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
// ** Custom Components Imports
import Icon from 'src/@core/components/icon'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { fetchUniqueDevicesData } from 'src/store/apps/uniqueDevices'
import { DeviceType } from 'src/types/apps/deviceTypes'

// ** Custom Table Components Imports
interface DeviceOSType {
  [key: string]: { icon: string; color: string }
}

// ** Vars
const deviceOSObj: DeviceOSType = {
  Android: { icon: 'mdi:android', color: 'success.main' },
  iOS: { icon: 'mdi:apple-ios', color: 'warning.main' }
}

interface CellType {
  row: DeviceType
}

// ** Styled component for the link in the dataTable
const LinkStyled = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const columns: GridColDef[] = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'id',
    headerName: 'id',
    renderCell: ({ row }: CellType) => {
      const { id } = row

      return <LinkStyled href={`/info/device/${id}`}>{`${id}`}</LinkStyled>
    }
  },
  {
    flex: 0.2,
    minWidth: 200,
    field: 'devicemodel',
    headerName: 'Model',
    renderCell: ({ row }: CellType) => {
      const { devicemodel } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{devicemodel}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'OS',
    minWidth: 150,
    headerName: 'OS',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3, color: deviceOSObj[row.OS].color } }}>
          <Icon icon={deviceOSObj[row.OS].icon} fontSize={20} />
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.OS}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 100,
    field: 'OS_version',
    headerName: 'OS Version',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap variant='body2'>
          {row.OS_version}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Kernel',
    field: 'Kernel',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ textTransform: 'capitalize' }}>
          {row.Kernel}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'Screen Resolution',
    field: 'Screen_resolution',
    renderCell: ({ row }: CellType) => {
      return (
        <Typography noWrap sx={{ textTransform: 'capitalize' }}>
          {row.Screen_resolution}
        </Typography>
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
  const store = useSelector((state: RootState) => state.uniqueDevices)

  useEffect(() => {
    dispatch(
      fetchUniqueDevicesData({
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
                    <Typography variant='h6'>Linked Devices</Typography>
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
