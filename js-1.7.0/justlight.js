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
 *
 * use waitUntilExists plugin on pages with dynamic content - https://gist.github.com/md55/6565078
 */

/* General functions (fired on every page */

/* global WT_SCRIPT_NAME, TEXT_PREV, TEXT_NEXT */

// general functions
jQuery.fn.outerHtml = function () {
	return jQuery(this).clone().wrap('<p>').parent().html();
};

// form controls
jQuery.fn.formControls = function (options) {
	var defaults = {
		layout: 'horizontal',
		control: 'form',
		cbInline: false,
		rbInline: false,
		button: ''
	};
	var opt = jQuery.extend(defaults, options);

	this.each(function () {
		// for inline checkboxes placed outside forms
		if (opt.control === 'checkbox') {
			var text = jQuery(this).next("label").text();
			jQuery(this).next("label").remove();
			jQuery(this).wrap('<label class="checkbox-inline">').after(text);
		} else {
			form = jQuery(this);
			form.addClass("form-" + opt.layout);
			form.find("input[id=NAME], input[type=text], input[type=password], input[type=email], select, textarea").addClass("form-control");
			form.find("label").not("input[type=radio]").parent("label").addClass("control-label");
			form.find("input[type=checkbox]").each(function () {
				if (opt.cbInline) {
					jQuery(this).formControls({
						control: "checkbox"
					});
				} else {
					jQuery(this).wrap('<div class="checkbox"><label>');
				}
			});
			form.find("input[type=radio]").each(function () {
				if (opt.rbInline) {
					jQuery(this).wrap('<label class="radio-inline">');
				} else {
					jQuery(this).wrap('<div class="radio"><label>');
				}
			});
			form.find("span[id=NAME_display]").each(function () {
				jQuery(this).replaceWith('<input id="NAME_display" type="text" class="form-control" value="' + jQuery(this).text() + '" dir="auto" disabled>')
			});
			form.find("button, input[type=submit], input[type=button], input[type=reset]").addClass("btn btn-primary").parent().addClass(opt.button);
			form.find("[class^=icon-]").each(function () {
				if (jQuery(this).prev().is("input[id=NAME_display]")) {
					jQuery(this).addClass("input-group-addon").parent().prepend(jQuery('<div class="input-group">').append(jQuery(this).siblings("input[id=NAME_display], input[type=hidden]")).append(jQuery(this)));
				} else if (jQuery(this).prev().is("input")) {
					jQuery(this).addClass("input-group-addon").parent().prepend(jQuery('<div class="input-group">').append(jQuery(this).parent().find("input[type=text]")).append(jQuery(this)));
				} else if (jQuery(this).prev().is(".input-group")) {
					jQuery(this).addClass("input-group-addon").prev(".input-group").append(jQuery(this));
				} else if (jQuery(this).siblings("textarea").length) {
					jQuery(this).addClass("input-group-addon").parent().prepend(jQuery('<div class="input-group">').append(jQuery(this).siblings("textarea")).append(jQuery(this)));
				} else {
					return;
				}
			});
		}
	});
};

function qstring(key, url) {
	'use strict';
	var KeysValues, KeyValue, i;
	if (url === null || url === undefined) {
		url = window.location.href;
	}
	KeysValues = url.split(/[\?&]+/);
	for (i = 0; i < KeysValues.length; i++) {
		KeyValue = KeysValues[i].split("=");
		if (KeyValue[0] === key) {
			return KeyValue[1];
		}
	}
}

// responsive page
var $responsive = jQuery("#responsive").is(":visible");
jQuery(window).resize(function () {
	$responsive = jQuery("#responsive").is(":visible");
});

// Modal dialog boxes
function jl_helpDialog(topic, module) {
	jQuery.getJSON('help_text.php?help=' + topic + '&mod=' + module, function (json) {
		jl_modalHelp(json.content, json.title);
	});
}

function jl_modalHelp(content, title) {
	var $dialog = jQuery('<div style="max-height:375px; overflow-y:auto"><div></div></div>').html(content).dialog({
		width: 'auto',
		maxWidth: 500,
		height: 'auto',
		maxHeight: 500,
		modal: true,
		fluid: true,
		resizable: false,
		open: function () {
			jQuery('.ui-widget-overlay').on('click', function () {
				$dialog.dialog('close');
			});
		}
	});

	jQuery('.ui-dialog-title').html(title);
	return false;
}

