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