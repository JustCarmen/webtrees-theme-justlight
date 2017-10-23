/*!
 * webtrees: online genealogy
 * Copyright (C) 2017 JustCarmen (http://www.justcarmen.nl)
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
;
(function($, window) {

  var intervals = {};
  var removeListener = function(selector) {

    if (intervals[selector]) {

      window.clearInterval(intervals[selector]);
      intervals[selector] = null;
    }
  };
  var found = 'waitUntilExists.found';

  /**
   * @function
   * @property {object} jQuery plugin which runs handler function once specified
   *           element is inserted into the DOM
   * @param {selector|string} selector
   * @param {function|string} handler
   *            A function to execute at the time when the element is inserted or
   *            string "remove" to remove the listener from the given selector
   * @param {bool} shouldRunHandlerOnce
   *            Optional: if true, handler is unbound after its first invocation
   * @example jQuery(parent-selector).waitUntilExists(selector, function);
   */

  $.fn.waitUntilExists = function(selector, handler, shouldRunHandlerOnce, isChild) {

    var $this = $(selector);
    var $elements = $this.not(function() {
      return $(this).data(found);
    });

    if (handler === 'remove') {

      // Hijack and remove interval immediately if the code requests
      removeListener(selector);
    } else {

      // Run the handler on all found elements and mark as found
      $elements.each(handler).data(found, true);

      if (shouldRunHandlerOnce && $this.length) {

        // Element was found, implying the handler already ran for all
        // matched elements
        removeListener(selector);
      } else if (!isChild) {

        // If this is a recurring search or if the target has not yet been
        // found, create an interval to continue searching for the target
        intervals[selector] = window.setInterval(function() {

          $this.waitUntilExists(selector, handler, shouldRunHandlerOnce, true);
        }, 500);
      }
    }

    return $this;
  };

}(jQuery, window));

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

jQuery.fn.outerHtml = function() {
  return jQuery(this).clone().wrap('<p>').parent().html();
};

function strip_tags(str) {
    str = str.toString();
    return str.replace(/<\/?[^>]+>/gi, '').trim();
}

/* Put here scripts to override webtrees behavior which doesn't fit in any of the other categories */

// Prevent jumping to the top of the page when clicking on a javascript link
if ($('a[onclick]').attr('href') === '#') {
  $('a[onclick]').attr('href', 'javascript:void(0)');
}



// Tweak the datatables made by webtrees
// target = column number - 1

var dtDom =
    "<'row mt-1 mb-lg-1'<'col-md-6 float-none'l><'col-md-6 float-sm-none float-md-right'f>>" +
    "<'row'<'col-6 d-none d-lg-block'i><'col-6 d-none d-lg-block'p>>" +
    "<'row'<'col-sm-12'tr>>" +
    "<'row'<'col-md-6 float-none'i><'col-md-6 float-sm-none float-md-right'p>>";

// Repository table
if ($('.table-repository').length) {
  var table = $('.table-repository').DataTable({
    sDom: dtDom,
    columnDefs: [
      {width: "5%", targets: 1},
      {width: "15%", targets: 2},
      {className: "jc-last-change", targets: 2}
    ],
    autoWidth: false
  });

  table.column(2, {order: 'index'}).data().each(function(value, index) {
    var date = value.split("-");
    var cell = table.cell(index, 2);
    cell.data($.trim(date[0]));
  });
  table.columns.adjust().draw();
}

// Source table
if ($('.table-source').length) {
  var table = $('.table-source').DataTable({
    sDom: dtDom,
    columnDefs: [
      {width: "15%", targets: 1},
      {width: "5%", targets: [2, 3, 4, 5]},
      {width: "15%", targets: 6},
      {className: "jc-last-change", targets: 6}
    ],
    autoWidth: false
  });

  table.column(6, {order: 'index'}).data().each(function(value, index) {
    var date = value.split("-");
    var cell = table.cell(index, 6);
    cell.data($.trim(date[0]));
  });
  table.columns.adjust().draw();
}

// Shared notes table
if ($('.table-note').length) {
  var table = $('.table-note').DataTable({
    sDom: dtDom,
    columnDefs: [
      {width: "5%", targets: [1, 2, 3, 4]},
      {width: "15%", targets: 5},
      {className: "jc-last-change", targets: 5}
    ],
    autoWidth: false
  });

  table.column(5, {order: 'index'}).data().each(function(value, index) {
    var date = value.split("-");
    var cell = table.cell(index, 5);
    cell.data($.trim(date[0]));
  });
  table.columns.adjust().draw();
}

