/*
 * webtrees: online genealogy
 * Copyright (C) 2015 webtrees development team
 * Copyright (C) 2015 JustCarmen
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

/* global WT_SCRIPT_NAME */

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
jQuery(".dropdown-menu > li > a.dropdown-submenu-toggle").on("click", function (e) {
	e.preventDefault();
	var current = jQuery(this).next();
	var grandparent = jQuery(this).parent().parent();
	grandparent.find(".sub-menu:visible").not(current).hide();
	current.toggle();
	e.stopPropagation();
});
jQuery(".dropdown-menu > li > a:not(.dropdown-submenu-toggle)").on("click", function () {
	var root = jQuery(this).closest('.dropdown');
	root.find('.sub-menu:visible').hide();
});

// Bootstrap active tab in navbar
var url_parts = location.href.split('/');
var last_segment = url_parts[url_parts.length - 1];
jQuery('.nav-pills a[href="' + last_segment + '"]').parents('li').addClass('active');

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
	if (jQuery(this).hasClass("table-census-assistant")) {
		jQuery(this).addClass("table table-condensed table-striped width100");
		jQuery(this).find("tbody tr:first td:first").attr("colspan", jQuery(this).find("th").length);
	} else if (jQuery(this).is("#mycart")) {
		jQuery(this).addClass("table table-striped");
	} else if (jQuery(this).parents().hasClass("user_messages_block")) {
		jQuery(this).addClass("table table-striped");
	} else {
		var table = jQuery(this).not("#accordion table, table.tv_tree, [id*=chart] table, [id*=booklet] table, #place-hierarchy > table, #place-hierarchy > table table, #family-page table, #branches-page table, .gedcom_block_block table, .user_welcome_block table, .cens_search table, .cens_data table");
		table.addClass("table");
		jQuery(this).parents(".gedcom_stats_block > table").addClass("table-striped");
	}
	jQuery(this).show();
});

jQuery(".markdown").waitUntilExists(function () {
	jQuery(this).find("table").each(function () {
		jQuery(this).addClass("table table-condensed table-striped width100");
		var colspan = jQuery(this).find("th").length;
		jQuery(this).find("tbody").prepend("<tr><td colspan=\"" + colspan + "\">");
	});

});

jQuery("#sb_content_family_nav").each(function () {
	jQuery(this).find("table").addClass("table-striped");
	jQuery(this).find("td").removeClass("person_box person_boxF person_boxNN center");
});

// table correction. This particular table has no reference point.
if (WT_SCRIPT_NAME === 'relationship.php') {
	jQuery("table").not("form table").removeClass("table");
}

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
	var title = jQuery(this).parents(".person_box_template").find(".chart_textbox .NAME").parents("a").clone().wrap('<p>').parent().html();
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
		var obj = jQuery("#fan_chart > div[id=" + id[1] + "]");
		obj.find(".person_box").addClass("fan-chart-list");
		var title = obj.find(".name1:first").remove();
		var content = obj.html();
		jQuery(this).attr("data-toggle", "popover").attr("title", title.clone().wrap('<p>').parent().html()).removeAttr("href");
		jQuery(this).popover({
			content: content,
			html: true,
			trigger: 'manual',
			container: 'body'
		}).on(manualTrigger(jQuery(this), true, false));
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

// add bootstrap buttons
jQuery("#edit_interface-page .save, #edit_interface-page .cancel").addClass("btn btn-default btn-sm");
jQuery("#find-page button").addClass("btn btn-default btn-xs");
jQuery("input[type=submit], input[type=button]").addClass("btn btn-primary");
jQuery("#personal_facts_content").waitUntilExists(function () {
	jQuery("input[type=button]").addClass("btn btn-primary btn-sm").css("visibility", "visible");
});

// Login, Register, Verify form in bootstrap layout
jQuery("#login-form, #register-form, #verify-form").each(function () {
	jQuery(this).addClass("form-horizontal");
	jQuery("div", this).each(function () {
		jQuery(this).addClass("form-group");
	});
	jQuery("input, textarea", "#register-form").not(":hidden, :submit").each(function () {
		jQuery(this).parent("label").addClass("control-label col-sm-3").after(jQuery(this));
		jQuery(this).addClass("form-control input-sm").wrap('<div class="col-sm-6">');
	});
	jQuery("input, textarea", "#login-form").not(":hidden, :submit").each(function () {
		jQuery(this).parent("label").addClass("control-label col-sm-4").after(jQuery(this));
	});
	jQuery("input, textarea", "#login-form, #verify-form").not(":hidden, :submit").each(function () {
		jQuery(this).addClass("form-control input-sm").wrap('<div class="col-sm-4">');
	});
	jQuery("#verify-form label").each(function () {
		jQuery(this).addClass("control-label col-sm-4");
	});
	jQuery(".form-group").each(function () {
		jQuery(this).children("div").append(jQuery("p", this));
		jQuery(this).has("a, input[type=submit]").css("text-align", "center");
	});
});
jQuery("#login-text").each(function () {
	jQuery("center", this).replaceWith("<h2>" + jQuery("center b", this).text() + "</h2><hr>");
	jQuery("br:eq(0), br:eq(1)", this).remove();
});
jQuery("#verify-form h4").after("<hr>");
jQuery("#login-box .form-group .btn").parent().before("<hr>");
jQuery("#verify-form .form-group:last").before("<hr>");

