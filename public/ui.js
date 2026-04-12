// ui.js - DOM manipulation and rendering
import { formatNumber } from './utils.js';
import { renderVideoStatsChart } from './charts.js';

export function displayChannelInfo(channelData, sessionToken = null, addToDashboardCallback = null) {
  const channelInfo = document.getElementById('channelInfo');
  const snippet = channelData.snippet;
  const statistics = channelData.statistics;
  
  let addToDashboardBtn = '';
  if (sessionToken && addToDashboardCallback) {
    addToDashboardBtn = `<button id="addToDashboardBtn" onclick="(${addToDashboardCallback.toString()})()">Add to Dashboard</button>`;
  }
  
  channelInfo.innerHTML = `
    <div class="channel-card">
      <img src="${snippet.thumbnails.medium.url}" alt="${snippet.title}" class="channel-avatar">
      <div class="channel-details">
        <h2>${snippet.title}</h2>
        <p>Subscribers: ${parseInt(statistics.subscriberCount).toLocaleString()}</p>
        <p>Total Videos: ${parseInt(statistics.videoCount).toLocaleString()}</p>
        <p>Total Views: ${parseInt(statistics.viewCount).toLocaleString()}</p>
        <p class="channel-description">${snippet.description.substring(0, 200)}...</p>
        ${addToDashboardBtn}
      </div>
    </div>
  `;
}

export function showNotification(msg, type = 'info') {
  const status = document.getElementById('statusMessage');
  status.textContent = msg;
  
  // Different styles based on notification type
  switch(type) {
    case 'success':
      status.style.background = '#f6ffed';
      status.style.color = '#52c41a';
      status.style.border = '1px solid #b7eb8f';
      break;
    case 'error':
      status.style.background = '#fff2f0';
      status.style.color = '#ff4d4f';
      status.style.border = '1px solid #ffccc7';
      break;
    case 'warning':
      status.style.background = '#fffbe6';
      status.style.color = '#d48806';
      status.style.border = '1px solid #ffe58f';
      break;
    default: // info
      status.style.background = '#e6f7ff';
      status.style.color = '#1890ff';
      status.style.border = '1px solid #91d5ff';
  }
  
  status.style.padding = '8px 12px';
  status.style.borderRadius = '4px';
  
  setTimeout(() => {
    status.textContent = '';
    status.style.background = '';
    status.style.color = '';
    status.style.border = '';
    status.style.padding = '';
    status.style.borderRadius = '';
  }, 3500);
}
