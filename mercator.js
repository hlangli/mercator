var windowLoad = $.Deferred();
$(window).load(windowLoad.resolve);
$(function() {
	var corners = ["north", "west", "center", "east", "south"];
	$("padding").each(function() {
		// Apply padding
		var size = $(this).attr("size");
		var width = $(this).attr("width");
		var height = $(this).attr("height");
		var east = $(this).attr("east");
		var west = $(this).attr("west");
		var north = $(this).attr("north");
		var south = $(this).attr("south");
		$(this).contents().wrapAll("<center/>");
		$(this).prepend("<west/>");
		$(this).prepend("<north/>");
		$(this).append("<east/>");
		$(this).append("<south/>");
		if(size) {
			$(this).children("north,south").attr("height", size);
			$(this).children("west,east").attr("width", size);
		}
		if(width) {
			$(this).children("west,east").attr("width", width);
		}
		if(height) {
			$(this).children("north,south").attr("height", height);
		}
		if(west) {
			$(this).children("west").attr("width", west);
		}
		if(east) {
			$(this).children("east").attr("width", east);
		}
		if(north) {
			$(this).children("north").attr("width", north);
		}
		if(south) {
			$(this).children("south").attr("width", south);
		}
	});
	$("north,west,east,south,center").each(function() {
		// Insert fillers for corners without content
		if($(this).children().size() == 0) {
			if($(this).text() != "") {
				$(this).html("<text>"+$(this).text()+"</text>");
			}
			else if(!$(this).is("center")) {
				$(this).html("<filler/>");
			}
		}
		var width = $(this).attr("width");
		if(width) {
			$(this).children("filler,text").attr("width", width);
		}
		var height = $(this).attr("height");
		if(height) {
			$(this).children("filler,text").attr("height", height);
		}
	});
	$("north,west,center,east,south").each(function() {
		// Wrap all child corners in borderlayout
		var parent = $(this).parent();
		if(!parent.is("borderlayout")) {
			parent.children("north,west,center,east,south").wrapAll("<borderlayout/>");
		}
	});
	$("borderlayout").each(function() {
		if($(this).children("center").size() == 0) {
			$(this).append("<center/>");
		}
		var cornerElements = $(this).children("north,west,center,east,south");
		var north = $(this).children("north");
		var west = $(this).children("west");
		var center = $(this).children("center");
		var east = $(this).children("east");
		var south = $(this).children("south");
		cornerElements.detach();
		$(this).append(north, west, center, east, south);
	});
	$("borderlayout").each(function() {
		// Make inner table for middle row (because css cannot define colspan - so we can only have one column)
		$(this).children("west,center,east").wrapAll("<row><cell><nested><row/></nested></cell></row>");
		// Add table row to north and south
		$(this).children("north,south").wrap("<row collapse/>");
	});
	$("layer,north,west,center,east,south,filler,text,panel").each(function() {
		// Set css width and height from attributes
		var width = $(this).attr("width");
		if(width) {
			$(this).css("width", width);
		}
		var height = $(this).attr("height");
		if(height) {
			$(this).css("height", height);
		}
		var minWidth = $(this).attr("min-width");
		if(minWidth) {
			$(this).css("min-width", minWidth);
		}
		var minHeight = $(this).attr("min-height");
		if(minHeight) {
			$(this).css("min-height", minHeight);
		}
	});
	
	$("layer").each(function() {
		var east = $(this).attr("east");
		if(east) {
			$(this).css("right", east);
		}
		var west = $(this).attr("west");
		if(west) {
			$(this).css("left", west);
		}
		var north = $(this).attr("north");
		if(north) {
			$(this).css("top", north);
		}
		var south = $(this).attr("south");
		if(south) {
			$(this).css("bottom", south);
		}
		var width = $(this).attr("width");
		var height = $(this).attr("height");
		if(east||west||width||north||south||height) {
			var collapse = "both";
			if((east||west||width) && !(north||south||height)) {
				collapse = "width";
			}
			if(!(east||west||width) && (north||south||height)) {
				collapse = "height";
			}
			$(this).children("borderlayout").attr("collapse", collapse);
		}
	});
	
	if(isIE()) {
		$("layer").click(function(event) {
			$("layer").not($(this)).hide();
			var element =  document.elementFromPoint(event.pageX, event.pageY);
			if(element) {
				$(element).trigger(event);	
			}
		});
	}
	
});

function isIE() {
	return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)));
}

function setHeight(element, height) {
	if(height) {
		try {
			var elements = eval(height);
			height = getHeight(elements);
			windowLoad.done(function() {
				setHeight(element, height);
			});
		}
		catch(e) {
			element.css("height", height);
		}
	}
}

function getHeight(elements) {
	var h = 0;
	elements.each(function() {
		h += $(this).height();
	});
	return h+"px";
}

