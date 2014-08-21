/*
 * webtrees: Web based Family History software
 * Copyright (C) 2014 webtrees development team.
 * Copyright (C) 2014 JustCarmen.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */
// use waitUntilExists plugin on pages with dynamic content - https://gist.github.com/md55/6565078

// Sticky footer - correction needed for pedigree page
if(jQuery("#pedigree-page").length > 0) {
	jQuery("#content").css("margin-bottom", "50px");
}

// Move link to change blocks to the footer area.
jQuery("#link_change_blocks").appendTo(jQuery("#footer .top"));

// Modal dialog boxes
function jl_modalDialog(url, title) {
	var	$dialog = jQuery('<div id="config-dialog" style="max-height:550px; overflow-y:auto"><div title="'+title+'"><div></div>')
		.load(url, function() {
                jQuery(this).dialog("option", "position", ['center', 'center'] );
         })
		.dialog({
			title: title,
			width: 'auto',
			maxWidth: 500,
			height: 'auto',
			maxHeight: 500,
			fluid: true,
			modal: true,
			resizable: false,
			autoOpen: false,
			open: function() {
				jQuery('.ui-widget-overlay').on('click', function(){
					$dialog.dialog('close');
				});
			}
		});
	
	// open the dialog box after some time. This is neccessary for the dialogbox to load in center position without page flickering.
	setTimeout(function() {
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
	var $dialog = jQuery('<div style="max-height:375px; overflow-y:auto"><div></div></div>')
			.html(content)
			.dialog({
				width: 'auto',
				maxWidth: 500,
				height: 'auto',
				maxHeight: 500,
				modal: true,
				fluid: true,
				resizable: false,
				open: function() {
					jQuery('.ui-widget-overlay').on('click', function(){
						$dialog.dialog('close');
					});
				}		
			});

	jQuery('.ui-dialog-title').html(title);
	return false;
}

jQuery(document).on("dialogopen", ".ui-dialog", function (event, ui) {	
    fluidDialog();
});

// remove window resize namespace
jQuery(document).on("dialogclose", ".ui-dialog", function (event, ui) {
    jQuery(window).off("resize.responsive");
});

jQuery(window).resize(function() {
	jQuery(".ui-dialog-content").dialog("option", "position", ['center', 'center']);
});

function fluidDialog() {
    var $visible = jQuery(".ui-dialog:visible");
    $visible.each(function () {
        var $this = jQuery(this);
		if ($this.find('textarea.html-edit').length > 0) {
			$this.dialog( "option", "maxWidth", 700 );
			$this.dialog( "option", "maxHeight", 550 );
		}
        var dialog = $this.find(".ui-dialog-content");
		var maxWidth = dialog.dialog("option", "maxWidth");
		var width = dialog.dialog("option", "width");
		var fluid = dialog.dialog("option", "fluid");
        // if fluid option == true
        if (maxWidth && width) {
            // fix maxWidth bug
            $this.css("max-width", maxWidth);
            //reposition dialog
            dialog.dialog("option", "position", ['center', 'center']);
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
              dialog.dialog("option", "position", ['center', 'center']);
            });
        }
    });
}

function jl_dialogBox() {
	jQuery('[onclick^="modalDialog"], [onclick^="return modalDialog"]').each(function(){
		jQuery(this).attr('onclick',function(index,attr){
			return attr.replace('modalDialog', 'jl_modalDialog');
		});
	});

	jQuery('[onclick^="helpDialog"]').each(function(){
		jQuery(this).attr('onclick',function(index,attr){
			return attr.replace('helpDialog', 'jl_helpDialog');
		});
	});
}


jl_dialogBox();
jQuery(document).ajaxComplete(function() {
	jl_dialogBox();
});

// Styling of the individual page
if(WT_SCRIPT_NAME === "individual.php") {
	// Remove personboxNN class from header layout
	jQuery("#indi_header H3").removeClass("person_boxNN");
	
	// relatives tab
	jQuery("#relatives_content").waitUntilExists(function() {
		jQuery(this).find(".subheaders").parents("table").css("margin-top", "15px");
	});
}

