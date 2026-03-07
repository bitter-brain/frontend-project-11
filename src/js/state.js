import { proxy } from 'valtio/vanilla'

const state = proxy({
  feeds: {},

  posts: {},

  feedIds: [],

  postIds: [],

  feedUrls: [],

  readPostIds: {},

  form: {
    status: 'idle',
    error: null,
  },

  modal: {
    postId: null,
  },
})

export default state