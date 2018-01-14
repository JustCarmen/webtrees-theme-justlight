// Bootstrap active tab in navbar
var url = location.href.split(WT_BASE_URL);
jQuery('.jc-primary-navigation').find('a[href="' + url[1] + '"]').addClass('active').parents('li').find('.nav-link').addClass('active');
jQuery('.jc-secondary-navigation').find('a[href="' + url[1] + '"]').addClass('active').parents('.btn-group').find('button').addClass('active');
