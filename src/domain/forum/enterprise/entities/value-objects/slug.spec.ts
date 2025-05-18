import { Slug } from './slug'

it('should be able to create a new slug from a text', () => {
  const slug = Slug.createFromText('Hello, World!')

  expect(slug.value).toEqual('hello-world')
})
