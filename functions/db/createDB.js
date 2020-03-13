/* eslint-disable @typescript-eslint/explicit-function-return-type */
function createDB(db) {
  const updatePockets = async ({from, to}) => {
    const pockets = await db.get('pockets').value();
    if (!pockets[from.currency]) {
      throw Error('Pocket does not exist');
    } else {
      pockets[from.currency] = +(pockets[from.currency] - from.amount).toFixed(2);
      if (pockets[from.currency] < 0) {
        throw Error('Not enough money in the pocket');
      }
    }
    if (!pockets[to.currency]) {
      pockets[to.currency] = to.amount;
    } else {
      pockets[to.currency] = +(pockets[to.currency] + to.amount).toFixed(2);
    }

    db.set('pockets', pockets).write();
    return pockets;
  };

  const getPockets = async () => {
    const pockets = await db.get('pockets');
    return pockets;
  };

  return {
    getPockets,
    updatePockets,
  };
}

module.exports = createDB;
