$(function() {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
        // 纵横比 控制裁剪区域形状
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    // 给上传按钮绑定点击事件
    $('#chooseImage').on('click', function() {
        // 当我们点击上传按钮 就会自动去触发 点击文件选择框这个动作
        $('#file').click();
    });

    // 只要文件选择了文件就会触发 change 这个事件
    $('#file').on('change', function(e) {
        // console.log(e.target.files);
        // 获取用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layer.msg('请选择图片！');
        }
        // 1、拿到用户选择的文件
        var file = e.target.files[0];
        // 2、根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 3、先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 点击确定按钮 上传图片
    $('#upLoad').on('click', function() {
        // 1、拿到用户裁剪后的头像
        // 将裁剪后的图片，输出为 base64 格式的字符串
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            // 2、调用接口把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！');
                }
                layer.msg('更换头像成功！');
                // 重新调用父页面里的渲染头像方法 更新显示
                window.parent.getUserInfo();

            }
        })
    })
})