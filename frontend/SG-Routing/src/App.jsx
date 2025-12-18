import { useEffect, useState } from "react";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";

// src/config/api.ts
export const API = "https://routing-web-service-ityenzhnyq-an.a.run.app";
;

export default function App() {
  //map
  const SingaporeCoordinate = [1.352083, 103.819839];
  const defaultZoom = 12;
  const [layers, setLayers] = useState([]);
  const [center, setCenter] = useState(SingaporeCoordinate); // Default to Singapore
  const [zoom, setZoom] = useState(defaultZoom);
  //server status
  const [serverStatus, setServerStatus] = useState(false);
  const [statusTimeOut, setStatusTimeOut] = useState(null);
  //road types
  const [roadMsg, setRoadMsg] = useState("");
  const [roadTypes, setRoadTypes] = useState([]);
  //search routes

  //blockage
  const [blockageList, setBlockageList] = useState([]);
  const [blockageNameList, setBlockageNameList] = useState([]);
  const [selectedBlockage, setSelectedBlockage] = useState(null);
  const [addBlockageMsg, setAddBlockageMsg] = useState("");
  const [blockageMsg, setBlockageMsg] = useState("");


  const randomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);


  useEffect(() => {
    fetchServerStatus(); // fetch immediately
    if (!serverStatus) {
      console.log("Server status", serverStatus, "Continue polling.");
      const timeout = setTimeout(() => {
        setStatusTimeOut(prev => !prev); // toggle to trigger next fetch
      }, 5000); //timeout 30sec
      return () => clearTimeout(timeout); // cleanup previous timeout
    }
    else {
      console.log("Server is online. Stop polling.");
    }
  }, [statusTimeOut]);

  useEffect(() => {
    getAllRoadTypes();
    getAllBlockages();

  }, []);

  useEffect(() => {
    console.log("blockageNameList UPDATED:", blockageNameList);
  }, [blockageNameList]);



  const fetchServerStatus = async () => {
    try {
      const res = await fetch(`https://routing-web-service-ityenzhnyq-an.a.run.app/ready`);
      console.log("Server status:", res.ok);
      setServerStatus(res.ok);
    } catch (err) {
      setServerStatus(false);
      console.error("Failed to fetch server status:", err);
    }
  };

  const getAllRoadTypes = async () => {
    try {
      const res = await fetch(`https://nyc-bus-routing-k3q4yvzczq-an.a.run.app/allAxisTypes`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setRoadTypes(data);
    } catch (err) {
      console.error("Failed to fetch road types:", err);
      setRoadMsg({ type: "error", message: "Failed to fetch road types" });
      setTimeout(() => setRoadMsg(""), 5000);
    }
  };



  //////////////// BLOCKAGE FUNCTIONS ////////////////
  const getAllBlockages = async () => {
    try {
      const res = await fetch(`https://routing-web-service-ityenzhnyq-an.a.run.app/blockage`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      console.log("Fetched blockages:", data.features);
      setBlockageList(data.features);
      setBlockageNameListFromBlockages(data.features);
      setLayers([{ data: data }]);

    } catch (err) {
      console.error("Failed to fetch blockages:", err);
      setBlockageMsg({ type: "error", message: "Failed to fetch blockages" });
      setTimeout(() => setBlockageMsg(""), 5000);
    }
  }

  function setBlockageNameListFromBlockages(blockages) {
    const names = blockages.map(b => b.properties.name);
    setBlockageNameList(names);
    console.log("Blockage names set:", names);
  }

  function findBlockage(geojson, nameToFind) {
    return geojson.find(
      (feature) => feature.properties?.name === nameToFind
    );
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
      const res = await fetch(
        `https://routing-web-service-ityenzhnyq-an.a.run.app/blockage/${encodeURIComponent(selectedBlockage)}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Network response was not ok");
      console.log(`Blockage '${selectedBlockage}' deleted successfully.`);
      setBlockageMsg({ type: "success", message: `Blockage '${selectedBlockage}' deleted successfully` });
      setSelectedBlockage(null);

      // Wait 500ms before refreshing list
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await getAllBlockages();

      // Clear message after 5s
      setTimeout(() => setBlockageMsg(""), 5000);

    } catch (err) {
      console.error("Failed to delete blockage:", err);
      setBlockageMsg({ type: "error", message: `Failed to delete blockage '${selectedBlockage?.properties?.name}'` });
      setSelectedBlockage(null);
      setTimeout(() => setBlockageMsg(""), 5000);
    }
  };


  return (
    <div className="flex-col h-screen w-screen flex">
      {/* Sidebar left */}
      <Sidebar
        serverStatus={serverStatus}
        allRoadTypes={roadTypes}

        blockageList={blockageList}
        blockageNameList={blockageNameList}
        selectedBlockage={selectedBlockage}
        setSelectedBlockage={setSelectedBlockage}
        onSelectBlockage={onSelectBlockage}
        onDeleteBlockage={onDeleteBlockage}
        blockageMsg={blockageMsg}
      />
      {/* Map right */}
      <div className=" h-screen">
        <MapView layers={layers} center={center} zoom={zoom} selectedBlockage={selectedBlockage} />
      </div>
    </div>
  );
}
