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
	$("north,west,east,south").each(function() {
		// Insert fillers for corners without content
		if($(this).children().size() == 0) {
			$(this).html("<filler>"+$(this).text()+"</filler>");
		}
		var width = $(this).attr("width");
		if(width) {
			$(this).children("filler").attr("width", width);
		}
		var height = $(this).attr("height");
		if(height) {
			$(this).children("filler").attr("height", height);
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
	$("north,west,center,east,south,filler").each(function() {
		// Set css width and height from attributes
		var width = $(this).attr("width");
		if(width) {
			$(this).css("width", width);
		}
		var height = $(this).attr("height");
		if(height) {
			$(this).css("height", height);
		}
	});
});

