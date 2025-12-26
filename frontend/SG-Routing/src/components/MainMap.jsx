// MainMap.jsx
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import BlockageLayer from "./BlockageLayer";
import RouteLayer from "./RouteLayer";
import MapInteractions from "./MapInteractions";
import RoadLayers from "./RoadTypesLayer";

export default function MainMap(props) {
    const {
        center,
        zoom,
        blockageLayers,
        routeLayers,
        roadTypesLayers,
        selectedBlockage,
        setSelectedBlockage,
        clickedLatLng,
        setClickedLatLng,
        addMarker,
        updateSelectedCoordinate,
        searchRouteForm
    } = props;

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            className="h-full w-full"
            minZoom={12}
            maxZoom={17}
            zoomControl={false}
        >
            <ZoomControl position="bottomright" />
            <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* clicked Position */}
            {clickedLatLng && <Marker position={clickedLatLng} />}

            {/* Pure layers */}
            <RoadLayers
                layers={roadTypesLayers}
            />
            <RouteLayer
                searchRouteForm={searchRouteForm}
                routeLayers={routeLayers}
            />
            <BlockageLayer
                blockageLayers={blockageLayers}
                selectedBlockage={selectedBlockage}
                setSelectedBlockage={setSelectedBlockage}
            />

            {/* Map-level interactions */}
            <MapInteractions
                addMarker={addMarker}
                setClickedLatLng={setClickedLatLng}
                updateSelectedCoordinate={updateSelectedCoordinate}
            />
        </MapContainer>
    );
}
