import { useState, useRef, useEffect } from "react";

export default function SearchableDropdown({ label, options, onSelectBlockage, selectedBlockage, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const NONE_OPTION = "None";



  // Close dropdown when clicking outside
  useEffect(() => {
    console.log("Options in SearchableDropdown:", options);
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );
  const displayOptions = [NONE_OPTION, ...filtered];

  return (
    <div className="relative mb-1" ref={containerRef}>
      <label className="block font-medium mb-1">{label}</label>

      {/* Selected box / input */}
      <div
        className="w-full mb-2 border rounded-md px-2 py-1 text-sm bg-white cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {selectedBlockage || `Select ${label}`}
      </div>

      {open && (
        <div className="absolute w-full mt-1 bg-white border rounded-md text-sm shadow-lg z-[1000] max-h-60 overflow-auto">
          {/* Search input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${label}...`}
            className="w-full p-2 border-b outline-none"
          />

          {/* Options */}
          {filtered.length === 0 ? (
            <div className="p-2 text-gray-500 text-sm">No results</div>
          ) : (
            displayOptions.map((o) => (
              <div
                key={o}
                className="p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  const value = o === NONE_OPTION ? null : o;
                  onChange(value);
                  onSelectBlockage(value); 
                  setQuery("");
                  setOpen(false);

                }}
              >
                {o}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
