/**
 * @author Gilles Coomans <gilles.coomans@gmail.com>
 *
 */

if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
define(["require", "deepjs/deep", "deepjs/lib/views/view"], function(require, deep) {
	deep.ui.directives["dp-svg-trick"] = function(node) {
		var $ = deep.context.$,
			width = $(node).attr("width"),
			height = $(node).attr("height");
		var parent = $(node).wrap('<div></div>').parent();
		$(parent).css("display", "block")
			.css("background", 'url("' + $(node).attr("src") + '")')
		.css("background-size", width + "px " + height + "px")
			.css("margin", "auto")
			.css("width", width + "px")
			.css("height", height + "px")
			.css("margin-bottom", "10px");
		$(node).css("display", "none");
	};
});