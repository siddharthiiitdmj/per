import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Popup, CircleMarker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { AppDispatch, RootState } from 'src/store'
import { useDispatch, useSelector } from 'react-redux'

import { fetchUserSpecificEventsData } from 'src/store/apps/userSpecificEvents'

interface Props {
  data: any
}

const ActivityMap = ({ data }: Props) => {
  const [locationData, setLocationData] = useState([])
  const id = data

  // const position = { lat: 51.505, lng: -0.09 }; // Example initial position
  // const positions = [
  //   { lat: 51.505, lng: -0.09 },
  //   { lat: 52.52, lng: 13.405 },
  //   { lat: 40.712, lng: -74.006 },
  //   { lat: 50.434, lng: -23.877 }
  // ]

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

  // useEffect(() => {
  //   // console.log('locationData: ', locationData)
  //   positions = locationData
  // }, [locationData])

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
    <MapContainer center={locationData[0]} zoom={2} style={{ width: '100%', height: '500px' }}>
      <TileLayer
        url='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=en'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FitBoundsMap />
      {locationData?.map((position, index) => (
        <CircleMarker key={index} center={position} radius={8} color='blue'>
          <Popup>
            Circle marker #{index + 1}. <br /> Easily customizable.
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}

export default ActivityMap
