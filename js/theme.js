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

// Prevent jumping to the top of the page when clicking on a javascript link
if ($('a[onclick]').attr('href') == '#') {
  $('a[onclick]').attr('href', 'javascript:void(0)');
}



// Tweak the datatables made by webtrees
// target = column number - 1

// Repository table
var table = $('.table-repository').DataTable({
   columnDefs: [
    {width: "20%", targets: 1},
    {width: "5%", targets: 3}
  ],
  autoWidth: false
});

// Don't show the last change column
table.column(2).visible(false).columns.adjust().draw();

// Source table
var table = $('.table-source').DataTable({
   columnDefs: [
    {width: "15%", targets: 1},
    {width: "7.5%", targets: [2, 3, 4, 5]},
    {width: "5%", targets: 7},
  ],
  autoWidth: false
});

// Don't show the last change column
table.column(6).visible(false).columns.adjust().draw();

// Shared notes table
var table = $('.table-note').DataTable({
   columnDefs: [
    {width: "15%", targets: 1},
    {width: "7.5%", targets: [2, 3, 4]},
    {width: "5%", targets: 6},
  ],
  autoWidth: false
});

// Don't show the last change column
table.column(5).visible(false).columns.adjust().draw();

// Surname table
var table = $('.table-surname').DataTable({
  columnDefs: [
    {width: "50%", targets: '_all'}
  ]
});
$('.table-surname').addClass('mx-auto');
table.columns.adjust().draw();

function get_imagetype() {
  var xrefs = [];
  jQuery('a[type^=image].gallery').each(function() {
    var xref = qstring('mid', jQuery(this).attr('href'));
    jQuery(this).attr('id', xref);
    xrefs.push(xref);
  });
  jQuery.ajax({
    url: COLORBOX_ACTION_FILE + '?action=imagetype',
    type: 'POST',
    dataType: 'json',
    data: {
      'xrefs': xrefs
    },
    success: function(data) {
      jQuery.each(data, function(index, value) {
        jQuery('a[id=' + index + ']').attr('data-obje-type', value);
      });
    }
  });
}

function longTitles() {
  var tClass = jQuery("#cboxTitle .title");
  var tID = jQuery("#cboxTitle");
  if (tClass.width() > tID.width() - 100) { // 100 because the width of the 4 buttons is 25px each
    tClass.css({
      "width": tID.width() - 100,
      "margin-left": "75px"
    });
  }
  if (tClass.height() > 25) { // 26 is 2 lines
    tID.css({
      "bottom": 0
    });
    tClass.css({
      "height": "26px"
    }); // max 2 lines.
  } else {
    tID.css({
      "bottom": "6px"
    }); // set the value to vertically center a 1 line title.
    tClass.css({
      "height": "auto"
    }); // set the value back;
  }
}

function resizeImg() {
  jQuery("#cboxLoadedContent").css('overflow-x', 'hidden');
  var outerW = parseInt(jQuery("#cboxLoadedContent").css("width"), 10);
  var innerW = parseInt(jQuery(".cboxPhoto").css("width"), 10);
  if (innerW > outerW) {
    var innerH = parseInt(jQuery(".cboxPhoto").css("height"), 10);
    var ratio = innerH / innerW;
    var outerH = outerW * ratio;
    jQuery(".cboxPhoto").css({
      "width": outerW + "px",
      "height": outerH + "px"
    });
  }
}

// add colorbox function to all images on the page when first clicking on an image.
jQuery("body").one('click', 'a.gallery', function() {
  get_imagetype();

  // General (both images and pdf)
  jQuery("a[type^=image].gallery, a[type$=pdf].gallery").colorbox({
    rel: "gallery",
    current: "",
    slideshow: true,
    slideshowAuto: false,
    slideshowSpeed: 3000,
    fixed: true
  });

  // Image settings
  jQuery("a[type^=image].gallery").colorbox({
    photo: true,
    scalePhotos: function() {
      if (jQuery(this).data('obje-type') === 'photo') {
        return true;
      }
    },
    maxWidth: "90%",
    maxHeight: "90%",
    title: function() {
      var img_title = jQuery(this).data("title");
      return "<div class=\"title\">" + img_title + "</div>";
    },
    onComplete: function() {
      if (jQuery(this).data('obje-type') !== 'photo') {
        resizeImg();
      }
      jQuery(".cboxPhoto").wheelzoom();
      jQuery(".cboxPhoto img").on("click", function(e) {
        e.preventDefault();
      });
      longTitles();
    }
  });

  // PDF settings
  jQuery("a[type$=pdf].gallery").colorbox({
    width: "75%",
    height: "90%",
    iframe: true,
    title: function() {
      var pdf_title = jQuery(this).data("title");
      return '<div class="title">' + pdf_title + '</div>';
    },
    onComplete: function() {
      longTitles();
    }
  });

  // Do not open the gallery when clicking on the mainimage on the individual page
  jQuery('a.gallery').each(function() {
    if (jQuery(this).parents("#indi_mainimage").length > 0) {
      jQuery(this).colorbox({
        rel: "nofollow"
      });
    }
  });
});

// Bootstrap popovers and/or tooltips
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
