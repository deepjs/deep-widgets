/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if (typeof define !== 'function')
	var define = require('amdefine')(module);
define(["require", "deepjs/deep"], function(require, deep) {
	var argToArr = deep.utils.argToArr;
	var render = function(args) {
		args = argToArr.call(args);
		if (args && args.forEach && args[0] == "dp:success : ")
			args.shift();
		var rendered = args.map(function(s) {
			if (s == 'dp:success : ') return '';
			if (typeof s === 'object') return JSON.stringify(s, function(key, value) {
				if (typeof value === 'function')
					return 'Function';
				if (value instanceof Date)
					return value.toString();
				if (value instanceof RegExp)
					return value.toString();
				if(typeof jQuery !== 'undefined' && value instanceof jQuery)
					return "jquery:"+value.selector;
				return value;
			}, ' ');
			return s;
		}).join(" ");
		rendered = hljs.highlight("javascript", rendered).value;
		return rendered;
	};
	var createLogger = function(output) {
		return {
			log: function() {
				$(output).append('<div class="deep-log">' + render(arguments) + '</div>')
			},
			warn: function() {
				$(output).append('<div class="deep-warn">' + render(arguments) + '</div>')
			},
			error: function() {
				$(output).append('<div class="deep-error">' + render(arguments) + '</div>')
			}
		};
	};
	deep.ui.View.htmlEnhancers["dp-try"] = function(node) {
		var $ = deep.context.$;
		if (!deep.isBrowser)
			return;
		var $ = deep.context.$;
		var controller = this;
		var code, editor;
		$(node)
			.wrap('<div class="dp-try"></div>')
			.first()
			.each(function(e) {
				code = $(this).text();
				$(this).html(hljs.highlight("javascript", code).value);
			});
		var view = $(node).removeAttr("dp-try").attr("view"), viewValue;
		if(view)
			viewValue = $(view).html();
		var id = "dp-try-" + Date.now().valueOf();
		var parent = $(node).parent();
		var editorNode = $('<div class="dp-try-editor" id="' + id + '">' + code + '</div>').appendTo(parent).hide();
		var output = $('<pre class="dp-try-output"></pre>').appendTo(parent).hide();
		var logger = createLogger(output);
		$('<button class="dp-try-button">run</button>')
			.appendTo(parent)
			.click(function() {
				deep(1).toContext("logger", logger)
					.done(function() {
						output.html("").show();
						if (editor)
							eval(editor.getValue());
						else
							eval(code);
					});
			});
		$('<button class="dp-try-edit">edit</button>')
			.appendTo(parent)
			.click(function() {
				if (!editor) {
					$(editorNode).show();
					$(node).hide();
					editor = ace.edit(id);
					var heightUpdateFunction = function() {
						// http://stackoverflow.com/questions/11584061/
						var newHeight =
							editor.getSession().getScreenLength() * editor.renderer.lineHeight + editor.renderer.scrollBar.getWidth();
						$(editorNode).height(newHeight.toString() + "px");
						// This call is required for the editor to fix all of
						// its inner structure for adapting to a change in size
						editor.resize();
					};
					// Set initial size to match initial content
					heightUpdateFunction();
					// Whenever a change happens inside the ACE editor, update
					// the size again
					editor.getSession().on('change', heightUpdateFunction);
					editor.setTheme("ace/theme/twilight");
					editor.getSession().setMode("ace/mode/javascript");
				}
			});
		$('<button class="dp-try-reset">reset</button>')
			.appendTo(parent)
			.click(function() {
				//if(editor)
				//	code = editor.getValue();
				$(node).show();
				$(editorNode).hide();
				if(editor)
					editor.destroy();
				editor = null;
				output.html("").hide();
				if(view)
					$(view).html(viewValue);
			});
	};
});