// Surname table
if ($('.table-surname').length) {
  var table = $('.table-surname').DataTable();
  $(table.table().container()).addClass('col-sm-12 col-md-8 col-lg-6 mx-auto');
  table.rows().invalidate().draw();
}

// Tab list tables - only change some markup. The indi, fam and media tab still have the old jquery markup.
// This is a change webtrees should make, so we wait with our final modifications until these changes have taken place.

if ($('.nav-tabs').length) {
  // The datatable option markup is temporary code
  $('[class^=filtersH], [class^=filtersF], .dt-clear').remove();
  $(".indi-list, .fam-list, .media-list").each(function() {
    var list = $(this);
    $('<div class="row mt-1 mb-lg-1">')
        .appendTo(list.find('.dataTables_paginate:first').parent())
        .append(list.find('.dataTables_length:first'))
        .append(list.find('.dataTables_filter'));
    $('<div class="row">')
        .appendTo(list.find('.dataTables_paginate:first').parent())
        .append(list.find('.dataTables_info'))
        .append(list.find('.dataTables_paginate:first'));
    $('<div class="row">')
        .appendTo(list.find('.dataTables_paginate:last').parent())
        .append(list.find('.dataTables_info').clone())
        .append(list.find('.dataTables_paginate:last'));
    list.find('.dataTables_length:last').remove();
    list.find('.dataTables_length select').addClass('form-control-sm');

    list.find('.dataTables_length').wrap('<div class="col-md-6 float-none">');
    list.find('.dataTables_filter').wrap('<div class="col-md-6 float-sm-none float-md-right">');
    list.find('.dataTables_info').wrap('<div class="col-6 d-none d-lg-block">');
    list.find('.dataTables_paginate').wrap('<div class="col-6 d-none d-lg-block">');
  });

  $('table[id^=table-]').each(function() {
    $(this).addClass('table table-sm table-bordered table-responsive');
    var toolbar = $(this).find('.btn-toolbar');
    toolbar.removeClass('mb-2');
    toolbar.parents('thead').find('.btn-group').addClass('mb-2');
    toolbar.find('.btn').addClass('btn-sm mr-1');
    toolbar.parents('thead th:first').addClass('jc-toolbar jc-header-toolbar px-2 pt-2 pb-0');
    toolbar.parent('tfoot th').addClass('jc-toolbar jc-footer-toolbar p-2');
  });
}

/* global THEME_COLORBOX_URL */

function get_imagetype() {
  var xrefs = [];
  $('a[type^=image].gallery').each(function() {
    var xref = qstring('mid', $(this).attr('href'));
    $(this).attr('id', xref);
    xrefs.push(xref);
  });
  $.ajax({
    url: COLORBOX_ACTION_FILE + '?action=imagetype',
    type: 'POST',
    dataType: 'json',
    data: {
      'xrefs': xrefs
    },
    success: function(data) {
      $.each(data, function(index, value) {
        $('a[id=' + index + ']').attr('data-obje-type', value);
      });
    }
  });
}

function resizeImg() {
  $("#cboxLoadedContent").css('overflow-x', 'hidden');
  var outerW = parseInt($("#cboxLoadedContent").css("width"), 10);
  var innerW = parseInt($(".cboxPhoto").css("width"), 10);
  if (innerW > outerW) {
    var innerH = parseInt($(".cboxPhoto").css("height"), 10);
    var ratio = innerH / innerW;
    var outerH = outerW * ratio;
    $(".cboxPhoto").css({
      "width": outerW + "px",
      "height": outerH + "px"
    });
  }
}

