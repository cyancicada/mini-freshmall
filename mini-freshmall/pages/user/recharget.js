let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    state1:"color:#fd0;background: #fff;",
    state2: "color:#fd0;background: #fff;",
    state3: "color:#fd0;background: #fff;",
    state4: "color:#fd0;background: #fff;",
    state5: "color:#fd0;background: #fff;",
    state6: "color:#fd0;background: #fff;",
    recharge_next_button: "background:#fd0;opacity:1;",
    money: "",
    error: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  btn10: function () {
    let _this = this
    _this.setData({
      state1: "background:#fd0;color:#fff;",
      state2: "color:#fd0;background: #fff;",
      state3: "color:#fd0;background: #fff;",
      state4: "color:#fd0;background: #fff;",
      state5: "color:#fd0;background: #fff;",
      state6: "color:#fd0;background: #fff;",
      money: "10",
    });
    console.log(_this.data.money)
  },
  btn20: function () {
    let _this = this
    _this.setData({
      state1: "color:#fd0;background: #fff;",
      state2: "background:#fd0;color:#fff;",
      state3: "color:#fd0;background: #fff;",
      state4: "color:#fd0;background: #fff;",
      state5: "color:#fd0;background: #fff;",
      state6: "color:#fd0;background: #fff;",
      money: "20",
    });
    console.log(_this.data.money)
  },
  btn30: function () {
    let _this = this
    _this.setData({
      state1: "color:#fd0;background: #fff;",
      state2: "color:#fd0;background: #fff;",
      state3: "background:#fd0;color:#fff;",
      state4: "color:#fd0;background: #fff;",
      state5: "color:#fd0;background: #fff;",
      state6: "color:#fd0;background: #fff;",
      money: "30",
    });
    console.log(_this.data.money)
  },
  btn50: function () {
    let _this = this
    _this.setData({
      state1: "color:#fd0;background: #fff;",
      state2: "color:#fd0;background: #fff;",
      state3: "color:#fd0;background: #fff;",
      state4: "background:#fd0;color:#fff;",
      state5: "color:#fd0;background: #fff;",
      state6: "color:#fd0;background: #fff;",
      money: "50",
    });
    console.log(_this.data.money)
  },
  btn100: function () {
    let _this = this
    _this.setData({
      state1: "color:#fd0;background: #fff;",
      state2: "color:#fd0;background: #fff;",
      state3: "color:#fd0;background: #fff;",
      state4: "color:#fd0;background: #fff;",
      state5: "background:#fd0;color:#fff;",
      state6: "color:#fd0;background: #fff;",
      money: "100",
    });
    console.log(_this.data.money)
  },
  btn200: function () {
    let _this = this
    _this.setData({
      state1: "color:#fd0;background: #fff;",
      state2: "color:#fd0;background: #fff;",
      state3: "color:#fd0;background: #fff;",
      state4: "color:#fd0;background: #fff;",
      state5: "color:#fd0;background: #fff;",
      state6: "background:#fd0;color:#fff",
      money: "200",
    });
    console.log(_this.data.money)
  },
  input(event){
    let _this = this
    console.log(event.detail.value);
    _this.setData({
      state1: "color:#fd0;background: #fff;",
      state2: "color:#fd0;background: #fff;",
      state3: "color:#fd0;background: #fff;",
      state4: "color:#fd0;background: #fff;",
      state5: "color:#fd0;background: #fff;",
      state6: "color:#fd0;background: #fff;",
      money: event.detail.value
    });
  },
  submit:function(e){
    let _this=this

    if(_this.data.money==""){
      _this.data.money = '请选择充值金额';
      App.showError(_this.data.money);
      _this.data.money=""
      return false; 
    }else{
      console.log(_this.data.money)
      // 按钮禁用
      _this.setData({
        disabled: true
      });
      //提交到后端
      App._post_form('', _this.data.money, function (result) {
        App.showSuccess(result.msg, function () {
          
        });
      }, false, function () {
        // 解除禁用
        _this.setData({
          disabled: false
        });
      });
    }
  },
  /**
   * 表单提交
   */
  saveData: function (e) {
    let _this = this,
    values = e.detail.value
    values.region = _this.data.region;

    // 记录formId
    // App.saveFormId(e.detail.formId);

    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }

    // 按钮禁用
    _this.setData({
      disabled: true
    });

    // 提交到后端
    App._post_form('address/add', values, function (result) {
      App.showSuccess(result.msg, function () {
        wx.navigateBack();
      });
    }, false, function () {
      // 解除禁用
      _this.setData({
        disabled: false
      });
    });
  },

  /**
   * 表单验证
   */
  validation: function (values) {
    if (values.name === '') {
      this.data.error = '收件人不能为空';
      return false;
    }
    if (values.phone.length < 1) {
      this.data.error = '手机号不能为空';
      return false;
    }
    if (values.phone.length !== 11) {
      this.data.error = '手机号长度有误';
      return false;
    }
    let reg = /^1\d{10}$/;
    if (!reg.test(values.phone)) {
      this.data.error = '手机号不符合要求';
      return false;
    }
    if (!this.data.region) {
      this.data.error = '省市区不能空';
      return false;
    }
    if (values.detail === '') {
      this.data.error = '详细地址不能为空';
      return false;
    }
    return true;
  },

  /**
   * 修改地区
   */
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

})