import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Popup, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import { AppDispatch, RootState } from 'src/store'
import { useDispatch, useSelector } from 'react-redux'

import { fetchUserSpecificEventsData } from 'src/store/apps/userSpecificEvents'

interface Props {
  data: any
}

const customIcon = L.icon({
  iconUrl: '/images/location-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const ActivityMap = ({ data }: Props) => {
  const [locationData, setLocationData] = useState([])
  const id = data


  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.userSpecificEvents)

  useEffect(() => {
    dispatch(
      fetchUserSpecificEventsData({
        id
      })
    )
  }, [dispatch, id])

  useEffect(() => {
    if (store.allData.length > 0) {
      const uniqueData: any = []
      const seenCombinations = new Set()

      store.allData.forEach((item: any) => {
        const lat = item.Latitude
        const lng = item.Longitude
        const combination = `${lat}:${lng}`

        if (!seenCombinations.has(combination)) {
          seenCombinations.add(combination)
          uniqueData.push({ lat, lng })
        }
      })
      setLocationData(uniqueData)

      // console.log('Unique Data: ', locationData)
    }
  }, [store.allData])



  const FitBoundsMap: React.FC = () => {
    const map = useMap()

    useEffect(() => {
      if (locationData.length > 0) {
        const bounds = L.latLngBounds(locationData)
        map.fitBounds(bounds)
      }
    }, [map, locationData])

    return null // This component doesn't render anything
  }

  return (
    <Card>
      <Card>
        <CardContent>
          <Grid container spacing={6} sx={{ display: 'flex' }}>
            <Grid item xs={12} sm={6}>
              <Typography variant='h6'>Recent Locations</Typography>
            </Grid>
          </Grid>
        </CardContent>
      <MapContainer center={locationData[0]} zoom={2} style={{ width: '100%', height: '400px' }}>
        <TileLayer
          url='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=en'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FitBoundsMap />
        {locationData.map((position, index) => (
          <Marker key={index} position={position} icon={customIcon}>
          <Popup>
            Location marker #{index + 1}. <br /> Easily customizable.
          </Popup>
        </Marker>
      ))}
      </MapContainer>
      </Card>
    </Card>
  )
}

export default ActivityMap
