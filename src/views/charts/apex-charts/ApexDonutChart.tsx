// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import api from '../../../helper/api'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Component Import
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { useEffect, useState } from 'react'
import FallbackSpinner from 'src/layouts/components/spinner'

// const donutColors = {
//   series1: '#fdd835',
//   series2: '#00d4bd',
//   series3: '#826bf8',
//   series4: '#32baff',
//   series5: '#ffa1a1'
// }

const ApexDonutChart = () => {
  // ** Hook
  const theme = useTheme()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      const res = await api.get('/events/getCountries')
      const newData = res.data
      setData(newData)
    }

    fetchData()
    setLoading(false)
  }, [])

  // useEffect(() => {
  //   console.log('countryData: ', data)
  // }, [data])

  const colors = [
    '#FF7777', // Red
    '#5D82FF', // Blue
    '#A1FF9E', // Light Green
    '#FFE459', // Yellow
    '#936EFF', // Purple
    '#FFB35C', // Amber
    '#FF614D', // Orange
    '#FF609F', // Pink
    '#62C4FF', // Light Blue
    '#FF8E4B', // Deep Orange
    '#76FF8E', // Green
    '#5769FF' // Indigo
  ]
  const labels = Object.keys(data)
  const values: any = Object.values(data)

  const options: ApexOptions = {
    stroke: { width: 0 },
    labels: labels ? labels : [],
    colors: colors,
    dataLabels: {
      enabled: true,
      formatter: (val: string) => `${parseInt(val, 10)}%`
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      labels: { colors: theme.palette.text.secondary },
      itemMargin: {
        vertical: 3,
        horizontal: 10
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '1.2rem'
            },
            value: {
              fontSize: '1.2rem',
              color: theme.palette.text.secondary,
              formatter: (val: string) => `${parseInt(val, 10)}`
            },
            total: {
              show: true,
              fontSize: '1.2rem',
              label: labels ? labels[0] : '',
              formatter: () => (values ? values[0] : ''),
              color: theme.palette.text.primary
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1rem'
                  },
                  value: {
                    fontSize: '1rem'
                  },
                  total: {
                    fontSize: '1rem'
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='Ratio by Country'
        subheader='Country-wise Device Logins'
        subheaderTypographyProps={{ sx: { color: theme => `${theme.palette.text.disabled} !important` } }}
      />
      {loading ? (
        <FallbackSpinner />
      ) : (
        <CardContent>
        <ReactApexcharts type='donut' height={400} options={options} series={values ? values : []} />
      </CardContent>
      )}
      
    </Card>
  )
}

export default ApexDonutChart
