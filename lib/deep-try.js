/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if(typeof define !== 'function')
	var define = require('amdefine')(module);
define(["require", "deepjs/deep"], function(require, deep){
	var argToArr = deep.utils.argToArr;
	var render = function(args){
		args = argToArr.call(args);
		if(args && args.forEach && args[0] == "dp:success : ")
			args.shift();
		var rendered = args.map(function(s){ if(s == 'dp:success : ') return ''; if(typeof s === 'object') return JSON.stringify(s, null, ' '); return s; }).join(" ");
		rendered = hljs.highlight("javascript", rendered).value
		return rendered;
	};
	var createLogger = function(output){
		return {
		    log:function(){
		        $(output).append('<div class="deep-log">'+render(arguments)+'</div>')
		    },
		    warn:function(){
		        $(output).append('<div class="deep-warn">'+render(arguments)+'</div>')
		    },
		    error:function(){
		        $(output).append('<div class="deep-error">'+render(arguments)+'</div>')
		    }
		};
	};
	hljs.configure({useBR: true});
	deep.ui.View.htmlEnhancers["dp-try"] = function(node) {
		var  $ = deep.context.$;
		if (!deep.isBrowser)
			return;
		var $ = deep.context.$;
		var controller = this;
		var code;
		$(node)
		.wrap('<div class="dp-try"></div>')
		.first()
		.each(function(e){
			code = $(this).text();
			$(this).html(hljs.highlight("javascript", code).value);
		});
		$(node).removeAttr("dp-try");
		var parent = $(node).parent();
		var output = $('<pre class="dp-try-output"></pre>').appendTo(parent).hide();
		var button = $('<button class="dp-try-button">run</button>').appendTo(parent);
		var logger = createLogger(output);
		button.click(function(){
			deep(1).toContext("logger", logger)
			.done(function(){
				output.html("").show();
				eval(code);
			});
		});
	};

	deep.ui.View.htmlEnhancers["dp-try-sandbox"] = function(node) {
		var  $ = deep.context.$;
		if (!deep.isBrowser)
			return;
		var $ = deep.context.$;
		var controller = this;
		var code, output;
		code = $(node).find(".dp-try-input");
		if(!code || code.length === 0)
			code = $('<textarea class="dp-try-input"></textarea>').appendTo(node);
		var button = $(node).find(".dp-try-button");
		if(button.length === 0)
			button = $('<button class="dp-try-button">run</button>').appendTo(node);
		output = $(node).find(".dp-try-output");
		if(output.length === 0)
			output = $('<pre class="dp-try-output"></pre>').appendTo(node);
		output.hide();
		var logger = createLogger(output);
		button.click(function(){
			deep(1).toContext("logger", logger)
			.done(function(){
				output.html("").show();
				eval($(code).val());
			});
		});
	};
});