import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { io } from "socket.io-client";

const socket = io("https://real-time-devicetracker-bakend.vercel.app/");

// Custom icon
const defaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const SimpleMap = () => {
  const [location, setLocation] = useState({}); // Default to Delhi, India
  useEffect(() => {
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     const latitude = position.coords.latitude;
    //     const longitude = position.coords.longitude;
    //     const newLocation = [latitude, longitude];
    //     socket.emit('newLocation', newLocation);
    //     // setLocation(newLocation);
    //     console.log(`Initial Location: Latitude = ${latitude}, Longitude = ${longitude}`);
    //   },
    //   (error) => {
    //     console.log("Error fetching location: " + error.message);
    //   },
    //   {
    //     enableHighAccuracy: true,
    //     timeout: 10000,
    //     maximumAge: 0,
    //   }
    // );

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        socket.emit("newLocation", { lat: latitude, lng: longitude });
        console.log(
          `Updated Location: Latitude = ${latitude}, Longitude = ${longitude}`
        );
      },
      (error) => {
        console.log("Error watching location: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 2500,
        maximumAge: 0,
      }
    );
    socket.on('toAll', (data)=>{
      setLocation(data);
    });
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: "100vh", width: "100vw" }}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {Object.entries(location).map(([id, loc]) => (
      <Marker key={id} position={[loc.lat, loc.lng]} icon={defaultIcon}>
        <Popup>User: {id}</Popup>
      </Marker>
    ))}
  </MapContainer>
  );
};

export default SimpleMap;
