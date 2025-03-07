import React, { useState, useEffect, useRef } from "react";
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
  const [activeBusinessId, setActiveBusinessId] = useState("");
  const [zIndex, setZIndex] = useState(1000);
  const markerRefs = useRef([]);

  const PinSvg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        width="60"
        height="60"
        viewBox="0 0 256 256"
      >
        <g
          style={{
            stroke: "none",
            strokeWidth: 0,
            strokeDasharray: "none",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeMiterlimit: 10,
            fill: "none",
            fillRule: "nonzero",
            opacity: 1,
          }}
          transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
        >
          <path
            d="M 45 90 c -1.415 0 -2.725 -0.748 -3.444 -1.966 l -4.385 -7.417 C 28.167 65.396 19.664 51.02 16.759 45.189 c -2.112 -4.331 -3.175 -8.955 -3.175 -13.773 C 13.584 14.093 27.677 0 45 0 c 17.323 0 31.416 14.093 31.416 31.416 c 0 4.815 -1.063 9.438 -3.157 13.741 c -0.025 0.052 -0.053 0.104 -0.08 0.155 c -2.961 5.909 -11.41 20.193 -20.353 35.309 l -4.382 7.413 C 47.725 89.252 46.415 90 45 90 z"
            style={{
              stroke: "none",
              strokeWidth: 1,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeMiterlimit: 10,
              fill: "#9945FF",
              fillRule: "nonzero",
              opacity: 1,
            }}
            transform="matrix(1 0 0 1 0 0)"
            strokeLinecap="round"
          />
          <path
            d="M 45 45.678 c -8.474 0 -15.369 -6.894 -15.369 -15.368 S 36.526 14.941 45 14.941 c 8.474 0 15.368 6.895 15.368 15.369 S 53.474 45.678 45 45.678 z"
            style={{
              stroke: "none",
              strokeWidth: 1,
              strokeDasharray: "none",
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeMiterlimit: 10,
              fill: "rgb(255,255,255)",
              fillRule: "nonzero",
              opacity: 1,
            }}
            transform="matrix(1 0 0 1 0 0)"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  };

  useEffect(() => {
    console.log(activeBusinessId);
  }, [activeBusinessId]);

  const defaultIcon = new L.DivIcon({
    html:
      "<div class='marker-svg-wrapper'>" +
      renderToString(<PinSvg />) +
      "</div>",
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
        className="map-overlay"
        onClick={onClose}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <h3>{textToSend.businessName}</h3>
          <p>{textToSend.businessDescription}</p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="vendor-add-button-styles" onClick={onClose}>
              Close
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleShowDescription = (business) => {
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
          <div className={activeBusinessId === business.businessId ? "marker-icon active" : "marker-icon"}>
            <img id={business.businessName} src={business.logo.file} />
          </div>
        );
      };
      return new L.DivIcon({
        html: renderToString(<BusinessIcon />),
        iconSize: [75, 75],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });
    } else {
      return defaultIcon;
    }
  };
  
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

  const handleActiveWrapper = (business, index) => {
    setActiveBusinessId(business.businessId);
  };

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
        className="modal-overlay  map-overlay"
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
            {businesses.map((business, index) => (
              <Marker
                key={business.businessId}
                position={getLatLon(business)}
                icon={createBusinessIcon(business)}
                ref={(el) => markerRefs.current[index] = el}
                eventHandlers={{
                  click: () => handleActiveWrapper(business, index), // Handle the click event
                }}
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
