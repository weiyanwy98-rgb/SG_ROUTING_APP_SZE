import { GeoJSON, Marker, Popup } from "react-leaflet";
import { renderPopup } from "../schema/popup_render";
import { ROUTE_SCHEMA} from "../schema/popup_schema";

export default function RouteLayer({ searchRouteForm, routeLayers }) {
    return (
        <>
            {/* Start Marker */}
            {searchRouteForm.startPt?.lat && (
                <Marker
                    position={[searchRouteForm.startPt.lat, searchRouteForm.startPt.long]}
                >
                    <Popup><strong>Start Point</strong></Popup>
                </Marker>
            )}

            {/* End Marker */}
            {searchRouteForm.endPt?.lat && (
                <Marker
                    position={[searchRouteForm.endPt.lat, searchRouteForm.endPt.long]}
                >
                    <Popup><strong>End Point</strong></Popup>
                </Marker>
            )}

            {/* Draw route lines */}
            {routeLayers.map((layer, idx) => {
                // Filter out only LineString features
                const lineFeatures = {
                    type: "FeatureCollection",
                    features: layer.data.features.filter(
                        f => f.geometry.type === "LineString"
                    )
                };

                return (
                    <GeoJSON
                        key={idx}
                        data={lineFeatures}
                        style={{ color: layer.color || "blue", weight: 4 }}
                        onEachFeature={(feature, layerObj) => {
                            const popupHtml = renderPopup(feature.properties, ROUTE_SCHEMA);
                            layerObj.bindPopup(popupHtml);
                        }}
                    />
                );
            })}
        </>
    );
}
