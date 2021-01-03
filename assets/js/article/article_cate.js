$(function() {
    var form = layui.form;
    var layer = layui.layer;
    getArticleList();
    // 获取文章分类列表
    function getArticleList() {
        $.ajax({
            methos: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // 第一个参数 模板的ID
                var HTMLStr = template('tpl-table', res);
                // console.log(HTMLStr);
                $('tbody').html(HTMLStr);
            }
        })
    };
    // 给添加类别按钮 绑定点击事件
    var indexAdd = null;
    $('#addCate').on('click', function() {
        indexAdd = layer.open({
                type: 1, // 默认是0 1表示 取消 弹出层底下的确认按钮
                area: ['530px', '280px'], //设置弹出层的宽和高
                title: '添加文章类别',
                // 获取script标签里面的HTML结构
                content: $('#dialog-add').html()

            })
            // index = open();
            // console.log(index);
    });

    // 封装一个弹出层函数

    // function open() {
    //     layer.open({
    //         type: 1, // 默认是0 1表示 取消 弹出层底下的确认按钮
    //         area: ['530px', '280px'], //设置弹出层的宽和高
    //         title: '添加文章类别',
    //         // 获取script标签里面的HTML结构
    //         content: $('#dialog-add').html()

    //     })
    // };

    // 通过代理的方式 为 form-add 表单绑定submit事件 因为 form-add这个表单
    // 是通过JavaScript动态创建的 所以刚开始是获取不到的 只能通过代理的形式绑定
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        // console.log('ok');
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // 快速获取表单内的数据
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！');
                }
                getArticleList();
                layer.msg('新增分类成功！');
                // 根据索引关闭弹出层
                layer.close(indexAdd);
            }

        });
    });
    // 通过代理的形式 为编辑按钮添加点击事件
    var indexEdit = null;
    $('body').on('click', '.btn-edit', function() {
        // console.log('ok');
        indexEdit = layer.open({
            type: 1, // 默认是0 1表示 取消 弹出层底下的确认按钮
            area: ['530px', '280px'], //设置弹出层的宽和高
            title: '修改文章分类',
            // 获取script标签里面的HTML结构
            content: $('#dialog-edit').html()

        });
        // 获取该编辑按钮对应的 自定义 data-id
        var id = $(this).attr('data-id');
        // 发起请求获取对应data-id对应的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data);
            }
        })

    });

    // 通过代理的形式为 编辑表单form 添加提交事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！');
                }
                // 重新获取文章分类列表
                getArticleList();
                layer.close(indexEdit);
                layer.msg('更新分类信息成功！');

            }

        })
    });

    // 通过代理的形式 为删除按钮添加点击事件
    $('body').on('click', '.btn-del', function() {
        // console.log('ok');
        var id = $(this).attr('data-id');
        // console.log(id);
        // 点击删除按钮弹出layui询问框
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章分类失败！');
                    }
                    getArticleList();
                    layer.msg('删除文章分类成功！');
                }
            })
            layer.close(index);
        });
    })

})