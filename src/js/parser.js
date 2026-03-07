const parseRSS = (xmlString) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'application/xml')

  const parseError = doc.querySelector('parsererror')
  if (parseError) {
    const error = new Error('parseError')
    error.code = 'parseError'
    throw error
  }

  const channel = doc.querySelector('channel')
  if (!channel) {
    const error = new Error('parseError')
    error.code = 'parseError'
    throw error
  }

  const feed = {
    title: channel.querySelector('title')?.textContent ?? '',
    description: channel.querySelector('description')?.textContent ?? '',
  }

  const items = [...channel.querySelectorAll('item')]
  const posts = items.map((item) => ({
    title: item.querySelector('title')?.textContent ?? '',
    link: item.querySelector('link')?.textContent ?? '',
    description: item.querySelector('description')?.textContent ?? '',
  }))

  return { feed, posts }
}

export default parseRSS