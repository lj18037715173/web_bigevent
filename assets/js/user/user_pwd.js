$(function() {
    var layer = layui.layer;
    // 创建表单验证规则
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // value 表示 把校验规则samePwd 给到那个文本框
        // value就是那个文本框里面的值
        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样！';
            }
        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！';
            }
        }

    })

    // 给表单绑定提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            // 快速获取表单内的值
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新密码失败！');
                }
                layer.msg('更新密码成功！');
                // $('.layui-form')[0] 表示将jquery 对象转换为 dom对象
                $('.layui-form')[0].reset(); // 重置表单里面的值
            }
        })
    })
})