// New password form
jQuery("#new_passwd_form").each(function () {
	jQuery(this).addClass("form-horizontal");
	jQuery("div", this).each(function () {
		jQuery(this).addClass("form-group");
		jQuery("label", this).addClass("control-label col-sm-4").after(jQuery("#new_passwd_username"));
	});
	jQuery("#new_passwd_username", this).addClass("form-control input-sm").wrap('<div class="col-sm-4">');
	jQuery(".form-group:last, h4", this).before("<hr>");
	jQuery("h4", this).after("<hr>");
	jQuery(".form-group", this).has("a, input[type=submit]").css("text-align", "center");
});

// Edit user form in bootstrap layout
jQuery("#edituser-page form").addClass("form-horizontal");
jQuery("#edituser-table").each(function () {
	jQuery(".label", this).each(function () {
		jQuery(this).addClass("form-group").removeClass('label');
		jQuery(this).append(jQuery(this).next(".value").html());
		jQuery(this).next(".value").remove();
		jQuery("label", this).addClass("control-label col-sm-3");
		jQuery("input, select", this).addClass("form-control input-sm").wrap('<div class="col-sm-6">');

		if (jQuery("span", this).length > 0) {
			jQuery(this).addClass("form-group-static");
		}
	});

	jQuery(".form-group").each(function () {
		jQuery(this).children("div").append(jQuery("p, .icon-button_indi", this));
	});

	jQuery("#form_rootid").parent().find("input, .icon-button_indi").wrapAll('<div class="input-group">');
	jQuery(".icon-button_indi").addClass("input-group-addon");

	jQuery(".form-group-static").each(function () {
		var label = jQuery(this).clone().children().remove().end().text();
		jQuery(">span", this).addClass("form-control-static");
		jQuery(this).children().wrapAll('<div class="col-sm-6 static">');
		var content = jQuery(".static", this);
		jQuery(this).html('<label class="control-label col-sm-3">' + label + "</div>").append(content);
	});

	jQuery("input[name=form_visible_online]").removeAttr("class").wrap('<div class="checkbox"><label>');
});

// Selectboxes on the indi page, source page etc.
jQuery("form[name=newfactform]").waitUntilExists(function () {
	jQuery(this).addClass("form-inline");
	jQuery("select", this).addClass("form-control input-sm");
});

// Popup forms
jQuery(".container-popup").waitUntilExists(function () {
	jQuery("form", this).addClass("form-horizontal");
	jQuery("input[type=text], #NAME[type=hidden], textarea, select", this).addClass("form-control input-sm");
	jQuery("input[type=checkbox]", this).wrap("<label>");
	jQuery("label", this).each(function () {
		var text = jQuery(this)[0].nextSibling.nodeValue;
		this.parentNode.removeChild(jQuery(this)[0].nextSibling);
		jQuery(this).append(text).wrap('<div class="checkbox">');
	});
	jQuery("div[id*=_PLAC]", this).contents().unwrap();
	jQuery(".optionbox, .facts_value", this).not("tr[id^=SOUR] .optionbox").each(function () {
		if (jQuery(this).children('[class^="icon-"]').not(".icon-help").length) {
			jQuery('[class^="icon-"]', this).addClass("input-group-addon");
			jQuery(this).children().not("div[id$=_description], a[onclick*=addnewnote_assisted], p").wrapAll('<div class="input-group">');
		};
	});
	jQuery("tr[id^=SOUR] .optionbox", this).each(function () {
		jQuery(".icon-button_source, .icon-button_addsource, .icon-button_keyboard", this).addClass("input-group-addon");
		jQuery(this).children(".SOUR, .TITL, .icon-button_source, .icon-button_addsource, .icon-button_keyboard").wrapAll('<div class="input-group">');
		jQuery(".checkbox", this).wrapAll('<div class="sour-checkboxes">');
	});
	jQuery(".optionbox, .facts_value", this).find("br").not(".text-muted br").remove();
	if (jQuery("form .btn", "#find-page").parent("p").length === 0) {
		jQuery("form .btn", "#find-page").wrap("<p>");
	}
	jQuery(".find-media-media", this).each(function () {
		jQuery(this).children().not(".find-media-thumb").wrapAll('<div class="find-media-desc">');
	});
});

// For those who have activated the facebook module
jQuery("#facebook-login-box").waitUntilExists(function () {
	jQuery("#facebook-login-button").addClass("btn btn-default");
});