jQuery(document).on("dialogopen", ".ui-dialog", function () {
	fluidDialog();
});

// remove window resize namespace
jQuery(document).on("dialogclose", ".ui-dialog", function () {
	jQuery(window).off("resize.responsive");
});

jQuery(window).resize(function () {
	jQuery(".ui-dialog-content").dialog("option", "position", {
		my: "center",
		at: "center",
		of: window
	});
});

function fluidDialog() {
	var $visible = jQuery(".ui-dialog:visible");
	$visible.each(function () {
		var $this = jQuery(this);
		var dialog = $this.find(".ui-dialog-content");
		var maxWidth = dialog.dialog("option", "maxWidth");
		var width = dialog.dialog("option", "width");
		var fluid = dialog.dialog("option", "fluid");
		// if fluid option == true
		if (maxWidth && width) {
			// fix maxWidth bug
			$this.css("max-width", maxWidth);
			//reposition dialog
			dialog.dialog("option", "position", {
				my: "center",
				at: "center",
				of: window
			});
		}

		if (fluid) {
			// namespace window resize
			jQuery(window).on("resize.responsive", function () {
				var wWidth = jQuery(window).width();
				// check window width against dialog width
				if (wWidth < maxWidth + 50) {
					// keep dialog from filling entire screen
					$this.css("width", "90%");

				}
				//reposition dialog
				dialog.dialog("option", "position", {
					my: "center",
					at: "center",
					of: window
				});
			});
		}
	});
}

jQuery('[onclick^="helpDialog"]').waitUntilExists(function () {
	jQuery(this).attr('onclick', function (index, attr) {
		return attr.replace('helpDialog', 'jl_helpDialog');
	});
});

// personboxes
function personbox_default() {
	var obj = jQuery(".person_box_template .inout, .person_box_template .inout2");
	modifybox(obj);
}

function modifybox(obj) {
	obj.find(".field").contents().filter(function () {
		return (this.nodeType === 3);
	}).remove();
	obj.find(".field span").filter(function () {
		return jQuery(this).text().trim().length === 0;
	}).remove();
	obj.find("div[class^=fact_]").each(function () {
		var div = jQuery(this);
		div.find(".field").each(function () {
			if (jQuery.trim(jQuery(this).text()) === '') {
				div.remove();
			}
		});
	});
}

personbox_default();
jQuery(document).ajaxComplete(function () {
	setTimeout(function () {
		personbox_default();
	}, 10);
});

/**
 * This theme uses a fixed header.
 * This code prevents a target from disappearing behind the header if activated by an anchor.
 * Check any href for an anchor. If exists, and in document, scroll to it.
 * If href argument omitted, assumes context (this) is HTML Element,
 * which will be the case when invoked by jQuery after an event
 *
 * @param href string
 */

function scroll_if_anchor(href) {
	href = typeof (href) === "string" ? href : jQuery(this).attr("href");

	// If href missing, ignore
	if (!href) return;

	// get the height of the header including borders, padding and margin.
	var fromTop = jQuery("header").outerHeight(true) + 20;
	var $target = jQuery(href);

	if ($target.length) {
		jQuery('html, body').animate({
			scrollTop: $target.offset().top - fromTop
		});
		if (history && "pushState" in history) {
			history.pushState({}, document.title, window.location.pathname + window.location.search + href);
			return false;
		}
	}
}

// When our page loads, check to see if it contains an anchor
scroll_if_anchor(window.location.hash);

// Intercept all anchor clicks
jQuery("body").on("click", "a[href^='#']", function () {
	scroll_if_anchor(jQuery(this).attr("href"));
});

/* page specific functions */

if (WT_SCRIPT_NAME === "index.php") {
	// journal-box correction - remove br's from content. Adjust layout to the news-box layout.
	jQuery(".user_blog_block > br, .journal_box > br").remove();
	jQuery(".journal_box > a[onclick*=editnews]").before('<hr>');

	// statistics block correction - replace br tag to show all data in one line
	jQuery(".gedcom_stats_block").waitUntilExists(function () {
		jQuery(".stat-table1 .stats_value br", this).replaceWith(" - ");
		jQuery(".stat-table2 .list_item", this).each(function () {
			jQuery("br:first", this).replaceWith(": ");
			jQuery("br", this).replaceWith(" • ");
		});
	});
}

