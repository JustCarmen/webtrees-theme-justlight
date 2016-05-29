/*
 * webtrees: online genealogy
 * Copyright (C) 2016 webtrees development team
 * Copyright (C) 2016 JustCarmen
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/* global WT_SCRIPT_NAME, WT_BASE_URL, textDirection */

// Use a flexible header on small screens. The header takes to much space on small screens
function flexibleHeader() {
	if (jQuery("#responsive").is(":visible")) {
		jQuery('#nav-container').removeClass('navbar-fixed-top');
		jQuery('#nav-container').addClass('navbar-top');
	} else {
		jQuery('#nav-container').addClass('navbar-fixed-top');
		jQuery('#nav-container').removeClass('navbar-top');
	}
}

flexibleHeader();
jQuery(window).resize(function () {
	flexibleHeader();
});

// Bootstrap multilevel menu
jQuery(".dropdown").on("click", ".dropdown-toggle", function () {
	jQuery(".sub-menu:visible").hide();
});

jQuery(".dropdown").on("click", ".dropdown-submenu-toggle", function (e) {
	e.preventDefault();
	getSubMenu(jQuery(this));
	e.stopPropagation();
});

jQuery(".btn-group").on("click", ".dropdown-toggle", function () {
	jQuery(".sub-menu:visible").hide();
	scrollMenu(jQuery(this).next());
});

function getSubMenu($menu) {
	var current = $menu.next();
	var grandparent = $menu.parent().parent();
	jQuery(".dropdown-menu:visible").not(grandparent).not(current).hide();
	current.toggle();
	if (current.is(":visible")) {
		scrollMenu(current);
	}
}

// Add scrollbar for long dropdown-menus
function scrollMenu($menu) {
	var offset = $menu.offset();
	if (typeof offset !== 'undefined') {
		var maxHeight = 0.90 * (jQuery(window).height() - offset.top + jQuery(window).scrollTop());
		if ($menu.height() > maxHeight) {
			$menu.css({
				"height": "auto",
				"max-height": maxHeight,
				"overflow-x": "hidden"
			});
		}
	}
}

// Bootstrap active tab in navbar
var url = location.href.split(WT_BASE_URL);
jQuery('.nav-pills, .navbar-right').find('a[href="' + url[1] + '"]').parents('li').addClass('active');

// Bootstrap vertical menu for smaller screens
function getSmallMenu() {
	if (jQuery(window).width() < 450) {
		jQuery('.nav').removeClass('nav-pills');
		jQuery('.nav').addClass('nav-stacked');
	} else {
		jQuery('.nav').addClass('nav-pills');
		jQuery('.nav').removeClass('nav-stacked');
	}
}

getSmallMenu();
jQuery(window).resize(function () {
	getSmallMenu();
});

// Bootstrap table layout
jQuery("table").waitUntilExists(function () {
	var t = jQuery(this);
	if (t.is("#accordion table, table.tv_tree, [id*=chart] table, [id*=booklet] table, #place-hierarchy > table, #place-hierarchy > table table, #family-page table, .gedcom_block_block table, .user_welcome_block table, .cens_search table, .cens_data table, #reportengine-page table")) {
		return;
	} else if (WT_SCRIPT_NAME === 'relationship.php') {
		if (t.parents().is("form")) {
			t.addClass("table");
		}
	} else if (t.hasClass("table-census-assistant")) {
		t.addClass("table table-condensed table-striped width100");
		t.find("tbody tr:first td:first").attr("colspan", jQuery(this).find("th").length);
	} else if (t.is("#mycart")) {
		t.addClass("table table-striped");
	} else if (t.parents().hasClass("user_messages_block")) {
		t.addClass("table table-striped");
	} else if (t.parents().is("#sb_content_family_nav")) {
		t.addClass("table-striped");
		jQuery("td", t).removeClass("person_box person_boxF person_boxNN center");
	} else {
		t.addClass("table");
		t.parents(".gedcom_stats_block > table").addClass("table-striped");
	}
	return t;
});

jQuery(".markdown").waitUntilExists(function () {
	jQuery(this).find("table").each(function () {
		jQuery(this).addClass("table table-condensed table-striped width100");
		var colspan = jQuery(this).find("th").length;
		jQuery(this).find("tbody").prepend("<tr><td colspan=\"" + colspan + "\">");
	});
});

