const groq                    = require('../config/groq');
const { SYSTEM_PROMPT }       = require('../constants/prompts');
const { GROQ_MODEL, MAX_TOKENS } = require('../constants/server');

const HISTORY_LIMIT = 10; // number of past messages to include for context

/**
 * Sends a user message to Groq and returns the AI reply string.
 * @param {string} message       - Validated user message
 * @param {Array}  history       - Previous [{role, content}] messages
 * @returns {Promise<string>}    - AI response text
 */
const getAIReply = async (message, history = []) => {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-HISTORY_LIMIT).map(({ role, content }) => ({ role, content })),
    { role: 'user', content: message },
  ];

  const completion = await groq.chat.completions.create({
    model:       GROQ_MODEL,
    messages,
    max_tokens:  MAX_TOKENS,
    temperature: 0.7,
  });

  const reply = completion.choices[0]?.message?.content;

  if (!reply) throw new Error('AI returned an empty response.');

  return reply;
};

module.exports = { getAIReply };