// Styling of the individual page
if (WT_SCRIPT_NAME === "individual.php") {
	// restyle the header area -> responsive
	updateHeader();

	// When in responsive state hide the indi_left part when sidebar is open.
	var responsiveSidebar = false;

	// Hide sidebar by default on smaller screens
	if ($responsive) {
		jQuery.cookie("hide-sb", true);
		jQuery("#sidebar").hide();
		responsiveSidebar = true;
	}

	jQuery(window).resize(function () {
		jQuery("#indi_left").show();
		if ($responsive) {
			responsiveSidebar = true;
		} else {
			responsiveSidebar = false;
		}

		if ($responsive || jQuery.cookie("hide-sb") === "true") {
			jQuery("#sidebar").hide();
		} else {
			jQuery("#sidebar").show();
		}
	});

	// extend webtrees click function
	jQuery("#main").on("click", "#separator", function () {
		if (responsiveSidebar) {
			jQuery("#indi_left").toggle();
		}
	});

	// responsive tabs
	updateUI();
}

function updateHeader() {
	// keep the jQuery-ui layout here
	jQuery("#header_accordion1").each(function () {
		jQuery(this).find(".name_one").each(function () {
			var l = jQuery('<div class="pull-left">');
			l.append(jQuery(this).find(".ui-icon").outerHtml());
			l.append(jQuery(this).find(".NAME").outerHtml());
			var r = jQuery('<div class="pull-right">');
			r.append(jQuery(this).find("#dates").outerHtml());
			r.find("#dates").prepend(jQuery(this).find("#sex").outerHtml());
			r.append(jQuery(this).find(".header_age").outerHtml());
			jQuery(this).html("").append(l).append(r);

		})
	})
}

function updateUI() {
	tabsToAccordions();

	jQuery('.panel').on('shown.bs.collapse', function () {
		openPanel(jQuery(this));
	});

	jQuery('.panel').on('hidden.bs.collapse', function () {
		jQuery(this).addClass("panel-default").removeClass("panel-primary");
		jQuery(".panel-prev").after(jQuery(this)).removeClass("panel-prev");
		jQuery(".panel-next").removeClass("panel-next");
	});
}

// changes tabs to accordion (jQuery UI tabs to Bootstrap accordion)
// inspired by http://www.markadrake.com/blog/2013/09/06/responsive-design-turning-tabs-into-accordions-and-back-again/
function tabsToAccordions() {
	jQuery("#tabs").each(function () {
		var e = jQuery('<div id="accordion" class="panel-group">');
		var t = new Array;
		jQuery(this).find(">ul>li").each(function (index) {
			jQuery("a", this).attr({
				"data-toggle": "collapse",
				"data-parent": "#accordion",
				"data-target": "#collapse" + index,
				"data-source": jQuery("a", this).attr("href"),
				"href": "#"
			}).removeAttr("id class");
			t.push('<div class="panel-heading"><h4 class="panel-title">' + jQuery(this).html() + '</h4></div>');
		});
		var n = new Array;
		jQuery(this).find(">div").each(function (index) {
			if (index == jQuery.cookie("indi-tab")) {
				n.push('<div id="collapse' + index + '" class="panel-collapse collapse in"><div class="panel-body">' + jQuery(this).html() + '</div></div>');
			} else {
				n.push('<div id="collapse' + index + '" class="panel-collapse collapse"><div class="panel-body">' + jQuery(this).html() + '</div></div>');
			}
		});
		for (var r = 0; r < t.length; r++) {
			if (r == jQuery.cookie("indi-tab")) {
				e.append('<div class="panel panel-primary">' + t[r] + n[r] + '</div>');
			} else {
				e.append('<div class="panel panel-default">' + t[r] + n[r] + '</div>');
			}
		}

		jQuery(this).before(e).remove();
		accordionControls();

		if (document.cookie.indexOf("indi-tab") < 0) {
			openPanel(jQuery("#collapse0", e).addClass("in").parent());
		} else {
			openPanel(jQuery(".in", e).parent());
		}
	});
}

