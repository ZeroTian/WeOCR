Page({
    data: {
        src: '',
        width: 250,//裁剪框宽度
        height: 250,//裁剪框高度
    },


    onLoad: function (options) {
        let self = this,
            eventChannel = self.getOpenerEventChannel(),
            pictures = [],
            id = '',
            src = '';

        //获取到image-cropper对象
        self.cropper = self.selectComponent("#image-cropper");

        eventChannel.on('albumnToCropper', function (data) {
            pictures = data.pictures;
            id = data.id;
            src = pictures[id].images;

            self.setData({
                src: src,
            })
        })

        wx.showLoading({
            title: '加载中'
        })
    },


    cropperload(e) {
        console.log("cropper初始化完成");
    },


    loadimage(e) {
        let self = this;

        console.log("图片加载完成", e.detail);
        wx.hideLoading();
        //重置图片角度、缩放、位置
        self.cropper.imgReset();
    },


    clickcut(e) {
        console.log(e.detail);
        //点击裁剪框阅览图片
        wx.previewImage({
            current: e.detail.url, // 当前显示图片的http链接
            urls: [e.detail.url] // 需要预览的图片http链接列表
        })
    },


})