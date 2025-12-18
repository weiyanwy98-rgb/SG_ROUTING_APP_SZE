import SearchableDropdown from "./SearchableDropdown";
export default function Sidebar({
  /* ===== Function 1 ===== */
  serverStatus,

  /* ===== Function 2 ===== */
  allRoadTypes,
  // selectedRoadTypes,
  // onRoadTypeToggle,
  // onRoadTypeView,

  /* ===== Function 3 ===== */
  // origin,
  // destination,
  // onSearchRoute,

  /* ===== Function 4 ===== */
  // blockagePoint,
  // onAddBlockage,
  blockageList,
  blockageNameList,
  selectedBlockage,
  setSelectedBlockage,
  onSelectBlockage,
  onDeleteBlockage,
  blockageMsg
}) {
  return (
    <div className="absolute top-5 bg-white shadow-lg rounded-xl p-4 w-80 z-[1000] space-y-4">
      <h2 className="text-lg font-semibold">Singapore Routing</h2>

      {/* ================= Function 1 ================= */}
      {/* Keep OLD DESIGN */}
      <div
        className={`w-fit rounded-md py-0.5 px-2.5 text-sm text-black shadow-sm
        ${serverStatus ? "bg-green-500" : "bg-red-500"}`}
      >
        {serverStatus ? "Server: Online" : "Server: Offline"}
      </div>

      {/* ================= Function 2 ================= */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h3 className="font-semibold text-blue-700 mb-2">Road Types</h3>

        {/* Dropdown to view road type */}
        <select
          onChange={(e) => onRoadTypeView(e.target.value)}
          className="w-full mb-2 border rounded-md px-2 py-1 text-sm"
        >
          {/* Placeholder (not selectable once changed) */}
          <option value="" disabled>
            Select Road Type to View
          </option>

          {/* None option */}
          <option value="false">None</option>

          {/* Road types */}
          {allRoadTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Checkbox selection */}
        <div className="max-h-32 overflow-y-auto space-y-1">
          {/* {allRoadTypes.map((type) => (
            <label key={type} className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={selectedRoadTypes.includes(type)}
               // onChange={() => onRoadTypeToggle(type)}
                className="mr-2"
              />
              {type}
            </label>
          ))} */}
        </div>
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
            //value={blockagePoint}
            placeholder="Click map to select point"
            className="w-full border rounded-md px-2 py-1 text-sm bg-gray-100"
          />
        </div>

        <button
          //onClick={onAddBlockage}
          //disabled={!blockagePoint}
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
      {/* ================= Function 3 ================= */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <h3 className="font-semibold text-green-700 mb-2">Search Route</h3>

        <div className="mb-2">
          <label className="text-sm font-medium">Origin</label>
          <input
            type="text"
            // value={origin}
            readOnly
            placeholder="Click map to select origin"
            className="w-full border rounded-md px-2 py-1 text-sm bg-gray-100"
          />
        </div>

        <div className="mb-2">
          <label className="text-sm font-medium">Destination</label>
          <input
            type="text"
            //value={destination}
            readOnly
            placeholder="Click map to select destination"
            className="w-full border rounded-md px-2 py-1 text-sm bg-gray-100"
          />
        </div>

        <button
          //onClick={onSearchRoute}
          //disabled={!origin || !destination}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm py-2 rounded-md"
        >
          Search Route
        </button>
      </div>
    </div>
  );
}