// Manual popover trigger function
function manualTrigger(obj, click, hover) {

	if (click === true) {
		obj.on("click", function (event) { // click is neccessary for touchscreen devices.
			event.preventDefault();
			event.stopPropagation();
			jQuery('.popover').not(obj).hide();
			obj.popover("show");
			jQuery('.popover-content').addClass(obj.data("class"));
		});
	}

	if (hover === true) {
		obj.on("mouseenter", function () {
			jQuery('.popover').not(obj).hide();
			obj.popover("show");
			jQuery('.popover-content').addClass(obj.data("class"));
			obj.siblings(".popover").on("mouseleave", function () {
				obj.popover('hide');
			});
		});

		obj.on("mouseleave", function () {
			setTimeout(function () {
				if (!jQuery(".popover:hover").length) {
					obj.popover("hide");
				}
			}, 100);
		});
	}
}

// Prepare webtrees popup lists for bootstrap popovers
jQuery(".popup > ul > li").waitUntilExists(function () {
	var text = jQuery.trim(jQuery(this).children().text());
	if (!text.length) {
		jQuery(this).remove();
	}
	jQuery(this).find(">ul").parent().css("list-style-type", "none");
});

// Bootstrap popovers and/or tooltips
jQuery(".itr .icon-pedigree").waitUntilExists(function () {
	var title = jQuery(this).parents(".person_box_template").find(".chart_textbox .NAME").parents("a").outerHtml();
	var content = jQuery(this).parents(".itr").find(".popup > ul");
	content = content.removeClass().remove();
	if (jQuery(this).parents("#index_small_blocks")) {
		placement = 'left';
	} else {
		placement = 'auto right';
	}
	jQuery(this).attr("data-toggle", "popover");
	jQuery(this).popover({
		title: title,
		content: content,
		html: true,
		trigger: 'manual',
		placement: placement,
		container: 'body'
	}).on(manualTrigger(jQuery(this), true, true));
});

jQuery("#medialist-page .lb-menu").each(function () {
	jQuery(this).find(".lb-image_edit a, .lb-image_view a").each(function () {
		var title = jQuery(this).text();
		jQuery(this).text("");
		jQuery(this).attr({
			"data-toggle": "tooltip",
			"data-placement": "top",
			"title": title
		});
		jQuery(this).tooltip();
	});
	jQuery(this).find(".lb-image_link a").each(function () {
		var title = jQuery(this).text();
		var content = jQuery(this).next("ul").html();
		jQuery(this).text("").next("ul").remove();
		jQuery(this).attr("data-toggle", "popover");
		jQuery(this).popover({
			title: title,
			content: content,
			html: true,
			trigger: 'manual',
			placement: 'bottom',
			container: '#medialist-page'
		}).on(manualTrigger(jQuery(this), false, true));
	});
	jQuery(this).css("display", "inline-block");
});

// Bootstrap popover for fanchart page
if (WT_SCRIPT_NAME === "fanchart.php") {

	jQuery("#fan_chart #fanmap area").each(function () {
		var id = jQuery(this).attr("href").split("#");
		var obj = jQuery(".fan_chart_menu[id=" + id[1] + "]");
		obj.find(".person_box").addClass("fan-chart-list");
		var title = obj.find(".name1:first").remove();
		var content = obj.html();
		jQuery(this).attr("data-toggle", "popover").attr("title", title.outerHtml()).removeAttr("href");
		jQuery(this).popover({
			content: content,
			html: true,
			trigger: 'manual',
			container: 'body'
		}).on(manualTrigger(jQuery(this), true, true));
	});
}

// Bootstrap popover for lifespan chart
if (WT_SCRIPT_NAME === "lifespan.php") {
	
	jQuery("#lifespan-people .itr").each(function () {
		jQuery(this).attr("data-toggle", "popover");
		var title = jQuery(this).find(".popup div:first").html();
		var content = jQuery(this).find(".popup div").not(":first").outerHtml();
		jQuery(this).find(".popup").remove();
		jQuery(this).popover({
			title: title,
			content: content,
			html: true,
			trigger: 'manual',
			placement: 'bottom',
			viewport: '#lifespan-chart'
		}).on(manualTrigger(jQuery(this), true, true));
	});
}

// Childbox popover
jQuery("#childarrow a").waitUntilExists(function () {
	content = jQuery(this).parent().find("#childbox").remove();
	jQuery(this).attr({
		"data-toggle": "popover",
		"data-class": "childbox"
	});
	jQuery(this).popover({
		content: content.html(),
		html: true,
		trigger: 'manual',
		placement: 'bottom',
		container: 'body'
	}).on(manualTrigger(jQuery(this), true, true));
});

