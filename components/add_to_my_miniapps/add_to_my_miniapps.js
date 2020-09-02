Component({
    data: {
        showFavHint: !1
    },
    attached: function() {
        var t = this;
        wx.getStorage({
            key: "hideFavHint",
            success: function(t) {},
            fail: function(a) {
                t.setData({
                    showFavHint: !0
                });
            }
        });
    },
    methods: {
        hideFavHint: function(t) {
            wx.setStorage({
                key: "hideFavHint",
                value: 1
            }), this.setData({
                showFavHint: !1
            });
        }
    }
});