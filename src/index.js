export class ImpartElement extends HTMLElement {
  /** @param tagName {string} */
  static define(tagName) {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, this)
    }
  }

  constructor() {
    super()

    /** @type {Element[] | undefined} */
    this.partsMeta
  }

  connectedCallback() {
    if (this.partsMeta) return;

    if (!this.shadowRoot) {
      const template = this.querySelector("template[shadowroot]")
      const mode = template.getAttribute("shadowroot")
      this.attachShadow({ mode }).append(template.content)
      template.remove()
    }

    this.partsMeta = [...this.shadowRoot.querySelectorAll("part-meta")]
    this.partsMeta.forEach(part => {
      const name = part.getAttribute("name")
      if (part.hasAttribute("reflect")) {
        const reflectName = part.getAttribute("reflect")
        const format = part.getAttribute("format")
        Object.defineProperty(this, reflectName, {
          get: () => {
            if (format === "boolean") {
              return this.hasAttribute(reflectName)
            }
            else if (format === "number") {
              if (this.hasAttribute(reflectName)) {
                return Number(this.getAttribute(reflectName))
              } else {
                return null
              }
            }
            return this.getAttribute(reflectName)
          },
          set: (val) => {
            if (format === "boolean") {
              if (val) {
                this.setAttribute(reflectName, "")
              } else {
                this.removeAttribute(reflectName)
              }
              return
            }
            if (val === null || typeof val === "undefined") {
              this.removeAttribute(reflectName)
            } else {
              this.setAttribute(reflectName, val)
            }
          }
        })
        this.attributeChangedCallback(reflectName)
      }
      for (const attr of part.attributes) {
        if (attr.name.endsWith("-listener")) {
          const eventName = attr.name.replace(/\-listener$/, "")
          this.queryParts(name).forEach(part => part.addEventListener(eventName, this[attr.value].bind(this)))
        }
      }
    })
  }

  /**
   * @param name {string}
   * @return {Element | null}
   */
  queryPart(name) {
    if (this.partsMeta && !this.partsMeta.find(item => item.getAttribute("name") == name)) {
      throw new Error(`The part ${name} has not been defined`)
    }
    return this.shadowRoot.querySelector(`[part="${name}"]`)
  }

  /**
   * @param name {string}
   * @return {Element[]}
   */
  queryParts(name) {
    if (this.partsMeta && !this.partsMeta.find(item => item.getAttribute("name") == name)) {
      throw new Error(`The part ${name} has not been defined`)
    }
    return [...this.shadowRoot.querySelectorAll(`[part="${name}"]`)]
  }

  /** @param name {string} */
  attributeChangedCallback(name) {
    if (!this.partsMeta) return;
    const meth = `${name}Callback`
    if (this[meth]) this[meth]()
  }
}
