import api from 'src/helper/api'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// import Grid from '@mui/material/Grid'

// ** Third Party Imports
import { Line } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'
import { useEffect, useState } from 'react'

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
  const [myData, setMyData] = useState(null)
  const colors = ['#fff', '#ff8131', '#28dac6', '#299aff', '#836af9', '#ffe802']

  const [timePeriod, setTimePeriod] = useState('monthly')
  const [OS, setOS] = useState('All')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/devices/stats?os=${OS}`)
        if (res.status === 200) {
          const newData = res.data
          setMyData(newData)

          // console.log(myData)
        } else {
          console.error('Failed to fetch data:', res.status)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchData()
  }, [OS])

  // const stepSize = 0
  // let maxValue = 160
  useEffect(() => {
    console.log(myData)
    console.log(OS)
    console.log(timePeriod)

    // maxValue = timePeriod ? Math.max(...Object.values(myData?.[timePeriod]?.isVPNSpoofed || [])) : 160
    // console.log(maxValue)
  }, [myData, OS, timePeriod])

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
        min: 0,
        max: 160,
        ticks: {
          stepSize: 40,
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
    labels: myData ? Object.keys(myData[timePeriod]['isVPNSpoofed']) : [],
    datasets: Object.entries(myData?.[timePeriod] || {}).map(([property, values], index) => ({
      fill: false,
      tension: 0.5,
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
      <CardHeader title='New Technologies Data' subheader='Commercial networks & enterprises' />
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
