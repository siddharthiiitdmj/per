// ** React Imports
import { forwardRef, useCallback, useEffect, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports

// ** Utils Import

// ** Actions Imports
import { fetchData } from 'src/store/apps/events'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import { EventsType } from 'src/types/apps/eventTypes'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Custom Components Imports
import TableHeader from 'src/views/apps/events/list/TableHeader'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

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
  row: EventsType
}

interface CustomInputProps {
  dates: Date[]
  label: string
  end: number | Date
  start: number | Date
  setDates?: (value: Date[]) => void
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
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`/info/device/${row.deviceId}`}>{`${row.deviceId}`}</LinkStyled>
    )
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
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            {JSON.stringify(isVPNSpoofed)}
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'isVirtualOS',
    headerName: 'isVirtualOS',
    renderCell: ({ row }: CellType) => {
      const { isVirtualOS } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            {JSON.stringify(isVirtualOS)}
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'isEmulator',
    headerName: 'isEmulator',
    renderCell: ({ row }: CellType) => {
      const { isEmulator } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            {JSON.stringify(isEmulator)}
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'isAppSpoofed',
    headerName: 'isAppSpoofed',
    renderCell: ({ row }: CellType) => {
      const { isAppSpoofed } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            {JSON.stringify(isAppSpoofed)}
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'isAppPatched',
    headerName: 'isAppPatched',
    renderCell: ({ row }: CellType) => {
      const { isAppPatched } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            {JSON.stringify(isAppPatched)}
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'isAppCloned',
    headerName: 'isAppCloned',
    renderCell: ({ row }: CellType) => {
      const { isAppCloned } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            {JSON.stringify(isAppCloned)}
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'Latitude',
    headerName: 'Latitude',
    renderCell: ({ row }: CellType) => {
      const { Latitude } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{Latitude}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'Longitude',
    headerName: 'Longitude',
    renderCell: ({ row }: CellType) => {
      const { Longitude } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{Longitude}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'Cellular_network',
    headerName: 'Cellular_network',
    renderCell: ({ row }: CellType) => {
      const { Cellular_network } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{Cellular_network}</Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 230,
    field: 'Wifi_network',
    headerName: 'Wifi_network',
    renderCell: ({ row }: CellType) => {
      const { Wifi_network } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{Wifi_network}</Box>
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
  }
]

/* eslint-disable */
const CustomInput = forwardRef((props: CustomInputProps, ref) => {
  const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
  const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

  const value = `${startDate}${endDate !== null ? endDate : ''}`
  props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
  const updatedProps = { ...props }
  delete updatedProps.setDates

  return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
})
/* eslint-enable */

const EventsList = () => {
  // ** State
  const [OS, setOS] = useState<string>('')
  const [dates, setDates] = useState<Date[]>([])
  const [value, setValue] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [startDateRange, setStartDateRange] = useState<DateType>(null)

  // const [IPaddress] = useState<string>('')
  // const [nodename] = useState<string>('')
  // const [deviceId] = useState<string>('')
  // const [userId] = useState<string>('')
  // const [isVPNSpoofed] = useState<boolean>()
  // const [isVirtualOS] = useState<boolean>()
  // const [isEmulator] = useState<boolean>()
  // const [isAppSpoofed] = useState<boolean>()
  // const [isAppPatched] = useState<boolean>()
  // const [isAppCloned] = useState<boolean>()
  // const [Latitude] = useState<string>('')
  // const [Longitude] = useState<string>('')
  // const [Cellular_network] = useState<string>('')
  // const [Wifi_network] = useState<string>('')
  // const [createdAt] = useState<string>('')
  // const [updatedAt] = useState<string>('')

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.events)

  useEffect(() => {
    dispatch(
      fetchData({
        OS,
        q: value,
        dates
      })
    )
  }, [dispatch, OS, value, dates])

  const handleOSChange = useCallback((e: SelectChangeEvent) => {
    setOS(e.target.value)
  }, [])

  const handleFilter = (val: string) => {
    setValue(val)
  }

  const handleOnChangeRange = (dates: any) => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Events' />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Event Date'
                        end={endDateRange as number | Date}
                        start={startDateRange as number | Date}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <TableHeader value={value} handleFilter={handleFilter} />
            <DataGrid
              autoHeight
              pagination
              rows={store.allData}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Card>
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default EventsList
