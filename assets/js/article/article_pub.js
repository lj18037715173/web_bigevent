$(function() {
    var form = layui.form;
    var layer = layui.layer;
    initCate();
    // 初始化富文本编辑器
    initEditor();
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败!');
                }
                // 调用模板引擎渲染 文章类别下拉选择的内容
                var htmlStr = template('tlp-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // console.log(htmlStr);
                form.render(); //通知layUI 重新渲染
            }
        })
    };

    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 给选择封面按钮绑定点击事件
    $('.choose-cover').on('click', function() {
        // 当我们点击择封面按钮 就会自动去触发 点击文件选择框这个动作
        $('#file').click();
    });
    // 只要文件选择了文件就会触发 change 这个事件
    $('#file').on('change', function(e) {
        // 获取用户选择的文件
        console.log(e.target.files);
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择图片！');
        }
        // 1、拿到用户选择的文件
        var file = e.target.files[0]; // files[0]就是拿到的文件
        // 2、根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 3、先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 定义文章的发布状态
    var art_state = '已发布';
    // 给存为草稿按钮绑定一个点击事件
    $('#btn_save').on('click', function() {
        art_state = '草稿';
    });

    // 给表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 2、基于form表单 快速创建一个FormData对象
        var fd = new FormData($(this)[0]); // 参数接收的需要是 DOM对象

        // 3、将文章的发布状态存到FormData对象中
        fd.append('state', art_state);
        // 4、将封面裁剪过会的图片输出为文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5、将图片文件 追加到fd中
                fd.append('cover_img', blob);

                // 6、发情ajax请求
                publishArticle(fd);
            });
    });

    function publishArticle(data) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: data,
            // 注意：如果向服务器提交的是FormData格式的数据
            // 必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!');
                }
                layer.msg('发布文章成功!');
                // 发布成功后跳转到文章列表页面
                location.href = '/article/article_list.html'
            }
        })
    }
})