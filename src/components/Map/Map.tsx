import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '@/hooks/useNavigation';

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';

import 'leaflet/dist/images/marker-shadow.png';

import styles from './Map.module.css';
import { useCities } from '../../contexts/CitiesContext';
import Button from '../Button/Button';
import { useURLPosition } from '../../hooks/useURLPosition';

const leafletIcon = L.icon({
  iconUrl: '/map-marker.svg',
  shadowUrl: '',
  iconSize: [38, 95],
});

const Map = () => {
  const { cities } = useCities();
  const { mapLat, mapLng } = useURLPosition();
  const [mapPosition, setMapPosition] = useState<LatLngExpression>([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  useEffect(() => {
    if (mapLat && mapLng) setMapPosition([Number(mapLat), Number(mapLng)]);
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition !== null)
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
  }, [geolocationPosition]);

  return (
    <div
      className={styles.mapContainer}
      // onClick={() => navigate('form')}
    >
      {!geolocationPosition ? (
        <Button variant="position" onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Use your position'}
        </Button>
      ) : null}
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities &&
          cities.map((city) => (
            <Marker
              key={city.id}
              icon={leafletIcon}
              position={[city.position.lat, city.position.lng]}
            >
              <Popup>
                <span>{city.emoji}</span>
                <span>{city.cityName}</span>
              </Popup>
            </Marker>
          ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
};

const ChangeCenter = ({ position }: { position: LatLngExpression }) => {
  const map = useMap();
  map.setView(position);
  return null;
};

const DetectClick = () => {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  return null;
};

export default Map;
