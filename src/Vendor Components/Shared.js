import { API_URL } from "../Components/Shared";
import axios from "axios";

export const socialPlatforms = [
  {
    name: "X",
    value: "x",
    imageUrl: "https://s.magecdn.com/social/tc-x.svg",
  },
  {
    name: "Instagram",
    value: "instagram",
    imageUrl: "https://s.magecdn.com/social/tc-instagram.svg",
  },
  {
    name: "Facebook",
    value: "facebook",
    imageUrl: "https://s.magecdn.com/social/tc-facebook.svg",
  },
  {
    name: "YouTube",
    value: "youtube",
    imageUrl: "https://s.magecdn.com/social/tc-youtube.svg",
  },
  {
    name: "Discord",
    value: "discord",
    imageUrl: "https://s.magecdn.com/social/tc-discord.svg",
  },
  {
    name: "Pinterest",
    value: "pinterest",
    imageUrl: "https://s.magecdn.com/social/tc-pinterest.svg",
  },
  {
    name: "Reddit",
    value: "reddit",
    imageUrl: "https://s.magecdn.com/social/tc-reddit.svg",
  },
  {
    name: "Substack",
    value: "substack",
    imageUrl: "https://s.magecdn.com/social/tc-substack.svg",
  },
];

export const getCityAndState = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.address) {
      const city =
        data.address.city || data.address.town || data.address.village;
      const state = data.address.state;
      return { city, state };
    } else {
      throw new Error("No results found for the provided coordinates.");
    }
  } catch (error) {
    console.error("Error getting city and state:", error);
  }
};

export const getIpAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return "Unknown";
  }
};

export const getLocationMetadataFromIp = async (ipAddress) => {
  try {
    const response = await fetch(`https://ipinfo.io/${ipAddress}/json`);
    const data = await response.json();
    if (data && data.loc) {
      let formattedData = data;
      let lat = data.loc.split(",")[0];
      let lon = data.loc.split(",")[1];
      formattedData.lat = lat;
      formattedData.lon = lon;
      return formattedData;
    }
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return "Unknown";
  }
};

/*
export const handleResponseRefreshToken = (response) => {
  if (response.data.refreshToken) {
    const token = response.data.refreshToken;
    localStorage.setItem('authToken', token);
  }
}
*/

export const fetchDataWithAuth = async (setCallback) => {
  try {
    const response = await axios.get(`${API_URL}/api/check_login`, {
      withCredentials: true,
    });

    if (response.data) {
      console.log(response);
      setCallback(response.data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    setCallback({ error: error.message, doContinue: false });
  }
};

export const retrieveExistingData = async (keys) => {
  try {
    const apiUrl = `${API_URL}/api/get_data_by_keys`;
    const postData = {
      searchKeys: keys,
    };
    const response = await axios.post(apiUrl, postData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
};

export const queryKeysAcrossCollections = async (
  keys,
  start,
  limit,
  setter
) => {
  const apiUrl = `${API_URL}/api/query_keys_across_collection`;
  try {
    const response = await axios.post(
      apiUrl,
      { keys: keys, start: start, limit: limit },
      {
        "Content-Type": "application/json",
      }
    );
    setter(response.data.data);
  } catch (error) {
    console.error("error:", error);
    return error;
  }
};

export const tryGetGeolocationFromStreetAddress = async (address, setter) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${address.street.replace(
        " ",
        "+"
      )},+${address.city.replace(" ", "+")},+${address.state}&format=json`
    );
    setter(response.data);
  } catch {
    return false;
  }
};

export const updateExistingData = async (data) => {
  try {
    const apiUrl = `${API_URL}/api/update_item`;
    const postData = {
      updateItems: data,
    };
    const response = await axios.post(apiUrl, postData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    console.log("Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return error;
  }
};

export const handleUserLogout = async (setUserLogout) => {
  try {
    const response = await axios.get(`${API_URL}/api/logout`, {
      withCredentials: true,
    });
    if (response) {
      setUserLogout(true);
    }
  } catch (error) {
    setUserLogout(false);
  }
};

export const fetchTokens = async (stateSetter) => {
  try {
    const response = await fetch("https://tokens.jup.ag/tokens?tags=verified");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    stateSetter(data);
  } catch (error) {
    console.error("Error fetching tokens:", error);
  }
};

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function setCookie(name, value, options = {}) {
  let updatedCookie = `${name}=${value}`;

  // Set options for cookie
  if (options.expires) {
    updatedCookie += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.path) {
    updatedCookie += `; path=${options.path}`;
  }

  if (options.domain) {
    updatedCookie += `; domain=${options.domain}`;
  }

  if (options.secure) {
    updatedCookie += `; secure`;
  }

  if (options.sameSite) {
    updatedCookie += `; SameSite=${options.sameSite}`;
  }

  document.cookie = updatedCookie;
}

export function modifyCookieExpiration(cookieName, newExpirationDate) {
  // Get the value of the cookie
  const cookieValue = getCookie(cookieName);

  if (!cookieValue) {
    console.log(`Cookie with name ${cookieName} not found.`);
    return;
  }

  // Retrieve other attributes (path, domain, secure, sameSite) by parsing the cookie
  const cookieAttributes = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(cookieName))
    ?.split(";")[0]
    .split("=")[0]; // Extracts only the cookie name

  // Set the new expiration date, keeping all other attributes the same
  setCookie(cookieName, cookieValue, {
    expires: newExpirationDate,
    path: "/", // Default path
    // Add any other attributes such as domain, secure, sameSite here if needed
  });
}
