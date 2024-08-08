document.getElementById('send-magnet').addEventListener('click', async () => {
  try {
    const magnetLink = await navigator.clipboard.readText();
    if (magnetLink.startsWith('magnet:')) {
      chrome.storage.sync.get(['synologyIP', 'synologyPort'], (items) => {
        const synologyIP = items.synologyIP || 'example.com';
        const synologyPort = items.synologyPort || '5001';
        const username = 'username';
        const password = 'password';
        getApiInfoAndSendMagnetLink(synologyIP, synologyPort, username, password, magnetLink);
      });
    } else {
      alert('No valid magnet link found in clipboard.');
    }
  } catch (error) {
    console.error('Failed to read clipboard contents:', error);
  }
});

function fetchWithBackgroundScript(url, options) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action: 'fetch', url, ...options }, response => {
      if (response.error) {
        reject(response.error);
      } else {
        resolve(response.data);
      }
    });
  });
}

async function getApiInfoAndSendMagnetLink(synologyIP, synologyPort, username, password, magnetLink) {
  try {
    const apiInfoUrl = `https://${synologyIP}:${synologyPort}/webapi/entry.cgi?api=SYNO.API.Info&version=1&method=query&query=SYNO.API.Auth,SYNO.DownloadStation.Task`;
    const apiInfoData = await fetchWithBackgroundScript(apiInfoUrl);
    const authPath = apiInfoData.data['SYNO.API.Auth'].path;

    const { sid } = await loginAndGetSessionID(synologyIP, synologyPort, authPath, username, password);
    await sendMagnetLink(synologyIP, synologyPort, sid, magnetLink);
  } catch (error) {
    console.error('Error retrieving API info:', error);
  }
}

async function loginAndGetSessionID(synologyIP, synologyPort, authPath, username, password) {
  const authUrl = `https://${synologyIP}:${synologyPort}/webapi/${authPath}?api=SYNO.API.Auth&version=6&method=login&account=${username}&passwd=${password}&session=DownloadStation&format=sid`;

  const authData = await fetchWithBackgroundScript(authUrl);
  if (!authData.success) {
    throw new Error('Login failed');
  }
  return { sid: authData.data.sid };
}

async function sendMagnetLink(synologyIP, synologyPort, sid, magnetLink) {
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

  if (downloadResult.success) {
    alert('Magnet link added successfully!');
  } else {
    alert('Failed to add magnet link.');
  }
}
