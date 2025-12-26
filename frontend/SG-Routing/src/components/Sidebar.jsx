import SearchableDropdown from "./SearchableDropdown";
export default function Sidebar({
  /* ===== Function 1 ===== */
  serverStatus,
  serverStatusMsg,
  /* ===== Function 2 ===== */
  allRoadTypes,
  selectedRoadTypes,
  clearSelectedRoadTypes,
  roadTypesData,
  onRoadTypeToggle,
  roadTypesEnabled,
  roadMsg,
  /* ===== Function 3 ===== */
  searchRouteForm,
  setSearchRouteForm,
  addOriginalDestination,
  addDestination,
  removeOriginalDestination,
  removeDestination,
  searchRouteMsg,
  searchRoute,
  clearMap,
  RouteMode,
  selectRouteMode,
  setSelectRouteMode,
  // origin,
  // destination,
  // onSearchRoute,

  /* ===== Function 4 ===== */
  // blockagePoint,
  onAddBlockage,
  handleChangeAddBlockageForm,
  addBlockageForm,
  setAddBlockageForm,
  addBlockageMsg,
  blockageList,
  blockageNameList,
  selectedBlockage,
  setSelectedBlockage,
  onSelectBlockage,
  onDeleteBlockage,
  blockageMsg,

  clickedLatLng,

  addMarker,
  toggleAddMarker
}) {
  return (
    <div className="absolute top-5 left-5 bg-white shadow-lg rounded-xl p-4 w-80 z-[1000] space-y-4
            max-h-[95vh] overflow-y-auto">

      <h2 className="text-lg font-semibold">Singapore Routing</h2>

      {/* ================= Function 1 ================= */}
      <div className="flex items-center justify-between w-full">
        {/* Server Status */}
        <div
          className={`w-fit rounded-md py-0.5 px-2.5 text-sm text-black shadow-sm
    ${serverStatus ? "bg-green-500" : "bg-red-500"}`}
        >
          {serverStatus ? "Server: Online" : "Server: Offline"}
        </div>

        {/* Enable Marker Button */}
        <button
          className={`${addMarker ? "bg-green-500" : "bg-gray-200"} ${addMarker ? "hover:bg-green-600" : "hover:bg-gray-300"} text-gray-800 text-sm py-0.5 px-2 rounded-md`}
          onClick={toggleAddMarker}
        >
          Enable Marker: {addMarker ? "On" : "Off"}
        </button>
      </div>
      {/* Display error messages */}
      {serverStatusMsg && (
        <div className={`pb-2 text-sm font-medium ${serverStatusMsg.type === "error" ? "text-red-600" : "text-green-600"}`}>
          {serverStatusMsg.message}
        </div>
      )}



      {/* ================= Function 2 ================= */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between w-full">
          <h3 className="font-semibold text-blue-700 mb-2">Road Types</h3>
          <button className="w-10 bg-blue-400 hover:bg-blue-700 text-white text-sm rounded-md"
            onClick={clearSelectedRoadTypes}
          >
            clear
          </button>
        </div>
        {/* Dropdown to view road type */}


        {/* Checkbox selection */}
        <div className="max-h-32 overflow-y-auto space-y-1">
          {roadTypesEnabled ?
            (allRoadTypes.map((type) => (
              <label key={type} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={selectedRoadTypes.includes(type)}
                  onChange={() => onRoadTypeToggle(type)}
                  className="mr-2"
                />
                <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: roadTypesData[type]?.color }}></span>
                {type}
              </label>
            )))
            :
            <span>Loading...</span>
          }

          {/* Display error messages */}
          {roadMsg && (
            <div className={`pb-2 text-sm font-medium ${roadMsg.type === "error" ? "text-red-600" : "text-green-600"}`}>
              {roadMsg.message}
            </div>
          )}
        </div>
      </div>

      {/* ================= Function 3 ================= */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center justify-between w-full">
          <h3 className="font-semibold text-green-700 mb-2">Search Route</h3>
          <button className="w-20 bg-blue-400 hover:bg-blue-600 text-white text-sm rounded-md"
            onClick={clearMap}
          >
            Clear Map
          </button>
        </div>
        {/* Route Modes */}
        <div className="flex gap-2">
          {Object.entries(RouteMode).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => setSelectRouteMode(key)}
              className={`px-3 py-1 rounded-md text-sm border
              ${selectRouteMode === key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between w-full">
            <label className="text-sm font-medium">Origin</label>
            <div className="space-x-2">
              <button className="w-10 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md"
                onClick={removeOriginalDestination}>
                clear
              </button>
              <button className="w-10 bg-green-600 disabled:bg-gray-400 hover:bg-green-700 text-white text-sm rounded-md"
                onClick={addOriginalDestination}
                disabled={!clickedLatLng}>
                save
              </button>
            </div>
          </div>
          <input
            type="text"
            // value={origin}
            value={searchRouteForm.startPt.long ? `${searchRouteForm.startPt.lat.toFixed(5)}, ${searchRouteForm.startPt.long.toFixed(5)}` :
              clickedLatLng ? `${clickedLatLng[0].toFixed(5)}, ${clickedLatLng[1].toFixed(5)}` : "Click map to select Origin"}
            readOnly
            placeholder="Click map to select origin"
            className={`w-full border rounded-md px-2 py-1 text-sm ${searchRouteForm.startPt.lat ? "bg-green-200" : "bg-gray-100"}`}
          />
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between w-full">
            <label className="text-sm font-medium">Destination</label>
            <div className="space-x-2">
              <button className="w-10 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md"
                onClick={removeDestination}>
                clear
              </button>
              <button className="w-10 bg-green-600 disabled:bg-gray-400 hover:bg-green-700 text-white text-sm rounded-md"
                onClick={addDestination}
                disabled={!clickedLatLng} //check if clickedLatLng is set
              >
                save
              </button>
            </div>
          </div>
          <input
            type="text"
            value={searchRouteForm.endPt.long ? `${searchRouteForm.endPt.lat.toFixed(5)}, ${searchRouteForm.endPt.long.toFixed(5)}` :
              clickedLatLng ? `${clickedLatLng[0].toFixed(5)}, ${clickedLatLng[1].toFixed(5)}` : "Click map to select Origin"}
            readOnly
            placeholder="Click map to select destination"
            className={`w-full border rounded-md px-2 py-1 text-sm ${searchRouteForm.endPt.lat ? "bg-green-200" : "bg-gray-100"}`}
          />
        </div>

        <button
          onClick={searchRoute}
          disabled={!searchRouteForm.startPt.lat || !searchRouteForm.endPt.lat}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm py-2 rounded-md"
        >
          Search Route
        </button>
        {/* Display error messages */}
        {searchRouteMsg && (
          <div className={`pb-2 text-sm font-medium ${searchRouteMsg.type === "error" ? "text-red-600" : "text-green-600"}`}>
            {searchRouteMsg.message}
          </div>
        )}
      </div>
      {/* ================= Function 4 ================= */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <h3 className="font-semibold text-yellow-700 mb-2">Blockage</h3>

        {/* Add Blockage */}
        <div className="mb-2">
          <label className="text-sm font-medium">Add Blockage Location</label>
          <input
            type="text"
            readOnly
            value={clickedLatLng ? `${clickedLatLng[0].toFixed(5)}, ${clickedLatLng[1].toFixed(5)}` : "Click map to select point"}
            placeholder="Click map to select point"
            className="w-full border rounded-md px-2 py-1 text-sm bg-gray-100"
          />
        </div>

        <div className="mb-2">
          <label className="text-sm font-medium ">Blockage Name</label>
          <input
            type="text"
            value={addBlockageForm.name || ""}
            name="name"
            placeholder="Enter blockage name"
            className="w-full bg-white border rounded-md px-2 py-1 text-sm"
            onChange={handleChangeAddBlockageForm}
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium">Distance (meters)</label>
          <input
            type="number"
            value={addBlockageForm.radius || ""}
            name="radius"
            placeholder="Enter distance in meters"
            className="w-full bg-white border rounded-md px-2 py-1 text-sm"
            onChange={handleChangeAddBlockageForm}
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium">Description</label>
          <input
            type="text"
            value={addBlockageForm.description || ""}
            name="description"
            placeholder="Enter description"
            className="w-full bg-white border rounded-md px-2 py-1 text-sm"
            onChange={handleChangeAddBlockageForm}
          />
        </div>

        {/* Display error messages */}
        {addBlockageMsg && (
          <div className={`pb-2 text-sm font-medium ${addBlockageMsg.type === "error" ? "text-red-600" : "text-green-600"}`}>
            {addBlockageMsg.message}
          </div>
        )}

        <button
          onClick={onAddBlockage}
          disabled={clickedLatLng === null || !addBlockageForm.name || !addBlockageForm.radius || !addBlockageForm.description}
          className="w-full mb-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white text-sm py-1.5 rounded-md"
        >
          Add Blockage
        </button>

        {/* Delete Blockage */}

        <SearchableDropdown
          label="Select/Search Blockage"
          options={blockageNameList}
          onSelectBlockage={onSelectBlockage}
          selectedBlockage={selectedBlockage}
          onChange={setSelectedBlockage}

        />
        {/* Display error messages */}
        {blockageMsg && (
          <div className={`pb-2 text-sm font-medium ${blockageMsg.type === "error" ? "text-red-600" : "text-green-600"}`}>
            {blockageMsg.message}
          </div>
        )}

        <button
          onClick={onDeleteBlockage}
          disabled={!selectedBlockage}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white text-sm py-1.5 rounded-md"
        >
          Delete Blockage
        </button>
      </div>

    </div >
  );
}
