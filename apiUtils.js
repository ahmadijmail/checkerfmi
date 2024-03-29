const axios = require("axios");
const moment = require("moment");

const url = "https://api.ifreeicloud.co.uk";

async function performApiRequest(selectedOption, imei, key) {
  let service;

  if (selectedOption === "FMiP ON/OFF 🔎") {
    service = 4;
  } else if (selectedOption === "iPhone Basic INFO 🔎") {
    service = 120;
  } else if (selectedOption === "iPhone CARRIER 🔎") {
    service = 253;
  } else if (selectedOption === "Black List Check 🔎") {
    service = 9;
  } else if (selectedOption === "Phone number lookup 🔎") {
    return await fetchCarrierNameAndGateway(imei);
  } else {
    throw new Error("Invalid selected option");
  }

  const params = {
    service,
    imei,
    key,
  };

  try {
    const response = await axios.get(url, { params });

    if (response.status !== 200) {
      throw new Error(`Error: HTTP Code ${response.status}`);
    }

    const responseData = response.data;

    if (responseData.success !== true) {
      throw new Error(`Error: ${responseData.error}`);
    }
    let formattedResponse;
    if (selectedOption === "FMiP ON/OFF 🔎") {
      formattedResponse = formatResponse(responseData.object);
    } else if (selectedOption === "iPhone Basic INFO 🔎") {
      formattedResponse = formatBasicInfoResponse(responseData.object);
    } else if (selectedOption === "iPhone CARRIER 🔎") {
      formattedResponse = formatCarrierResponse(responseData.object);
    } else if (selectedOption === "Black List Check 🔎") {
      formattedResponse = formatBlackListResponse(responseData.object);
    } else {
      throw new Error("Invalid selected option");
    }

    // Return the formatted response
    return formattedResponse;
  } catch (error) {
    throw error;
  }
}

const formatResponse = (data) => {
  const { imei, fmiOn } = data;
  const status = fmiOn ? "ON ⚠️" : "OFF ✅";
  const time = moment().format("YYYY-MM-DD HH:mm:ss");

  return `IMEI: ${imei}\nFind My: ${status}\nTime: ${time}\n© Powered By AI`;
};

const formatBasicInfoResponse = (data) => {
  console.log(data);
  const {
    modelDescription,
    imei,
    imei2,
    serial,
    fmiON,
    estimatedPurchaseDate,
    warrantyStatus,
    purchaseCountry,
    blacklistStatus,
    replacedDevice,
    replacementDevice,
    refurbishedDevice,
    "sim-lockStatus": simLockStatus,
  } = data;

  const formattedResponse = `Model: ${modelDescription}
IMEI: ${imei}
imei2: ${imei2}
Serial: ${serial}
iCloud Lock: ${fmiON ? "⚠️ON" : "✅OFF"}
estimatedPurchaseDate: ${estimatedPurchaseDate}
Warranty Status: ${warrantyStatus}
replacedDevice: ${replacedDevice}
blacklistStatus: ${blacklistStatus}
replacementDevice: ${replacementDevice}
refurbishedDevice: ${refurbishedDevice}
Purchase Country: ${purchaseCountry}
Sim-Lock: ${simLockStatus}`;

  return formattedResponse;
};
const formatCarrierResponse = (data) => {
  const {
    imei,
    imei2,
    serial,
    estPurchaseDate,
    blocked,
    simLock,
    blockedPolicy,
    modelDesc,
    purchaseCountryCodeIso3,
    model,
    fmiOn,
    lostMode,
    country,
    carrier,
    nextActivationPolicyId,
  } = data;

  const emojiCheckmark = "✅";
  const emojiCrossmark = "❌";
  const emojiLock = "🔒";
  const emojiPhone = "📱";
  const emojiGlobe = "🌍";
  const emojiAction = "🔧";
  const emojiCalendar = "📅";

  const formattedResponse = `Model Description: ${modelDesc}
Model: ${model}
IMEI: ${imei}
IMEI2: ${imei2}
Serial: ${serial}
Purchase Date: ${estPurchaseDate}
Find My iPhone: ${fmiOn ? "On" + emojiCrossmark : "OFF" + emojiCheckmark}
ICloud Status: ${
    lostMode ? "Lost Mode" + emojiCrossmark : "Clean" + emojiCheckmark
  }
Blocked: ${blocked}
SIM Lock: ${simLock ? "Locked" + emojiLock : "Unlocked" + emojiCheckmark}
Blocked Policy: ${blockedPolicy}
Purchase Country Code: ${purchaseCountryCodeIso3}
Country: ${emojiGlobe} ${country}
Carrier: ${emojiPhone} ${carrier}`;
  return formattedResponse;
};

