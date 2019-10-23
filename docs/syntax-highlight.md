# Syntax highlight

## Inline template

For enabling syntax highlight for those inline templates, we have to add specific comments at the beginning of those template to indicate the remaining content are the template of Regularjs, for example:

```js
const tpl = `
<!-- @regular -->
<div>
{#if result.length > 0 }
  <div v-model={message} style={{color: 'red'}} some-v={a + b + '1' + `${c}`}>
{/if}
</div>
`
```

the rendered result of above should be something like:

![](/assets/syntax-highlight-inline.png)
