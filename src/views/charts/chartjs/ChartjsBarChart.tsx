// ** React Imports

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { Bar } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

import { fetchPieStatsData } from 'src/store/apps/pieStats'

// ** Types
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { useEffect, useState } from 'react'

interface BarProp {
  labelColor: string
  borderColor: string
}

const ChartjsBarChart = (props: BarProp) => {
  // ** Props
  const { labelColor, borderColor } = props

  // ** States
  const [OS, setOS] = useState<string>('All')
  const [activeDate, setActiveDate] = useState<number>(30)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.pieStats)
  console.log('store data: ', store.pieChartData)

  const handleOsChange = (event: SelectChangeEvent) => {
    setOS(event.target.value as string)
  }

  const handleActiveDate = (event: React.MouseEvent<HTMLElement>, newActive: string | null) => {
    if (newActive !== null) {
      setActiveDate(parseInt(newActive))
      console.log(newActive)
    }
  }

  useEffect(() => {
    dispatch(
      fetchPieStatsData({
        OS
      })
    )
  }, [dispatch, OS])

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    scales: {
      x: {
        grid: {
          color: borderColor
        },
        ticks: { color: labelColor }
      },
      y: {
        min: 0,
        max: 150,
        grid: {
          color: borderColor
        },
        ticks: {
          stepSize: 25,
          color: labelColor
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }

  const colors = [
    '#FF6384', // Red
    '#36A2EB', // Blue
    '#FFCE56', // Yellow
    '#4BC0C0', // Teal
    '#9966FF', // Purple
    '#FF9F40' // Orange
  ]

  const labels = Object.keys(store.pieChartData[activeDate] ? store.pieChartData[activeDate] : {})
  const dataValues = Object.values(store.pieChartData[activeDate] ? store.pieChartData[activeDate] : {})

  const data: ChartData<'bar'> = {
    labels: labels.map(label => label.substring(2)), // Extracting label names without 'is' prefix
    datasets: [
      {
        maxBarThickness: 15,
        backgroundColor: colors.slice(0, dataValues.length),
        borderColor: 'transparent',
        borderRadius: { topRight: 15, topLeft: 15 },
        data: dataValues as []
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='Malicious Devices'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [2, 0] }
        }}
      />
      <Grid container spacing={2} sx={{ px: 4 }}>
        <Grid item xs={12} md={6}>
          <FormControl sx={{ width: 100 }}>
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
        </Grid>
        <Grid item xs={12} md={6}>
          <ToggleButtonGroup exclusive value={activeDate} onChange={handleActiveDate} sx={{ height: 35 }}>
            <ToggleButton value={1}>1 Day</ToggleButton>
            <ToggleButton value={7}>7 Days</ToggleButton>
            <ToggleButton value={30}>30 Days</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <CardContent>
        <Bar data={data} height={400} options={options} />
      </CardContent>
    </Card>
  )
}

export default ChartjsBarChart