const formatBlackListResponse = (data) => {
  const {
    imei,
    manufacturer,
    modelName,
    model,
    gsmaBlacklisted,
    blacklistStatus,
    blacklistHistory,
    blacklistRecords,
    history,
  } = data;

  const emojiCheckmark = "✅";
  const emojiCrossmark = "❌";
  const emojiWarning = "⚠️";
  const emojiCalendar = "📅";
  const emojiPhone = "📱";
  const emojiLocation = "📍";
  const emojiAction = "🔧";
  const emojiCountry = "🌍";

  const formattedResponse = `IMEI: ${imei}
Manufacturer: ${manufacturer}
Model Name: ${modelName}
Model: ${model}
GSMA Blacklisted: ${gsmaBlacklisted ? emojiCrossmark : emojiCheckmark}
Blacklist Status: ${blacklistStatus ? emojiCrossmark : emojiCheckmark}
Blacklist History:
${blacklistHistory
  .map(
    (item) => `${emojiAction} Action: ${item.action}
${emojiCalendar} Date: ${item.date}
${emojiPhone} By: ${item.by}
${emojiCountry} Country: ${item.Country}
`
  )
  .join("\n")}
Blacklist Records: ${blacklistRecords}
History:
${history
  .map(
    (item) => `${emojiAction} Action: ${item.action}
${emojiCalendar} Date: ${item.date}
${emojiPhone} By: ${item.by}
${emojiCountry} Country: ${item.Country}
`
  )
  .join("\n")}`;

  return formattedResponse;
};

function sanitizePhoneNumber(phoneNumber) {
  // Remove any spaces, hyphens, parentheses, or other non-numeric characters
  return phoneNumber.replace(/[^\d]/g, "");
}

async function fetchCarrierNameAndGateway(rawPhoneNumber) {
  const phoneNumber = sanitizePhoneNumber(rawPhoneNumber);
  const accountSid = "ACd98152d28f5bef3ddc77b5141303aa65"; // Replace with your Account SID
  const authToken = process.env.CARRIERTOKEN; // Replace with your Auth Token
  const twilioUrl = `https://lookups.twilio.com/v1/PhoneNumbers/${phoneNumber}?Type=carrier`;

  try {
    const response = await axios.get(twilioUrl, {
      auth: {
        username: accountSid,
        password: authToken,
      },
    });

    const carrierName = response.data.carrier.name;
    const smsGateway = getSmsGateway(phoneNumber, carrierName);
    return smsGateway;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function getSmsGateway(phoneNumber, carrierName) {
  const carrierGateways = {
    "T-Mobile": "tmomail.net",
    "AT&T": "txt.att.net",
    Verizon: "vtext.com",
    "T-Mobile USA, Inc.": "tmomail.net",
    "T-Mobile USA, Inc. (form. Metro PCS, Inc.)": "mymetropcs.com",
  };

  let gatewayDomain = "";
  for (let key in carrierGateways) {
    if (carrierName.includes(key)) {
      gatewayDomain = carrierGateways[key];
      break;
    }
  }

  if (gatewayDomain) {
    return `${phoneNumber}@${gatewayDomain}`;
  } else {
    throw new Error(
      "Carrier not recognized or SMS gateway not available for this carrier."
    );
  }
}

module.exports = {
  performApiRequest,
  formatBasicInfoResponse,
  formatResponse,
  fetchCarrierNameAndGateway,
};
