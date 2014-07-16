if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(["require", "deepjs/deep", "deepjs/lib/views/view"], function(require, deep) {

	jQuery.fn.outerHTML = function(s) {
		return s ? this.before(s).remove() : jQuery("<p>").append(this.eq(0).clone()).html();
	};


	// todo : add default-engine flag somewhere
	deep.widgets = {
		list: function(descriptor, node) {
			/* TO DO : add gards (missing protocol, missing uri, etc... )*/
			var uri = $(node).attr("bind");
			var request = deep.utils.parseRequest(uri);
			var schema = request.protocol + "::schema";
			return deep.getAll([uri, schema])
				.done(function(result) {
					var datas = [];
					console.log("Results = ", result[0]);
					if (result[0]._deep_range_)
						datas = result[0].results;
					else
						datas = result[0];
					schema = result[1] || {};
					console.log("Widget List datas : ", datas); //could receive an array or a simple object or ... depending on the query
					headerNode = $(node).find("*[list-header]");
					headerHtml = headerNode.outerHTML();

					rowNode = $(node).find("*[list-row]");
					rowContainer = rowNode.parent();
					rowHtml = rowNode.outerHTML();

					pagerNode = $(node).find("*[list-pager]");
					pagerHtml = pagerNode.outerHTML();

					// TO DO : use datas and schema to produce header + rows + pager

					headerHtml = deep.ui.swig(headerHtml);
					rowHtml = deep.ui.swig(rowHtml);
					pagerHtml = deep.ui.swig(pagerHtml);

					headerNode.replaceWith(headerHtml({
						title: "hello"
					}));

					rowNode.remove();
					datas.forEach(function(data) {
						rowContainer.append(rowHtml(data));
					});

					//rowNode.replaceWith(rowHtml({title:"hello"}));


					pagerNode.replaceWith(pagerHtml({
						title: "hello"
					}));
				});
		}
	};
});