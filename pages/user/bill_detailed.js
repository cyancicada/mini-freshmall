const App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    flowing_water:"",
    create_time:"",
    mark:"",
    type_name:"",
    trade_no:"",
    balance:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    let _this=this
    _this.setData({
      flowing_water: options.flowing_water,
      create_time: options.create_time,
      mark: options.mark,
      type_name: options.type_name,
      trade_no: options.trade_no,
      balance: options.balance
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  
  },


})