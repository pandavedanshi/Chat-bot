export const sendChatMessage = async (apiUrl, message, conversationId) => {
  const response = await fetch(`${apiUrl}/chat/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message,
      role: 'user',
      conversation_id: conversationId,
      temperature: 0.3,
      top_p: 0.9
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const resetConversation = async (apiUrl, conversationId) => {
  const response = await fetch(`${apiUrl}/reset/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(conversationId)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};