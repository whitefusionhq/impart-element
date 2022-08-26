# Impart

A base class for building purely server-driven declarative web components. Under 900B (yes, you read that right: 0.9KB!) minified+compressed!

Example (this could be 100% vanilla SSR output via a simple HTML template written in literally any language):

```js
<my-toggler>
  <script type="module">
    import { ImpartElement } from "https://cdn.jsdelivr.net/npm/impart-element@0.1.0/dist/index.min.js"

    class Toggler extends ImpartElement {
      static observedAttributes = ["checked"]

      handleToggle(e) {
        this.checked = e.target.checked
      }

      checkedCallback() {
        this.queryPart("checkbox").checked = this.checked
        this.queryPart("description").classList.toggle("bold", this.checked)
      }
    }

    Toggler.define("my-toggler")
  </script>

  <template shadowroot="open">
    <part-meta name="checkbox" reflect="checked" format="boolean" change-listener="handleToggle"></part-meta>
    <part-meta name="description"></part-meta>

    <style>
      .bold { font-weight: bold; }
    </style>

    <label>
      <input type="checkbox" part="checkbox" />
      Check me
    </label>
    <p part="description">I'm bold if it's checked!</p>
  </template>
</my-toggler>
```

Not only will this HTML-based web component simply "work" on any page you place it on, it'll do so whether or not Declarative Shadow DOM is available because it has a "polyfill" baked in!

The `checked` prop is reflected as an attribute, so if you rendered this out instead as `<my-toggler checked>`, it would ensure the internal checkbox is checked as well as the `description` part shown bold. You can also add or remove the attribute after the fact, or you can use `togglerEl.checked = true` (or `false`) to change the state via JavaScript.

Every defined part will work with an associated `(partname)Callback` you define any time that attribute/prop changes, and you can use parts to provide straightforward queryable connections within your shadow DOM. And because parts also are exposed as CSS shadow parts, they're easy to style as well.

----

**MORE DOCS COMING SOON**
