# Inline template

For enabling syntax highlight and code formatting, you have to add specific comment at the top of each template to indicate they are the template of Regularjs, for example:

```js
const tpl = `
<!-- @regular -->
<div>
{#if result.length > 0 }
  <div 
    v-model={message} style={{color: 'red'}} 
    some-v={a + b + '1' + `${c}`}>
{/if}
</div>
`
```

the rendered result of above will be something like:

<img src="https://github.com/hsiaosiyuan0/vscode-regularjs/blob/master/assets/syntax-highlight-inline.png" width="600" />
