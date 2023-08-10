import { formatDistanceToNow } from "date-fns";

export function timeAgo(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function capitalizeString(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function camelCaseToTitleCase(inputString) {
  if (inputString) {
    const wordsArray = inputString.split(/(?=[A-Z])/);

    wordsArray[0] = wordsArray[0][0].toUpperCase() + wordsArray[0].substring(1);

    return wordsArray.join(" ");
  }
  return;
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
