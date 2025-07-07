import { Popup, useMap, Marker } from "react-map-gl/maplibre";
import { useState, useEffect } from "react";
import "../styles/Home.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { collection, onSnapshot } from "firebase/firestore";
import UserDetailPopup from "../components/UserDetailPopup";

export default function Home() {
  //USED FOR STORING USER LAT/LONG
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    error: null,
  });

  //USED FOR GETTING MAP
  const { current: map } = useMap();

  //USED FOR STORING ALLUSER'S DATA
  const [allUsers, setAllUsers] = useState([]);

  //CHECKING IF LOGIN IS DONE OR NOT BY THE USER
  const [login, setLogin] = useState(false);

  //
  const [selectedUser, setSelectedUser] = useState(null);


  //
  const [currentUserDoc,setCurrentUserDoc]=useState(null);

  //THIS TAKES LOCATION OF THE USER AS HE ENTER'S
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => {
          setLocation((prevLocation) => ({
            ...prevLocation,
            error: error.message,
          }));
        }
      );
    } else {
      setLocation((prevLocation) => ({
        ...prevLocation,
        error: "Geolocation is not supported by this browser.",
      }));
    }
  }, []);

  //THIS TAKES ALL THE USER'S DATA FROM FIREBASE DATABASE
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = [];
      // console.log(usersData);
      snapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setAllUsers(usersData);
    });

    return () => unsub();
  }, []);

  //NAVIGATE'S USER TO HIS LOCATION
  useEffect(() => {
    if (!map) return;
    (async () => {
      map.flyTo({ center: [location.longitude, location.latitude], zoom: 11 });
    })();
  }, [map, location]);

  //THIS FUNCTION HELPS STORE USER DATA'S INTO DATABASE
  function saveToFirestore(saveUser) {

    //ONLY STORES THE USER DOCUMENT
    setCurrentUserDoc(saveUser.sub);

    //STORING TO THE FIREBASE DATABASE
    setDoc(doc(db, "users", saveUser.sub), {
      name: saveUser.name,
      email: saveUser.email,
      picture: saveUser.picture,
      latitude: location.latitude,
      longitude: location.longitude,
      createdAt: new Date(),
    });

    document.getElementById("googleLogin").style.display = "none";
  }

  //CHECK'S IF MAP IS PRESENT IF NOT THEN SHOW NOTHING (LATER CHANGE TO BAD REQUEST PAGE)
  if (!map) return null;

  //THIS IS THE MAIN RETURN HTML CODE
  return (
    <>
      {/* ON TOP WE HAVE GOOGLE LOGIN 
     (WHICH NEED TO BE UPDATE TO LOOK GOOD) */}
      <div id="googleLogin">
        <GoogleLogin
          isSignedIn={true}
          cookiePolicy={"single_host_origin"}
          onSuccess={async (credentialResponse) => {
            saveToFirestore(jwtDecode(credentialResponse.credential));
            setLogin(true);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
          useOneTap={true}
          auto_select={true}
        />
      </div>
      {login ? (
        <>
          {allUsers.map((user) => (
            <Marker
              key={user.id}
              longitude={user.longitude}
              latitude={user.latitude}
            >
              <div
                onClick={() => setSelectedUser(user)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={user.picture}
                  alt={user.name}
                  className="profileImage"
                />
              </div>
            </Marker>
          ))}

          {selectedUser && (
            <UserDetailPopup
              clicked={selectedUser}
              onClose={() => setSelectedUser(null)}
              userDoc={currentUserDoc}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
}
