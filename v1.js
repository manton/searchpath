var script = document.createElement('script');
script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
script.type = 'text/javascript';
script.onload = function() {
	document.searchpath_jQuery = jQuery.noConflict(true);
};

var css_link = document.createElement('link');
css_link.rel = 'stylesheet';
css_link.href = 'http://js.searchpath.io/css/light.css';
css_link.type = 'text/css';

document.getElementsByTagName('head')[0].appendChild(script);
document.getElementsByTagName('head')[0].appendChild(css_link);

function searchpath_getParam(inName)
{
	var s = location.href.split("?")[1];
	if (s != undefined) {
		var params = s.split("&");
		for (var i = 0; i < params.length; i++) {
			var param = params[i];
			var name = param.split("=")[0];
			var val = param.split("=")[1];
			if (name == inName) {
				return val;
			}
		}
	}
		
	return "";
}

function searchpath_getFieldId()
{
	var field_id = searchpath_getParam("id");
	if (field_id == "") {
		field_id = "searchpath_q";
	}
	return field_id;
}

function searchpath_getSite()
{
	var s = location.href.split("?")[0];
	var pieces = s.split("/");
	var site = pieces[pieces.length-1];
	return site;
}

function searchpath_go()
{
	var searchpath_j = document.searchpath_jQuery;
	
	if (searchpath_j("#searchpath_pane").length == 0) {
		searchpath_j("<div>").attr("id", "searchpath_arrow").appendTo("body");
		searchpath_j("<div>").attr("id", "searchpath_pane").appendTo("body");
		searchpath_j("<div>").attr("id", "searchpath_backdrop").appendTo("body");

		searchpath_j(document).keyup(function(e) {
			if (e.which == 27) {
				searchpath_close();
				searchpath_restoreScroll();
				return false;
			}
		});
	}
	
	var search_box = document.getElementById(searchpath_getFieldId());
	var q = search_box.value;
	var link = searchpath_j(search_box);
	var copy_pane = searchpath_j('#searchpath_pane');
	var copy_arrow = searchpath_j('#searchpath_arrow');
	var backdrop = searchpath_j('#searchpath_backdrop');
	var x, y;
	
	if (q.length == 0) {
		searchpath_close();
		searchpath_restoreScroll();
		return false;
	}
	
	var page_column_size = searchpath_j(document).width() / 5;
	var position_mid = link.offset().left + (link.width() / 2);
	var direction;
	if ((position_mid > (page_column_size * 2)) && (position_mid < (page_column_size * 3))) {
		x = (page_column_size * 2) + (page_column_size / 2) - (copy_pane.width() / 2);
		if (link.offset().top < 500) {
			direction = "up";
			y = link.offset().top + link.height() + 20;
		}
		else {
			direction = "down";
			y = link.offset().top - copy_pane.height() - 20;
		}
	}	
	else if (link.offset().left > 400) {
		x = link.offset().left - copy_pane.width() - 20;
		y = link.offset().top - (copy_pane.height() / 2) + parseInt(link.css("padding-top"));
		direction = "right";
	}
	else {
		x = link.offset().left + link.width() + parseInt(link.css("padding-left")) + parseInt(link.css("padding-right")) + 20;
		y = link.offset().top - (copy_pane.height() / 2) + parseInt(link.css("padding-top"));
		direction = "left";
	}
		
	var scroll_y = searchpath_j(document).scrollTop();
	if ((y - scroll_y) < 10) {
		y = scroll_y + 10;
	}
	else {
		var scroll_bottom = scroll_y + searchpath_j(window).height();
		if ((y + copy_pane.height()) > scroll_bottom) {
			y = scroll_bottom - copy_pane.height() - 10;
		}
	}
	
	copy_pane.css({
		top: y + "px",
		left: x + "px",
		"box-shadow": "1px 1px 2px gray"
	});

	backdrop.css({
		width: searchpath_j(document).width() + "px",
		height: searchpath_j(document).height() + "px"
	});

	searchpath_showWithOpacity(backdrop, 0.7);
	searchpath_showWithOpacity(copy_pane, 1.0);

	if (copy_pane.scrollTop() > 0) {
		copy_pane.animate({scrollTop:0});
	}

	if (direction == "up") {
		copy_arrow.css("background-image", "url(http://js.searchpath.io/img/popover_arrow_up.png)");
		copy_arrow.css({
			width: "30px",
			height: "16px",
			top: y - 15 + "px",
			left: link.offset().left + (link.width() / 2) - 10 + "px"
		});
	}
	else if (direction == "down") {
		copy_arrow.css("background-image", "url(http://js.searchpath.io/img/popover_arrow_down.png)");
		copy_arrow.css({
			width: "30px",
			height: "16px",
			top: y + copy_pane.height() + "px",
			left: link.offset().left + (link.width() / 2) - 10 + "px"
		});
	}
	else if (direction == "right") {
		copy_arrow.css("background-image", "url(http://js.searchpath.io/img/popover_arrow_right.png)");
		copy_arrow.css({
			top: link.offset().top - 4 + "px",
			left: copy_pane.offset().left + copy_pane.width() + 1 + "px"
		});
	}
	else if (direction == "left") {
		copy_arrow.css({
			top: link.offset().top - 4 + "px",
			left: copy_pane.offset().left - copy_arrow.width() + 1 + "px"
		});
	}
	
	searchpath_showWithOpacity(copy_arrow, 1.0);

	backdrop.unbind("click");
	backdrop.click(function() {		
		searchpath_close();
		searchpath_restoreScroll();
		return false;
	});

	searchpath_preventScroll();

	searchpath_j.get('http://js.searchpath.io/html?site=' + encodeURIComponent(searchpath_getSite()) + '&q=' + encodeURIComponent(q), function(response_data) {
		copy_pane.html(response_data);
	});
	
	return false;
}

