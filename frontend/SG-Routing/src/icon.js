import L from "leaflet";

const normalIcon = new L.Icon({
  iconUrl: "/icon/blockage.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

const selectedIcon = new L.Icon({
  iconUrl: "/icon/selectedBlockage.png",
  iconSize: [42, 42],   // bigger
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
});
export { normalIcon, selectedIcon };