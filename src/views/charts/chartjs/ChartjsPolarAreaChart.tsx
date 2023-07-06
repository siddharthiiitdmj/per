// ** MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

// ** Third Party Imports
import { ChartData, ChartOptions } from 'chart.js'
import { useEffect, useState } from 'react'
import { PolarArea } from 'react-chartjs-2'

import { AppDispatch, RootState } from 'src/store'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchPieStatsData } from 'src/store/apps/pieStats'

// ** Custom Components Imports
// import OptionsMenu from 'src/@core/components/option-menu'

interface PolarAreaProps {
  info: string
  grey: string
  green: string
  yellow: string
  primary: string
  warning: string
  legendColor: string
}

const ChartjsPolarAreaChart = (props: PolarAreaProps) => {
  // ** Props
  const { info, grey, green, yellow, primary, warning, legendColor } = props

  // States
  const [OS, setOS] = useState<string>('All')
  const [activeDate, setActiveDate] = useState<number>(30)

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.pieStats)

  // Handlers
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

  const options: ChartOptions<'polarArea'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 500 },
    layout: {
      padding: {
        top: -5,
        bottom: 0,
        right: 10
      }
    },
    scales: {
      r: {
        grid: { display: false },
        ticks: { display: false }
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 25,
          boxWidth: 10,
          color: legendColor,
          usePointStyle: true
        }
      }
    }
  }

  const data: ChartData<'polarArea'> = {
    labels: store.pieChartData[activeDate]
      ? Object.entries(store.pieChartData[activeDate]).map(([key, value]) => `${key}: ${value}`)
      : [],
    datasets: [
      {
        borderWidth: 0.5,
        label: 'No. of Devices',
        data: store.pieChartData[activeDate] ? Object.values(store.pieChartData[activeDate]) : [],
        backgroundColor: [primary, yellow, warning, info, grey, green]
      }
    ]
  }

  return (
    <Card>
      <CardHeader title='Malicious Devices' />
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
        <PolarArea data={data} height={350} options={options} />
      </CardContent>
    </Card>
  )
}

export default ChartjsPolarAreaChart
