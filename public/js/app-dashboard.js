$('[data-toggle="hover"]').on('mouseover', function (e) {
    e.preventDefault();
    var $this = $(this);
    $('#' + $this.data('target')).removeClass('hide');
});

$('[data-toggle="hover"]').on('mouseout', function (e) {
    e.preventDefault();
    var $this = $(this);
    $('#' + $this.data('target')).addClass('hide');
});

$('[data-toggle="fullscreen"]').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var $target = $($this.data('target'));
    if ($target.hasClass('fullscreen')) {
        $($this.data('target')).removeClass('fullscreen');
    } else {
        $($this.data('target')).addClass('fullscreen');
    }
});

$('[data-toggle="confirm"]').on('click', function (e) {
    e.preventDefault();
    var $this = $(this);
    var msg = $this.data('message');
    if (confirm(msg)) {
        location.href = $this.attr('href');
    }
});
var editor = new Editor({
    element: document.getElementById('editor')
});
if (document.querySelector('textarea')) {
    editor.render();
}

$('#shareUrl').on('blur', function () {
    var url = this.value;
    $.get('/dashboard/p/getTitleByUrl?url=' + url, function (data) {
        console.log(data);
        $('#shareTitle').val(data);
    });
});