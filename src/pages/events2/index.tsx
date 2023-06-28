// ** React Imports
import { useEffect, useState } from 'react'

// ** Next Imports

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports

// ** Utils Import

// ** Actions Imports
import { fetchData } from 'src/store/apps/events'

// ** Third Party Components

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import { EventsType } from 'src/types/apps/eventTypes'

// ** Custom Table Components Imports

interface CellType {
  row: EventsType
}

const columns: GridColDef[] = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'userId',
    headerName: 'User ID',
    renderCell: ({ row }: CellType) => {
      const { userId } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{userId}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'deviceId',
    headerName: 'Device ID',
    renderCell: ({ row }: CellType) => {
      const { deviceId } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{deviceId}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'nodename',
    headerName: 'Nodename',
    renderCell: ({ row }: CellType) => {
      const { nodename } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{nodename}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'IPaddress',
    headerName: 'IP Address',
    renderCell: ({ row }: CellType) => {
      const { IPaddress } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{IPaddress}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'isVPNSpoofed',
    headerName: 'isVPNSpoofed',
    renderCell: ({ row }: CellType) => {
      const { isVPNSpoofed } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{JSON.stringify(isVPNSpoofed)}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'createdAt',
    headerName: 'createdAt',
    renderCell: ({ row }: CellType) => {
      const { createdAt } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{createdAt}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'updatedAt',
    headerName: 'updatedAt',
    renderCell: ({ row }: CellType) => {
      const { updatedAt } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{updatedAt}</Box>
        </Box>
      )
    }
  },
]

const UserList = () => {
  // ** State
  const [IPaddress] = useState<string>('')
  const [nodename] = useState<string>('')
  const [deviceId] = useState<string>('')
  const [userId] = useState<string>('')
  const [isVPNSpoofed] = useState<boolean>()
  const [isVirtualOS] = useState<boolean>()
  const [isEmulator] = useState<boolean>()
  const [isAppSpoofed] = useState<boolean>()
  const [isAppPatched] = useState<boolean>()
  const [isAppCloned] = useState<boolean>()
  const [Latitude] = useState<string>('')
  const [Longitude] = useState<string>('')
  const [Cellular_network] = useState<string>('')
  const [Wifi_network] = useState<string>('')
  const [createdAt] = useState<string>('')
  const [updatedAt] = useState<string>('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.events)

  useEffect(() => {
    dispatch(
      fetchData()
    )
  }, [
    dispatch,
    userId,
    deviceId,
    nodename,
    IPaddress,
    isVPNSpoofed,
    isVirtualOS,
    isEmulator,
    isAppSpoofed,
    isAppPatched,
    isAppCloned,
    Latitude,
    Longitude,
    Cellular_network,
    Wifi_network,
    createdAt,
    updatedAt
  ])

//   const handleOSChange = useCallback((e: SelectChangeEvent) => {
//     setOS(e.target.value)
//   }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          {/* <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={4} xs={12}>
                <FormControl fullWidth>
                  <InputLabel id='OS-select'>Select OS</InputLabel>
                  <Select
                    fullWidth
                    value={OS}
                    id='select-OS'
                    label='Select OS'
                    labelId='OS-select'
                    onChange={handleOSChange}
                    inputProps={{ placeholder: 'Select OS' }}
                  >
                    <MenuItem value=''>Select OS</MenuItem>
                    <MenuItem value='Android'>Android</MenuItem>
                    <MenuItem value='iOS'>iOS</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider /> */}
          <DataGrid
            autoHeight
            rows={store.allData}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>
    </Grid>
  )
}

export default UserList
