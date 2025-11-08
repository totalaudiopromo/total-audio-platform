// Identifier fbq("abc", "def"), fbq('init','abc',customizedOption)
const regEx =
  /fbq\([\s*]?['"]([^'")]+)['"][\s*]?,[\s*]?['"]?([^'")]+)['"]?[\s*]?,?[\s*]?([^)]*)\)/gm;

function parseScriptEvents(document, frame) {
  // TODO: parsed in iframe
  const scriptTags = document.getElementsByTagName('script');
  const parsedEvent = {}; // key: pixel ID, value: Map<eventName, code>
  for (const script of scriptTags) {
    // One script snippet might contain multiple pixelIds
    let pixelIds = [];
    if (script?.textContent?.length > 0) {
      for (const match of script.textContent.matchAll(regEx)) {
        // match[0] is the full string, like fbq("init", pixelId) or fbq("track", "PageView")
        // match[1] is the first matched element, eg "init" or "track"
        // match[2] is the second matched element, eg "pixelId" or "PageView"
        if (match[1] === 'init') {
          // ("init", "pixelId', optional something else")
          const currentPixelId = match[2].match(/['"]?([\d]+)['"]?/)
            ? match[2].match(/['"]?([\d]+)['"]?/)[1]
            : match[2];
          if (!pixelIds.includes(currentPixelId)) {
            pixelIds.push(currentPixelId);
            if (!parsedEvent[currentPixelId]) {
              parsedEvent[currentPixelId] = {};
            }
          }
        } else if (pixelIds.length > 0) {
          // ("track", "pixelEventName', optional something else")
          const pixelEvent = match[2].match(/['"]?([\w]+)['"]?/)
            ? match[2].match(/['"]?([\w]+)['"]?/)[1]
            : match[2];
          for (const pixelId of pixelIds) {
            if (!parsedEvent[pixelId][pixelEvent]) {
              parsedEvent[pixelId][pixelEvent] = {};
            }
            parsedEvent[pixelId][pixelEvent]['pixelCode'] = match[0];
            parsedEvent[pixelId][pixelEvent]['frame'] = frame;
          }
        }
      }
    }
  }

  return parsedEvent;
}

function parseNoScriptEvents(noScriptElements, frame, parsedEvents) {
  for (const noscript of noScriptElements) {
    const match = noscript?.textContent?.match(
      /src[\s*]?=[\s*]?['"]https:\/\/www\.facebook\.com\/tr[\?]?id=([\d]*)(&amp;|&)ev=([^&]*)[&'"]/
    );
    if (match) {
      if (!parsedEvents[match[1]]) {
        parsedEvents[match[1]] = {};
      }
      if (!parsedEvents[match[1]][match[3]]) {
        parsedEvents[match[1]][match[3]] = {};
      }
      // Encode HTML element, https://stackoverflow.com/questions/18749591/encode-html-entities-in-javascript
      parsedEvents[match[1]][match[3]]['pixelCode'] = noscript.outerHTML.replace(
        /[\u00A0-\u9999<>\&]/gim,
        function (i) {
          return '&#' + i.charCodeAt(0) + ';';
        }
      );
      parsedEvents[match[1]][match[3]]['frame'] = frame;
    }
  }
}

function parsedImgEvents(imgElements, frame, parsedEvents) {
  for (const img of imgElements) {
    const match = img.src.match(/\/www\.facebook\.com\/tr[\?]?id=([\d]*)(&amp;|&)ev=([^&]*)[&'"]/);
    if (match) {
      if (!parsedEvents[match[1]]) {
        parsedEvents[match[1]] = {};
      }
      if (!parsedEvents[match[1]][match[3]]) {
        parsedEvents[match[1]][match[3]] = {};
      }
      // Encode HTML element, https://stackoverflow.com/questions/18749591/encode-html-entities-in-javascript
      parsedEvents[match[1]][match[3]]['pixelCode'] = img.outerHTML.replace(
        /[\u00A0-\u9999<>\&]/gim,
        function (i) {
          return '&#' + i.charCodeAt(0) + ';';
        }
      );
      parsedEvents[match[1]][match[3]]['frame'] = frame;
    }
  }
}

function parseEvents(document, window) {
  // These events are retrieved from same window / frame
  // frameElement return null when no frame running
  const frame = window.frameElement ? 'IFrame' : 'Window';
  // parse script events
  let parsedEvents = parseScriptEvents(document, frame);
  // parse noscript events
  parseNoScriptEvents(document.getElementsByTagName('noscript'), frame, parsedEvents);
  // parse images
  parsedImgEvents(document.getElementsByTagName('img'), frame, parsedEvents);
  return parsedEvents;
}

function parseContent() {
  const parsed = parseEvents(document, window);

  chrome.runtime.sendMessage({ parsedContent: JSON.stringify(parsed) });

  // TODO verify multiple frame cases
  const iframes = Array.prototype.slice.call(window.parent.frames).map(window => {
    try {
      return parseEvents(window.document, window);
    } catch (e) {
      return null;
    }
  });

  for (const data of iframes) {
    chrome.runtime.sendMessage({ parsedContent: JSON.stringify(data) });
  }
}

// Monitoring when page fully loaded without any subframes
window.addEventListener('DOMContentLoaded', parseContent);
// Monitoring when page fully loaded
window.addEventListener('load', parseContent);
