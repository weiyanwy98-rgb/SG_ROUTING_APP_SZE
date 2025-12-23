// MapInteractions.jsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapInteractions({
  addMarker,
  setClickedLatLng,
  updateSelectedCoordinate
}) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e) => {
      if (!addMarker) return;

      const latlng = [e.latlng.lat, e.latlng.lng];
      setClickedLatLng(latlng);
      updateSelectedCoordinate(latlng);
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map, addMarker]);

  return null;
}