// close popover when clicking outside (anywhere in the page);
jQuery('body').on('click', function (e) {
	if (jQuery(e.target).data('toggle') !== 'popover' && jQuery(e.target).parents('.popover.in').length === 0) {
		jQuery('[data-toggle="popover"]').popover('hide');
	}
});

// Login and new password form
jQuery("#login-form, #new_passwd_form").addClass("center").formControls();
jQuery("#login-page").each(function () {
	jQuery("#login-text center").replaceWith('<h2>' + jQuery("#login-text center").text() + '</h2>');
	jQuery(this).find("label").each(function () {
		jQuery(this).addClass("col-sm-4").after(jQuery('<div class="col-sm-4">').append(jQuery("input", this))).parent().addClass("form-group");
	});
	jQuery("#login-form .btn").parent().before("<hr>");
	jQuery("#new_passwd_form h4").before("<hr>");
});

// register form
jQuery("#register-form").formControls({
	button: "center"
});
jQuery("#register-form").each(function () {
	jQuery(this).find("label").each(function () {
		if (jQuery(this).find("textarea").length) {
			jQuery(this).addClass("col-sm-4").after(jQuery('<div class="col-sm-8">').append(jQuery("textarea", this))).parent().addClass("form-group").find("p").addClass("col-sm-8 col-sm-offset-4");
		} else {
			jQuery(this).addClass("col-sm-4").after(jQuery('<div class="col-sm-4">').append(jQuery("input", this))).parent().addClass("form-group").find("p").addClass("col-sm-8 col-sm-offset-4");
		}
	});
});

// verify form
jQuery("#verify-form").formControls({
	button: "center"
});
jQuery("#verify-form").each(function () {
	jQuery(this).find("h4").replaceWith('<h2>' + jQuery("h4", this).text() + '</h2><hr>');
	jQuery(this).find("label").each(function () {
		jQuery(this).addClass("col-sm-4").next("input").wrap('<div class="col-sm-4">').end().parent().addClass("form-group");
	});
	jQuery(this).find(".btn").parent().before("<hr>");
});

// Edit user form
jQuery("#edituser-page form").formControls();
jQuery("#edituser-page form").each(function () {
	jQuery(this).find(".label").each(function () {
		if (jQuery(this).find("label").length === 0) {
			var text = jQuery(this).text();
			jQuery(this).text("").append('<label class="control-label">' + text);
		}
		jQuery(this).addClass("form-group").removeClass("label").append(jQuery(this).next(".value").addClass("col-sm-4").removeClass("value")).append(jQuery(this).find("p").addClass("col-sm-8 col-sm-offset-4")).find("label").addClass("col-sm-4");
	});
	jQuery(this).find(".input-group").each(function () {
		jQuery(this).after(jQuery(this).find(">span").addClass("form-control-static")).find("br").remove();
	});
});

// Chart pages forms
jQuery("#ancestry-page, #branches-page, #compact-page, #descendancy-page, #familybook-page, #hourglass-page, #lifespan-page, #page-fan, #pedigree-page, #pedigreemap-page").find("form").formControls({
	layout: "inline"
});
if (WT_SCRIPT_NAME === 'relationship.php') {
	jQuery("form").formControls({
		layout: "inline"
	});
}

