const elements = {
  form: document.querySelector('.rss-form'),
  input: document.querySelector('#url-input'),
  feedback: document.querySelector('.feedback'),
  label: document.querySelector('#label-url'),
  submit: document.querySelector('button[type="submit"]'),
  posts: document.querySelector('.posts'),
  feeds: document.querySelector('.feeds'),
  modal: {
    el: document.querySelector('#modal'),
    title: document.querySelector('#modal .modal-title'),
    body: document.querySelector('#modal .modal-body'),
    fullArticle: document.querySelector('#modal .full-article'),
  },
}

export default elements