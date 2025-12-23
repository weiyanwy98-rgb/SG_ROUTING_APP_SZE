import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { point } from "leaflet";
import MainMap from "./components/MainMap";

// src/config/api.ts
export const API = "https://routing-web-service-ityenzhnyq-an.a.run.app";
;

export default function App() {
  const [loading, setLoading] = useState(true);

  //Retry
  const [retry, setRetry] = useState(false);
  //map
  const SingaporeCoordinate = [1.364237, 103.782208];
  const defaultZoom = 12;
  const [blockageLayers, setBlockageLayers] = useState([]);
  const [routeLayers, setRouteLayers] = useState([]);

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
  //search routes
  const [searchRouteForm, setSearchRouteForm] = useState({
    startPt: { "long": null, "lat": null, "description": "start point" },
    endPt: { "long": null, "lat": null, "description": "" }
  });
  const [searchRouteMsg, setSearchRouteMsg] = useState("");
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



  // ----- Fetch Server Status with retry -----
  const fetchServerStatus = async (maxRetries = 10, delayMs = 1000) => {
    setLoading(true);
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {

        const res = await fetch(`${API}/ready`);
        const text = await res.text();

        if (text.trim() === "Wait") {
          console.log(`Server says 'Wait', retrying status... (${attempt})`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }

        const isOnline = text.trim() === "true" || res.ok;
        console.log("Server status:", isOnline);
        setServerStatus(isOnline);
        break; // exit loop

      } catch (err) {
        console.error("Failed to fetch server status:", err);
        if (attempt === maxRetries) {
          setServerStatusMsg({ type: "error", message: "Failed to fetch server status" });
          setServerStatus(false);
          setTimeout(() => setServerStatusMsg(""), 5000);
        } else {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
    setLoading(false);
  };

  // ----- Fetch Road Types with retry -----
  const getAllRoadTypes = async (maxRetries = 10, delayMs = 1000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(`https://nyc-bus-routing-k3q4yvzczq-an.a.run.app/allAxisTypes`);
        const text = await res.text();

        if (text.trim() === "Wait") {
          console.log(`Server says 'Wait', retrying road types... (${attempt})`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Invalid JSON from road types API: " + text);
        }

        setRoadTypes(data);
        break; // exit loop

      } catch (err) {
        console.error("Failed to fetch road types:", err);
        if (attempt === maxRetries) {
          setRoadMsg({ type: "error", message: "Failed to fetch road types" });
          setTimeout(() => setRoadMsg(""), 5000);
        } else {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    }
  };


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
          setBlockageMsg({ type: "error", message: err.message });
          setTimeout(() => setBlockageMsg(""), 5000);
        } else {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }
    setLoading(false);

  };



  const onAddBlockage = async () => {

    if (!checkAddBlockageFormComplete()) {
      setAddBlockageMsg({ type: "error", message: "Please complete all fields." });
      setTimeout(() => setAddBlockageMsg(""), 5000);
      return;
    }
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
      if (!res.ok) throw new Error("Network response was not ok");

      //Check if duplicate exist
      const text = await res.text();
      if (text.trim().startsWith("Duplicate")) throw new Error("Blockage name already exists.");

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
    } catch (err) {
      console.error("Failed to add blockage:", err);
      setAddBlockageMsg({ type: "error", message: "Failed to add blockage. " + err.message });
      setTimeout(() => setAddBlockageMsg(""), 5000);
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
    try {
      setLoading(true); // show loading screen
      const res = await fetch(
        `https://routing-web-service-ityenzhnyq-an.a.run.app/blockage/${encodeURIComponent(selectedBlockage)}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Network response was not ok");
      console.log(`Blockage '${selectedBlockage}' deleted successfully.`);
      setBlockageMsg({ type: "success", message: `Blockage '${selectedBlockage}' deleted successfully` });
      setSelectedBlockage(null);

      getAllBlockages();

      // Clear message after 5s
      setTimeout(() => setBlockageMsg(""), 5000);

    } catch (err) {
      console.error("Failed to delete blockage:", err);
      setBlockageMsg({ type: "error", message: `Failed to delete blockage '${selectedBlockage?.properties?.name}'` });
      setSelectedBlockage(null);
      setTimeout(() => setBlockageMsg(""), 5000);
    }
  };

  //Search route functions

  const clearMap = ()=>{
    setRouteLayers([]);
    removeDestination();
    removeOriginalDestination();
    setClickedLatLng(null);
  }
  const addOriginalDestination = () => {
    console.log("Adding original destination:", clickedLatLng);
    setSearchRouteForm((prev) => ({
      ...prev,
      startPt: { "long": clickedLatLng[1], "lat": clickedLatLng[0], "description": "" }
    }))
  };

  const addDestination = () => {
    console.log("Adding destination:", clickedLatLng);
    setSearchRouteForm((prev) => ({
      ...prev,
      endPt: { "long": clickedLatLng[1], "lat": clickedLatLng[0], "description": "" }
    }))
  };

  const removeOriginalDestination = () => {
    console.log("Removing original destination");
    setSearchRouteForm((prev) => ({
      ...prev,
      startPt: { "long": null, "lat": null, "description": "" }
    }))
  };

  const removeDestination = () => {
    console.log("Removing destination");
    setSearchRouteForm((prev) => ({
      ...prev,
      endPt: { "long": null, "lat": null, "description": "" }
    }))
  };

  const searchRoute = async () => {
    console.log("Searching route from", searchRouteForm.startPt, "to", searchRouteForm.endPt);
    // Implement route searching logic here
    try {
      setLoading(true);
      console.log("Sending route search request with data:", JSON.stringify(searchRouteForm));
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
      //Check if route found
      if (text.trim().startsWith("No route found")) throw new Error("No route found for the given points.");

      //Set 
      setSearchRouteMsg({ type: "success", message: "Route found successfully." });
      setRouteLayers([{ data: JSON.parse(text) }]);
      // Clear message after 5s
      setTimeout(() => setSearchRouteMsg(""), 5000);
      console.log("Route search successful:", JSON.parse(text));
      //...
      setLoading(false);
    } catch (err) {
      console.error("Failed to search route:", err);
      setSearchRouteMsg({ type: "error", message: "Failed to search route. " + err.message });
      setTimeout(() => setSearchRouteMsg(""), 5000);
      setLoading(false);
    }
  }

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

        //search routes
        clearMap={clearMap}
        searchRouteForm={searchRouteForm}
        setSearchRouteForm={setSearchRouteForm}
        addOriginalDestination={addOriginalDestination}
        addDestination={addDestination}
        removeDestination={removeDestination}
        removeOriginalDestination={removeOriginalDestination}
        searchRoute={searchRoute}
        searchRouteMsg={searchRouteMsg}
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


