import axios from 'axios'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'

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

  // const [timePeriod, setTimePeriod] = useState('monthly')
  const [OS, setOS] = useState('All')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/devices/stats?os=${OS}`)
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

  useEffect(() => {
    console.log(myData)
    console.log(OS)
  }, [myData, OS])

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
    labels: myData ? Object.keys(myData.monthly.isVPNSpoofed) : [],
    datasets: Object.entries(myData?.monthly || {}).map(([property, values], index) => ({
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
      data: Object.values(values)
    }))
  }
  const handleOsChange = (event: SelectChangeEvent) => {
    setOS(event.target.value as string)
  }

  return (
    <Card>
      <CardHeader title='New Technologies Data' subheader='Commercial networks & enterprises' />
      <FormControl sx={{ width: 100, ml: 8 }}>
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
      <CardContent>
        <Line data={data} height={400} options={options} />
      </CardContent>
    </Card>
  )
}

export default ChartjsLineChart
