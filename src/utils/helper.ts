import { UAParser } from "ua-parser-js";


// Function to get device information from ua-parser-js (truncated for API limits)
export function getDeviceInfo() {
  try {
    const parser = new UAParser();
    const result = parser.getResult();
    
    // Create a simplified version that fits in 255 characters
    const deviceData = {
      browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
      os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
      device: result.device.model || result.device.vendor || 'Unknown Device'
    };
    
    const deviceString = JSON.stringify(deviceData);
    console.log("Device info:", deviceString, "Length:", deviceString.length);
    
    // Ensure it's under 255 characters
    if (deviceString.length <= 255) {
      return deviceString;
    } else {
      // Fallback to even simpler format if still too long
      const fallback = `${result.browser.name || 'Browser'} on ${result.os.name || 'Unknown OS'}`;
      console.log("Using fallback device info:", fallback);
      return fallback;
    }
  } catch (error) {
    console.error("Error parsing user agent:", error);
    return "Unknown Device";
  }
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
