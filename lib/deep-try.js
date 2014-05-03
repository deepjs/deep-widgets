/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 */
if(typeof define !== 'function')
	var define = require('amdefine')(module);
define(["require", "deepjs/deep"], function(require, deep){
	var argToArr = deep.utils.argToArr;
	var render = function(args){
		return argToArr.call(args).map(function(s){ return JSON.stringify(s); }).join(" ");
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
		var code = [], output;
		$(node).find(".code")
		.each(function(e){
			code.push($(this).text());
			$(this).html(hljs.highlight("javascript", $(this).text()).value);
		});
		output = $(node).find(".dp-try-output");
		if(output.length === 0)
			output = $('<div class="dp-try-output"></div>').appendTo(node);
		output.hide();
		var button = $(node)
		.find(".dp-try-button");
		if(button.length === 0)
			button = $('<button class="dp-try-button">try</button>').appendTo(node);
		var logger = createLogger(output);
		button.click(function(){
			deep(1).toContext("logger", logger)
			.done(function(){
				output.html("").show();
				code.forEach(function(c){
					eval(c);
				})
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
			button = $('<button class="dp-try-button">try</button>').appendTo(node);
		output = $(node).find(".dp-try-output");
		if(output.length === 0)
			output = $('<div class="dp-try-output"></div>').appendTo(node);
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