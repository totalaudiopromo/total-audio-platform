// Stored raw data for dedupe
// Stored tr endpoints requests URL
// [tabId] -> [pixel id] -> [pixel event]
var trDetails = {};
// [tabId] -> [pixel id] -> [pixel event]
// Stored parsed details from content
var parsedDetails = {};
// Stored combined data for above
// structure is pixelHelperDetails -> [tabId] -> [pixel id] -> [pixel event]
var pixelHelperDetails = {};
// Temporarily stored urls. tabid : url
var currentURL = {};
// Latest tab id
var latestTabId = null;

const customDataMatchRule = /cd\[([^\]]+)\]/; // cd[balabala]='123'
const piiDataMatchRule = /(a?udff|\bud)\[([^\]]+)\]/; // ud[balabala]='1234'
const dpoDataMatchRule = /(dpo|dpoco|dpost)/;

// processed data
chrome.runtime.onInstalled.addListener(() => {
  console.log('A new version is installed');
});

// Hash function from https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
// Shorten string length
function hashCode(str) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  const output = hash < 0 ? -hash : hash;
  return String(output).padStart(9, '0'); // force with 9 digits
}

function removeDataForTab(tabId) {
  if (tabId in trDetails) {
    delete trDetails[tabId];
  }
  if (tabId in parsedDetails) {
    delete parsedDetails[tabId];
  }
  if (tabId in pixelHelperDetails) {
    delete pixelHelperDetails[tabId];
    chrome.storage.local.set({ pixelHelperDetails: pixelHelperDetails });
  }
  if (latestTabId == tabId) {
    latestTabId = null;
  }
}

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  removeDataForTab(tabId);
});

// Clean up storage for reload, navigation
chrome.webNavigation.onBeforeNavigate.addListener(details => {
  if (details.frameId === 0) {
    // only care about outer frame
    removeDataForTab(details.tabId);
    currentURL[details.tabId] = details.url;
    latestTabId = details.tabId;
  }
});

chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
  if (details.frameId === 0) {
    const oldURL = new URL(currentURL[details.tabId]);
    const newURL = new URL(details.url);
    if (oldURL && newURL && (oldURL.host !== newURL.host || oldURL.pathname !== newURL.pathname)) {
      removeDataForTab(details.tabId);
      currentURL[details.tabId] = details.url; // update new url
      latestTabId = details.tabId;
    }
  }
});

// Active tab changes, refresh content. Update especially for pop out window case
chrome.tabs.onActivated.addListener(function (activeInfo) {
  // Save last tab id to local storage for popout purpose
  chrome.storage.local.set({ latestTabId: latestTabId ?? '' });
  chrome.storage.local.set({ latestURL: currentURL[latestTabId] ?? '' });

  latestTabId = activeInfo.tabId;
  chrome.runtime.sendMessage({ pixelHelperUpdated: 'updated' }, function (response) {
    if (chrome.runtime.lastError) {
      // Ignore error when popup not trigered.
      // Message as `Receiving end does not exist`
    }
  });
});

function setIcon(tabId, pixelCount) {
  let iconPath = {};
  if (pixelCount > 0) {
    iconPath = {
      19: '/img/pixel_helper_icon_19.png',
      38: '/img/pixel_helper_icon_38.png',
    };
  } else {
    iconPath = {
      19: '/img/pixel_helper_icon_faded_19.png',
      38: '/img/pixel_helper_icon_faded_38.png',
    };
  }
  chrome.action.setIcon({
    tabId: tabId,
    path: iconPath,
  });
  chrome.action.setBadgeText({
    tabId: tabId,
    text: pixelCount > 0 ? String(pixelCount) : '',
  });
  chrome.action.setBadgeBackgroundColor({
    tabId: tabId,
    color: '#6BB933',
  });
}
// Client side diagnostics status
function updateDiagnosticsStatus(pixelEventName, pixelEventAttribute) {
  if (
    pixelEventName.startsWith('Microdata') ||
    pixelEventName.startsWith('SubscribedButtonClick')
  ) {
    pixelEventAttribute['status'] = 'auto';
  } else if (!pixelEventAttribute['urlCalled']) {
    // no pixel request fired
    pixelEventAttribute['status'] = 'warning';
    pixelEventAttribute['statusContent'] =
      '<span>Pixel Helper found your Meta Pixel, but the pixel has not been activated for this event and no information has been sent to Meta. ' +
      'This may be due to an error in the code or if the pixel fires on a dynamic event, such as a button click. ' +
      'Follow the steps below to troubleshoot this issue: </span>' +
      "<ol style='padding-inline-start: 20px'><li>Try sending the desired event using the<a href='https://www.facebook.com/business/help/2040882565969969?id=1205376682832142' class='show'><span>test events</span></a> tool.</li>" +
      '<li>If the test events tool does not detect the event, there may be an issue with the Pixel Helper implementation. Please review Meta Pixel implementation with your developer.' +
      "<a href='https://www.facebook.com/business/help/952192354843755?id=1205376682832142' class='show'>" +
      '<span>Learn more</span>' +
      '</a></li><ol>';
  } else if (pixelEventAttribute['statusType'] === 'fired_multiple_times') {
    // multiple reqeusts fired
    pixelEventAttribute['status'] = 'warning';
    pixelEventAttribute['statusContent'] =
      '<span>The Facebook pixel activated ' +
      pixelEventAttribute['statusCount'] +
      ' times on this web page, which can cause errors in your event tracking.</span>' +
      "<a href='https://developers.facebook.com/docs/facebook-pixel/pixel-helper#multiple-activations' class='show'>" +
      '<span>Learn more</span>' +
      '</a>';
  } else {
    pixelEventAttribute['status'] = 'success';
    delete pixelEventAttribute['statusContent'];
  }
}

