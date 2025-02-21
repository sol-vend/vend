import { API_URL } from "../Components/Shared";
import axios from 'axios';

export const socialPlatforms = [
  {
    name: "X",
    value: "x",
    imageUrl: "https://s.magecdn.com/social/tc-x.svg"
  },
  {
    name: "Instagram",
    value: "instagram",
    imageUrl: "https://s.magecdn.com/social/tc-instagram.svg"
  },
  {
    name: "Facebook",
    value: "facebook",
    imageUrl: "https://s.magecdn.com/social/tc-facebook.svg"
  },
  {
    name: "YouTube",
    value: "youtube",
    imageUrl: "https://s.magecdn.com/social/tc-youtube.svg"
  },
  {
    name: "Discord",
    value: "discord",
    imageUrl: "https://s.magecdn.com/social/tc-discord.svg"
  },
  {
    name: "Pinterest",
    value: "pinterest",
    imageUrl: "https://s.magecdn.com/social/tc-pinterest.svg"
  },
  {
    name: "Reddit",
    value: "reddit",
    imageUrl: "https://s.magecdn.com/social/tc-reddit.svg"
  },
  {
    name: "Substack",
    value: "substack",
    imageUrl: "https://s.magecdn.com/social/tc-substack.svg"
  }
];

export const getCityAndState = async (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.address) {
      const city = data.address.city || data.address.town || data.address.village;
      const state = data.address.state;
      return { city, state };
    } else {
      throw new Error('No results found for the provided coordinates.');
    }
  } catch (error) {
    console.error('Error getting city and state:', error);
  }
};

export const getIpAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'Unknown';
  }
};

export const getLocationMetadataFromIp = async (ipAddress) => {
  try {
    const response = await fetch(`https://ipinfo.io/${ipAddress}/json`);
    const data = await response.json();
    if (data && data.loc) {
      let formattedData = data;
      let lat = data.loc.split(',')[0]
      let lon = data.loc.split(',')[1]
      formattedData.lat = lat;
      formattedData.lon = lon;
      return formattedData;
    }
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return 'Unknown';
  }
}

const handleResponseRefreshToken = (response) => {
  if (response.data.refreshToken) {
    const token = response.data.refreshToken;
    localStorage.setItem('authToken', token);
  }
}

export const fetchDataWithAuth = async (setCallback) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API_URL}/api/check_login`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });
    if (response.data) {
      setCallback(response.data);
      handleResponseRefreshToken(response);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    setCallback({ "error": error, doContinue: false })
  }
};

export const retrieveExistingData = async (keys) => {
  try {
    const token = localStorage.getItem("authToken");
    const apiUrl = `${API_URL}/api/get_data_by_keys`;  // Replace with your API endpoint
    const postData = {
      searchKeys: keys
    };

    // Use async/await for better handling of asynchronous code
    const response = await axios.post(apiUrl, postData, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Include the Bearer token in the Authorization header
        'Content-Type': 'application/json'       // Set Content-Type to JSON if you're sending JSON data
      }
    });
    console.log('Response:', response.data);
    handleResponseRefreshToken(response);
    return response.data;

  } catch (error) {
    console.error('Error:', error);
    return error;
  }
};

export const updateExistingData = async (data) => {
  try {
    const token = localStorage.getItem("authToken");
    const apiUrl = `${API_URL}/api/update_item`;  // Replace with your API endpoint
    const postData = {
      updateItems: data
    };
    const response = await axios.post(apiUrl, postData, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Include the Bearer token in the Authorization header
        'Content-Type': 'application/json'       // Set Content-Type to JSON if you're sending JSON data
      }
    })
    console.log('Response:', response.data);
    handleResponseRefreshToken(response);
    return response.data;

  } catch (error) {
    console.error('Error:', error);
    return error;
  }
}