import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import parkData from "../data/parks.json";
import "leaflet/dist/leaflet.css";
import "../App";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

var purpleIcon = new window.L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

var greenIcon = new window.L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

//Popup box to handle input for each location
function CheckBox({ markerId, visited, onSaveNotes }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSaveNotes = () => {
    onSaveNotes(markerId, selectedDate);
  };
  //Return a calendar for user to input date and save.
  return (
    <label>
      <p> Visited? Enter date below to save location:</p>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date"
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <button onClick={handleSaveNotes}>Save</button>
    </label>
  );
}

function Map() {
  const [notes, setNotes] = useState({});

  // const handleMarkerCheck = (markerId) => (e) => {
  //   const isChecked = e.target.checked;
  //   setNotes((prevNotes) => ({
  //     ...prevNotes,
  //     [markerId]: {
  //       ...prevNotes[markerId],
  //       visited: isChecked,
  //     },
  //   }));
  // };

  //Mark park as visited and list date.
  const handleSaveNotes = (markerId, date) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [markerId]: {
        visited: true,
        date: date,
      },
    }));
  };

  return (
    <MapContainer
      center={[44.5, -77]}
      zoom={9}
      scrollWheelZoom={false}
      style={{ height: "800px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {parkData.map((park) => {
        const markerId = park.map_label;
        const markerNotes = notes[markerId] || {};
        const visited = markerNotes.visited || false;
        const markerIcon = visited ? greenIcon : purpleIcon;

        return (
          <Marker
            key={markerId}
            position={[park.geo_point_2d.lat, park.geo_point_2d.lon]}
            icon={markerIcon}
            eventHandlers={{ mouseover: (event) => event.target.openPopup() }}
          >
            <Popup>
              {markerId} {"\n"}
              <CheckBox
                markerId={markerId}
                visited={visited}
                onSaveNotes={handleSaveNotes}
              />
              {visited && markerNotes.date && (
                <p>
                  Day Visited: {new Date(markerNotes.date).toLocaleDateString()}
                </p>
              )}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default Map;
