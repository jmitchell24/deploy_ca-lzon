/** Base URL for the lzon API, resolved by environment. */
const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:3000"
  : "https://api.lzon.ca";
