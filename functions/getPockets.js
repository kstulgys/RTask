/* eslint-disable @typescript-eslint/no-var-requires */
// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const db = require('./utils/fakeDB')

exports.handler = async (event, context) => {
  try {
    const pockets = await db.getPockets()
    return {
      statusCode: 200,
      body: JSON.stringify(pockets),
    }
  } catch (err) {
    return {statusCode: 500, body: err.toString()}
  }
}
