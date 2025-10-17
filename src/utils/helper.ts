// Simple function to get device information
export function getDeviceInfo() {
  // This is a simple implementation - you might want to use a library like 'platform' for better detection
  const userAgent = navigator.userAgent;
  let deviceName = "Unknown Device";

  if (/Macintosh/.test(userAgent)) deviceName = "Mac";
  else if (/Windows/.test(userAgent)) deviceName = "Windows PC";
  else if (/iPhone/.test(userAgent)) deviceName = "iPhone";
  else if (/iPad/.test(userAgent)) deviceName = "iPad";
  else if (/Android/.test(userAgent)) deviceName = "Android Device";

  return deviceName;
}

// Function to get IP address (you might need a service for this)
export async function getIpAddress() {
  try {
    // Option 1: Use an external service
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Failed to get IP address", error);
    return "0.0.0.0"; // Fallback value
  }
}
