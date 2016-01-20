$('[data-toggle="hover"]').on('mouseover', function (e) {
    e.preventDefault();
    var $this = $(this);
    $('#'+$this.data('target')).removeClass('hide');
});

$('[data-toggle="hover"]').on('mouseout', function (e) {
    e.preventDefault();
    var $this = $(this);
    $('#'+$this.data('target')).addClass('hide');
});