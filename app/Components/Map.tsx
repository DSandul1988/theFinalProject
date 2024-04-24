"use client";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
//@ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
// Merge new options into the default icon options of Leaflet's icon class.
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src, // Specify the URL to the marker icon image.
  iconRetinaUrl: markerIcon2x.src, // Specify the URL for the retina version of the marker icon.
  shadowUrl: markerShadow.src, // Specify the URL for the marker shadow image.
});

interface MapProps {
  center?: number[];
  // Optional prop to specify the center of the map as a latitude and longitude array.
}
const Map: React.FC<MapProps> = ({ center }) => {
  return (
    <MapContainer
      center={(center as L.LatLngExpression) || [51, -0.09]} // Set the center of the map. Fallback to London's coordinates if not provided.
      zoom={center ? 4 : 2} // Set zoom level based on whether center is provided.
      scrollWheelZoom={false} // Disable zooming the map with the scroll wheel.
      className="h-[35vh] rounded-lg" // Apply height and rounded border styling
      // Render a TileLayer to display the map tiles from OpenStreetMap.
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {center && <Marker position={center as L.LatLngExpression} />}
    </MapContainer>
  );
};

export default Map;
