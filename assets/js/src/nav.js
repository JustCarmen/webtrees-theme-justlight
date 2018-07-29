// Bootstrap active tab in navbar
var url = location.href;
jQuery('.jc-primary-navigation').find('a[href="' + url + '"]').addClass('active').parents('li').find('.nav-link').addClass('active');
jQuery('.jc-secondary-navigation').find('a[href="' + url + '"]').addClass('active').parents('.btn-group').find('button').addClass('active');
