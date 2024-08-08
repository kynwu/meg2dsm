chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "sendToSynology",
    title: "Send to Synology",
    contexts: ["selection"]
  }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error creating context menu item:", chrome.runtime.lastError);
    } else {
      console.log("Context menu item successfully created");
      showNotification('Synology Magnet Downloader', 'Extension installed successfully!');
    }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Context menu clicked');
  if (info.menuItemId === "sendToSynology") {
    console.log('Send to Synology clicked');
    const magnetLink = info.selectionText;
    if (!magnetLink.startsWith('magnet:')) {
      showNotification('Synology Magnet Downloader', 'Selected text is not a valid magnet link.');
      return;
    }
    chrome.storage.sync.get(['synologyIP', 'synologyPort', 'username', 'password'], async (items) => {
      const synologyIP = items.synologyIP || 'nas.cl00r.com';
      const synologyPort = items.synologyPort || '5001';
      const username = items.username || 'defaultUsername';
      const password = items.password || 'defaultPassword';
      try {
        await getApiInfoAndSendMagnetLink(synologyIP, synologyPort, username, password, magnetLink);
        showNotification('Synology Magnet Downloader', 'Magnet link added successfully!');
      } catch (error) {
        console.error('Error:', error);
        showNotification('Synology Magnet Downloader', 'Failed to add magnet link.');
      }
    });
  }
});

function showNotification(title, message) {
  const options = {
    type: 'basic',
    iconUrl: '/images/icon16.png',
    title: title,
    message: message
  };
  chrome.notifications.create('', options, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('Notification error:', chrome.runtime.lastError);
    } else {
      console.log('Notification shown with ID:', notificationId);
    }
  });
}

async function fetchWithBackgroundScript(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Fetch data:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

async function getApiInfoAndSendMagnetLink(synologyIP, synologyPort, username, password, magnetLink) {
  try {
    console.log(`Fetching API info from https://${synologyIP}:${synologyPort}/webapi/entry.cgi`);
    const apiInfoUrl = `https://${synologyIP}:${synologyPort}/webapi/entry.cgi?api=SYNO.API.Info&version=1&method=query&query=SYNO.API.Auth,SYNO.DownloadStation.Task`;
    const apiInfoData = await fetchWithBackgroundScript(apiInfoUrl);
    console.log('API info data:', apiInfoData);
    if (!apiInfoData || !apiInfoData.data || !apiInfoData.data['SYNO.API.Auth']) {
      throw new Error('Invalid API info response');
    }
    const authPath = apiInfoData.data['SYNO.API.Auth'].path;

    const { sid } = await loginAndGetSessionID(synologyIP, synologyPort, authPath, username, password);
    await sendMagnetLink(synologyIP, synologyPort, sid, magnetLink);
  } catch (error) {
    console.error('Error in getApiInfoAndSendMagnetLink:', error);
    throw new Error('Error retrieving API info or sending magnet link.');
  }
}

async function loginAndGetSessionID(synologyIP, synologyPort, authPath, username, password) {
  try {
    console.log(`Logging in to https://${synologyIP}:${synologyPort}/webapi/${authPath}`);
    const authUrl = `https://${synologyIP}:${synologyPort}/webapi/${authPath}?api=SYNO.API.Auth&version=6&method=login&account=${username}&passwd=${password}&session=DownloadStation&format=sid`;

    const authData = await fetchWithBackgroundScript(authUrl);
    console.log('Login data:', authData);
    if (!authData.success) {
      throw new Error('Login failed');
    }
    return { sid: authData.data.sid };
  } catch (error) {
    console.error('Error in loginAndGetSessionID:', error);
    throw error;
  }
}

async function sendMagnetLink(synologyIP, synologyPort, sid, magnetLink) {
  try {
    console.log(`Sending magnet link to https://${synologyIP}:${synologyPort}/webapi/entry.cgi`);
    const downloadUrl = `https://${synologyIP}:${synologyPort}/webapi/entry.cgi`;
    const encodedMagnetLink = encodeURIComponent(magnetLink);
    const body = `api=SYNO.DownloadStation2.Task&method=create&version=2&type=%22url%22&destination=%22Media%22&create_list=true&url=%5B%22${encodedMagnetLink}%22%5D&_sid=${sid}`;

    const downloadResult = await fetchWithBackgroundScript(downloadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: body
    });
    console.log('Send magnet link result:', downloadResult);
    if (!downloadResult.success) {
      throw new Error('Failed to add magnet link.');
    }
  } catch (error) {
    console.error('Error in sendMagnetLink:', error);
    throw error;
  }
}