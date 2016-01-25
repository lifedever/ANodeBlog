<!-- 多说js加载开始，一个页面只需要加载一次 -->
var duoshuoQuery = {
    short_name: "gefangshuai",
    sso: {
        login: "/sso-login",//替换为你自己的回调地址
        logout: "/sso-logout"//替换为你自己的回调地址
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