// add colorbox function to all images on the page when first clicking on an image.
$("body").one('click', 'a.gallery', function() {
   get_imagetype();

  // General (both images and pdf)
  $("a[type^=image].gallery, a[type$=pdf].gallery").colorbox({
    rel: "gallery",
    current: "",
    slideshow: true,
    slideshowAuto: false,
    slideshowSpeed: 3000,
    fixed: true
  });

  // Image settings
  $("a[type^=image].gallery").colorbox({
    photo: true,
    maxWidth: "95%",
    maxHeight: "95%",
    scalePhotos: function() {
      if ($(this).data('obje-type') === 'photo' || $(this).data('obje-type') === 'book') {
        return true; // default;
      } else {
        return false;
      }
    },
    scrolling: function() {
      if ($(this).data('obje-type') === 'photo' || $(this).data('obje-type') === 'book') {
        return false;
      } else {
        return true; // default;
      }
    },    
    title: function() {
      return '<span class="jc-cbox-title">' + $(this).find("img").attr("alt") + '</span>';
    },
    onComplete: function() {
      if ($(this).data('obje-type') !== 'photo') {
        resizeImg();
      }
      if ($("#colorbox").width() < 300) {
        $.colorbox.resize({
          width: 300
        });
      }
      if ($("#colorbox").height() < 300) {
        $.colorbox.resize({
          height: 300
        });
      }
      $('.cboxPhoto').unbind('click');
      wheelzoom(document.querySelectorAll('.cboxPhoto'));     
    }
  });

  // PDF settings - needs to be adjusted after webtrees has fixed pdf display
  $("a[type$=pdf].gallery").colorbox({
    width: "75%",
    height: "90%",
    iframe: true,
    title: function() {
      var pdf_title = $(this).data("title");
      return '<div class="title">' + pdf_title + '</div>';
    }
  });
});

// Stop browser scrolling
$(document).bind('cbox_open', function(){
    $('body').css({overflow:'hidden'});
}).bind('cbox_closed', function(){
    $('body').css({overflow:'auto'});
});

// Bootstrap popovers
jQuery(".wt-global").waitUntilExists('.icon-pedigree', function() {
  jQuery('.icon-pedigree').each(function() {
    var title = jQuery(this).parents(".person_box_template").find(".chart_textbox .NAME").parents("a").outerHtml();
    var popup = jQuery(this).next(".popup");
    popup.find("ul").removeAttr('class');
    var content = popup.html();
    popup.remove();
    if (jQuery(this).parents(".wt-side-blocks").length) {
      placement = 'left';
    } else {
      placement = 'right';
    }
    jQuery(this).attr("data-toggle", "popover");
    jQuery(this).popover({
      title: title,
      content: content,
      html: true,
      placement: placement,
      container: 'body'
    });
  });
});

// Childbox popover
jQuery(".jc-global-pedigree").waitUntilExists('#childbox', function() {
  jQuery("#childarrow a").each(function() {
    var childbox = jQuery(this).parent().find("#childbox").remove();
    jQuery(this).attr({
      "data-toggle": "popover",
      "data-class": "childbox"
    });
    jQuery(this).popover({
      content: childbox.html(),
      html: true,
      placement: 'bottom',
      container: 'body'
    });
  });
});

// close previous popover when opening another
jQuery('body').on('click', '[data-toggle=popover]', function() {
  jQuery('[data-toggle=popover]').not(this).popover('hide');
});

// close popover when clicking outside (anywhere in the page);
jQuery('body').on('click', function(e) {
  if (jQuery(e.target).data('toggle') !== 'popover' && jQuery(e.target).parents('.popover.in').length === 0) {
    jQuery('[data-toggle="popover"]').popover('hide');
  }
});

// Bootstrap active tab in navbar
var url = location.href.split(WT_BASE_URL);
jQuery('.jc-primary-navigation').find('a[href="' + url[1] + '"]').addClass('active').parents('li').find('.nav-link').addClass('active');
jQuery('.jc-secondary-navigation').find('a[href="' + url[1] + '"]').addClass('active').parents('.btn-group').find('button').addClass('active');

// Change the default grid on the individual page
$('.jc-global-individual').each(function() {

  $(this).find('.wt-main-container > .row > .col-sm-8').each(function() {
        $(this).addClass('col-12 col-lg-9 col-md-8').removeClass('col-sm-8');
        $(this).find('.row:first').each(function() {
          $(this).addClass('d-flex col p-0').removeClass('row');
          $(this).find('.col-sm-3').addClass('col-2 pl-0').removeClass('col-sm-3');
          $(this).find('.col-sm-9').addClass('col-10 pr-0').removeClass('col-sm-9');
        });
  });
  $(this).find('.wt-main-container > .row > .col-sm-4').addClass('col-12 col-lg-3 col-md-4').removeClass('col-sm-4');

});