// Combine and process parsedDetails and trDetails into one single object and stored in local storage.
function updatePixelHelperDetails(updateDetails) {
  // TODO: check if there new update or duplicate calls.
  // pixelHelperDetails = Object.assign(updateDetails);
  let hasChanged = false;

  // Iterate parsedDetails
  for (const tabId in updateDetails) {
    let tabTotalEventsCount = 0;
    if (!pixelHelperDetails[tabId]) {
      pixelHelperDetails[tabId] = {};
    }
    for (const pixelId in updateDetails[tabId]) {
      if (!pixelHelperDetails[tabId][pixelId]) {
        pixelHelperDetails[tabId][pixelId] = {};
      }
      for (const pixelEvent in updateDetails[tabId][pixelId]) {
        if (!pixelHelperDetails[tabId][pixelId][pixelEvent]) {
          pixelHelperDetails[tabId][pixelId][pixelEvent] = {};
        }
        for (const attribute in updateDetails[tabId][pixelId][pixelEvent]) {
          const updatedAttribute = updateDetails[tabId][pixelId][pixelEvent][attribute];
          const existingAttribute = pixelHelperDetails[tabId][pixelId][pixelEvent][attribute];
          if (JSON.stringify(updatedAttribute) !== JSON.stringify(existingAttribute)) {
            pixelHelperDetails[tabId][pixelId][pixelEvent][attribute] = updatedAttribute;
            hasChanged = true;
          }
        }

        // Update loading time
        const requestStartTime = pixelHelperDetails[tabId][pixelId][pixelEvent]['requestStartTime'];
        const requestEndTime = pixelHelperDetails[tabId][pixelId][pixelEvent]['requestEndTime'];
        if (requestStartTime && requestEndTime) {
          const loadTime = (requestEndTime - requestStartTime).toFixed(2);
          pixelHelperDetails[tabId][pixelId][pixelEvent]['loadTime'] = loadTime + ' ms';
        }
        // Client side diagnostics
        updateDiagnosticsStatus(pixelEvent, pixelHelperDetails[tabId][pixelId][pixelEvent]);
      }
      tabTotalEventsCount += Object.entries(pixelHelperDetails[tabId][pixelId]).length;
    }
    // set active tab icon
    setIcon(Number(tabId), tabTotalEventsCount);
  }

  // Save pixelHelperDetails to local storage. Retrieved from popup
  chrome.storage.local.set({ pixelHelperDetails: pixelHelperDetails });

  // console.log("print out pixelHelperDetails:" + JSON.stringify(pixelHelperDetails));
  if (hasChanged) {
    chrome.runtime.sendMessage({ pixelHelperUpdated: 'updated' }, function (response) {
      if (chrome.runtime.lastError) {
        // Ignore error when popup not trigered.
        // Message as `Receiving end does not exist`
      }
    });
  }
}

// Retrieved data from web request, dedupe when needed
function beforeTRRequest(request) {
  // if already processed in beforeTRRequestIfInBatch, return
  if (beforeTRRequestIfInBatch(request)) {
    return;
  }

  const url = new URL(request.url);
  let urlParams = new URLSearchParams(url.search);
  const tabId = request.tabId;
  let pixelId = urlParams.get('id');
  let pixelEvent = urlParams.get('ev');

  // Drop duplicate requests causing by pixel helper mv2
  if (urlParams.get('dt')) {
    return;
  }

  // tr related info in form, check form data
  if (!pixelId && !pixelEvent) {
    if (request?.requestBody?.formData) {
      const formData = new FormData();
      for (const key in request.requestBody.formData) {
        formData.append(key, request.requestBody.formData[key][0]);
      }
      urlParams = new URLSearchParams(formData);
      pixelId = urlParams.get('id');
      pixelEvent = urlParams.get('ev');
    } else {
      return;
    }
  }

  fillInTrDetails(request, urlParams, tabId);
  updatePixelHelperDetails(trDetails, tabId);
}

