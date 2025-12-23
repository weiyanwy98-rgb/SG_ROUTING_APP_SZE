// BlockageLayer.jsx
import { GeoJSON, Circle } from "react-leaflet";
import L from "leaflet";
import { normalIcon } from "../icon";
import { renderPopup } from "../schema/popup_render";
import { POPUP_SCHEMA } from "../schema/popup_schema";

export default function BlockageLayer({
  blockageLayers,
  selectedBlockage,
  setSelectedBlockage
}) {
  return (
    <>
      {blockageLayers.map((layer, idx) => (
        <GeoJSON
          key={idx}
          data={layer.data}
          pointToLayer={(feature, latlng) =>
            L.marker(latlng, { icon: normalIcon })
          }
          onEachFeature={(feature, layerObj) => {
            layerObj.bindPopup(
              renderPopup(feature.properties, POPUP_SCHEMA)
            );

            layerObj.on("click", (e) => {
              L.DomEvent.stopPropagation(e);
              setSelectedBlockage(feature.properties?.name);
              layerObj.openPopup();
            });
          }}
        />
      ))}

      {/* Radius circles */}
      {blockageLayers.flatMap(layer =>
        layer.data.features.map((feature, i) => {
          const [lng, lat] = feature.geometry.coordinates;
          const isSelected =
            feature.properties?.name === selectedBlockage;

          return (
            <Circle
              key={`radius-${i}`}
              center={[lat, lng]}
              radius={feature.properties["distance (meters)"] || 50}
              pathOptions={{
                color: isSelected ? "#8b0000" : "#ff0000",
                fillOpacity: isSelected ? 0.45 : 0.2,
                weight: isSelected ? 4 : 2,
              }}
            />
          );
        })
      )}
    </>
  );
}
