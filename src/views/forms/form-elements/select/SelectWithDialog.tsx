// ** React Imports
import api from 'src/helper/api'
import { forwardRef, useState } from 'react'

// ** MUI Imports
import { SelectChangeEvent } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

// for date range picker
// import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Third Party Imports
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import DatePicker from 'react-datepicker'

// ** Types
import { DateType } from 'src/types/forms/reactDatepickerTypes'

interface PickerProps {
  label?: string
  end: Date | number
  start: Date | number
}

const SelectWithDialog = ({
  popperPlacement,
  setRowData,
  createData,
  type
}: {
  popperPlacement: any
  setRowData: any
  createData: any
  type: string
}) => {
  // ** State
  const [open, setOpen] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<DateType>(new Date())
  const [endDate, setEndDate] = useState<DateType>(addDays(new Date(), 15))
  const [OS, setOS] = useState('')

  const handleOsChange = (event: SelectChangeEvent<string>) => {
    setOS(event.target.value)
  }

  const handleOnDateChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const CustomInput = forwardRef((props: PickerProps, ref) => {
    const startDate = format(props.start, 'MM/dd/yyyy')
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <TextField inputRef={ref} label={props.label || ''} {...props} value={value} />
  })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleCancel = () => {
    setOpen(false)
    setOS('')
    setStartDate(new Date())
    setEndDate(addDays(new Date(), 15))
  }
  const handleApply = async () => {
    setOpen(false)

    // const sdate = new Date(startDate)
    const sdate = startDate?.toISOString()
    const edate = endDate?.toISOString()

    // console.log(sdate, typeof sdate)
    // console.log(edate, typeof edate)
    let rows
    if (type === 'devices') {
      const res = await api.get(`/devices/all?startDate=${sdate}&endDate=${edate}&os=${OS}`)

      const fetchedData = res.data

      rows = fetchedData.map((item: any) =>
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
    } else if (type === 'users') {
      const res = await api.get(`/users/all?startDate=${sdate}&endDate=${edate}`)
      const fetchedData = res.data

      rows = fetchedData.map((item: any) => {
        const createdAt = new Date(item.createdAt).toISOString() // Convert to ISO 8601 string

        return createData(item.id, item.name, item.email, item.role, createdAt)
      })
    }
    setRowData(rows)
  }

  return (
    <div>
      <Button variant='outlined' onClick={handleClickOpen}>
        Filter
      </Button>
      <Dialog maxWidth='xs' fullWidth open={open} onClose={handleCancel}>
        <DialogTitle>Select filters</DialogTitle>
        <DialogContent sx={{ pt: theme => `${theme.spacing(2)} !important` }}>
          <form>
            {type === 'devices' && (
              <FormControl sx={{ mr: 4, mb: 4 }}>
                <InputLabel id='demo-dialog-select-label'>OS</InputLabel>
                <Select
                  label='Age'
                  labelId='demo-dialog-select-label'
                  id='demo-dialog-select'
                  defaultValue=''
                  onChange={handleOsChange}
                  value={OS}
                >
                  <MenuItem value={'All'}>All</MenuItem>
                  <MenuItem value={'Android'}>Android</MenuItem>
                  <MenuItem value={'iOS'}>iOS</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* <InputLabel htmlFor='outlined-age-native-simple'>Date Range</InputLabel> */}
            <DatePickerWrapper>
              <DatePicker
                selectsRange
                endDate={endDate}
                selected={startDate}
                startDate={startDate}
                id='date-range-picker'
                onChange={handleOnDateChange}
                shouldCloseOnSelect={true}
                popperPlacement={popperPlacement}
                customInput={
                  <CustomInput label='Date Range' start={startDate as Date | number} end={endDate as Date | number} />
                }
              />
            </DatePickerWrapper>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} variant='outlined'>
            Cancel
          </Button>
          <Button onClick={handleApply} variant='contained'>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default SelectWithDialog
