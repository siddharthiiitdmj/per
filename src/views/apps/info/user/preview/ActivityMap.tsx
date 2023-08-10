import React,{useEffect} from 'react';
import { MapContainer, TileLayer, Popup,CircleMarker,useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


const ActivityMap: React.FC = () => {



  // const position = { lat: 51.505, lng: -0.09 }; // Example initial position
  const positions = [
    { lat: 51.505, lng: -0.09 }, // Example position 1
    { lat: 52.520, lng: 13.405 }, // Example position 2
    { lat: 40.712, lng: -74.006 },
    {lat:50.434,lng:-23.877}
  ];

  const FitBoundsMap: React.FC = () => {
    const map = useMap();

    useEffect(() => {
      if (positions.length > 0) {
        const bounds = L.latLngBounds(positions);
        map.fitBounds(bounds);
      }
    }, [map]);

    return null; // This component doesn't render anything
  };

  return (
    <MapContainer  center={positions[0]} zoom={2} style={{ width: '100%', height: '500px' }}>
      <TileLayer
        url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=en"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <FitBoundsMap />
      {positions.map((position, index) => (
        <CircleMarker key={index} center={position} radius={8} color="blue">
          <Popup>
            Circle marker #{index + 1}. <br /> Easily customizable.
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default ActivityMap;
