// ** Next Import
import dynamic from 'next/dynamic'

// import axios from 'axios'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Demo Components Imports
import AnalyticsTotalProfit from 'src/views/dashboards/analytics/AnalyticsTotalProfit'

import ChartjsPolarAreaChart from 'src/views/charts/chartjs/ChartjsPolarAreaChart'

// import ApexDonutChart from 'src/views/charts/apex-charts/ApexDonutChart'

// ** Third Party Styles Import
import 'chart.js/auto'
import { useEffect, useState } from 'react'
import ChartjsLineChart from 'src/views/charts/chartjs/ChartjsLineChart'

// import { useSettings } from 'src/@core/hooks/useSettings'

// ** Types Imports
import { AppDispatch } from 'src/store'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Actions Imports
import { fetchDeviceData } from 'src/store/apps/device'
import { fetchData } from 'src/store/apps/events'
import ChartjsBarChart from 'src/views/charts/chartjs/ChartjsBarChart'
import ChartjsAreaChart from 'src/views/charts/chartjs/ChartjsAreaChart'
import ListWithSwitch from 'src/views/components/list/ListStickySubheader'

const CountryMap = dynamic(() => import('src/views/charts/maps/CountryMap'), { ssr: false })

// import RechartsLineChart from 'src/views/charts/recharts/RechartsLineChart'

const ChartJS = () => {
  const [OS] = useState<string>('')
  const [dates] = useState<Date[]>([])
  const [value] = useState<string>('')
  const theme = useTheme()

  // const { settings } = useSettings()

  // Vars
  const yellowColor = '#ffe802'
  const primaryColor = '#836af9'
  const polarChartGrey = '#4f5d70'
  const polarChartInfo = '#299aff'
  const polarChartGreen = '#28dac6'
  const polarChartWarning = '#ff8131'
  const legendColor = '#8a8891de'
  const lineChartWarning = '#ff9800'
  const lineChartYellow = '#d4e157'
  const lineChartPrimary = '#9e69fd'
  const areaChartRed = 'rgb(247, 56, 42,0.7)'
  const areaChartBlueLight = '#84d0ff'
  const areaChartGreyLight = '#edf1f4'
  const borderColor = theme.palette.divider
  const labelColor = theme.palette.text.disabled
  const whiteColor = '#fff'
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const fetchDataAndDeviceData = async () => {
      dispatch(
        fetchData({
          OS,
          q: value,
          startDate: new Date(''),
          endDate: new Date('')
        })
      )
      dispatch(
        fetchDeviceData({
          OS,
          q: value
        })
      )
    }

    fetchDataAndDeviceData()
  }, [dispatch, OS, value, dates])

  return (
    <DatePickerWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} md={6}>
          <Grid container spacing={6}>
          <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='10.23k'
                icon={<Icon icon='mdi:poll' />}
                color='secondary'
                trendNumber='+42%'
                title='Total Devices'
                subtitle='Weekly Devices'
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='5.644k'
                icon={<Icon icon='mdi:poll' />}
                color='secondary'
                trendNumber='+42%'
                title='Total Users'
                subtitle='Weekly users'
              />
            </Grid>
            <Grid item xs={6}>
              <AnalyticsTotalProfit />
            </Grid>
            <Grid item xs={6}>
              <AnalyticsTotalProfit />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='4.4k'
                icon={<Icon icon='mdi:poll' />}
                color='secondary'
                trendNumber='+42%'
                title='New Devices'
                subtitle='Weekly Devices'
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats='2.34k'
                icon={<Icon icon='mdi:poll' />}
                color='secondary'
                trendNumber='+42%'
                title='New Users'
                subtitle='Weekly users'
              />
            </Grid>
            <Grid item xs={6}>
              <AnalyticsTotalProfit />
            </Grid>
            <Grid item xs={6}>
              <AnalyticsTotalProfit />
            </Grid>
          </Grid>
        </Grid>

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
        <Grid item xs={12} md={6}>
          <ChartjsBarChart labelColor={labelColor} borderColor={borderColor} />
        </Grid>
        <Grid item xs={12} md={8}>
          {/* <ApexDonutChart />
           */}
           <CountryMap/>
        </Grid>
        <Grid item xs={12} md={4}>
          <ListWithSwitch/>
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
        <Grid item xs={12}>
          <ChartjsAreaChart
            white={whiteColor}
            red={areaChartRed}
            labelColor={labelColor}
            borderColor={borderColor}
            legendColor={legendColor}
            blueLight={areaChartBlueLight}
            greyLight={areaChartGreyLight}
          />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

export default ChartJS
