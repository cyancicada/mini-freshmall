let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    state1:"color:#00a92c;background: #fff;",
    state2: "color:#00a92c;background: #fff;",
    state3: "color:#00a92c;background: #fff;",
    state4: "color:#00a92c;background: #fff;",
    state5: "color:#00a92c;background: #fff;",
    state6: "color:#00a92c;background: #fff;",
    recharge_next_button: "background:#00a92c;opacity:1;",
    money: "",
    error: '',
    balance: 100,

    recharging: false,
    hasError: false,
    values: {},
    payment: {},
  },
  handleInput(e) {
    let money = this.validateNumber(e.detail.value)
    this.setData({
      money
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  btn10: function () {
    let _this = this
    _this.setData({
      state1: "background:#00a92c;color:#fff;",
      state2: "color:#00a92c;background: #fff;",
      state3: "color:#00a92c;background: #fff;",
      state4: "color:#00a92c;background: #fff;",
      state5: "color:#00a92c;background: #fff;",
      state6: "color:#00a92c;background: #fff;",
      money: "10",
    });
    console.log(_this.data.money)
  },
  btn20: function () {
    let _this = this
    _this.setData({
      state1: "color:#00a92c;background: #fff;",
      state2: "background:#00a92c;color:#fff;",
      state3: "color:#00a92c;background: #fff;",
      state4: "color:#00a92c;background: #fff;",
      state5: "color:#00a92c;background: #fff;",
      state6: "color:#00a92c;background: #fff;",
      money: "20",
    });
    console.log(_this.data.money)
  },
  btn30: function () {
    let _this = this
    _this.setData({
      state1: "color:#00a92c;background: #fff;",
      state2: "color:#00a92c;background: #fff;",
      state3: "background:#00a92c;color:#fff;",
      state4: "color:#00a92c;background: #fff;",
      state5: "color:#00a92c;background: #fff;",
      state6: "color:#00a92c;background: #fff;",
      money: "30",
    });
    console.log(_this.data.money)
  },
  btn50: function () {
    let _this = this
    _this.setData({
      state1: "color:#00a92c;background: #fff;",
      state2: "color:#00a92c;background: #fff;",
      state3: "color:#00a92c;background: #fff;",
      state4: "background:#00a92c;color:#fff;",
      state5: "color:#00a92c;background: #fff;",
      state6: "color:#00a92c;background: #fff;",
      money: "50",
    });
    console.log(_this.data.money)
  },
  btn100: function () {
    let _this = this
    _this.setData({
      state1: "color:#00a92c;background: #fff;",
      state2: "color:#00a92c;background: #fff;",
      state3: "color:#00a92c;background: #fff;",
      state4: "color:#00a92c;background: #fff;",
      state5: "background:#00a92c;color:#fff;",
      state6: "color:#00a92c;background: #fff;",
      money: "100",
    });
    console.log(_this.data.money)
  },
  btn200: function () {
    let _this = this
    _this.setData({
      state1: "color:#00a92c;background: #fff;",
      state2: "color:#00a92c;background: #fff;",
      state3: "color:#00a92c;background: #fff;",
      state4: "color:#00a92c;background: #fff;",
      state5: "color:#00a92c;background: #fff;",
      state6: "background:#00a92c;color:#fff",
      money: "200",
    });
    console.log(_this.data.money)
  },
  input(event){
    let _this = this
    console.log(event.detail.value);
    _this.setData({
      state1: "color:#00a92c;background: #fff;",
      state2: "color:#00a92c;background: #fff;",
      state3: "color:#00a92c;background: #fff;",
      state4: "color:#00a92c;background: #fff;",
      state5: "color:#00a92c;background: #fff;",
      state6: "color:#00a92c;background: #fff;",
      money: event.detail.value
    });
  },
  
  /**
   * 充提交
   */
  submitBalance: function(e) {
    let _this = this;
    if(_this.data.money === ''){
      App.showError('请输入正确充值金额');
      return false;
    }
    if (_this.data.recharging) {
      return false;
    }

    if (_this.data.hasError) {
      App.showError(_this.data.error);
      return false;
    }

    // 订单创建成功后回调--微信支付
    let callback = function(result) {
      if (result.code !== 1) {
        App.showError(result.msg);
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.payment.timeStamp,
        nonceStr: result.data.payment.nonceStr,
        package: 'prepay_id=' + result.data.payment.prepay_id,
        signType: 'MD5',
        paySign: result.data.payment.paySign,
        success: function(res) {
          // 跳转到订单详情
          wx.navigateBack();
        },
        fail: function() {
          App.showError('取消充值', function() {
            wx.navigateBack();
          });
        },
      });
    };
    // 按钮禁用, 防止二次提交
    _this.data.recharging = true;
    // 显示loading
    wx.showLoading({
      title: '正在处理...'
    });
    App._post_form('user.balance/balance', {
      balance:_this.data.money,
    }, function(result) {
      // success
      console.log('success');
      callback(result);
    }, function(result) {
      // fail
      console.log('fail');
    }, function() {
      // complete
      console.log('complete');
      // 解除按钮禁用
      _this.data.recharging = false;
    });
  },

})
