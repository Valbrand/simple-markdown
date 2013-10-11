var wndw = null;

function strengthenSelection(element) {
	surroundSelectionWith({
		element: element,
		prefix: '**'
	});
}

function emphasizeSelection(element) {
	surroundSelectionWith({
		element: element,
		prefix: '*'
	});
}

function makeTitle(element, titleLevel) {
	var selection = getInputSelection(element);

	if(selection) {
		if(selection.start == selection.end) {
			prependLineWith(element, generateHeaderString(titleLevel), selection);
		} else {
			makeTitleFromSelection(element, titleLevel, selection);
		}
	}
}

function generateHeaderString(titleLevel) {
	var header = ' ';

	for (var i = 0; i < titleLevel; i++) {
		header = '#' + header;
	};

	return header;
}

function makeTitleFromSelection(element, titleLevel, selection) {
	surroundSelectionWith({
		element: element,
		prefix: '\n'+generateHeaderString(titleLevel),
		select: selection,
		suffix: '\n',
		removeLineBreaks: true
	});
}

function makeQuoteBlock(element) {
	var selection = getInputSelection(element);

	if(selection) {
		if(selection.start == selection.end) {
			prependLineWith(element, '> ', selection);
		} else {
			prependMultipleLinesWith(element, '> ', selection);
		}
	}
}

function showHelpText() {
	text = "Browser support:\nThis markdown editor is only supported by browsers that also support the selectionStart and selectionEnd properties of inputs and textareas. If your browser doesn't, and you want to use the widget's buttons to add formatting, please update your browser. You can of course format your text manually, the result will be the same.\n\nAbout line breaks:\nYou can insert line breaks in the resulting text by adding 2 whitespaces before a line break in your markdown text. This will result in a <br> tag.\nNew paragraphs can be creating by inserting two consecutives line breaks in your markdown text, which will cause the closure of the current <p> tag, and the opening of another one.\n\nFor more info (and for an explanation for the rest of Markdown's features), visit \nhttp://daringfireball.net/projects/markdown/syntax\n\nYou can also click 'OK' to open the Markdown Syntax Documentation in another tab/window.";
	
	if(window.confirm(text)) {
		if(wndw === null || wndw.closed) {
			wndw = window.open('http://daringfireball.net/projects/markdown/syntax', 'MarkdownSyntaxDocs');
		} else {
			wndw.focus();
		}
	}
}

function makeHorizontalRule(element) {
	var selection = getInputSelection(element);

	if(selection) {
		surroundSelectionWith({
			element: element,
			select: {
				start: selection.start,
				end: selection.start
			},
			prefix: '\n***',
			suffix: '\n'
		});
	}
}

function makeLink(element) {
	var selection = getInputSelection(element);

	if(selection) {
		selectedText = element.value.substring(selection.start, selection.end);

		textMask = window.prompt("'Link mask' (the text that will be used as an hyperlink):", selectedText);
		if(textMask !== null) {
			url = window.prompt("Hyperlink url:", "http://");
			if(url !== null) {
				title = window.prompt("Link title (optional, just press 'Cancel' if you don't want any):", '');

				result = '[' + textMask + ']' + '(' + url;
				if(title !== null) {
					result += ' "' + title + '"';
				}
				result += ')'

				replaceSelectedText({
					element: element,
					select: selection,
					replacement: result
				});
			}
		}
	}
}

function makeImage(element) {
	var selection = getInputSelection(element);

	if(selection) {
		selectedText = element.value.substring(selection.start, selection.end);

		textMask = window.prompt("Alternative text:", selectedText);

		url = window.prompt("Url for the image:", "http://");

		if(url !== null) {
			if(textMask !== null) {
				title = window.prompt("Image title (optional, just press 'Cancel' if you don't want any):", '');

				result = '![' + textMask + ']' + '(' + url;
				if(title !== null) {
					result += ' "' + title + '"';
				}
				result += ')'
			} else {
				result = '<' + url + '>';
			}		

			replaceSelectedText({
				element: element,
				select: selection,
				replacement: result
			});
		}
	}
}

function createMDEditor(options) {
	if(typeof options.input_name === 'undefined') {
		options.input_name = 'text';
	}

	var clickFunctions = {
		'bold' : function(txtarea) {
			return function() {
				strengthenSelection(txtarea);
			};
		},
		'italic' : function(txtarea) {
			return function() {
				emphasizeSelection(txtarea);
			};
		},
		'h1' : function(txtarea) {
			return function() {
				makeTitle(txtarea, 1);
			};
		},
		'h2' : function(txtarea) {
			return function() {
				makeTitle(txtarea, 2);
			};
		},
		'h3' : function(txtarea) {
			return function() {
				makeTitle(txtarea, 3);
			};
		},
		'h4' : function(txtarea) {
			return function() {
				makeTitle(txtarea, 4);
			};
		},
		'h5' : function(txtarea) {
			return function() {
				makeTitle(txtarea, 5);
			};
		},
		'h6' : function(txtarea) {
			return function() {
				makeTitle(txtarea, 6);
			};
		},
		'quote' : function(txtarea) {
			return function() {
				makeQuoteBlock(txtarea);
			};
		},
		'help' : function() {
			return showHelpText;
		},
		'hr' : function(txtarea) {
			return function() {
				makeHorizontalRule(txtarea);
			}
		},
		'link' : function(txtarea) {
			return function() {
				makeLink(txtarea);
			}
		},
		'img' : function(txtarea) {
			return function() {
				makeImage(txtarea);
			}
		}
	}

	var container = document.getElementById(options.parent_id),
		btns = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'quote', 'hr', 'bold', 'italic', 'link', 'img', 'help'],
		div = document.createElement('div'),
		aux = document.createElement('div'), 
		textarea = document.createElement('textarea'), btn;

	aux.className = 'md-editor-buttons';
	for (var i = 0; i < btns.length; i++) {
		btn = document.createElement('button');
		btn.setAttribute('type', 'button');
		btn.className = 'md-editor-button';
		btn.innerHTML = btns[i];
		aux.appendChild(btn);

		btn.onclick = clickFunctions[btns[i]](textarea);
	};

	div.className = 'md-editor';
	div.appendChild(aux);
	textarea.setAttribute('name', options.input_name);
	textarea.className = 'md-editor-textarea';
	div.appendChild(textarea);

	if(typeof options.default_style === 'undefined' || options.default_style) {
		div.style.display = "table";
		div.style.padding = "10px";
		div.style.backgroundColor = "#ccc";
		div.style.border = "1px solid #aaa"
		textarea.style.width = "100%";
		if('boxSizing' in div.style) {
			div.style.boxSizing = 'border-box';
			textarea.style.boxSizing = 'border-box';
		} else if('MozBoxSizing' in div.style) {
			div.style.MozBoxSizing = 'border-box';
			textarea.style.MozBoxSizing = 'border-box';
		}
	}

	container.appendChild(div);
}