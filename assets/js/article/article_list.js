$(function() {
    // 导入分页需要的 laypage 对象
    var laypage = layui.laypage;
    // 导入layer对象
    var layer = layui.layer;
    var form = layui.form;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);
        var y = addZero(dt.getFullYear());
        var m = addZero(dt.getMonth() + 1);
        var d = addZero(dt.getDate());
        var hh = addZero(dt.getHours());
        var mm = addZero(dt.getMinutes());
        var ss = addZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    };

    // 定义时间补零的方法
    function addZero(n) {
        if (n > 9) {
            return n;
        } else {
            return '0' + n;
        }
    }
    // 定义一个查询的参数对象 将来请求数据的时候 需要将请求的参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值 默认请求第一页的数据
        pagesize: 2, //每页显示几条数据 默认每页显示2条数据
        cate_id: '', //文章分类的Id
        state: '', //文章的发布状态
    };

    // 调用获取文章列表数据的方法
    initTable();
    // 初始化文章分类的方法（筛选区域）
    initArtCate()

    // 获取文章列表数据的方法 （列表区域）
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败！');
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tlp-table', res);
                // console.log(res);
                $('tbody').html(htmlStr);
                // 因为分页区域是等渲染完表格后 才渲染的 所以应该在渲染完表格后，接着调用渲染分页的函数
                renderPage(res.total); //res.total 表示一共有几条数据
            }
        })
    };


    // 初始化文章分类的方法（筛选区域）
    function initArtCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！');
                }
                // 调用模板引擎 渲染筛选的可选项
                var htmlStr = template('tlp-cate', res);
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr);
                form.render(); //通知layUI 重新渲染
            }
        })
    };

    // 给筛选区域的表单绑定提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单中下拉菜单中选中的值
        var cate_id = $('[name=cate_id]').val(); // 获取到的是 模板去引擎中 {{$value.Id}} 这个值 
        var state = $('[name=state]').val();
        // 为查询的参数对象q 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的参数对象中的数据 重新渲染表格的数据
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用laypage.render()方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 不需要加#号
            count: total, //总条数
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //设置默认选中哪一页的数据
            // 自定义排版分页结构
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 6, 8, 10],


            // 当分页发生切换的时候 触发jump这个回调函数
            // 触发jump回调函数的两种方式：
            // 1、点击页码的时候会触发jump回调
            // 2、调用renderPage的时候 会触发jump回调

            // jump回调函数里面的first 参数的值有两种情况：
            // 1、当jump函数 是通过点击页码的方式调用时 first的值为false 否则 为true
            jump: function(obj, first) {
                // 通过obj.curr 来获取切换页码时 当前所属的页码值
                // 把获取到的当前页码值 赋值给查询的参数对象 q的pagenum 属性
                q.pagenum = obj.curr;


                // 当我们点击切换条数的时候 也会触发jump回调函数
                // obj.limit 得到每页显示的条数
                // console.log(obj.limit);
                q.pagesize = obj.limit;

                // 根据获取到当前的页码值 重新渲染表格数据
                // initTable();
                // 如果first为真 说明是通过点击方式调用的jump回调 然后再去调用渲染表格的函数 这样就可以避免 导致死循环的调用
                if (!first) {
                    initTable();
                };

            }
        });
    };

    // 定义删除文章的功能
    // 给删除按钮绑定点击事件 , 通过代理绑定
    $('body').on('click', '.btn-del', function() {
        // console.log($('.btn-del'));
        // 获取删除元素的个数
        var len = $('.btn-del').length;
        // 获取接口返回的id值
        var id = $(this).attr('data-id');
        // 弹出layUI的询问框
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!');
                    }
                    layer.msg('删除文章成功!');
                    // 当数据删除完后 需要判断当前的这一页中 是否还有剩余的数据
                    // 如果没剩余的数据 则让页码值-1之后 在重新调用 initTable()

                    if (len === 1) {
                        // 如果len等于1 证明删除完毕后 页面上就没有任何数据了
                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1;
                    }
                    // 删除后重新渲染表格
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})