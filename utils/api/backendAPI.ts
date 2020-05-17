const lucky = () => (Math.random() > 0.1 ? true : false)

async function getPockets(): Promise<{ [key: string]: string }> {
  const pockets = JSON.parse(window.localStorage.getItem('pockets') || '{}')
  if (Object.keys(pockets).length === 0) {
    pockets['GBP'] = '30400.45'
    pockets['USD'] = '1000.12'
    window.localStorage.setItem('pockets', JSON.stringify(pockets))
  }
  return new Promise((res, rej) => {
    if (!lucky()) rej()
    res(pockets)
  })
}

interface SavePocketsProps {
  from: { name: string; value: string }
  to: { name: string; value: string }
}

const savePockets = async ({ from, to }: SavePocketsProps) => {
  if (!lucky()) throw Error()
  const pockets = await getPockets()
  pockets[from.name] = (+pockets[from.name] - +from.value).toFixed(2)
  if (!pockets[to.name]) {
    pockets[to.name] = to.value
  } else {
    pockets[to.name] = (+pockets[to.name] + +to.value).toFixed(2)
  }
  window.localStorage.setItem('pockets', JSON.stringify(pockets))
}

export { getPockets, savePockets }
