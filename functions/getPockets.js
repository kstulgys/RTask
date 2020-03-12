/* eslint-disable @typescript-eslint/no-var-requires */
// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const db = require('./db');

exports.handler = async (event, context) => {
  try {
    const pockets = await db.getPockets();
    // const subject = event.queryStringParameters.name || 'World';
    return {
      statusCode: 200,
      body: JSON.stringify(pockets),
    };
  } catch (err) {
    return {statusCode: 500, body: err.toString()};
  }
};
