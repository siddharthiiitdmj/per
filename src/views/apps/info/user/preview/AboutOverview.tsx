// ** MUI Components
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useEffect, useState } from 'react'

interface arrType {
  value: string
  property: string
}

const renderList = (arr: arrType[], handleLocationClick: any) => {
  if (arr && arr.length) {
    return arr.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            display: 'flex',
            '&:not(:last-of-type)': { mb: 4 },
            '& svg': { color: 'text.secondary' },
            cursor: item.property === 'location' ? 'pointer' : 'default' // Make the location clickable
          }}
          onClick={
            item.property === 'location'
              ? () => handleLocationClick(item.value)
              : () => {
                  return
                }
          } // Handle location click
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
            <Typography
              sx={{
                flex: '1 1 33%',
                fontWeight: 600,
                color: 'text.secondary'
              }}
            >
              {`${item.property.charAt(0).toUpperCase() + item.property.slice(1)}:`}
            </Typography>
            <Typography
              sx={{
                flex: '2 2 66%',
                color: 'text.secondary'
              }}
            >
              {typeof item.value === 'string' ? item.value.charAt(0).toUpperCase() + item.value.slice(1) : item.value}
            </Typography>
          </Box>
        </Box>
      )
    })
  } else {
    return null
  }
}

function convertData(data: { [key: string]: string | null }): { property: string; value: string }[] {
  const allowedProperties = ['id', 'altUserId', 'name', 'email', 'role', 'createdAt', 'updatedAt', 'location']

  return Object.entries(data)
    .filter(([property]) => allowedProperties.includes(property))
    .map(([property, value]) => ({
      property,
      value: value === null ? '' : value
    }))
}

interface Props {
  data: any
}

const AboutOverview = ({ data }: Props) => {
  const arr = convertData(data)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('')

  const handleLocationClick = (location: string) => {
    setSelectedLocation(location)
    setDialogOpen(true)
  }

  useEffect(() => {
    console.log('location: ', selectedLocation)
  }, [selectedLocation])

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 6 }}>
              <Typography variant='caption' sx={{ mb: 5, display: 'block', textTransform: 'uppercase' }}>
                Details
              </Typography>
              {renderList(arr, handleLocationClick)}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Google Maps Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth='md'>
        <DialogTitle>Location Map</DialogTitle>
        <DialogContent>
          <LoadScript googleMapsApiKey='AIzaSyCfsah35lxjcYxzIq8ip5UW9mzYeEBdk5E'>
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={{ lat: 0, lng: 0 }} // Set initial center or provide an actual default location
              zoom={10} // Set an appropriate zoom level
            >
              <Marker position={{ lat: 0, lng: 0 }} /> {/* Set the marker position */}
            </GoogleMap>
          </LoadScript>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default AboutOverview
