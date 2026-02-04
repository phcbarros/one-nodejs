export class Slug {
  public value: string

  constructor(value: string) {
    this.value = value
  }

  // usado para criar um novo slug
  /**
   * Receives a string and normalize it as a slug.
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-') // troca os white space por string vazia
      .replace(/[^\w-]+/g, '') // troca todas as pontuações por string vazia
      .replace(/_/g, '-') // troca todos os underlines por hífen
      .replace(/--+/g, '-') // troca todos os dois hífen por 1
      .replace(/-$/g, '') // remove hífen no final

    return new Slug(slugText)
  }
}
