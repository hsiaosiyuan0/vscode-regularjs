# Code format

Easy to perform code format on the templates of Regularjs.

## Usage

Two manners are included in this extension, choose either of them according your requirements:

1. Right click on the partial selection of your template string then choose the option `Format Selection with...` then choose `Regularjs` on the list of the popup panel.

   Although this way is a little inconvenient but the specific comment `<!-- @regularjs -->` is not required via this way.

2. Call out the [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette) then choose the `Format Document with...` then choose `Regularjs` on the next popup panel. 
  
   `<!-- @regularjs -->` is required to be presented at the top of each template you want them to be handled automatically.


Another feature which this extension supports is automatically detect the base indent, you'll just put the spaces as same count as your preferred base indent at the beginning of the line which includes the specific comment `<!-- @regularjs -->`:

```js
const tpl = `
  <!-- @regularjs -->
  <div></div>
`
```

Above example we put two spaces before the `<!-- @regularjs -->` thus the base indent is considered as 2 spaces.

Feel free to get more information about code format from the underlying project [regularjs-beautify](https://github.com/hsiaosiyuan0/regularjs-beautify)


