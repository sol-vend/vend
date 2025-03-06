import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import {
  getIpAddress,
  getLocationMetadataFromIp,
  retrieveExistingData,
  queryKeysAcrossCollections,
} from "../Vendor Components/Shared";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapComponent.css";
import HeaderWrapper from "../Vendor Components/HeaderWrapper";

const MapComponent = () => {
  const [position, setPosition] = useState(false);
  const [userMetadata, setUserMetadata] = useState(false);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(1000); // Initial radius in meters
  const [businesses, setBusinesses] = useState([]);
  const [expandDescription, setExpandDescription] = useState(false);

  const defaultIcon = new L.DivIcon({
    html: "<div class='marker-icon'><img src='./pin.jpg'/></div>",
    iconSize: [50, 50],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const keysToQuery = [
    "businessName",
    "logo",
    "businessDescription",
    "businessHours",
    "businessPhone",
    "businessSocials",
    "businessLocation",
    "ipMetadata",
    "locationCoordinates",
  ];

  useEffect(() => {
    queryKeysAcrossCollections(keysToQuery, 0, 100, setBusinesses);
  }, []);

  useEffect(() => {
    console.log(businesses);

    if (businesses.length > 0) {
      console.log(businesses[0].logo.file);
    }
  }, [businesses]);

  useEffect(() => {
    if (position) {
      setLoading(false);
    }
  }, [position]);

  useEffect(() => {
    const localGetIp = async () => {
      const ipInfos = await getIpAddress();
      if (ipInfos) {
        const userData = await getLocationMetadataFromIp(ipInfos);
        setUserMetadata({
          ipAddress: ipInfos,
          data: userData,
        });
      }
    };

    localGetIp();
  }, []);

  useEffect(() => {
    if (userMetadata.data) {
      console.log(userMetadata.data);
      const newPosition = [
        Number(userMetadata.data.lat),
        Number(userMetadata.data.lon),
      ];
      console.log(newPosition);
      setPosition(newPosition);
    }
  }, [userMetadata, radius]);

  const getLatLon = (business) => {
    if (
      business.locationCoordinates &&
      business.locationCoordinates.length > 0
    ) {
      return [business.locationCoordinates[0], business.locationCoordinates[1]];
    } else if (business.ipMetadata && business.ipMetadata.lat) {
      return [Number(business.ipMetadata.lat), Number(business.ipMetadata.lon)];
    } else {
      return [0, 0];
    }
  };

  const handleShowDescription = (business) => {
    const Modal = ({ isOpen, onClose, textToSend }) => {
      if (!isOpen) return null; // If modal is not open, don't render anything

      return (
        <div
          style={{
            zIndex: "10000",
            top: "30vh",
            position: "absolute",
            width: "100vw",
            cursor: "default",
          }}
          className="overlay"
          onClick={onClose}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{textToSend.businessName}</h3>
            <p>{textToSend.businessDescription}</p>
            <div style={{display:"flex", alignItems:'center', justifyContent:'center'}}>
              <div className="vendor-add-button-styles" onClick={onClose}>
                Close
              </div>
            </div>
          </div>
        </div>
      );
    };
    setExpandDescription(
      <Modal
        isOpen={true}
        onClose={() => setExpandDescription(false)}
        textToSend={business}
      />
    );
  };

  const createBusinessIcon = (business) => {
    if (business.logo && business.logo.file) {
      const BusinessIcon = () => {
        return (
          <div className="marker-icon">
            <img id={business.businessName} src={business.logo.file} />
          </div>
        );
      };
      return new L.DivIcon({
        iconUrl: "./Vend-Logo.png",
        className: "marker-icon",
        html: renderToString(<BusinessIcon />),
        iconSize: [75, 75],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    } else{
      return defaultIcon;
    }
  }
  
  const CreateBusinessPopup = ({ business }) => {
    return (
      <div className="popup-icon-rel">
        <h3>{business.businessName}</h3>
        {business.businessDescription.length > 0 && (
          <div className="overflow-control-p">
            <p>{`${business.businessDescription.slice(0, 20)}...`}</p>
            <a
              style={{ cursor: "pointer" }}
              onClick={() => handleShowDescription(business)}
            >
              Read More
            </a>
          </div>
        )}
        {business.businessLocation && business.businessLocation.street && (
          <p>{`${business.businessLocation.street} ${business.businessLocation.city}, ${business.businessLocation.state}`}</p>
        )}
        {business.businessSocials &&
          business.businessSocials.map((social) => {
            if (social.url && social.platform) {
              return <p>{social.url}</p>;
            }
          })}
        {business.businessPhone && <p>{business.businessPhone}</p>}
      </div>
    );
  };

  function validateAddressFromLocation(location) {
    // Define the regex pattern for address validation
    const regex = /^\d+\s[\w\s]+,\s([A-Za-z\s\-]+),\s([A-Z]{2})$/;

    // Combine the address, city, and state into one string
    const fullAddress = `${location.address}, ${location.city}, ${location.state}`;

    // Test if the full address matches the regex pattern
    if (regex.test(fullAddress)) {
      return true; // Valid address
    } else {
      return false; // Invalid address
    }
  }

  const MapEvents = () => {
    const map = useMap();

    useEffect(() => {
      const calculateRadius = (zoom) => {
        const baseRadius = 1000; // meters
        return Math.round(baseRadius * Math.pow(2, 15 - zoom));
      };

      map.on("zoomend", () => {
        const currentZoom = map.getZoom();
        const newRadius = calculateRadius(currentZoom);
        setRadius(newRadius);
      });

      return () => {
        map.off("zoomend");
      };
    }, [map]);

    return null;
  };

  if (loading) {
    return (
      <div
        className="modal-overlay"
        style={{
          display: "flex",
          alignItems: "center",
          background: "rgb(0 0 0 / 75%)",
        }}
      >
        <div className="modal">
          <div className="loading-dialog">
            <p>Loading...</p>
            <div className="spinner" style={{ marginLeft: "15%" }}></div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <>
          <HeaderWrapper />
        </>
        <>
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: "90vh", width: "100%" }}
          >
            {expandDescription && expandDescription}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle center={position} radius={radius} />
            <MapEvents />
            {businesses.map((business) => (
              <Marker
                key={business.id}
                position={getLatLon(business)}
                icon={createBusinessIcon(business)}
              >
                {business.businessName && (
                  <Popup>{<CreateBusinessPopup business={business} />}</Popup>
                )}
              </Marker>
            ))}
          </MapContainer>
        </>
      </>
    );
  }
};

export default MapComponent;
