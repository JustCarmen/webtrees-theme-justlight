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

/* global WT_SCRIPT_NAME */

// responsive page
var $responsive = jQuery("#responsive").is(":visible");
jQuery(window).resize(function () {
	$responsive = jQuery("#responsive").is(":visible");
});

// Modal dialog boxes
function jl_modalDialog(url, title) {
	var $dialog = jQuery('<div id="config-dialog" style="max-height:550px; overflow-y:auto"><div title="' + title + '"><div></div>').load(url).dialog({
		title: title,
		width: 'auto',
		maxWidth: 700,
		height: 'auto',
		maxHeight: 500,
		fluid: true,
		modal: true,
		resizable: false,
		autoOpen: false,
		open: function () {
			jQuery('.ui-widget-overlay').on('click', function () {
				$dialog.dialog('close');
			});
		}
	});

	// open the dialog box after some time. This is neccessary for the dialogbox to load in center position without page flickering.
	setTimeout(function () {
		$dialog.dialog('open');
	}, 500);
	return false;
}

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

jQuery('[onclick*="modalDialog"], [onclick^="helpDialog"]').waitUntilExists(function () {
	jQuery(this).attr('onclick', function (index, attr) {
		return attr.replace('modalDialog', 'jl_modalDialog');
	});

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
jQuery("body").on("click", "a[href^='#']", scroll_if_anchor);

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
	// Remove personboxNN class from header layout
	jQuery("#indi_header H3").removeClass("person_boxNN");

	// When in responsive state hide the indi_left part when sidebar is open.
	var responsiveSidebar = false;

	// Hide sidebar by default on smaller screens
	if ($responsive) {
		jQuery.cookie("hide-sb", true);
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
