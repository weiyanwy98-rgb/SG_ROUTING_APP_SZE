import { GeoJSON } from "react-leaflet";
import { renderPopup } from "../schema/popup_render";
import { POPUP_SCHEMA, ROUTE_SCHEMA } from "../schema/popup_schema";

export default function RoadLayers({ layers }) {
    if (!layers || layers.length === 0) return null;

    return (
        <>
            {layers.map((layer, idx) => (
                <GeoJSON
                    key={`${layer.type}-${idx}`}
                    data={layer.data}
                    style={{
                        color: layer.color || "#ff0000",
                        weight: 4
                    }}
                    onEachFeature={(feature, layerObj) => {
                        const popupHtml = renderPopup(feature.properties, ROUTE_SCHEMA);
                        layerObj.bindPopup(popupHtml);
                    }}
                />
            ))}
        </>
    );
}
