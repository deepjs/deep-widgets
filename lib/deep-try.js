/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
define(["require", "deepjs/deep", "deep-views/lib/view"], function(require, deep) {
	var argToArr = deep.utils.argToArr;

	var render = function(args) {
		args = argToArr.call(args);
		if (args && args.forEach && args[0] == "dp:success : ")
			args.shift();
		var rendered = args.map(function(s) {
			if (s instanceof Error)
				return "Error: " + (s.status ? (s.status + ": ") : "") + s.message;
			if (typeof s === 'undefined')
				return 'undefined';
			if (s == 'dp:success : ') return '';
			if (typeof s === 'object') return deep.utils.stringify(s);
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
	deep.ui.directives["dp-try"] = function(node, context, uri) {
		// todo modes edit by default
		var $ = deep.$();
		// console.log("DP-TRY : ", $(node).text());
		if (!deep.isBrowser)
			return;
		var controller = this;
		var closure = {}, 
			editor,
			id = "dp-try-" + Date.now().valueOf();

		$(node)
			.wrap('<div class="dp-try"></div>');

		var view = $(node).attr("view"),
			viewValue;
		if (view)
			viewValue = $(view).html();
		var editable = !($(node).attr("editable") === 'false');

		var parent = $(node).parent();
		var editorNode;
		if (editable)
			editorNode = $('<div class="dp-try-editor" id="' + id + '"></div>').appendTo(parent).hide();
		if (uri)
			deep.get(uri)
				.done(function(result) {
					closure.code = result;
					if (editable)
						$(editorNode).text(result);
					$(this).html(hljs.highlight("javascript", closure.code).value);
				});
		else
			$(node)
				.each(function(e) {
					closure.code = $(this).text();
					// console.log("CATCHING CODE : ", closure.code);
					if (editable)
						$(editorNode).text(closure.code);
					var node = this;
					deep.delay(400+(Math.random()*100)).done(function(){
						$(node).html(hljs.highlight("javascript", closure.code).value);
					});
				});


		if (!editable)
			return;

		var buttonRow = $('<div class="dp-button-row"></div>').appendTo(parent);
		$('<button class="btn btn-default btn-xs"><span class="glyphicon glyphicon-flash"></span></button>')
			.appendTo(buttonRow)
			.click(function() {
				deep(1).toContext("logger", closure.logger)
					.done(function() {
						output.html("").slideDown(100);
						if (editor)
							eval(editor.getValue());
						else
							eval(closure.code);
					});
			})
			.hide().fadeIn();

		$('<button class="btn btn-default btn-xs"><span class="glyphicon glyphicon-edit"></span></button>')
			.appendTo(buttonRow)
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
			})
			.hide().delay(50).fadeIn();
		$('<button class="btn btn-default btn-xs"><span class="glyphicon glyphicon-refresh"></span></button>')
			.appendTo(buttonRow)
			.click(function() {
				//if(editor)
				//	code = editor.getValue();
				$(node).show();
				$(editorNode).hide();

				if (editor) {
					editor.setValue(closure.code, -1);
					editor.destroy();
				}
				editor = null;
				output.slideUp(100);
				if (view)
					$(view).html(viewValue);
			})
			.hide().delay(100).fadeIn();
		var output = $('<pre class="dp-try-output"></pre>').appendTo(parent).hide();

		closure.logger = createLogger(output);
	};
});