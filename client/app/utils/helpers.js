export function capitalizeString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getBrowserName(userAgent) {
  userAgent = userAgent.toLowerCase();

  if (userAgent.indexOf("chrome") !== -1) {
    return "chrome";
  } else if (userAgent.indexOf("firefox") !== -1) {
    return "firefox";
  } else if (userAgent.indexOf("safari") !== -1) {
    return "safari";
  } else if (userAgent.indexOf("edge") !== -1) {
    return "edge";
  } else {
    return "other";
  }
}

export function trimIdToSixChars(id) {
  if (typeof id !== "string" || id.length <= 6) {
    return id; //
  }

  return id.substring(0, 6);
}
