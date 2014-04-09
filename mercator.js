var timings = {};
timings["load"] = new Date().getTime();
var windowLoaded = $.Deferred();
$(window).load(windowLoaded.resolve);
$(function() {
	time("ready", function() {
		$("body").attr("mercator", "loading");
		var corners = ["north", "west", "center", "east", "south"];
		time("padding", function() {
			$("padding").each(function() {
				var padding = $(this);
				// Apply padding
				var size = padding.attr("size");
				var width = padding.attr("width");
				var height = padding.attr("height");
				var east = padding.attr("east");
				var west = padding.attr("west");
				var north = padding.attr("north");
				var south = padding.attr("south");
				padding.contents().wrapAll("<center/>");
				if(size || width || west) {
					padding.prepend("<west/>");
					padding.children("west").attr("width", west ? west : (width ? width : size));
				}
				if(size || width || east) {
					padding.append("<east/>");
					padding.children("east").attr("width", east ? east : (width ? width : size));
				}
				if(size || height || north) {
					padding.prepend("<north/>");
					padding.children("north").attr("height", north ? north : (height ? height : size));
				}
				if(size || height || south) {
					padding.append("<south/>");
					padding.children("south").attr("height", south ? south : (height ? height : size));
				}
			});
		});
		time("fillers", function() {
			$("north,west,center,east,south").each(function() {
				var corner = $(this);
				var width = corner.attr("width");
				var height = corner.attr("height");
				if(corner.children().size() != 0 || corner.text() != "" || width || height) {
					// Insert fillers for corners without content
					if(corner.children().size() == 0) {
						if(corner.text() != "") {
							corner.html("<text>"+corner.text()+"</text>");
						}
						else if(!corner.is("center")) {
							corner.append("<filler/>");
						}
					}
					if(width) {
						corner.children("filler,text").attr("width", width);
						corner.removeAttr("width");
					}
					if(height) {
						corner.children("filler,text").attr("height", height);
		//				corner.removeAttr("height");
					}
				}
				else {
					corner.remove();
				}
			});
		});
		time("wrap", function() {
			$("north,west,center,east,south").each(function() {
				var corner = $(this);
				// Wrap all child corners in borderlayout
				var parent = corner.parent();
				if(!parent.is("borderlayout")) {
					parent.children("north,west,center,east,south").wrapAll("<borderlayout/>");
				}
			});
		});
		time("borderlayout", function() {
			$("borderlayout").each(function() {
				var borderlayout = $(this);
				/* Collapse height if no west, center, and east
					 _____________________
					|_____________________|
					|_____________________|
				*/
				if(borderlayout.children("west,center,east").size() == 0) {
					borderlayout.attr("collapse", "height");
				}
				// Order corners as they are rendered
				var cornerElements = borderlayout.children("north,west,center,east,south");
				var north = borderlayout.children("north");
				var west = borderlayout.children("west");
				var center = borderlayout.children("center");
				var east = borderlayout.children("east");
				var south = borderlayout.children("south");
				cornerElements.detach();
				borderlayout.append(north, west, center, east, south);
				var polar = borderlayout.children("north,south");
				var tropical = borderlayout.children("west,center,east");
				// Wrap tropics in nested table if there are polar regions, otherwise just row
				if(polar.size() == 0) {
					tropical.wrapAll("<row/>");
					borderlayout.attr("auto", "true");
				}
				else {
					// FIXME: Should we have a collapse on the inner row?
					tropical.wrapAll("<row><cell><nested><row collapse/></nested></cell></row>");
					// Add table row to north and south
					polar.wrap("<row collapse/>");
				}
			});
		});
		time("size", function() {
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
		});
		
		time("layer", function() {
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
		$("body").attr("mercator", "ready");
		windowLoaded.done(function() {
				timings["load"] = new Date().getTime() - timings["load"];
				$("timings").text(JSON.stringify(timings));
		});
	});
});

function time(timer, onTime) {
	timings[timer] = new Date().getTime();
	onTime();
	timings[timer] = new Date().getTime() - timings[timer];
}

function isIE() {
	return ((navigator.appName == 'Microsoft Internet Explorer') || ((navigator.appName == 'Netscape') && (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(navigator.userAgent) != null)));
}

function getHeight(elements) {
	var h = 0;
	elements.each(function() {
		h += $(this).height();
	});
	return h+"px";
}

