function getInputSelection(element) {
	var retObj = {
		start: 0, 
		end: 0
	};

	element.focus();
	if(typeof element.selectionStart === 'number' && typeof element.selectionEnd === 'number') {
		retObj.start = element.selectionStart;
		retObj.end = element.selectionEnd;
	} else {
		console.log("Your browser does not currently support 'selectionStart' functionality.");
		return false;
	}

	return retObj;
}

function replaceSelectedText(options) {
	if(typeof options.select === 'undefined') {
		options.select = getInputSelection(options.element);
	}
	if(typeof options.replacement === 'undefined') {
		options.replacement = '';
	}

	var prefix = options.element.value.substring(0, options.select.start), suffix = options.element.value.substring(options.select.end, options.element.value.length);

	options.element.value = prefix + options.replacement + suffix;

	options.element.selectionStart = options.element.selectionEnd = prefix.length + options.replacement.length;
}

function surroundSelectionWith(options) {
	if(typeof options.select === 'undefined') {
		options.select = getInputSelection(options.element);
	};
	if(typeof options.suffix === 'undefined') {
		options.suffix = options.prefix;
	};

	var beforeStr = String(options.prefix), afterStr = String(options.suffix), selectionStr = options.element.value.substring(options.select.start, options.select.end);

	if(typeof options.removeLineBreaks !== 'undefined' && options.removeLineBreaks) {
		selectionStr = selectionStr.replace(/\n/g, '');
	}

	if(options.select) {
		options.element.value = options.element.value.substring(0, options.select.start) + beforeStr + selectionStr + afterStr + options.element.value.substring(options.select.end, options.element.value.length);

		if(options.select.start == options.select.end) {
			options.element.selectionStart = options.element.selectionEnd = options.select.start + beforeStr.length;
		} else {
			options.element.selectionStart = options.element.selectionEnd = options.select.end + beforeStr.length + afterStr.length;
		}
	}
}

function prependLineWith(element, prefix, selection) {
	if(typeof selection === 'undefined') {
		selection = getInputSelection(element)
	}

	var slicedValueBefore = element.value.substring(0, selection.start), slicedValueAfter = element.value.substring(selection.start, element.value.length), lastIndexBefore = slicedValueBefore.lastIndexOf('\n'), indexAfter = slicedValueAfter.indexOf('\n');

	selection.start = (lastIndexBefore >= 0) ? (lastIndexBefore + 1) : 0;
	selection.end = (indexAfter >= 0) ? (slicedValueBefore.length + indexAfter) : element.value.length;

	surroundSelectionWith({
		element : element,
		prefix : prefix,
		select : selection,
		suffix: ''
	});
}

function prependMultipleLinesWith(element, prefix, selection) {
	if(typeof selection === 'undefined') {
		selection = getInputSelection(element);
	}

	var prefixIndex = element.value.substring(0, selection.start).lastIndexOf('\n') + 1,  
		keepRunning = true, 
		suffixIndex = element.value.indexOf('\n', prefixIndex);

	while(keepRunning) {
		surroundSelectionWith({
			element: element,
			prefix: prefix,
			select: {
				start: prefixIndex,
				end: (suffixIndex < 0) ? element.value.length : suffixIndex
			},
			suffix: ''
		});

		if(suffixIndex < 0 || suffixIndex > selection.end) {
			keepRunning = false;
		} else {
			prefixIndex = element.selectionStart + 1;
			suffixIndex = element.value.indexOf('\n', prefixIndex);
		}
	}
}