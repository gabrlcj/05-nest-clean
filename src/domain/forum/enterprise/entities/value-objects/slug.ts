export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  /**
   * Creates a slug from the given text.
   *
   * This method takes a string of text and converts it into a URL-friendly slug.
   * It typically involves transforming the text to lowercase, replacing spaces
   * with hyphens, and removing any special characters.
   *
   * @param text - The text to be converted into a slug.
   * @returns A new slug instance created from the provided text. Example: "Hello, World!" -> "hello-world"
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Remove spaces
      .replace(/[^\w-]+/g, '') // Remove special characters
      .replace(/_/g, '-') // Replace underscores with hyphens
      .replace(/--+/g, '-') // Replace double hyphens with a single hyphen
      .replace(/-$/g, '') // Remove trailing hyphens

    return new Slug(slugText)
  }
}
