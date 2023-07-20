import React, { useState, ChangeEvent, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import MuiInput from '@mui/material/Input'
import Switch from '@mui/material/Switch'
import { Card, CardContent } from '@mui/material'

const Input = styled(MuiInput)`
  width: 42px;
`

const Fields: string[] = ['isVPNSpoofed', 'isVirtualOS', 'isEmulator', 'isAppSpoofed', 'isAppPatched', 'isAppCloned']

export default function Configurations() {
  const [values, setValues] = useState<{ [key: string]: number | string }>(
    Fields.reduce((acc, field) => {
      acc[field] = 30

      return acc
    }, {} as { [key: string]: number | string }) // Type assertion
  )

  const [sliderEnabled, setSliderEnabled] = useState<{ [key: string]: boolean }>(
    Fields.reduce((acc, field) => {
      acc[field] = true

      return acc
    }, {} as { [key: string]: boolean })
  )

  const handleSliderChange = (field: string) => (event: Event, newValue: number | number[]) => {
    setValues(prevValues => ({
      ...prevValues,
      [field]: newValue as number | string
    }))
  }

  const handleInputChange = (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value === '' ? '' : Number(event.target.value)
    setValues(prevValues => ({
      ...prevValues,
      [field]: newValue
    }))
  }

  const handleBlur = (field: string) => () => {
    const numericValue = typeof values[field] === 'number' ? values[field] : parseInt(values[field] as string, 10)
    if (typeof numericValue === 'number' && !isNaN(numericValue)) {
      if (numericValue < 0) {
        setValues(prevValues => ({
          ...prevValues,
          [field]: 0
        }))
      } else if (numericValue > 100) {
        setValues(prevValues => ({
          ...prevValues,
          [field]: 100
        }))
      }
    }
  }

  const handleSwitchChange = (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const newSliderEnabled = { ...sliderEnabled, [field]: event.target.checked }
    setSliderEnabled(newSliderEnabled)
    if (!event.target.checked) {
      // Disable the slider by setting its value to the previous value
      setValues(prevValues => ({
        ...prevValues,
        [field]: prevValues[field]
      }))
    }
  }

  useEffect(() => {
    console.log('values:', values)
  }, [values])

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h6'>Configurations</Typography>
            <Typography variant='body1' sx={{ color: 'text.secondary' }}>
              Adjust the severity of malicious indicators
            </Typography>
          </Box>
          <Box>
            <Grid container spacing={2} alignItems='center'>
              {Fields.map(field => (
                <Grid key={field} item xs={12} md={4}>
                  <React.Fragment>
                    <Typography id={`${field}-slider`} gutterBottom>
                      {field}
                    </Typography>
                    <Grid container spacing={2} alignItems='center'>
                      <Grid item xs>
                        <Slider
                          value={values[field] as number}
                          onChange={handleSliderChange(field)}
                          aria-labelledby={`${field}-slider`}
                          disabled={!sliderEnabled[field]} // Disable the slider based on the switch state
                        />
                      </Grid>
                      <Grid item>
                        <Input
                          value={values[field]}
                          size='small'
                          onChange={handleInputChange(field)}
                          onBlur={handleBlur(field)}
                          inputProps={{
                            step: 10,
                            min: 0,
                            max: 100,
                            type: 'number',
                            'aria-labelledby': `${field}-slider`
                          }}
                          disabled={!sliderEnabled[field]} // Disable the input field based on the switch state
                        />
                      </Grid>
                      <Grid item>
                        <Switch checked={sliderEnabled[field]} onChange={handleSwitchChange(field)} />
                      </Grid>
                    </Grid>
                  </React.Fragment>
                </Grid>
              ))}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}
