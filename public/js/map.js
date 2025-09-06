(function () {
  const { apiKey } = window.MAP_CONFIG || {};
  const address = "Noida, Uttar Pradesh, India";
  const title = "Noida";
  const lat = 28.5355;
  const lon = 77.391;

  // Create Leaflet map at fixed Noida coordinates
  const map = L.map("map").setView([lat, lon], 12);

  // Tiles: use Geoapify if apiKey exists, otherwise fallback to OSM public tiles
  if (apiKey) {
    L.tileLayer(
      `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`,
      {
        attribution:
          "© OpenMapTiles © OpenStreetMap contributors, Powered by Geoapify",
        maxZoom: 20,
      }
    ).addTo(map);
  } else {
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
  }

  // Marker + popup
  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup(`<strong>${title}</strong><br>${address}`).openPopup();
})();

window.MAP_CONFIG = {
  apiKey: "<%= geoapifyKey %>",
  address: "<%= listing.location %>, <%= listing.country %>",
  title: "<%= listing.title %>",
};
