$(function() {
        // 调用getUserInfo 函数 获取用户基本信息
        getUserInfo();
        // 点击退出功能模块
        $('#logOut').on('click', function() {
            layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function(index) {
                //do something
                // 点击确认后，调用回调函数
                // 确认退出后 清除本地存储 token
                localStorage.removeItem('token');
                // 确认退出后 跳转到登录页面
                location.href = './login.html';
                // 关闭confirm询问框
                layer.close(index);
            });
        })
    })
    // 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        url: "/my/userinfo",
        method: "GET",
        // // headers 是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败!');
                }
                // 调用渲染用户的头像方法
                renderAvatar(res.data);
            }
            // 无论请求成功还是失败 最终都会调用complete这个回调函数
            // complete: function(res) {
            //     // 在complete回调函数中 可以使用res.responseJSON拿到服务器响应回来的数据
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
            //         // 1、强制清空本地存储token
            //         localStorage.removeItem('token');
            //         // 2、让页面跳转回 登录页面
            //         location.href = './login.html';
            //     }
            // }
    })
}

// 渲染用户的头像
function renderAvatar(user) {
    // 1、获取用户名称 如果有昵称就获取昵称 如果没有昵称就获取用户注册名称
    var name = user.nickname || user.username;
    // 2、设置欢迎的文本内容
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3、渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        // // 如果没有文本头像，但是有图片头像就把文本头像隐藏
        $('.text-avatar').hide();
    } else {
        // 3.2渲染文本头像
        // 如果有文本头像，但是没有图片头像就把图片隐藏
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
        // var str = $('.text-avatar');
        // console.log(str);
        // console.log(first);
    }
}