jQuery("#timeline_chart").prev("form").formControls({
	layout: "inline",
	cbInline: true
});
jQuery("#timeline_chart").prev("form").find("table").each(function () {
	var t = jQuery('<table class="timeline-chart table"><tbody>');
	var tr1 = new Array();
	var tr2 = new Array();
	var tr3 = new Array();
	jQuery(this).find("[class^=person]").each(function () {
		tr1.push('<td class="' + jQuery(this).attr("class") + '">' + jQuery(this).find("input[type=hidden]").outerHtml() + jQuery(this).find("i").outerHtml() + jQuery(this).find("a:first").find("br").remove().end().outerHtml() + '</td>');
		tr2.push('<td class="' + jQuery(this).attr("class") + '">' + jQuery(this).find("a .details1").parent().outerHtml() + '</td>');
		if (jQuery(this).find(">.details1").length) {
			tr3.push('<td class="' + jQuery(this).attr("class") + '"><span>' + jQuery(this).find(">.details1").text() + '</span>' + jQuery(this).find(".checkbox-inline").addClass("pull-right").outerHtml() + '</td>');
		} else {
			tr3.push('<td class="' + jQuery(this).attr("class") + '"></td>');
		}
	});
	jQuery(this).find(".list_value:first").each(function () {
		tr1.push('<td class="list_value temp-1"></td>');
		tr2.push('<td colspan="2"><span style="font-size:85%">' + jQuery(this).text() + '</span></td>');
		tr3.push('<td class="temp-2"></td>');
	});
	jQuery(this).find(".list_value:last").each(function () {
		tr1.push('<td class="list_value text-right">' + jQuery(this).find(".icon-zoomin").outerHtml() + jQuery(this).find(".icon-zoomout").outerHtml() + '</td>');
		tr3.push('<td class="text-right temp-3"></td>');
	});
	t.append("<tr>" + tr1 + "</tr><tr>" + tr2 + "</tr><tr>" + tr3 + "</tr>");
	// append objects to the newly created table to preserve events.
	t.find(".temp-1").append(jQuery(this).find(".input-group").find("input").addClass("input-sm").end()).removeClass("temp-1");
	t.find(".temp-2").append(jQuery(this).find(".list_value:first .btn").addClass("btn-xs")).removeClass('temp-2');
	t.find(".temp-3").append(jQuery(this).find(".list_value:last .btn").addClass("btn-xs")).removeClass('temp-3');
	jQuery(this).after(t).remove();
});

jQuery("#familybook-page").find("form th").each(function () {
	jQuery(this).replaceWith("<td>" + jQuery(this).text());
});
jQuery("#hourglass-page .topbottombar ").attr("rowspan", 2);

// Medialist page
jQuery("#medialist-page form").formControls();
var text = jQuery("#medialist-page form td:first").text();
jQuery("#medialist-page form td:first").text("").append('<label for="folder">' + text);

// New fact forms and Clipboard forms
jQuery("form[name=newfactform], form[name=newFromClipboard]").quickForm();

// Search forms
jQuery("form[name=searchform]").each(function(){
	jQuery(this).formControls({
		layout: "inline"
	});

	// Advanced search form
	jQuery(this).find("#field_table").each(function() {
		// we use small input field for this form
		jQuery(this).find("input, select").addClass("input-sm");

		// add a bottom border at the last row. We need to stick this one at the current last table row.
		jQuery(this).find("tr:last td").css("border-top", "1px solid #ccc");

		// advanced search form - add more fields function - fields in bootstrap layout
		// add return false to onclick attribute to prevent page jumping
		jQuery(this).find("a[onclick]").on("click", function(){
			jQuery("input, select").addClass("form-control input-sm");
			return false;
		});
		jQuery(this).find(".list_label select").waitUntilExists(function(){
			jQuery(this).on("change", function(){
				jQuery("input, select").addClass("form-control input-sm");
			});
		});
	});
});

// Reports
jQuery("#reportengine-page form").formControls({
	rbInline: true
});
jQuery("#reportengine-page form table").each(function () {
	var t = new Array();
	var text = jQuery(this).find("tr:eq(1) .optionbox").text().split("\n");
	t.push('<h2>' + jQuery(this).find("tr:eq(1) .descriptionbox").text() + ' - ' + text[0] + '<p><small>' + text[1] + '</small></p></h2><hr>');
	t.push('<h4 class="center">' + jQuery(this).find("td:first").text() + '</h4>');

	var e = new Array();
	jQuery(this).find("tr").not("tr:first, tr:eq(1), tr:last, tr:eq(-2)").each(function () {
		e.push('<div class="form-group">' + jQuery(this).find("input[type=hidden]").outerHtml() + '<label class="control-label col-sm-4">' + jQuery(this).find(".descriptionbox").text() + '</label><div class="col-sm-4">' + jQuery(this).find(".optionbox").html() + '</div></div>');
	});

	var f = jQuery('<div class="form-group text-center">');
	jQuery(this).find("tr:eq(-2) .report-type > div").each(function () {
		f.append(jQuery(this).find(".radio-inline").addClass("text-left").append(jQuery(this).find("i")).outerHtml());
	});
	e.push(f);

	jQuery(this).find("tr:last input").each(function () {
		e.push('<div class="text-center">' + jQuery(this).outerHtml() + '</div>');
	});

	jQuery(this).parent("form").before(t);
	jQuery(this).before(e);
	jQuery(this).remove();
});


