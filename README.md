# simple-markdown.js
***

As the title says, this is a simple javascript module to create a simple (duh) markdown editor. It only helps editing by now, there is no preview mode YET.

## What is markdown?

As taken from the Markdown Documentation (which can be found [here](http://daringfireball.net/projects/markdown/ "Markdown docs")):

> Markdown is a text-to-HTML conversion tool for web writers. Markdown allows you to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML).

You can find more about it on the link to the documentation above, or if you're lazy you can go straight to the Syntax Documentation [here](http://daringfireball.net/projects/markdown/syntax)

## Usage

In order to use simple-markdown.js, just include `simple-markdown-complete.min.js` in your page, and call `createMDEditor(options);`, where  `options` is a javascript object that may contain the following attributes:

- **parent_id** (**Mandatory**): id of the parent component where the editor is going to be placed in;
- **input_name**: "name" attribute of the textarea that's created inside the editor. Defaults to "text";
- **default_style**: Determines whether the default style of the editor is to be used. It's REALLY simple now, so unless you don't care at all about the looks of your site, make a css file and style it whichever way you want to. The classes of the created elements are the following:

        md-editor: The box that surrounds everything;
        md-editor-buttons: A div surrounding all of the buttons;
        md-editor-button: Every button of the editor belongs to this class;
        md-editor-textarea: The textarea where you will be entering your markdown text.

## The repository

This repository contains three javascript files, of which only one is needed if you just want to use the editor:

- `selection.js`: A small javascript file containing basic input selection functionality. simple-markdown currently uses it, therefore, any browser which does not support the use of the `selectionStart` and `selectionEnd` will **NOT** make any use of simple-markdown;
- `simple-markdown.js`: This file contains the functions concerning the editor only. It won't work on its own, as it uses functions declared in the `selection.js` file;
- `simple-markdown-complete.min.js`: Basically, `simple-markdown-complete.js` is the equivalent to the two previous files combined, and `simple-markdown-complete.min.js` is the minified version of it.