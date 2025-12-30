import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { point } from "leaflet";
import MainMap from "./components/MainMap";

// src/config/api.ts
export const API = "https://routing-web-service-ityenzhnyq-an.a.run.app";
;

export default function App() {
  const [loading, setLoading] = useState(false);

  //cache

  //map
  const SingaporeCoordinate = [1.364237, 103.782208];
  const defaultZoom = 12;
  const [blockageLayers, setBlockageLayers] = useState([]);
  const [routeLayers, setRouteLayers] = useState([]);
  const [roadTypesLayers, setRoadTypesLayers] = useState([]);

  const [center, setCenter] = useState(SingaporeCoordinate); // Default to Singapore
  const [zoom, setZoom] = useState(defaultZoom);
  const [clickedLatLng, setClickedLatLng] = useState(null);

  //Add marker
  const [addMarker, setAddMarker] = useState(false);

  //server status
  const [serverStatus, setServerStatus] = useState(false);
  const [statusTimeOut, setStatusTimeOut] = useState(null);
  const [serverStatusMsg, setServerStatusMsg] = useState("");
  //road types
  const [roadMsg, setRoadMsg] = useState("");
  const [roadTypes, setRoadTypes] = useState([]);
  const [roadTypesData, setRoadTypesData] = useState([]);
  const [selectedRoadTypes, setSelectedRoadTypes] = useState([]);
  const [roadTypesEnabled, setRoadTypesEnabled] = useState(true);
  //search routes
  const [routeDetails, setRouteDetails] = useState([])
  const [searchRouteForm, setSearchRouteForm] = useState({
    startPt: { "long": null, "lat": null, "description": "start point" },
    endPt: { "long": null, "lat": null, "description": "" }
  });
  const [searchRouteMsg, setSearchRouteMsg] = useState("");
  const [searchLock, setSearchLock] = useState(true);
  const RouteMode = {
    default: {
      road: ["primary", "secondary", "motorway", "tertiary", "residential", "trunk", "cycleway"],
      label: "Default"
    },
    motorRoute: {
      road: ["primary", "secondary", "tertiary", "motorway", "residential", "trunk"],
      label: "Car"
    },
    cycleRoute: {
      road: ["cycleway", "residential"],
      label: "Cycle"
    },
    walkRoute: {
      road: ["footway"],
      label: "Walk"
    }

  }
  const [selectRouteMode, setSelectRouteMode] = useState("default");



  //blockage
  const [blockageList, setBlockageList] = useState([]);
  const [blockageNameList, setBlockageNameList] = useState([]);
  const [selectedBlockage, setSelectedBlockage] = useState(null);
  const [addBlockageMsg, setAddBlockageMsg] = useState(null);
  const [addBlockageForm, setAddBlockageForm] = useState({
    point: { "long": null, "lat": null },
    radius: 0,
    name: "",
    description: ""
  });
  const [blockageMsg, setBlockageMsg] = useState("");

  //Lock for button and dropdown
  const [lock, setLock] = useState(false);
  //////////////// EFFECTS ////////////////
  useEffect(() => {
    fetchServerStatus(); // fetch immediately
  }, []);

  useEffect(() => {
    getAllRoadTypes();
    getAllBlockages();
  }, []);

  useEffect(() => {
    console.log("blockageNameList UPDATED:", blockageNameList);
  }, [blockageNameList]);

  useEffect(() => {
    console.log("getting new road layers", roadTypesLayers)
    getRoadLayers();
  }, [selectedRoadTypes])

  useEffect(() => {
    console.log("Selected Mode", selectRouteMode)
    console.log("select mode", RouteMode[selectRouteMode])
  }, [selectRouteMode])

  //call if search routes are set and road mode is change
  useEffect(() => {

    if (!searchLock) {
      console.log("Searching new route with new road mode")
      searchRoute();
    }
  }, [selectRouteMode])

  // ----- Fetch Server Status with retry -----
  const fetchServerStatus = async (maxRetries = 10, delayMs = 10000) => {
    setLoading(true);
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {

        const res = await fetch(`${API}/ready`);
        const text = await res.text();

        if (text.trim() === "Wait") {
          console.log(`Server says 'Wait', retrying status... (${attempt})`);
        }
        else {
          const isOnline = text.trim() === "true" || res.ok;
          console.log("Server status:", isOnline);
          setServerStatus(isOnline);
          break; // exit loop
        }
      } catch (err) {
        console.error("Failed to fetch server status:", attempt);
        if (attempt === maxRetries) {
          setServerStatusMsg({ type: "error", message: "Failed to fetch server status" });
          setServerStatus(false);
          //setTimeout(() => setServerStatusMsg(""), 5000);
        }
      }
      // 10s delay BEFORE next attempt (always)
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    setLoading(false);
  };

  // ----- Fetch Road Types with retry -----
  // ----- Predefined color palette (20 colors) -----
  const ROAD_TYPE_COLORS = [
    "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
    "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
    "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000",
    "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080"
  ];

  // ----- Fetch Road Types (with retry) -----
  const getAllRoadTypes = async (maxRetries = 10, delayMs = 1000) => {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        attempt++;

        const res = await fetch(
          "https://nyc-bus-routing-k3q4yvzczq-an.a.run.app/allAxisTypes"
        );
        const text = await res.text();

        if (text.trim() === "Wait") {
          console.warn(`Server busy, retrying... (${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }

        let roadTypes;
        try {
          roadTypes = JSON.parse(text);
        } catch {
          throw new Error("Invalid JSON from road types API");
        }

        setRoadTypes(roadTypes);

        await getAllRoadTypesData(roadTypes);

        return; // success
      } catch (err) {
        console.error("Failed to fetch road types:", err);

        if (attempt >= maxRetries) {
          setRoadMsg({
            type: "error",
            message: "Failed to fetch road types"
          });
          //setTimeout(() => setRoadMsg(""), 5000);
          return;
        }

        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  };

  // ----- Fetch GeoJSON for each road type + assign color -----
  const getAllRoadTypesData = async (allRoadTypes) => {
    const dataMap = {};
    setRoadTypesEnabled(false);
    for (let i = 0; i < allRoadTypes.length; i++) {
      const roadType = allRoadTypes[i];
      try {
        //console.log("Fetching road type data:", roadType);

        const res = await fetch(
          `https://routing-web-service-ityenzhnyq-an.a.run.app/axisType/${roadType}`
        );
        const text = await res.text();

        if (text.trim() === "Wait") {
          console.warn(`Skipping ${roadType}: server busy`);
          continue;
        }

        let geojson;
        try {
          geojson = JSON.parse(text);
        } catch {
          throw new Error(`Invalid GeoJSON for ${roadType}`);
        }

        // Assign color from palette (loop if more than 20 road types)
        const color = ROAD_TYPE_COLORS[i % ROAD_TYPE_COLORS.length];

        dataMap[geojson.axis_type] = {
          type: geojson.axis_type,
          color,
          data: geojson
        };

      } catch (err) {
        console.error(`Failed to fetch road type: ${roadType}`, err);
      }
    }
    setRoadTypesEnabled(true);
    setRoadTypesData(dataMap);
  };


  const onRoadTypeToggle = (type) => {

    setSelectedRoadTypes(prev => {
      if (prev.includes(type)) {
        // Remove type
        return prev.filter(t => t !== type);
      } else {
        // Add type
        return [...prev, type];
      }
    });
  };

  const getRoadLayers = async () => {
    const roadLayers = selectedRoadTypes
      .map(type => ({
        type,
        data: roadTypesData[type].data,
        color: roadTypesData[type].color
      }))
      .filter(layer => layer.data); // safety

    setRoadTypesLayers(roadLayers)
  }

  const clearSelectedRoadTypes = () => {
    setSelectedRoadTypes([]);
  }



  const updateSelectedCoordinate = (latlng) => {
    console.log("Updating selected coordinate to:", latlng);
    //set add blockage form point
    setAddBlockageForm((prev) => ({
      ...prev,
      point: { "long": latlng[1], "lat": latlng[0] }
    }));
    console.log("Selected coordinate updated:", latlng);
    //set destination coordinate for route planning


  }

  //////////////// BLOCKAGE FUNCTIONS ////////////////

  const handleChangeAddBlockageForm = (e) => {
    const { name, value } = e.target;
    setAddBlockageForm((prev) => ({ ...prev, [name]: value, ...(name === "radius" ? { radius: parseInt(value) } : {}) }));

    console.log("Add Blockage Form Updated:", addBlockageForm);
  }

  const getAllBlockages = async () => {
    const maxRetries = 10;
    const delayMs = 1000;

    setLoading(true);
    setBlockageLayers([]);


    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(`https://routing-web-service-ityenzhnyq-an.a.run.app/blockage`);
        const text = await res.text();

        if (text.trim() === "Wait") {
          console.log(`Server says 'Wait', retrying... (${attempt})`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue; // try again
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          throw new Error("Server returned invalid JSON: " + text);
        }

        // Got valid data
        console.log("Fetched blockages:", data.features);
        setBlockageList(data.features);
        setBlockageNameListFromBlockages(data.features);
        setBlockageLayers([{ data: data }]);
        // setLoading(false);
        break; // exit loop

      } catch (err) {
        console.error(`Attempt ${attempt} failed :`, err.message);
        if (attempt === maxRetries) {
          setBlockageMsg({ type: "error", message: "Failed to fetch blockage" });
          // setTimeout(() => setBlockageMsg(""), 5000);
        } else {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }
    setLoading(false);

  };



  const onAddBlockage = async () => {
    const maxRetries = 10;
    const delayMs = 1000;
    if (!checkAddBlockageFormComplete()) {
      setAddBlockageMsg({ type: "error", message: "Please complete all fields." });
      setTimeout(() => setAddBlockageMsg(""), 5000);
      return;
    }
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {

        console.log("Adding blockage with data:", JSON.stringify(addBlockageForm));
        const res = await fetch(
          `https://routing-web-service-ityenzhnyq-an.a.run.app/blockage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(addBlockageForm),
          }
        );

        //Check if duplicate exist
        const text = await res.text();
        if (text.trim().startsWith("Duplicate")) throw new Error("Blockage name already exists.");
        else if (text.trim() === "Wait") {
          console.log(`Server says 'Wait', retrying... (${attempt})`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue; // try again
        }

        console.log("Blockage added successfully.");
        setAddBlockageMsg({ type: "success", message: "Blockage added successfully." });
        // Clear form
        setAddBlockageForm({
          point: { "long": null, "lat": null },
          name: "",
          description: "",
          radius: 0,
        });
        setClickedLatLng(null); // clear selected point on map

        getAllBlockages();
        // Clear message after 5s
        setTimeout(() => setAddBlockageMsg(""), 5000);
        // Set new route
        if (!searchLock) {
          console.log("Searching new route with new road mode")
          searchRoute();
        }
        break;
      } catch (err) {
        console.error("Failed to add blockage:", err);
        if (attempt === maxRetries) {
          setAddBlockageMsg({ type: "error", message: "Failed to add blockage. " + err.message });
        }
        else {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }
  }

  function checkAddBlockageFormComplete() {
    const { name, radius, description } = addBlockageForm;
    return (
      point.long !== null &&
      point.lat !== null &&
      name.trim() !== "" &&
      radius !== null &&
      description.trim() !== ""
    );
  }

  function setBlockageNameListFromBlockages(blockages) {
    const names = blockages.map(b => b.properties.name);
    setBlockageNameList(names);
    console.log("Blockage names set:", names);
  }


  const onSelectBlockage = (blockageName) => {
    if (!blockageName) {
      setCenter(SingaporeCoordinate);
      setZoom(defaultZoom);
    }
    else {
      const selected = blockageList.find(b => b.properties.name === blockageName);
      console.log("New center", selected.geometry.coordinates);
      setCenter([
        selected.geometry.coordinates[1], selected.geometry.coordinates[0]
      ]);
      setZoom(15);
    }
  }

  const onDeleteBlockage = async () => {
    console.log("Deleting blockage:", selectedBlockage);
    const maxRetries = 10
    const delayMs = 1000
    for (const attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setLoading(true); // show loading screen
        const res = await fetch(
          `https://routing-web-service-ityenzhnyq-an.a.run.app/blockage/${encodeURIComponent(selectedBlockage)}`,
          { method: "DELETE" }
        );

        const text = await res.text()
        if (text.trim() === "Wait") {
          console.log(`Server says 'Wait', retrying... (${attempt})`);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue; // try again
        }
        console.log(`Blockage '${selectedBlockage}' deleted successfully.`);
        setBlockageMsg({ type: "success", message: `Blockage '${selectedBlockage}' deleted successfully` });
        setSelectedBlockage(null);

        getAllBlockages();

        // Clear message after 5s
        setTimeout(() => setBlockageMsg(""), 5000);

        // Set new route
        if (!searchLock) {
          console.log("Searching new route with new road mode")
          searchRoute();
        }
        break;

      } catch (err) {
        console.error("Failed to delete blockage:", err);
        if (attempt === maxRetries) {
          setBlockageMsg({ type: "error", message: `Failed to delete blockage '${selectedBlockage?.properties?.name}'` });
          setSelectedBlockage(null);
          //setTimeout(() => setBlockageMsg(""), 5000);
        }
      }
    }
  };

  //Search route functions

  const clearMap = () => {
    removeDestination();
    removeOriginalDestination();
    setClickedLatLng(null);
    setRouteLayers([]);
    setRouteDetails([]);
  }
  const addOriginalDestination = () => {
    console.log("Adding original destination:", clickedLatLng);
    setRouteLayers([]);
    setSearchRouteForm((prev) => ({
      ...prev,
      startPt: { "long": clickedLatLng[1], "lat": clickedLatLng[0], "description": "" }
    }))
  };

  const addDestination = () => {
    console.log("Adding destination:", clickedLatLng);
    setRouteLayers([])
    setSearchRouteForm((prev) => ({
      ...prev,
      endPt: { "long": clickedLatLng[1], "lat": clickedLatLng[0], "description": "" }
    }))
  };

  const removeOriginalDestination = () => {
    console.log("Removing original destination");
    setRouteLayers([]);
    setRouteDetails([]);
    setSearchLock(true);
    setSearchRouteForm((prev) => ({
      ...prev,
      startPt: { "long": null, "lat": null, "description": "" }
    }))
  };

  const removeDestination = () => {
    console.log("Removing destination");
    setRouteLayers([]);
    setRouteDetails([]);
    setSearchLock(true);
    setSearchRouteForm((prev) => ({
      ...prev,
      endPt: { "long": null, "lat": null, "description": "" }
    }))
  };

  const searchRoute = async (maxRetries = 10, delayMs = 1000) => {
    console.log("Sending route seth data:", JSON.stringify(searchRouteForm));
    setRouteDetails([]);
    setRouteLayers([]);
    // Implement route searching logic here
    for (let attempt = 1; attempt <= 10; attempt++) {
      try {
        setLoading(true);
        //console.log("Sending route search request with data:", JSON.stringify(searchRouteForm));

        // //Change route road type
        const road_res = await fetch("https://routing-web-service-ityenzhnyq-an.a.run.app/changeValidRoadTypes",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(RouteMode[selectRouteMode].road),
          }
        )
        console.log("Route mode set to", await road_res.text())

        //fetch route from API
        const res = await fetch(
          `https://routing-web-service-ityenzhnyq-an.a.run.app/route`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchRouteForm),
          }
        );

        const text = await res.text();
        if (!res.ok) throw new Error("Network response was not ok: " + text);
        //chec if server is ready
        if (text.trim() === "Wait") {
          console.log(`Server says 'Wait', retrying status... (${attempt})`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
        //Check if Route exists
        if (!checkRouteExist(JSON.parse(text))) {
          throw new Error("No Route Found")
        }
        //Set 
        setSearchRouteMsg({ type: "success", message: "Route found successfully." });
        setRouteLayers([{ data: JSON.parse(text) }]);
        setRouteDetails(JSON.parse(text).features)
        setAddMarker(0);
        // Clear message after 5s
        setTimeout(() => setSearchRouteMsg(""), 5000);
        console.log("Route search successful:", JSON.parse(text));


        //...
        setLoading(false);
        setSearchLock(false);
        break;
      } catch (err) {
        console.error("Failed to search route:", err);
        setSearchRouteMsg({ type: "error", message: "Failed to search route. " + err.message });
        setTimeout(() => setSearchRouteMsg(""), 5000);
        setLoading(false);
        break;
      }
    }
  }

  const checkRouteExist = (route) => {
    if (!route || !route.features) return false;

    for (const feature of route.features) {
      if (feature.geometry?.type === "LineString") {
        return true; // found at least one LineString
      }
    }

    return false; // none found
  };

  const extractRouteDetails = (geojson) => {
    if (!geojson || !geojson.features) {
      setRouteDetails([]);
      return;
    }

    const streets = geojson.features
      .filter(f => f.geometry?.type === "LineString")
      .map(f => ({
        name: f.properties?.["road name"],
        type: f.properties?.["road type"],
        distance: f.properties?.distance
      }))
      .filter(r => r.name && r.name !== "NULL");

    setRouteDetails(streets);
  };

  ///Toggle add marker

  const toggleAddMarker = () => {
    setAddMarker(!addMarker);
    setClickedLatLng(null);
  }

  return (
    <div className="flex-col h-screen w-screen flex">

      {loading && (
        <div className="fixed inset-0 z-[9999] bg-gray-500/40 flex items-center justify-center pointer-events-auto">
          <div className="text-white text-lg font-semibold">
            Loading...
          </div>
        </div>
      )}



      {/* Sidebar left */}
      <Sidebar
        serverStatus={serverStatus}
        serverStatusMsg={serverStatusMsg}
        allRoadTypes={roadTypes}
        selectedRoadTypes={selectedRoadTypes}
        clearSelectedRoadTypes={clearSelectedRoadTypes}
        roadTypesData={roadTypesData}
        onRoadTypeToggle={onRoadTypeToggle}
        roadTypesEnabled={roadTypesEnabled}
        roadMsg={roadMsg}
        //search routes
        clearMap={clearMap}
        searchRouteForm={searchRouteForm}
        setSearchRouteForm={setSearchRouteForm}
        addOriginalDestination={addOriginalDestination}
        addDestination={addDestination}
        removeDestination={removeDestination}
        removeOriginalDestination={removeOriginalDestination}
        RouteMode={RouteMode}
        selectRouteMode={selectRouteMode}
        setSelectRouteMode={setSelectRouteMode}
        searchRoute={searchRoute}
        searchRouteMsg={searchRouteMsg}
        routeDetails={routeDetails}
        //blockage
        handleChangeAddBlockageForm={handleChangeAddBlockageForm}
        onAddBlockage={onAddBlockage}
        addBlockageForm={addBlockageForm}
        setAddBlockageForm={setAddBlockageForm}
        addBlockageMsg={addBlockageMsg}
        blockageList={blockageList}
        blockageNameList={blockageNameList}
        selectedBlockage={selectedBlockage}
        setSelectedBlockage={setSelectedBlockage}
        onSelectBlockage={onSelectBlockage}
        onDeleteBlockage={onDeleteBlockage}
        blockageMsg={blockageMsg}
        //clicked lat lng
        clickedLatLng={clickedLatLng}
        //add marker button
        addMarker={addMarker}
        toggleAddMarker={toggleAddMarker}
      />
      {/* Map right */}
      <div className=" h-screen">
        <MainMap
          blockageLayers={blockageLayers}
          routeLayers={routeLayers}
          roadTypesLayers={roadTypesLayers}
          center={center} zoom={zoom}
          selectedBlockage={selectedBlockage}
          setSelectedBlockage={setSelectedBlockage}
          setClickedLatLng={setClickedLatLng}
          clickedLatLng={clickedLatLng}
          addMarker={addMarker}
          setAddMarker={setAddMarker}
          updateSelectedCoordinate={updateSelectedCoordinate}
          searchRouteForm={searchRouteForm}
        />
      </div>
    </div>
  );
}