// Statistics form
jQuery("#own-stats-form").waitUntilExists(function(){
	jQuery(this).formControls();
	jQuery(this).find(".radio").each(function () {
		var label = jQuery(this).next("label");
		jQuery(this).find("label").append(label.text());
		label.remove();
	});
});

// Popup forms
jQuery(".container-popup form").each(function () {
	jQuery("div[id*=_PLAC]", this).contents().unwrap();
	jQuery(this).formControls();
	jQuery(".checkbox").each(function () {
		var text = jQuery(this)[0].nextSibling.nodeValue;
		this.parentNode.removeChild(jQuery(this)[0].nextSibling);
		jQuery(this).find("label").append(text);
	});
	jQuery(".optionbox, .facts_value", this).find("br").not(".text-muted br").remove();
});

// Change blocks form
jQuery("form[name=config_setup").each(function () {
	jQuery(this).formControls({
		layout: 'inline',
		cbInline: true
	});
	jQuery(this).find(".checkbox-inline").each(function () {
		jQuery(this).append(jQuery(this).parents("td").text());
		jQuery(this).parents("td").contents().filter(function () {
			return this.nodeType === 3;
		}).remove();
	});
	jQuery(this).prev("h1").each(function () {
		jQuery(this).replaceWith("<h2>" + jQuery(this).text());
	});
	jQuery("#change_blocks").addClass("center").removeAttr("border").find("tr:first").addClass("bg-info").end().find(".topbottombar:first").addClass("text-left").removeClass("topbottombar").end().find(".topbottombar:last").addClass("text-right").removeClass("topbottombar").parent().addClass("bg-info");
});

// configure block form
jQuery('form[action^="?block_id"]').each(function () {
	jQuery(this).formControls({
		cbInline: true,
		rbInline: true
	});
	jQuery(this).find(".radio-inline").each(function(){
		jQuery(this).parents(".optionbox").append(jQuery(this).parent("label").html());
		jQuery(this).parent("label").remove();		
	});
	jQuery(this).find(".checkbox-inline").each(function(){
		jQuery(this).parents(".checkbox").append(jQuery(this).parent("label").html());
		jQuery(this).parent("label").remove();		
	});
	jQuery(this).find("table").css("margin", "auto");
	jQuery(this).find(".topbottombar").addClass("text-right").removeClass("topbottombar");
});

// Googlemap forms (control panel)
jQuery("form#editplaces").each(function () {
	var titlediv = jQuery(this).parent().find("b:first");
	titlediv.next("br").remove().end().next("br").remove();
	titlediv.replaceWith("<h4>" + titlediv.text());
	jQuery(this).prev("table").hide();
	jQuery(this).find("[for=new_pl_name]").css("font-size", "85%");
	jQuery(this).find(".radio").each(function () {
		var label = jQuery(this).next("label");
		jQuery(this).find("label").append(label.text());
		label.remove();
	});
	jQuery(this).find("#NEW_PLACE_LONG, #NEW_PLACE_LATI").each(function () {
		var pull = "pull-left";
		if (textDirection === 'rtl') {
			pull = "pull-right";
		}
		jQuery(this).parent("td").children().wrapAll('<div class="row">').end().find("input").wrap('<div class="' + pull + ' col-md-1">').end().find("select").addClass("width30");
	});
	jQuery(this).find("#NEW_ZOOM_FACTOR").css("width", "auto");
});

jQuery("form#flags").each(function () {
	jQuery(this).find(".radio").each(function () {
		var flag = jQuery(this).next("img");
		jQuery(this).find("label").append(flag);
		if (textDirection === 'rtl') {
			flag.css("padding-left", "7px");
		} else {
			flag.css("padding-right", "7px");
		}
		var text = jQuery(this)[0].nextSibling.nodeValue;
		this.parentNode.removeChild(jQuery(this)[0].nextSibling);
		jQuery(this).find("label").append(jQuery.trim(text));
	});
});

// Census assistant form
jQuery(".census-assistant form #personid").wrap("<div class=\"personid-input col-sm-4\">");

// Logout form - button style only
jQuery("form[name=logoutform] input").addClass("btn btn-xs btn-primary");

// Style buttons outside forms
jQuery("button").not(".btn-primary").addClass("btn btn-xs btn-default");

// For those who have activated the facebook module
jQuery("#facebook-login-box").waitUntilExists(function () {
	jQuery("#facebook-login-button").addClass("btn btn-default");
});