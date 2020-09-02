function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var t = e(require("./md5")), r = e(require("./config"));

exports.default = function(e, u) {
    var n = new Date().getTime().toString().slice(0, -3), o = (0, t.default)("mnc20F%f*" + n + "1609");
    wx.request({
        url: r.default.url + "/wb/index",
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: {
            app_code: "mnc",
            method: "log",
            type: e,
            message: u,
            create_ts: n,
            token: o,
            uid: "1609"
        },
        method: "POST",
        success: function(e) {}
    });
};