// Hide sidebar by default on smaller screens
if (jQuery(window).width() < 767) {
	jQuery.cookie("hide-sb", true);
}

jQuery(window).resize(function() {
	if (jQuery(window).width() >= 767 && jQuery.cookie ("hide-sb") === "false") {
		jQuery("#sidebar").show ();
		jQuery("#separator").addClass("separator-visible");		
	}
	else {
		jQuery("#sidebar").hide();
		jQuery("#separator").addClass("separator-hidden");
	}
});

// Styling of the family page
if(WT_SCRIPT_NAME === "family.php") {
	// consistent styling (like indi page)
	jQuery(".facts_table").addClass("ui-widget-content");
	
	// add some classes to style particular elements
	jQuery("#family-table td:first").addClass("left-table").next("td").addClass("right-table");
	jQuery('.right-table > table tr:eq(1)').addClass("parents-table");
}

// journal-box correction - remove br's from content. Adjust layout to the news-box layout.
jQuery(".user_blog_block > br, .journal_box > br").remove();
jQuery(".journal_box > a[onclick*=editnews]").before('<hr>');

// media list - don't list filenames
if(jQuery(".media-list").length > 0) {
	jQuery(".list_item.name2").each(function(){
		jQuery(this).next("br").remove();
		jQuery(this).next("a").remove();
	});
}

// personboxes
function jl_expandbox(boxid, bstyle) {
	var getBox = function () {
		var result = jQuery.Deferred();

		expandbox(boxid, bstyle);
		jQuery('div[id="inout-'+boxid+'"]').each(function(){
			if (jQuery(this).html().indexOf("LOADING")>0) {
				jQuery(this).hide();
			}
		});

		setTimeout(function () {
			result.resolve();
		}, 500);

		return result;
	},
	modifyBox = function () {
		jQuery('div[id="inout-'+boxid+'"]').each(function(){
			var obj = jQuery(this);
			obj.find(".field").contents().filter(function(){
				return (this.nodeType === 3);
			}).remove();
			obj.find(".field span").filter(function(){
				return jQuery(this).text().trim().length === 0;
			}).remove();
			obj.find("div[class^=fact_]").each(function(){
				var div = jQuery(this);
				div.find(".field").each(function(){
					if(jQuery.trim(jQuery(this).text()) === '') {
						div.remove();
					}
				});
			});
			obj.show();
		});
	};

	jQuery('div[id="inout-'+boxid+'"]').each(function(){
		if (jQuery(this).html().indexOf("LOADING")>0) {
			getBox().done(modifyBox);
		} else {
			getBox();
		}
	});
}

//Remove labels with empty fields from the personboxes.
jQuery('div[class^=fact_]').each(function(){
	obj = jQuery(this);
	obj.find('span.field').each(function(){
		if(jQuery.trim(jQuery(this).text()) === '') {
			obj.remove();
		}
	});
});

// replace the default function with our own to customize the zoomed personbox view
jQuery('[onclick^="expandbox"]').each(function(){
	jQuery(this).attr('onclick',function(index,attr){
		return attr.replace('expandbox', 'jl_expandbox');
	});
});

// census assistant module
// replace delete button with our own
jQuery(".census-assistant button").waitUntilExists(function(){
	jQuery(this).parent("td").html("<i class=\"deleteicon\">");
});

jQuery(".deleteicon").waitUntilExists(function() {
	jQuery(this).on("click", function() {
		jQuery(this).parents("tr").remove();
	});
});	

// use same style for submenu flyout as in the individual sidebar
jQuery(".census-assistant").waitUntilExists(function() {
	jQuery(this)
			.find(".ltrnav").removeClass().addClass("submenu flyout")
			.find(".name2").removeAttr("style");
});