// Retrieved data from web request, check if in batch
// If yes, process each event and update pixelHelperDetails individually, return true
// Otherwise return false
function beforeTRRequestIfInBatch(request) {
  let batchedEvents = [];
  // if a batch and batched events info in request.url
  const urlQueryString = new URL(request.url).search;
  const urlParams = new URLSearchParams(urlQueryString);
  if (urlParams.get('batch') === '1') {
    for (const key of urlParams.keys()) {
      if (key.startsWith('event')) {
        batchedEvents.push(decodeURIComponent(urlParams.get(key)));
      }
    }
    // if a batch and batched events info in request.body
  } else if (request?.requestBody?.formData?.batch == '1') {
    for (const key in request.requestBody.formData) {
      if (key.startsWith('event')) {
        batchedEvents.push(decodeURIComponent(request.requestBody.formData[key][0]));
      }
    }
  } else {
    return false;
  }

  // process each event and update pixelHelperDetails individually
  for (const event of batchedEvents) {
    const eventParams = new URLSearchParams(event);
    const pixelId = eventParams.get('id');
    const pixelEvent = eventParams.get('ev');
    if (!pixelId && !pixelEvent) {
      return true;
    }
    fillInTrDetails(request, eventParams, request.tabId);
    updatePixelHelperDetails(trDetails, request.tabId);
  }
  return true;
}

