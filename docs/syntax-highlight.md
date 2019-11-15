# Syntax highlight

For enabling syntax highlight and code formatting, you have to add a specific comment `<!-- @regular -->` at the top of each template to indicate they are the templates of Regularjs, for example:

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

> It maybe odd that we have to put the html comment at the top of each template, let's give it a little bit explanation. Suppose we are at the viewpoint of the plugin, there is no information for us to tell the string is a normal string or a specific one being used as Regularjs template, thus we cannot give users the exact lint reports. So the comment is used to ask the users to indicate their intents more clearly thus to help the plugin to tell the difference between the normal string and the regularjs one.

the rendered result of above will be something like:

<img src="https://github.com/hsiaosiyuan0/vscode-regularjs/blob/master/assets/syntax-highlight-inline.png" width="600" />
