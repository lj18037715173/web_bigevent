// 每次调用调用 $.get() 或 $.post() 或 $.ajax()的时候 会先调用
// ajaxPrefilter这个函数，在这个函数中 我们可以先拿到给ajax提供的配置对象

// option 这个形参就是 当我们发起ajax请求时 传递给服务器的配置对象
$.ajaxPrefilter(function(option) {
    // console.log(option.url);
    // 在真正的发起ajax请求之前 把url地址拼接好
    option.url = 'http://ajax.frontend.itheima.net' + option.url;
})