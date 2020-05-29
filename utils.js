let http = {
    get: function (url, data) {
        var postpromise = new Promise(function (getsuccess, getfail) {
            wx.request({
                header: { 'content-type': 'application/json' },
                url: url,
                data: data,
                success: function (res) {
                    getsuccess(res);
                },
                fail: (res) => {
                    getfail(res);
                }
            })
        })
        return postpromise;
    },

    mutlUploadFile: function (pictures, url, name, header) {
        var postpromise = new Promise(function (resolve, reject) {
          wx.showLoading({
            title: "正在处理..."
          })
          let flag = 0,
            results = [];
          pictures.forEach(element => {
            wx.uploadFile({
              url: url,
              filePath: element.images,
              name: name,
              header: header,
              success(res) {
                flag++;
                results.push({
                  images: element.images,
                  result: res.data,
                }) 
                if (flag == pictures.length) {
                  resolve(results);
                }
              },
              fail: (res) => {
                flag++;
                if (flag == pictures.length) {
                  reject(res);
                }
              },
            })
          })
        })
        return postpromise;
      }
}