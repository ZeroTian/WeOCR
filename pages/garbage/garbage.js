function t(t) {
    return t && t.__esModule ? t : {
        default: t
    };
}

var e = t(require("../../utils/md5.js")), a = t(require("../../data/trash")), i = t(require("../../utils/config")), s = t(require("../../utils/util"));
getApp();

Page({
    data: {
        active: '',
        content: '垃圾识别',
        sectionIndex: 0,
        activeSectionId: 0,
        cats: [{
            title: "湿垃圾",
            imageSrc: "/images/household_food_waste_icon.png"
        }, {
            title: "干垃圾",
            imageSrc: "/images/residual_waste_icon.png"
        }, {
            title: "可回收物",
            imageSrc: "/images/recyclable_waste_icon.png"
        }, {
            title: "有害垃圾",
            imageSrc: "/images/hazardous_waste_icon.png"
        }],
        test: null,
        hjp: null,
        searching: !1,
        searchText: null,
        searchResults: [],
        searchWithNoResults: !1,
        searchTextFocus: !0,
        magnifierSrc: "/images/tab_bar_icon_magnifier.png",
        qrBSrc: "/images/qr_b.png",
        wsgQrSrc: "/images/wsg_qr.jpg",
        showingDetail: !1,
        showingTips: !1,
        showQr: !1,
        writePhotosAlbumStatus: 0,
        page: "index",
        withAd: !0
    },

    onLoad: function (options) {
        var t = [];
        for (var e in a.default.data) {
            var i = a.default.data[e];
            t.push(i);
        }
        t.forEach(function (t) {
            t.sort(function (t, e) {
                for (var a = t.i.split(""), i = e.i.split(""), s = Math.max(a.length, i.length), o = 0; o < s; o++) {
                    if (o > a.length - 1) return -1;
                    if (o > i.length - 1) return 1;
                    if (a[o] < i[o]) return -1;
                    if (a[o] > i[o]) return 1;
                }
                return 0;
            });
        }), this.setData({
            data: t
        }), wx.showShareMenu({
            withShareTicket: !0
        });

        this.setData({
            active: options.active,
        })

    },
    /**
   * 生命周期函数--监听页面显示
   */
    onShow: function () {
        //参数归拢
        const eventChannel = this.getOpenerEventChannel()
        var json = null;
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        eventChannel.on('acceptDataFromOpenerPage', function (res) {
            json = res.data1
            //console.log(json)
        })
        var that = this;
        that.setData({
            hjp: json,
            searchText: json
        })
        this.search(json);
    },
    onShareAppMessage: function (t) {
        return {
            title: "垃圾分类指南",
            path: "/pages/index/index"
        };
    },
    switchSection: function (t) {
        this.setData({
            activeSectionId: t.currentTarget.id.slice(3)
        });
    },
    listOnScroll: function (t) {
        var e = this;
        if (void 0 === this.data.sectionThresholds && function () {
            for (var t = wx.createSelectorQuery(), a = [], i = [0], s = e, o = 0; o < 4; o++) !function (e) {
                t.select("#section" + e).boundingClientRect(function (t) {
                    if (a[e] = t.height, e > 0) {
                        i[e] = 0;
                        for (var o = 0; o < e; o++) i[e] += a[o];
                    }
                    3 === e && s.setData({
                        sectionThresholds: i
                    });
                }).exec();
            }(o);
        }(), this.data.sectionThresholds) for (var a = 3; a >= 0; a--) if (t.detail.scrollTop >= this.data.sectionThresholds[a]) {
            this.setData({
                activeSectionId: a
            });
            break;
        }
    },
    showDetail: function (t) {
        this.setData({
            showingDetail: !0,
            detailItemName: t.currentTarget.dataset.itemName,
            detailCatIndex: t.currentTarget.dataset.catIndex,
            activeSectionId: t.currentTarget.dataset.catIndex,
        });
    },
    hideDetail: function (t) {
        this.setData({
            showingDetail: !1
        });
    },
    logKeyword: function (t) {
        var a = new Date().getTime().toString().slice(0, -3), s = (0, e.default)(t + "logS_Slog" + a);
        wx.request({
            url: i.default.url + "/mn/logS",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            data: {
                keyword: t,
                ts: a,
                vv: s
            },
            method: "POST",
            success: function (t) { }
        });
    },
    /* startSearch: function(t) {
        wx.navigateTo({
            url: "../search/search"
        });
    }, */

    searchOnFocus: function (t) {
        this.setData({
            searching: !0
        });
    },
    searchOffFocus: function (t) {
        "" === t.detail.value.trim(),
            this.setData({
                searching: !1
            });
    },

    clearSearchText: function (t) {
        this.setData({
            searchText: "",
            searchResults: [],
            searchWithNoResults: !1,
            submittedKeyword: !1,
            searchTextFocus: !0
        });
    },

    cancelSearch: function (t) {
        this.setData({
            searchText: null,
        });
    },

    searchOnTyping: function (t) {
        this.setData({
            searchResults: [],
            searchWithNoResults: !1
        });
        var e = [], a = t.detail.value.trim();
        this.setData({

            searchText: a,
            a: this.data.hjp,
            test: this.data.hjp

        });
        //     a.length > 0 && ("zzmmqqkkmm702" === a && "develop" === __wxConfig.envVersion ? wx.navigateTo({
        //     url: "../admin/index/index"
        // }) : (this.data.data.forEach(function(t) {
        //     t.forEach(function(t) {
        //         -1 === t.n.indexOf(a) && -1 === t.a.indexOf(a) || e.push(t);
        //     });
        // }), this.setData({
        //     searchResults: e
        // }), 0 === e.length && this.setData({
        //     searchWithNoResults: !0
        // })));
        this.search(a);
    },

    search: function (text) {
        var e = [], a = text;
        try {
            a.length > 0 && ("zzmmqqkkmm702" === a && "develop" === __wxConfig.envVersion ? wx.navigateTo({
                url: "../"
            }) : (this.data.data.forEach(function (t) {
                t.forEach(function (t) {
                    -1 === t.n.indexOf(a) && -1 === t.a.indexOf(a) || e.push(t);
                });
            }), this.setData({
                searchResults: e
            }), 0 === e.length && this.setData({
                searchWithNoResults: !0
            })));
        } catch (error) {}
    },

    submitFeedback: function (t) {
        var a = this;
        if (!this.data.sendingFeedback) {
            this.setData({
                sendingFeedback: !0,
                talkFeedbackEmpty: !1,
                talkContactInfoEmpty: !1
            });
            var s = t.detail.value.talkFeedback.trim(), o = t.detail.value.talkContactInfo.trim(), n = new Date().getTime().toString().slice(0, -3), r = (0,
                e.default)(o + "logS_Slog" + n);
            0 === s.length && this.setData({
                talkFeedbackEmpty: !0,
                sendingFeedback: !1
            }), 0 === o.length && this.setData({
                talkContactInfoEmpty: !0,
                sendingFeedback: !1
            }), s.length > 0 && o.length > 0 && wx.request({
                url: i.default.url + "/mn/saveFeedback",
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                data: {
                    contact_info: o,
                    content: s,
                    ts: n,
                    vv: r
                },
                method: "POST",
                success: function (t) {
                    a.setData({
                        sent: !0
                    });
                },
                complete: function (t) {
                    a.setData({
                        sendingFeedback: !1
                    });
                }
            });
        }
    },
    showTips: function (t) {
        this.setData({
            showingTips: !0
        });
    },
    hideTips: function (t) {
        this.setData({
            showingTips: !1
        });
    },
    showQr: function (t) {
        var e = this;
        wx.getSetting({
            success: function (t) {
                void 0 === t.authSetting["scope.writePhotosAlbum"] ? e.setData({
                    writePhotosAlbumStatus: 0
                }) : !0 === t.authSetting["scope.writePhotosAlbum"] ? e.setData({
                    writePhotosAlbumStatus: 1
                }) : !1 === t.authSetting["scope.writePhotosAlbum"] && e.setData({
                    writePhotosAlbumStatus: 2
                });
            }
        }), this.setData({
            showQr: !0
        });
    },
    hideQr: function (t) {
        this.setData({
            showQr: !1
        });
    },
    saveQrToAlbum: function (t) {
        var e = this;
        wx.saveImageToPhotosAlbum({
            filePath: e.data.wsgQrSrc,
            success: function () {
                e.setData({
                    writePhotosAlbumStatus: 3
                }), (0, s.default)(101, "");
            }
        });
    },
    authorizeWritePhotosAlbum: function (t) {
        var e = this;
        wx.authorize({
            scope: "scope.writePhotosAlbum",
            success: function () {
                e.saveQrToAlbum();
            },
            fail: function () {
                e.setData({
                    writePhotosAlbumStatus: 2
                });
            }
        });
    },
    openSetting: function (t) {
        void 0 === t.detail.authSetting["scope.writePhotosAlbum"] ? this.setData({
            writePhotosAlbumStatus: 0
        }) : !0 === t.detail.authSetting["scope.writePhotosAlbum"] ? (this.setData({
            writePhotosAlbumStatus: 1
        }), this.saveQrToAlbum()) : 0 == t.detail.authSetting["scope.writePhotosAlbum"] && this.setData({
            writePhotosAlbumStatus: 2
        });
    },
    generateNonce: function () {
        for (var t = "", e = 0; e < 8; e++) {
            var a = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^*(){}[]<>";
            t += a[Math.floor(Math.random() * a.length)];
        }
        return t;
    },

    ToPhoto: function (e) {
        let self = this;

        wx.chooseImage({
            count: 100,
            sourceType: ['camera'],

            success: res => {
                // tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths,
                    pictures = [];

                // 导向照片集合页面
                wx.navigateTo({
                    url: "../albumn/albumn",
                    // 一个事件的监听器可以随时接听事件是否被调用
                    event: {
                        // 接收来自Albumn的数据
                        albumnToIndex: function (data) {
                            console.log(data.feedback);
                        },

                    },
                    success: function (res) {
                        tempFilePaths.forEach(element => {
                            pictures.push({ images: element })
                        });
                        // 通过eventChannel向被打开页面传送图片
                        res.eventChannel.emit('indexToAlbumn', { pictures: pictures, active: self.data.active })
                    },
                })
            },
        })
    }
});