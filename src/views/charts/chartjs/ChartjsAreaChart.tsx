// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// import Grid from '@mui/material/Grid'

// ** Third Party Imports
import { ChartData, ChartOptions } from 'chart.js'
import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import api from 'src/helper/api'
import { AppDispatch, RootState } from 'src/store'
import ChipsIcon from 'src/views/components/chips/ChipsIcon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchLineStatsData } from 'src/store/apps/lineStats'
import { Grid } from '@mui/material'
import FallbackSpinner from 'src/layouts/components/spinner'

interface AreaProps {
  red: string
  white: string
  blueLight: string
  greyLight: string
  labelColor: string
  borderColor: string
  legendColor: string
}

const ChartjsAreaChart = (props: AreaProps) => {
  // ** Props
  const {  red, greyLight, labelColor, borderColor, legendColor } = props

  // ** States
  const [timePeriod, setTimePeriod] = useState<string>('monthly')
  const [OS, setOS] = useState('All')
  const [riskValue, setRiskValue] = useState(0)
  const [loading, setLoading] = useState<boolean>(false)

  const [yAxis, setYAxis] = useState({
    min: 0,
    max: 160,
    stepSize: 40
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.lineStats)

  useEffect(() => {
    setLoading(true)
    dispatch(
      fetchLineStatsData({
        OS
      })
    )

    fetchConfig()

    setLoading(false)
  }, [dispatch, OS])


  const fetchConfig = async () => {
    const res = await api.get('/configurations/')
    const configData = res.data
    let value = 0
    configData.map((item: any) => {
      if (item.field == 'Threshold') {
        value = item.value
      }
    })

    // console.log('Risk value: ', value)

    setRiskValue(value)
  }

  const findYAxis = () => {
    const yAxisData = Object.entries((store?.lineChartData as { [key: string]: any })[timePeriod] || {}).map(
      ([, values]) => ({
        data: Object.values(values as { [s: string]: number | null }) as (number | null)[]
      })
    )

    // Find the minimum and maximum values among the numbers in the data array
    let min = Infinity
    let max = -Infinity

    yAxisData.forEach(({ data }) => {
      const validNumbers = data.filter(value => value !== null) as number[]

      if (validNumbers.length > 0) {
        const currentMin = Math.min(...validNumbers)
        const currentMax = Math.max(...validNumbers)

        if (min === null || currentMin < min) {
          min = currentMin
        }

        if (max === null || currentMax > max) {
          max = currentMax
        }
      }
    })

    return { min, max }
  }

  useEffect(() => {
    const { min, max } = findYAxis()
    const stepSize = Math.floor((max - min) / 4)
    setYAxis({
      min: Math.max(0, min - 2),
      max: max + 2,
      stepSize
    })
  }, [store, timePeriod])

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: -20 }
    },
    scales: {
      x: {
        ticks: { color: labelColor },
        grid: {
          color: borderColor
        }
      },
      y: {
        min: yAxis.min,
        max: yAxis.max,
        ticks: {
          stepSize: yAxis.stepSize,
          color: labelColor
        },
        grid: {
          color: borderColor
        }
      }
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 10,
          color: legendColor,
          usePointStyle: true
        }
      }
    }
  }

  const labels = (store?.lineChartData as { [key: string]: any })[timePeriod]
    ? Object.keys((store?.lineChartData as { [key: string]: any })[timePeriod]?.['riskyDevices'])
    : []
  const datasets = Object.entries((store?.lineChartData as { [key: string]: any })[timePeriod] || {}).filter(
    key => key[0] === 'riskyDevices'
  )

  const data: ChartData<'line'> = {
    labels: labels,
    datasets: datasets.map(([property, values]) => ({
      fill: true,
      tension: 0,
      pointRadius: 0.5,
      label: property,
      pointHoverRadius: 5,
      pointStyle: 'circle',
      pointHoverBorderWidth: 5,
      borderColor: red,
      backgroundColor: '#e52d2da6',
      pointHoverBorderColor: greyLight,
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: red,
      data: Object.values(values as { [s: string]: number | null }) as (number | null)[]
    }))
  }

  const handleOsChange = (event: SelectChangeEvent) => {
    setOS(event.target.value as string)
  }

  const handleTimeChange = (event: SelectChangeEvent) => {
    setTimePeriod(event.target.value as string)
  }

  return (
    <Card>
      <CardHeader title='Risky Devices Info' subheader='Can sort by OS and Time Period' />
      <Grid container justifyContent='space-between' alignItems='center'>
        <Grid item>
          <FormControl sx={{ width: 100, mx: 8 }}>
            <InputLabel
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              id='controlled-select-label'
            >
              OS
            </InputLabel>
            <Select
              sx={{ height: 45 }}
              value={OS}
              label='Controlled'
              id='controlled-select'
              onChange={handleOsChange}
              labelId='controlled-select-label'
            >
              <MenuItem value={'All'}>All</MenuItem>
              <MenuItem value={'Android'}>Android</MenuItem>
              <MenuItem value={'iOS'}>iOS</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: 110 }}>
            <InputLabel
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              id='controlled-select-label'
            >
              Time Period
            </InputLabel>
            <Select
              sx={{ height: 45 }}
              value={timePeriod}
              label='Controlled'
              id='controlled-select'
              onChange={handleTimeChange}
              labelId='controlled-select-label'
            >
              <MenuItem value={'daily'}>Daily</MenuItem>
              <MenuItem value={'weekly'}>Weekly</MenuItem>
              <MenuItem value={'monthly'}>Monthly</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <ChipsIcon riskValue={riskValue} />
        </Grid>
      </Grid>
      {loading ? (
        <FallbackSpinner />
      ) : (
        <CardContent>
          <Line data={data} height={400} options={options} />
        </CardContent>
      )}
    </Card>
  )
}

export default ChartjsAreaChart
