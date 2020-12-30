$(function() {
    // layer 提示消息
    var layer = layui.layer;
    // 创建表单验证规则
    var form = layui.form;
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间';
            }
        }
    });
    initUserInfo();
    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户基本信息失败！')
                }
                // console.log(res);
                // 调用form.val()快速为表单赋值
                // 第一个参数为：被赋值的表单名 名为自定义的： formUserInfo
                // 第二个参数为：给表单赋值的数据 ： res.data
                form.val('formUserInfo', res.data);
            }
        })
    };

    // 重置表单的数据
    $('#reset').on('click', function(e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 重新调用这个函数 初始化用户信息
        initUserInfo();
    });

    // 监听表单提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // $(this).serialize()快速拿到表单里面的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！');
                }
                layer.msg('更新用户信息成功！');
                // console.log(res);
                // 调用父页面中的方法 重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
            }
        })
    })
})