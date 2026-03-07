import { subscribe } from 'valtio/vanilla'
import i18next from 'i18next'
import elements from './elements'
import state from './state'

const renderForm = () => {
  const { feedback, input, submit } = elements

  feedback.textContent = ''
  input.classList.remove('is-invalid')
  feedback.className = 'feedback m-0 position-absolute small'

  switch (state.form.status) {
    case 'sending':
      input.setAttribute('disabled', true)
      submit.setAttribute('disabled', true)
      break

    case 'failed':
      input.removeAttribute('disabled')
      submit.removeAttribute('disabled')
      input.classList.add('is-invalid')
      feedback.classList.add('text-danger')
      feedback.textContent = i18next.t(`errors.${state.form.error}`)
      break

    case 'success':
      input.removeAttribute('disabled')
      submit.removeAttribute('disabled')
      input.value = ''
      input.focus()
      feedback.classList.add('text-success')
      feedback.textContent = i18next.t('form.success')
      break

    default:
      input.removeAttribute('disabled')
      submit.removeAttribute('disabled')
  }
}

const renderFeeds = () => {
  const container = elements.feeds
  container.innerHTML = ''

  if (state.feedIds.length === 0) return

  const card = document.createElement('div')
  card.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')

  const heading = document.createElement('h2')
  heading.classList.add('card-title', 'h4')
  heading.textContent = i18next.t('feeds.title')
  cardBody.append(heading)
  card.append(cardBody)

  const list = document.createElement('ul')
  list.classList.add('list-group', 'border-0', 'rounded-0')

  ;[...state.feedIds].reverse().forEach((id) => {
    const feed = state.feeds[id]
    const li = document.createElement('li')
    li.classList.add('list-group-item', 'border-0', 'border-end-0')

    const h3 = document.createElement('h3')
    h3.classList.add('h6', 'm-0')
    h3.textContent = feed.title

    const p = document.createElement('p')
    p.classList.add('m-0', 'small', 'text-black-50')
    p.textContent = feed.description

    li.append(h3, p)
    list.append(li)
  })

  card.append(list)
  container.append(card)
}

const createPostItem = (post) => {
  const li = document.createElement('li')
  li.classList.add(
    'list-group-item',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'border-0',
    'border-end-0',
  )
  li.dataset.postId = post.id

  const a = document.createElement('a')
  a.href = post.link
  a.textContent = post.title
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  if (state.readPostIds[post.id]) {
    a.classList.add('fw-normal', 'link-secondary')
    } else {
    a.classList.add('fw-bold')
  }

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'ms-2')
  btn.dataset.bsToggle = 'modal'
  btn.dataset.bsTarget = '#modal'
  btn.dataset.postId = post.id
  btn.textContent = i18next.t('posts.preview')

  li.append(a, btn)
  return li
}

const renderPosts = () => {
  const container = elements.posts
  container.innerHTML = ''

  if (state.postIds.length === 0) return

  const card = document.createElement('div')
  card.classList.add('card', 'border-0')

  const cardBody = document.createElement('div')
  cardBody.classList.add('card-body')

  const heading = document.createElement('h2')
  heading.classList.add('card-title', 'h4')
  heading.textContent = i18next.t('posts.title')
  cardBody.append(heading)
  card.append(cardBody)

  const list = document.createElement('ul')
  list.classList.add('list-group', 'border-0', 'rounded-0')
  list.dataset.postsList = ''

  ;[...state.postIds].reverse().forEach((id) => {
    list.append(createPostItem(state.posts[id]))
  })

  card.append(list)
  container.append(card)
}

const renderReadState = (postId) => {
  const a = elements.posts.querySelector(`[data-post-id="${postId}"] a`)
  if (!a) return
  a.classList.toggle('fw-bold', !state.readPostIds[postId])
  a.classList.toggle('fw-normal', !!state.readPostIds[postId])
  a.classList.toggle('link-secondary', !!state.readPostIds[postId])
}

const renderModal = () => {
  const { postId } = state.modal
  if (!postId) return

  const post = state.posts[postId]
  if (!post) return

  elements.modal.title.textContent = post.title
  elements.modal.body.textContent = post.description
  elements.modal.fullArticle.href = post.link
}

const renderStaticTexts = () => {
  const { label, submit } = elements
  if (label) label.textContent = i18next.t('form.label')
  if (submit) submit.textContent = i18next.t('form.submit')
}

const initView = () => {
  renderStaticTexts()

  subscribe(state.form, () => renderForm())
  subscribe(state.feedIds, () => renderFeeds())
  subscribe(state.postIds, () => renderPosts())

  subscribe(state.modal, () => {
    renderModal()
    if (state.modal.postId) {
      state.readPostIds[state.modal.postId] = true
      renderReadState(state.modal.postId)
    }
  })

  elements.posts.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-post-id]')
    if (!btn) return
    state.modal.postId = btn.dataset.postId
  })

  elements.modal.el.addEventListener('hidden.bs.modal', () => {
    elements.input.focus()
    state.modal.postId = null
  })
}

export default initView
