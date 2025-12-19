import {
    MapContainer,
    TileLayer,
    GeoJSON,
    useMap,
    Circle,
    ZoomControl,
    Marker
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

import { renderPopup } from "../schema/popup_render";
import { POPUP_SCHEMA } from "../schema/popup_schema";
import { normalIcon } from "../icon";

/* ---------------- Center Control ---------------- */
function ChangeCenter({ center, zoom }) {
    const map = useMap();

    useEffect(() => {
        if (!center || !center[0] || !center[1]) return;
        map.setView(center, zoom);
    }, [center, zoom, map]);

    return null;
}

/* ---------------- Clear Selection + Close Popup ---------------- */
function ClearSelectionOnMapClick({ setSelectedBlockage }) {
    const map = useMap();

    useEffect(() => {
        const handleMapClick = () => {
            map.closePopup();          // close any open popup
            setSelectedBlockage(null); // unselect
            console.log("Map clicked - selection cleared");
        };

        map.on("click", handleMapClick);
        return () => map.off("click", handleMapClick);
    }, [map, setSelectedBlockage]);

    return null;
}

/*------------- Capture map click -------------*/
function CaptureMapClick({ updateSelectedCoordinate, setClickedLatLng }) {
    const map = useMap();

    useEffect(() => {
        map.on("click", (e) => {
            setClickedLatLng([e.latlng.lat, e.latlng.lng]);
            updateSelectedCoordinate([e.latlng.lat, e.latlng.lng]);
        });

        return () => map.off("click");
    }, [map, setClickedLatLng]);

    return null;
}


/* ---------------- Main Map ---------------- */
export default function MapView({
    layers,
    center,
    zoom,
    selectedBlockage,
    setSelectedBlockage,
    setClickedLatLng,
    clickedLatLng,   
    addMarker,
    setAddMarker,
    updateSelectedCoordinate
}) {
    return (
        <div className="w-full h-full">
            <MapContainer
                center={center}
                zoom={zoom}
                className="h-full w-full"
                zoomControl={false}
                minZoom={12}
                maxZoom={17}
            >
                <ZoomControl position="bottomright" />
                <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Unselect + close popup when clicking empty map */}
                {(!addMarker) && <ClearSelectionOnMapClick setSelectedBlockage={setSelectedBlockage} />}

                {/* -------- Markers -------- */}
                {layers.map((layer, idx) => (
                    <GeoJSON
                        key={idx}
                        data={layer.data}
                        pointToLayer={(feature, latlng) =>
                            L.marker(latlng, { icon: normalIcon })
                        }
                        onEachFeature={(feature, layerObj) => {
                            const popupHtml = renderPopup(
                                feature.properties,
                                POPUP_SCHEMA
                            );
                            layerObj.bindPopup(popupHtml);

                            layerObj.on("click", (e) => {
                                L.DomEvent.stopPropagation(e); // prevent map click

                                setSelectedBlockage(feature.properties?.name);
                                layerObj.openPopup();
                            });
                        }}
                    />
                ))}

                {/* -------- Radius Circles -------- */}
                {layers.flatMap(layer =>
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
                                    fillColor: isSelected ? "#8b0000" : "#ff0000",
                                    fillOpacity: isSelected ? 0.45 : 0.2,
                                    weight: isSelected ? 4 : 2,
                                }}
                            />
                        );
                    })
                )}

                
                {clickedLatLng && <Marker position={clickedLatLng}/>}
            
                {addMarker && <CaptureMapClick updateSelectedCoordinate={updateSelectedCoordinate} setClickedLatLng={setClickedLatLng} />}


                <ChangeCenter center={center} zoom={zoom} />
            </MapContainer>
        </div>
    );
}
