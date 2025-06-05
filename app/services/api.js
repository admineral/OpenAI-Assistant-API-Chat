export const sendAgentMessage = async (message) => {
  const response = await fetch('/api/agentsSDKChat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  const data = await response.json();
  return data.reply;
};