function accordionControls() {
	jQuery("#accordion").before('<div id="controls row"><div id="prev" class="pull-left"><i class="fa fa-hand-o-left"></i> <a href="#">' + TEXT_PREV + '</a></div><div id="next" class="pull-right"><a href="#">' + TEXT_NEXT + '</a> <i href="#" class="fa fa-hand-o-right"></i></div></div><div class="clearfix"></div>');

	jQuery("#main").on("click", "#prev", function (e) {
		e.preventDefault();
		jQuery(".in").collapse("hide");
		if (!jQuery(".panel-prev").length && !jQuery(".panel-next").length) {
			jQuery(".panel:first .panel-collapse").collapse("show");
		} else if (jQuery(".panel-prev").length) {
			jQuery(".panel-prev .panel-collapse").collapse("show");
		} else {
			jQuery(".panel:last .panel-collapse").collapse("show");
		}
	});

	jQuery("#main").on("click", "#next", function (e) {
		e.preventDefault();
		jQuery(".in").collapse("hide");
		if (!jQuery(".panel-prev").length && !jQuery(".panel-next").length) {
			jQuery(".panel:first .panel-collapse").collapse("show");
		} else if (jQuery(".panel-next").length) {
			jQuery(".panel-next .panel-collapse").collapse("show");
		} else {
			jQuery(".panel:eq(1) .panel-collapse").collapse("show");
		}
	});
}

function openPanel(panel) {
	var source = jQuery(".panel-heading a", panel).data("source");
	var target = jQuery(".panel-body", panel);
	if (target.html().length === 0 || target.find(".loading-image").length) {
		target.load(source, function () {
			styleForms(target);
		});
	}

	jQuery.cookie("indi-tab", jQuery(".panel-heading a", panel).data("target").replace("#collapse", ""));
	panel.addClass("panel-primary").removeClass("panel-default");
	panel.prev(".panel").addClass("panel-prev");
	panel.next(".panel").addClass("panel-next");
	panel.parent().prepend(panel);
}

// Styling the forms
function styleForms(obj) {
	obj.find("form").formControls({
		layout: "inline",
		cbInline: true
	});
	obj.find("input[type=checkbox]").not("form input[type=checkbox]").formControls({
		control: "checkbox"
	});
	obj.find("[name=newfactform]").each(function(){
		jQuery(this).children().not(".quickfacts").wrapAll('<div class="form-group">');
		jQuery(this).find(".quickfacts").wrap('<div class="form-group quickfacts-form-group">');
		jQuery(this).find("select").addClass("input-sm");
		jQuery(this).find(".btn").addClass("btn-sm");
	});
}

// Styling of the family page
if (WT_SCRIPT_NAME === "family.php") {
	// consistent styling (like indi page)
	jQuery(".facts_table").addClass("ui-widget-content");

	// add some classes to style particular elements
	jQuery("#family-table td:first").addClass("left-table").next("td").addClass("right-table");
	jQuery('.right-table > table tr:eq(1)').addClass("parents-table");
}

// Collapse notes by default on the medialist page
if (WT_SCRIPT_NAME === "medialist.php") {
	jQuery(".fact_NOTE, .fact_SHARED_NOTE").each(function () {
		if (jQuery(".icon-plus", this).length === 0) {
			if (jQuery(this).hasClass("fact_SHARED_NOTE")) {
				jQuery(this).removeClass().addClass("fact_NOTE");
			}
			jQuery(".field", this).uniqueId().removeAttr("dir").removeClass("field").addClass("note-details").hide();
			var uniqueId = jQuery(".note-details", this).attr("id");
			var title = jQuery(".note-details", this).text().split("\n")[0];
			if (title.length > 100) {
				title = title.substr(0, 100) + "…";
			}
			jQuery(".label", this).prepend('<a onclick="expand_layer(\'' + uniqueId + '\'); return false;" href="#"><i class="icon-plus" id="' + uniqueId + '_img"></i></a> ').after('<span id="' + uniqueId + '-alt"> ' + title + '</span>');
		}
	});
	jQuery("#medialist-page .list_table").show();
}

// mediatab on sources and notes list - don't list filenames
if (jQuery(".media-list").length > 0) {
	jQuery(".list_item.name2").each(function () {
		jQuery(this).next("br").remove();
		jQuery(this).next("a").remove();
	});
}

if (WT_SCRIPT_NAME === "edit_interface.php") {
	// census assistant module
	// replace delete button with our own
	jQuery(".census-assistant button").waitUntilExists(function () {
		jQuery(this).parent("td").html("<i class=\"deleteicon\">");
	});

	jQuery(".deleteicon").waitUntilExists(function () {
		jQuery(this).on("click", function () {
			jQuery(this).parents("tr").remove();
		});
	});

	// use same style for submenu flyout as in the individual sidebar
	jQuery(".census-assistant").waitUntilExists(function () {
		jQuery(this).find(".ltrnav").removeClass().addClass("submenu flyout").find(".name2").removeAttr("style");
	});
}