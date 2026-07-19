// Helper to dynamically load Google Identity Services SDK
export const loadGoogleScript = () => {
  return new Promise((resolve) => {
    if (window.google?.accounts?.oauth2) {
      resolve(window.google);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve(window.google);
    };
    script.onerror = () => {
      resolve(null);
    };
    document.body.appendChild(script);
  });
};

// Helper to decode JWT token returned by Google OAuth One Tap
export const decodeGoogleJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse Google JWT token:', error);
    return null;
  }
};

// Fetch real Google user profile using OAuth access token
export const fetchGoogleUserInfo = async (accessToken) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch Google UserInfo:', error);
    return null;
  }
};
