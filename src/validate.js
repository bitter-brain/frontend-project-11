import * as yup from 'yup'
import state from './state'

yup.setLocale({
  mixed: {
    required: 'required',
  },
  string: {
    url: 'invalidUrl',
  },
})

const createSchema = () => yup.object({
  website: yup
    .string()
    .required()
    .url()
    .notOneOf(state.feedUrls, 'duplicate'),
})

export default createSchema