function searchpath_mobile()
{
	var searchpath_j = document.searchpath_jQuery;
	var search_box = document.getElementById(searchpath_getFieldId());
	var q = search_box.value;
	var body_tag = searchpath_j('body');

	searchpath_j.get('http://js.searchpath.io/html?site=' + encodeURIComponent(searchpath_getSite()) + '&q=' + encodeURIComponent(q), function(response_data) {
		body_tag.html(response_data);
		body_tag.append('<input type="hidden" id="' + searchpath_getFieldId() + '" value="' + encodeURIComponent(q) + '" />')

		if (body_tag.scrollTop() > 0) {
			body_tag.animate({scrollTop:0});
		}
	});
	
	return false;
}

function searchpath_showMore()
{
	var searchpath_j = document.searchpath_jQuery;
	var search_box = document.getElementById(searchpath_getFieldId());
	var q = search_box.value;
	searchpath_j.get('http://js.searchpath.io/html?site=' + encodeURIComponent(searchpath_getSite()) + '&q=' + encodeURIComponent(q) + '&from=10&size=50', function(response_data) {
		searchpath_j("#searchpath_more").html(response_data);
	});
}

function searchpath_close()
{
	var searchpath_j = document.searchpath_jQuery;

	if (searchpath_isMobile()) {
		window.location.reload();
	}
	else {
		searchpath_hideWithOpacity(searchpath_j("#searchpath_pane"));
		searchpath_hideWithOpacity(searchpath_j("#searchpath_arrow"));
		searchpath_hideWithOpacity(searchpath_j("#searchpath_backdrop"));
	
		setTimeout(function() {
			searchpath_j("#searchpath_pane").hide();
			searchpath_j("#searchpath_arrow").hide();
			searchpath_j("#searchpath_backdrop").hide();
		}, 1000);
	}
}

function searchpath_preventScroll()
{
	if (navigator.userAgent.match(/WebKit/i) != null) {
		var searchpath_j = document.searchpath_jQuery;
		searchpath_j("body").css("overflow", "hidden");
	}
}

function searchpath_restoreScroll()
{
	if (navigator.userAgent.match(/WebKit/i) != null) {
		var searchpath_j = document.searchpath_jQuery;
		searchpath_j("body").css("overflow", "scroll");
	}
}

function searchpath_showWithOpacity(inElement, inOpacity)
{
	inElement.show();
	inElement.css("opacity", inOpacity);
}

function searchpath_hideWithOpacity(inElement)
{
	inElement.css("opacity", 0);
}

function searchpath_isMobile()
{
	return (navigator.userAgent.match(/iPhone/i) != null);
}

if (searchpath_getParam("id") == "") {
	document.write('<form class="form-search"><input type="search" name="q" id="searchpath_q" class="input-medium search-query" placeholder="' + searchpath_getParam("placeholder") + '" /></form>');
}

if (searchpath_isMobile()) {
	document.getElementById(searchpath_getFieldId()).form.onsubmit = searchpath_mobile;
}
else {
	document.getElementById(searchpath_getFieldId()).form.onsubmit = searchpath_go;
}