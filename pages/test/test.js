const app = getApp()

let listData = [
	{
		images: "../../images/Sample/1.jpg",
	},
	{
		images: "../../images/Sample/1.jpg",
	},
	{
		images: "../../images/Sample/1.jpg",
	},
	{
		images: "../../images/Sample/1.jpg",
	},
	{
		images: "../../images/Sample/1.jpg",
	},
	{
		images: "../../images/Sample/1.jpg",
	},
	{
		images: "../../images/Sample/1.jpg",
	},
	{
		images: "../../images/Sample/1.jpg",
	},
	{
		images: "../../images/Sample/1.jpg",
	},
	{
		images: "../../images/Sample/1.jpg",
	}
];

Page({
	data: {
		isIphoneX: app.globalData.isIphoneX,
		size: 4,
		listData: [],
		extraNodes: [
			// {
			// 	type: "destBefore",
			// 	dragId: "destBefore0",
			// 	destKey: 0,
			// 	slot: "before",
			// 	fixed: true
			// },
			// {
			// 	type: "destAfter",
			// 	dragId: "destAfter0",
			// 	destKey: 0,
			// 	slot: "after",
			// 	fixed: true
			// },
			{
				type: "after",
				dragId: "plus",
				slot: "plus",
				fixed: true
			}
		],
		pageMetaScrollTop: 0,
		scrollTop: 0
	},

	
	onLoad() {
		this.drag = this.selectComponent('#drag');
		// 模仿异步加载数据
		setTimeout(() => {
			this.setData({
				listData: listData
			});
			this.drag.init();
		}, 100)
	},


	sortEnd(e) {
		console.log(e)
		console.log("sortEnd", e.detail.listData)
		this.setData({
			listData: e.detail.listData
		});
	},


	change(e) {
		// console.log("change", e.detail.listData)
	},


	itemClick(e) {
		// console.log(e);
	},


	add(e) {
		let listData = this.data.listData;
		listData.push({
      images: "../../images/Sample/1.jpg",
			fixed: false
		});
		setTimeout(() => {
			this.setData({
				listData: listData
			});
			this.drag.init();
		}, 300)

	},


	scroll(e) {
		this.setData({
			pageMetaScrollTop: e.detail.scrollTop
		})
	},


	// 页面滚动
	onPageScroll(e) {
		this.setData({
			scrollTop: e.scrollTop
		});
  },
  
  
})