async function logEventImmediately(pixelId, tabId, pixelEvent) {
  const analyticsLoggingPath = '/pixel_helper/analytics/';
  const hostEndpoint = 'www.facebook.com';
  const extensionVersion = chrome.runtime.getManifest().version;

  const loggingEvents = [
    {
      time: Date.now(),
      type: 'pixel_event_detected',
      payload: {
        pixelID: pixelId,
        eventName: pixelEvent,
        pageURL: trDetails[tabId][pixelId][pixelEvent]['pixelLocation'],
        requestURL: trDetails[tabId][pixelId][pixelEvent]['urlCalled'],
        setupMethod: trDetails[tabId][pixelId][pixelEvent]['setupMethod'],
      },
    },
  ];

  try {
    const response = await fetch(`https://${hostEndpoint}${analyticsLoggingPath}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:
        `extension_version=${encodeURIComponent(extensionVersion)}` +
        `&events=${encodeURIComponent(JSON.stringify(loggingEvents))}`,
    });

    if (response.status == 200) {
      console.log('Successfully logged event detected by pixel helper');
    }
  } catch (error) {
    console.log('Failed to log event detected by pixel helper');
  }
}

// Fill in TrDetails with the event params
function fillInTrDetails(request, eventParams, tabId) {
  if (!trDetails[tabId]) {
    trDetails[tabId] = {};
  }
  const pixelId = eventParams.get('id');
  if (!trDetails[tabId][pixelId]) {
    trDetails[tabId][pixelId] = {};
  }
  // extract custom data, pii data
  const customData = {};
  const piiData = {};
  const dpoData = {};
  for (const key of eventParams.keys()) {
    const matchedCustomData = key.match(customDataMatchRule);
    const matchedPiiData = key.match(piiDataMatchRule);
    const matchedDpoData = key.match(dpoDataMatchRule);
    if (matchedCustomData) {
      customData[matchedCustomData[1]] = eventParams.get(matchedCustomData[0]);
    }
    if (matchedPiiData) {
      piiData[matchedPiiData[0]] = eventParams.get(matchedPiiData[0]);
    }
    if (matchedDpoData) {
      dpoData[key] = eventParams.get(key);
    }
  }
  // pixel event
  const pixelEvent = eventParams.get('ev');
  if (trDetails[tabId][pixelId][pixelEvent]) {
    // Check duplication
    if (
      JSON.stringify(trDetails[tabId][pixelId][pixelEvent]['customData']) ==
      JSON.stringify(customData)
    ) {
      trDetails[tabId][pixelId][pixelEvent]['statusType'] = 'fired_multiple_times';
      trDetails[tabId][pixelId][pixelEvent]['statusCount'] = trDetails[tabId][pixelId][pixelEvent][
        'statusCount'
      ]
        ? trDetails[tabId][pixelId][pixelEvent]['statusCount'] + 1
        : 2;
    } else {
      // Specific for some events shared the same name, eg auto event or based on user's config.
      pixelEvent = pixelEvent + '-' + hashCode(JSON.stringify(customData));
    }
  }

  if (!trDetails[tabId][pixelId][pixelEvent]) {
    trDetails[tabId][pixelId][pixelEvent] = {};
  }

  trDetails[tabId][pixelId][pixelEvent]['customData'] = customData;
  trDetails[tabId][pixelId][pixelEvent]['piiData'] = piiData;
  trDetails[tabId][pixelId][pixelEvent]['dpoData'] = dpoData;

  // Update pixel event attribute
  trDetails[tabId][pixelId][pixelEvent]['urlCalled'] = request.url;
  trDetails[tabId][pixelId][pixelEvent]['eventId'] = eventParams.get('eid');
  trDetails[tabId][pixelId][pixelEvent]['pixelLocation'] = eventParams.get('dl');
  trDetails[tabId][pixelId][pixelEvent]['requestType'] = eventParams.get('rqm');
  trDetails[tabId][pixelId][pixelEvent]['requestStartTime'] = request.timeStamp;
  // Setup method, types: https://fburl.com/code/4uln7ulv how to differneciate: https://fburl.com/code/pivalymv
  if (!pixelEvent.startsWith('Microdata') && !pixelEvent.startsWith('SubscribedButtonClick')) {
    trDetails[tabId][pixelId][pixelEvent]['setupMethod'] = 'Manual';
  }

  // log the event
  logEventImmediately(pixelId, tabId, pixelEvent);
}

// Update loading time
function completeTRRequest(request) {
  // TODO: dedupe following code
  const url = new URL(request.url);
  const urlParams = new URLSearchParams(url.search);
  const tabId = request.tabId;
  const pixelId = urlParams.get('id');
  const pixelEvent = urlParams.get('ev');

  // Validate the requestStartTime has been in place
  if (
    trDetails[tabId] &&
    trDetails[tabId][pixelId] &&
    trDetails[tabId][pixelId][pixelEvent] &&
    trDetails[tabId][pixelId][pixelEvent]['requestStartTime'] &&
    trDetails[tabId][pixelId][pixelEvent]['requestStartTime'] < request.timeStamp
  ) {
    trDetails[tabId][pixelId][pixelEvent]['requestEndTime'] = request.timeStamp;
    updatePixelHelperDetails(trDetails, tabId);
  }
}

chrome.webRequest.onBeforeRequest.addListener(
  beforeTRRequest,
  { urls: ['*://www.facebook.com/tr*'] },
  ['extraHeaders', 'requestBody']
);

// Feature parity to get loading time
chrome.webRequest.onCompleted.addListener(
  completeTRRequest,
  { urls: ['*://www.facebook.com/tr*'] },
  ['extraHeaders']
);

chrome.webRequest.onErrorOccurred.addListener(
  function () {
    console.log('Error occured in request interception');
  },
  { urls: ['*://www.facebook.com/tr*'] }
);

// Listening to messages parsed from content, dedupe when needed
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.parsedContent) {
    const tabId = sender.tab.id;
    const parsedContent = JSON.parse(request.parsedContent);

    if (!parsedDetails[tabId]) {
      parsedDetails[tabId] = {};
    }

    if (parsedContent && Object.entries(parsedContent).length > 0) {
      // const parsedContentWithTabId = {};
      // parsedContentWithTabId[tabId] = parsedContent;
      // merged parsedContentWithTabId into parsedDetails
      // parsedDetails = Object.assign(parsedContentWithTabId);
      // set pixel id. key from parsedContent
      for (const pixelId in parsedContent) {
        // Initialize new pixel id
        if (!parsedDetails[tabId][pixelId]) {
          parsedDetails[tabId][pixelId] = {};
        }
        // Update pixelEvents
        const pixelEvents = parsedContent[pixelId];
        for (const pixelEvent in pixelEvents) {
          if (!parsedDetails[tabId][pixelId][pixelEvent]) {
            parsedDetails[tabId][pixelId][pixelEvent] = {};
          }
          parsedDetails[tabId][pixelId][pixelEvent]['pixelCode'] =
            pixelEvents[pixelEvent]['pixelCode'];
          parsedDetails[tabId][pixelId][pixelEvent]['frame'] = pixelEvents[pixelEvent]['frame'];
          parsedDetails[tabId][pixelId][pixelEvent]['pixelLocation'] = sender.tab.url;
          parsedDetails[tabId][pixelId][pixelEvent]['setupMethod'] = 'Manual';
        }
      }
      updatePixelHelperDetails(parsedDetails, tabId);
    }
  }
});
