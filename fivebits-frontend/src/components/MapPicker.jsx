import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapPicker.css';

// Fix default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ latitude, longitude, onChange }) {
  const defaultCenter = [7.8731, 80.7718]; // Center of Sri Lanka
  const [position, setPosition] = useState(
    latitude && longitude ? [latitude, longitude] : null
  );

  useEffect(() => {
    if (position) {
      onChange({ latitude: position[0], longitude: position[1] });
    }
  }, [position]);

  return (
    <div className="map-picker">
      <label className="map-picker-label">Pin Location on Map</label>
      <p className="map-picker-hint">Click on the map to set your boarding place location</p>
      <MapContainer
        center={position || defaultCenter}
        zoom={position ? 15 : 8}
        className="map-picker-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
      {position && (
        <div className="map-picker-coords">
          <span>Lat: {position[0].toFixed(6)}</span>
          <span>Lng: {position[1].toFixed(6)}</span>
        </div>
      )}
    </div>
  );
}
