const CHANNELS = {
  aipass: {
    name: 'AIPass 统一激活中心',
    url: 'https://www.aipass.me/api/recharge-go',
  },
};

const DEFAULT_CHANNEL = 'aipass';
const KV_KEY = 'global:gpt-recharge-active-channel';

function normalizeChannel(value) {
  return Object.prototype.hasOwnProperty.call(CHANNELS, value) ? value : DEFAULT_CHANNEL;
}

async function kvCommand(command) {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error(`KV request failed: ${response.status}`);
  }

  return response.json();
}

async function getActiveChannel() {
  const data = await kvCommand(['GET', KV_KEY]);
  return normalizeChannel(data?.result);
}

async function setActiveChannel(channel) {
  const active = normalizeChannel(channel);
  await kvCommand(['SET', KV_KEY, active]);
  await kvCommand(['SET', `${KV_KEY}:updated-at`, new Date().toISOString()]);
  return active;
}

async function getUpdatedAt() {
  const data = await kvCommand(['GET', `${KV_KEY}:updated-at`]);
  return typeof data?.result === 'string' ? data.result : '';
}

module.exports = {
  CHANNELS,
  DEFAULT_CHANNEL,
  getActiveChannel,
  getUpdatedAt,
  normalizeChannel,
  setActiveChannel,
};
