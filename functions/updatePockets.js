/* eslint-disable @typescript-eslint/no-var-requires */
// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const db = require('./utils/fakeDB')

exports.handler = async (event, context) => {
  try {
    const {selectedFrom, selectedTo} = JSON.parse(event.body)
    console.log(selectedFrom, selectedTo)
    const pockets = await db.updatePockets({selectedFrom, selectedTo})
    return {
      statusCode: 200,
      body: JSON.stringify('hello'),
    }
  } catch (err) {
    return {statusCode: 500, body: err.toString()}
  }
}
