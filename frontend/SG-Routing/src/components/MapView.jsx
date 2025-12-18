import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { useEffect } from "react";
import { renderPopup } from "../schema/popup_render";
import { POPUP_SCHEMA } from "../schema/popup_schema";
import { ZoomControl } from "react-leaflet";

function ChangeCenter({ center, zoom }) {
    const map = useMap();
    //console.log("new center", center);
    useEffect(() => {
        if (!center || !center[0] || !center[1]) return; // prevents "lat of null"
        map.setView(center);
        map.setZoom(zoom);
    }, [center]);

    return null;
}
export default function MapView({ layers, center, zoom, selectedBlockage }) {

    return (
        <div className="w-full h-full">
            <MapContainer
                center={center}
                zoom={zoom}
                className="h-full w-full"
                zoomControl={false}
            >
                <ZoomControl position="bottomright" />
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {layers.map((layer, idx) => (
                    <GeoJSON
                        key={`${idx}-${selectedBlockage}`} // force remount
                        data={layer.data}
                        style={(feature) =>
                            geoJsonStyle(feature, layer.color, selectedBlockage)
                        }
                        onEachFeature={(feature, layerObj) => {
                            const popupHtml = renderPopup(feature.properties, POPUP_SCHEMA);
                            layerObj.bindPopup(popupHtml);

                            //auto-open popup if selected
                            if (feature.properties?.name === selectedBlockage) {
                                layerObj.openPopup();
                            }
                        }}
                    />
                ))}

                <ChangeCenter center={center} zoom={zoom} />

            </MapContainer>
        </div>
    );
}


const geoJsonStyle = (feature, layerColor, selectedBlockage) => {
    const isSelected = feature.properties?.name === selectedBlockage;

    return {
        color: isSelected ? "#ff0000" : layerColor, // red when selected
        weight: isSelected ? 8 : 4,                  // thicker
        opacity: 1,
        fillOpacity: isSelected ? 0.8 : 0.4,
    };
};
