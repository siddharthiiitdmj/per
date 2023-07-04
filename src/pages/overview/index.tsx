// ** Next Import

// import axios from 'axios'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Demo Components Imports

import ChartjsPolarAreaChart from 'src/views/charts/chartjs/ChartjsPolarAreaChart'

// ** Third Party Styles Import
import 'chart.js/auto'
import { useEffect, useState } from 'react'
import ChartjsLineChart from 'src/views/charts/chartjs/ChartjsLineChart'

// ** Types Imports
import { AppDispatch } from 'src/store'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { fetchData } from 'src/store/apps/events'
import { fetchDeviceData } from 'src/store/apps/device'


const ChartJS = () => {
  const [OS] = useState<string>('')
  const [dates] = useState<Date[]>([])
  const [value] = useState<string>('')
  const theme = useTheme()

  // Vars
  const yellowColor = '#ffe802'
  const primaryColor = '#836af9'
  const polarChartGrey = '#4f5d70'
  const polarChartInfo = '#299aff'
  const polarChartGreen = '#28dac6'
  const polarChartWarning = '#ff8131'
  const legendColor = '#FFF'
  const lineChartWarning = '#ff9800'
  const lineChartYellow = '#d4e157'
  const lineChartPrimary = '#9e69fd'
  const borderColor = theme.palette.divider
  const labelColor = theme.palette.text.disabled
  const whiteColor = '#fff'
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const fetchDataAndDeviceData = async () => {
      dispatch(fetchData({
        OS,
        q: value,
        dates
      }))
      dispatch(fetchDeviceData({
        OS
      }))
    }
  
    fetchDataAndDeviceData()
  }, [dispatch, OS, value, dates])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} md={6}>
          <ChartjsPolarAreaChart
            yellow={yellowColor}
            info={polarChartInfo}
            grey={polarChartGrey}
            primary={primaryColor}
            green={polarChartGreen}
            legendColor={legendColor}
            warning={polarChartWarning}
          />
        </Grid>
        <Grid item xs={12}>
          <ChartjsLineChart
            white={whiteColor}
            labelColor={labelColor}
            success={lineChartYellow}
            borderColor={borderColor}
            legendColor={legendColor}
            primary={lineChartPrimary}
            warning={lineChartWarning}
          />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default ChartJS
