// Change the default grid on the individual page
$('.jc-global-individual .wt-main-container > .row > .col-sm-8').each(function() {
      $(this).addClass('col-12 col-lg-9 col-md-8').removeClass('col-sm-8');
      $(this).find('.row:first').each(function() {
        $(this).addClass('d-flex col p-0').removeClass('row');
        $(this).find('.col-sm-3').addClass('col-2 pl-0').removeClass('col-sm-3');
        $(this).find('.col-sm-9').addClass('col-10 pr-0').removeClass('col-sm-9');
      });
      
      
});
$('.jc-global-individual .wt-main-container > .row > .col-sm-4').addClass('col-12 col-lg-3 col-md-4').removeClass('col-sm-4');
