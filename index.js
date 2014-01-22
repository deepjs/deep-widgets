if(typeof define !== 'function'){
	var define = require('amdefine')(module);
}

define(["require","deepjs/deep","deepjs/lib/view"], function(require, deep){

	jQuery.fn.outerHTML = function(s) {
	    return s
	        ? this.before(s).remove()
	        : jQuery("<p>").append(this.eq(0).clone()).html();
	};

	deep.utils.up({
		deepWidgets : function (descriptor) {
			var promises = [];
			descriptor.placed
			.find("div[deep-widgets]") // <div  object-bind="mp3::id" schema:"jsion::",  maxLength="12"> 
			.each(function() {
				var type = $(this).attr("deep-widgets");
				if(!deep.widgets[type])
					throw deep.errors.Error(500,"This widget didn't exist yet...");
				promises.push(deep.widgets[type](descriptor, this));
			});
			return promises;
		}		
	},deep.ui.View.htmlEnhancers);


	deep.widgets = {
		list:function (descriptor,node) {
			/* TO DO : add gards (missing protocol, missing uri, etc... )*/
			var uri = $(node).attr("bind");
			var request = deep.utils.parseRequest(uri);
                        var schema = request.protocol+"::schema";
			return deep.getAll([uri, schema])
			.done(function(result){
				var datas = res[0], 
				    schema = res[1] || {};
				    
				   // TO DO : use datas and schema to produce header + rows + pager
				   
				var headerNode = $(node).find("*[list-header]");
				var headerHtml = headerNode.outerHTML();
	
				var rowNode = $(node).find("*[list-row]");
				var rowHtml = rowNode.outerHTML();
	
				var pagerNode = $(node).find("*[list-pager]");
				var pagerHtml = pagerNode.outerHTML();
	
				headerHtml = deep.ui.swig(headerHtml);
				rowHtml = deep.ui.swig(rowHtml);
				pagerHtml = deep.ui.swig(pagerHtml);
	
				$(headerNode).replaceWith(headerHtml({title:"hello"}));
				$(rowNode).replaceWith(rowHtml({title:"hello"}));
				$(pagerNode).replaceWith(pagerHtml({title:"hello"}));	
			});
		}
	};
});
