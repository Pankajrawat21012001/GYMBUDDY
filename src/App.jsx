import "./styles/App.css";
import "maplibre-gl/dist/maplibre-gl.css";
import Home from "./pages/Home";
import Map from "react-map-gl/maplibre";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_OAUTH2_CLIENT_ID}
      >
        <Map
          initialViewState={{
            latitude: 20.5937,
            longitude: 78.9629,
            zoom: 4,
          }}
          style={{ width: window.innerWidth, height: window.innerHeight }}
          mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${
            import.meta.env.VITE_MAPLIBRE_API
          }`}
        >
          <Home />
        </Map>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
