//==================================
// UTIL
//==================================

function requireConfigValue_(key) {

  if (!CONFIG[key]) {

    throw new Error(
      "CONFIG." + key + " が設定されていません。"
    );

  }

}

//----------------------------------
// Log
//----------------------------------

function logInfo_(message) {

  Logger.log("[INFO] " + message);

}

function logError_(message) {

  Logger.log("[ERROR] " + message);

}

//----------------------------------
// Text
//----------------------------------

function truncateText_(text, maxLength) {

  text = String(text || "");

  if (text.length <= maxLength) {

    return text;

  }

  return text.substring(0, maxLength);

}

function isEmpty_(value) {

  return String(value || "").trim() === "";

}

function normalizeText_(value) {

  return String(value || "")

    .replace(/<script[\s\S]*?<\/script>/gi, " ")

    .replace(/<style[\s\S]*?<\/style>/gi, " ")

    .replace(/<[^>]+>/g, " ")

    .replace(/&nbsp;/g, " ")

    .replace(/&amp;/g, "&")

    .replace(/&quot;/g, "\"")

    .replace(/&#39;/g, "'")

    .replace(/&lt;/g, "<")

    .replace(/&gt;/g, ">")

    .replace(/\s+/g, " ")

    .trim();

}

//----------------------------------
// HTML
//----------------------------------

function getMetaContent_(html, patterns) {

  for (let i = 0; i < patterns.length; i++) {

    const match = html.match(patterns[i]);

    if (match && match[1]) {

      return normalizeText_(match[1]);

    }

  }

  return "";

}

//----------------------------------
// JSON
//----------------------------------

function fetchJson_(url, options) {

  const response =
    UrlFetchApp.fetch(url, options);

  const code =
    response.getResponseCode();

  const text =
    response.getContentText();

  if (code < 200 || code >= 300) {

    throw new Error(

      "HTTP " +

      code +

      "\n\n" +

      text

    );

  }

  return JSON.parse(text);

}

//----------------------------------
// Cloudinary
//----------------------------------

function base64UrlSafe_(text) {

  return Utilities
    .base64EncodeWebSafe(text)
    .replace(/=+$/, "");

}

function encodeCloudinaryText_(text) {

  return encodeURIComponent(text)

    .replace(/\(/g,"%28")

    .replace(/\)/g,"%29");

}

//----------------------------------
// XML
//----------------------------------

function escapeXml_(text) {

  return String(text || "")

    .replace(/&/g,"&amp;")

    .replace(/</g,"&lt;")

    .replace(/>/g,"&gt;")

    .replace(/"/g,"&quot;")

    .replace(/'/g,"&apos;");

}

//----------------------------------
// Date
//----------------------------------

function now_() {

  return new Date();

}

function nowString_() {

  return Utilities.formatDate(

    new Date(),

    Session.getScriptTimeZone(),

    "yyyy-MM-dd HH:mm:ss"

  );

}

//----------------------------------
// Retry
//----------------------------------

function retry_(func) {

  let lastError;

  for (

    let i = 0;

    i < CONFIG.RETRY_COUNT;

    i++

  ) {

    try {

      return func();

    }

    catch(e) {

      lastError = e;

      logError_(

        "Retry " +

        (i + 1) +

        "/" +

        CONFIG.RETRY_COUNT +

        " : " +

        e.message

      );

      if (

        i <

        CONFIG.RETRY_COUNT - 1

      ) {

        Utilities.sleep(

          CONFIG.RETRY_WAIT_MS

        );

      }

    }

  }

  throw lastError;

}
