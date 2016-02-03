<!-- 多说js加载开始，一个页面只需要加载一次 -->
var duoshuoQuery = {
    short_name: short_name,
    sso: {
        login: "/sso-login"
    }

};
(function () {
    var ds = document.createElement('script');
    ds.type = 'text/javascript';
    ds.async = true;
    ds.src = 'http://static.duoshuo.com/embed.js';
    ds.charset = 'UTF-8';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ds);
})();


<!-- 多说js加载结束，一个页面只需要加载一次 -->
<!-- google analytics-->
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-72898178-1', 'auto');
ga('send', 'pageview');

<!--end google analytics-->
$('#searchBtn').on('click', function(e) {
    e.preventDefault();
    var $this = $(this);
    $this.hide();
    $('.navbar-form').show();
    $('.navbar-form input').focus();
});

$('.navbar-form input').on('blur', function(e) {
    e.preventDefault();
    $('.navbar-form').hide();
    $('#searchBtn').show();
});