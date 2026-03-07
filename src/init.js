import { nanoid } from 'nanoid'
import state from './state'
import createSchema from './validate'
import './scss/styles.scss'
import 'bootstrap'
import initView from './view'
import elements from './elements'
import initI18n from './i18n'
import parseRSS from './parser'


const fetchRSS = (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`

  return fetch(proxyUrl)
    .then((response) => {
      if (!response.ok) {
        const error = new Error('networkError')
        error.code = 'networkError'
        throw error
      }
      return response.json()
    })
    .then(data => data.contents)
}

const checkFeed = (feedId) => {
  const feed = state.feeds[feedId]

  const knownLinks = new Set(
    Object.values(state.posts)
      .filter(p => p.feedId === feedId)
      .map(p => p.link),
  )

  return fetchRSS(feed.url)
    .then((xmlString) => {
      const { posts } = parseRSS(xmlString)

      const newPosts = posts.filter((post) => !knownLinks.has(post.link))

      newPosts.forEach((post) => {
        const postId = nanoid()
        state.posts[postId] = { id: postId, feedId, ...post }
        state.postIds.push(postId)
      })
    })

    .catch(() => {})
  }

const pollFeeds = () => {
  const checks = state.feedIds.map(feedId => checkFeed(feedId))

  Promise.allSettled(checks).then(() => {
    setTimeout(pollFeeds, 5000)
  })
}

const init = () => {
  initI18n().then(() => {
    initView()
    elements.input.focus()

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault()

      const url = elements.input.value.trim()
      const schema = createSchema()

      schema.validate({ website: url })
        .then(() => {
          state.form.status = 'sending'
          state.form.error = null

          return fetchRSS(url)
        })
        .then((xmlString) => {
          const { feed, posts } = parseRSS(xmlString)

          const feedId = nanoid()

          state.feeds[feedId] = { id: feedId, url, ...feed }
          state.feedIds.push(feedId)
          state.feedUrls.push(url)

          posts.forEach((post) => {
            const postId = nanoid()
            state.posts[postId] = { id: postId, feedId, ...post }
            state.postIds.push(postId)
          })

          state.form.status = 'success'
        })
        .catch((err) => {
          state.form.status = 'failed'
          if (err.name === 'TypeError') {
            state.form.error = 'networkError'
            } else {
            state.form.error = err.message
          }
        })
    })

    pollFeeds()
  })
}

export default init
