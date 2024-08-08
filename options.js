document.getElementById('save').addEventListener('click', () => {
    const synologyIP = document.getElementById('synologyIP').value;
    const synologyPort = document.getElementById('synologyPort').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    chrome.storage.sync.set({
      synologyIP,
      synologyPort,
      username,
      password
    }, () => {
      alert('Settings saved');
    });
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['synologyIP', 'synologyPort', 'username', 'password'], (items) => {
      document.getElementById('synologyIP').value = items.synologyIP || 'example.com';
      document.getElementById('synologyPort').value = items.synologyPort || '5001';
      document.getElementById('username').value = items.username || 'user';
      document.getElementById('password').value = items.password || 'password';
    });
  });
  