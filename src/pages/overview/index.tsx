// ** Next Import

// import axios from 'axios'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Demo Components Imports

import ChartjsPolarAreaChart from 'src/views/charts/chartjs/ChartjsPolarAreaChart'

// ** Third Party Styles Import
import 'chart.js/auto'

const ChartJS = () => {
  // ** Hook

  // Vars
  const yellowColor = '#ffe802'
  const primaryColor = '#836af9'
  const polarChartGrey = '#4f5d70'
  const polarChartInfo = '#299aff'
  const polarChartGreen = '#28dac6'
  const polarChartWarning = '#ff8131'
  const legendColor = '#FFF'

  // const pieData = async () => {
  //   const res = axios.get(`http://localhost:3000/api/devices/stats2?os=${OS}`)
  // }
  // pieData()

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
      </Grid>
    </DatePickerWrapper>
  )
}

export default ChartJS
