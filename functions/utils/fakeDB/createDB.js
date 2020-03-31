/* eslint-disable @typescript-eslint/explicit-function-return-type */
function createDB(db) {
  const updatePockets = async ({selectedFrom, selectedTo}) => {
    const pockets = await db.get('pockets').value()
    if (!pockets[selectedFrom.name]) {
      throw Error('Pocket does not exist')
    } else {
      pockets[selectedFrom.name] = +(pockets[selectedFrom.name] - selectedFrom.value).toFixed(2)
      if (pockets[selectedFrom.name] < 0) {
        throw Error('Not enough money in the pocket')
      }
    }
    if (!pockets[selectedTo.name]) {
      pockets[selectedTo.name] = selectedTo.value
    } else {
      pockets[selectedTo.name] = +(pockets[selectedTo.name] + selectedTo.value).toFixed(2)
    }

    db.set('pockets', pockets).write()
    return pockets
  }

  const getPockets = async () => {
    return await db.get('pockets')
  }

  return {
    getPockets,
    updatePockets,
  }
}

module.exports = createDB
