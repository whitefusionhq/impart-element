# Impart

A base class for building purely server-driven declarative web components.

Example (this could be 100% vanilla SSR output via a simple HTML template written in literally any language):

```js
<my-toggler>
  <script type="module">
    import { ImpartElement } from "impart-element" // CDN link or via local server

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

**DOCS COMING SOON**
