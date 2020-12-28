$(function() {
    // 点击去注册的链接
    $('#link_reg').on('click', function() {
        // 点击去注册，让登录框界面隐藏
        $('.login').hide();
        // 点击去注册，让注册框界面显示
        $('.reg').show();

    });

    // 点击登录的链接
    $('#link_login').on('click', function() {
        // 点击登录的链接，让注册框界面隐藏
        $('.reg').hide();
        // 点击登录的链接，让登录框界面显示
        $('.login').show();
    });

    // 自定义layUI 表单验证规则
    // 从layUI中获取form对象
    var form = layui.form;
    // 从layUI中获取 layer 对象
    var layer = layui.layer;
    // 通过 form.verify()这个函数 来自定义校验规则
    form.verify({
        // 自定义了一个pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        // 这是校验两次密码是否一致的规则
        rpwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容 value
            // 还需要拿到密码框中的值
            var pwd = $('.reg [name=password]').val();
            // 然后进行一次等于的判断
            if (pwd !== value) {
                // 如果判断失败 return 一个错误提示消息
                return "两次密码不一致!!!"
            };

        }
    });

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止表单提交的默认行为
        e.preventDefault();
        // 发起ajax 的post请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        };
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                // layer.msg 可以弹出提示
                return layer.msg(res.message);
            };
            layer.msg('注册成功!!!');

            // 注册成功后 模拟手动点击去登陆链接 让其自动跳转到登录界面
            $('#link_login').click();
        })
    });

    // 监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单内的数据  $(this) 指的是当前的这个表单$('#form_login')
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败!!!');
                }
                layer.msg('登录成功!!!');
                // 将登录成功后得到的token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token);
                // console.log(res.token);
                // 登陆成功后跳转到后台主页 index.html
                location.href = './index.html';
            }

        })
    })
})