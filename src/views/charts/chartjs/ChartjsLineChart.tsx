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

import { AppDispatch, RootState } from 'src/store'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchLineStatsData } from 'src/store/apps/lineStats'

interface LineProps {
  white: string
  warning: string
  primary: string
  success: string
  labelColor: string
  borderColor: string
  legendColor: string
}

const ChartjsLineChart = (props: LineProps) => {
  // ** Props
  const { white, primary, warning, labelColor, borderColor, legendColor } = props
  const colors = ['#fff', '#ff8131', '#28dac6', '#299aff', '#836af9', '#ffe802', '#f30101eb']

  const [timePeriod, setTimePeriod] = useState<string>('monthly')
  const [OS, setOS] = useState('All')
  const [yAxis, setYAxis] = useState({
    min: 0,
    max: 160,
    stepSize: 40
  })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.lineStats)

  useEffect(() => {
    dispatch(
      fetchLineStatsData({
        OS
      })
    )
  }, [dispatch, OS])

  const findYAxis = () => {
    const yAxisData = Object.entries((store?.lineChartData as { [key: string]: any })[timePeriod] || {}).map(
      ([, values]) => ({
        data: Object.values(values as { [s: string]: number | null }) as (number | null)[]
      })
    )

    // Find the minimum and maximum values among the numbers in the data array
    let min: number | null = null
    let max: number | null = null

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

  const data: ChartData<'line'> = {
    labels: (store?.lineChartData as { [key: string]: any })[timePeriod]
      ? Object.keys((store?.lineChartData as { [key: string]: any })[timePeriod]?.['isVPNSpoofed'])
      : [],
    datasets: Object.entries((store?.lineChartData as { [key: string]: any })[timePeriod] || {}).map(
      ([property, values], index) => ({
        fill: false,
        tension: property === 'riskyDevices' ? 0.9 : 0.5,
        pointRadius: 1,
        label: property,
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: colors[index],
        backgroundColor: colors[index],
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: index === 0 ? primary : warning,
        data: Object.values(values as { [s: string]: number | null }) as (number | null)[]
      })
    )
  }

  const handleOsChange = (event: SelectChangeEvent) => {
    setOS(event.target.value as string)
  }

  const handleTimeChange = (event: SelectChangeEvent) => {
    setTimePeriod(event.target.value as string)
  }

  return (
    <Card>
      <CardHeader title='Malicious Device Info' subheader='Can sort by OS and Time Period' />
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
      <CardContent>
        <Line data={data} height={400} options={options} />
      </CardContent>
    </Card>
  )
}

export default ChartjsLineChart
