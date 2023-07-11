// ** React Imports
import { forwardRef, useEffect, useState } from 'react'

// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

// ** Icon Imports

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports

// ** Utils Import

// ** Actions Imports
import { fetchUserSpecificEventsData } from 'src/store/apps/userSpecificEvents'

// ** Third Party Imports
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Types Imports
import { AppDispatch, RootState } from 'src/store'
import { EventsType } from 'src/types/apps/eventTypes'
import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Custom Components Imports
import { styled } from '@mui/material/styles'
import Link from 'next/link'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Custom Table Components Imports

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
    field: 'deviceId',
    headerName: 'Device ID',
    renderCell: ({ row }: CellType) => {
      const { deviceId } = row

      return <LinkStyled href={`/info/device/${deviceId}`}>{`${deviceId}`}</LinkStyled>
    }
  },
  {
    flex: 0.15,
    field: 'OS',
    minWidth: 80,
    headerName: 'OS',
    renderCell: ({ row }: CellType) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>{row.OS}</Box>
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

interface Props {
  data: any
}

const UserEvents = ({ data }: Props) => {
  // ** State
  const [id] = useState<string>(data)
  const [OS] = useState<string>('')
  const [dates, setDates] = useState<Date[]>([])
  const [value] = useState<string>('')
  const [endDateRange, setEndDateRange] = useState<DateType>(null)
  const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.userSpecificEvents)

  useEffect(() => {
    dispatch(
      fetchUserSpecificEventsData({
        id,
        OS,
        q: value,
        dates
      })
    )
  }, [dispatch, OS, value, dates, id])

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
            <Card>
              <CardContent>
                <Grid container spacing={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant='h6'>Associated Events</Typography>
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
            {/* <TableHeader value={value} handleFilter={handleFilter} /> */}
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

export default UserEvents
