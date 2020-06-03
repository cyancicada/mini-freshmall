let App = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_select: false, // 快捷导航
    options: {}, // 当前页面参数

    address: null, // 默认收货地址
    exist_address: false, // 是否存在收货地址
    goods: {}, // 商品信息
    
    disabled: false,

    hasError: false,
    error: '',
    time_range: [],
    multiIndex: [1, 0],
    remark:'',
    checked: "0" , //余额购买选项
    balance_deduction:"", //余额抵扣
    checkbox_color:"background:#fff;border:2rpx solid #ccc;", 
    balance:"", //余额
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 当前页面参数
    this.data.options = options;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let _this=this
    // 获取当前订单信息
    this.getOrderData();
    App._get('user.balance/me', {}, result => {
      console.log(result)
      _this.setData({
        balance: result.data.balance
      });
    })
    console.log(_this.data)
  },

  /**
   * 获取当前订单信息
   */
  getOrderData: function() {
    let _this = this,
      options = _this.data.options;

    // 获取订单信息回调方法
    let callback = function(result) {
      if (result.code !== 1) {
        App.showError(result.msg);
        return false;
      }
      // 显示错误信息
      if (result.data.has_error) {
        _this.data.hasError = true;
        _this.data.error = result.data.error_msg;
        App.showError(_this.data.error);
      }
      _this.data.hasError = false;
      _this.setData(result.data);
    };

    // 立即购买
    if (options.order_type === 'buyNow') {
      App._get('order/buyNow', {
        goods_id: options.goods_id,
        goods_num: options.goods_num,
        goods_sku_id: options.goods_sku_id,
      }, function(result) {
        callback(result);
      });
    }

    // 购物车结算
    else if (options.order_type === 'cart') {
      App._get('order/cart', {}, function(result) {
        callback(result);
      });
    }

  },
  // 余额购买选项
  checked: function (e) {
    let _this =this
    console.log(_this.data.balance)
    console.log(_this.data.order_pay_price)
    if (_this.data.checked == '0') {
      console.log("余额选中状态")
      if (Number(_this.data.order_pay_price) <= Number(_this.data.balance)){
        _this.setData({
          checked: "1",
          balance_deduction: "￥ -" + _this.data.order_pay_price,
          order_pay_price: "0.00",
          checkbox_color: "background:#ff495e;border:2rpx solid #ff495e;"
        });
      }else{
        App.showError('余额不足，只有余额大于订单金额才能进行余额支付');
        return false;
      }
    }else {
      console.log("余额未选中状态")
      App._get('user.balance/me', {}, result => {
        if(_this.data.order_pay_price <= result.data.balance){
          _this.setData({
            checked: "0",
            balance_deduction: "",
            order_pay_price: _this.data.order_total_price,
            checkbox_color: "background:#fff;border:2rpx solid #ccc;",
          });
        }else{
        _this.setData({
            checked: "0",
            balance_deduction: "",
            order_pay_price: parseFloat(Number(_this.data.order_pay_price) + Number(result.data.balance)).toFixed(2),
            checkbox_color: "background:#fff;border:2rpx solid #ccc;"
          });
        }
      })
    }
  },
  /**
   * 选择收货地址
   */
  selectAddress: function() {
    wx.navigateTo({
      url: '../address/' + (this.data.exist_address ? 'index?from=flow' : 'create')
    });
  },

  /**
   * 订单提交
   */
  submitOrder: function() {
    let _this = this,
    options = _this.data.options;

    if (_this.data.disabled) {
      return false;
    }

    if (_this.data.hasError) {
      App.showError(_this.data.error);
      return false;
    }
    if(_this.data.checked=="1") {
      console.log("余额购买")
      // 显示loading
      wx.showLoading({
        title: '正在处理...'
      });

      // 创建订单-立即购买
      if (options.order_type === 'buyNow') {
        App._post_form('order/buyNow', {
          goods_id: options.goods_id,
          goods_num: options.goods_num,
          goods_sku_id: options.goods_sku_id,
          delivery_time: this.data.multiIndex,
          remark: this.data.remark,
          use_balance:1
        }, function (result) {
          // success
          console.log(result);
          if (result.code == "1") {
            wx.redirectTo({
              url: '../order/detail?order_id=' + result.data.order_id,
            });
          } else {
            // 跳转到未付款订单
            wx.redirectTo({
              url: '../order/index?type=payment',
            });
          }
          //按钮禁用, 防止二次提交
          _this.data.disabled = true;
          
        }, function (result) {
          // fail
          console.log('fail');
        }, function () {
          // complete
          console.log('complete');
          // 解除按钮禁用
          _this.data.disabled = false;
        });
      }
      // 创建订单-购物车结算
      else if (options.order_type === 'cart') {
        App._post_form('order/cart', {
          delivery_time: this.data.multiIndex,
          remark: this.data.remark,
          use_balance:1
        }, function (result) {
          // success
          console.log('success');
          wx.redirectTo({
            url: '../order/detail?order_id=' + result.data.order_id,
          });
        }, function (result) {
          // fail
          console.log('fail');
        }, function () {
          // complete
          console.log('complete');
          // 解除按钮禁用
          _this.data.disabled = false;
        });
      }
    }else{
      console.log("微信购买")
      // 订单创建成功后回调--微信支付
      let callback = function (result) {
        if (result.code === -10) {
          App.showError(result.msg, function () {
            // 跳转到未付款订单
            wx.redirectTo({
              url: '../order/index?type=payment',
            });
          });
          return false;
        }
        // 发起微信支付
        wx.requestPayment({
          timeStamp: result.data.payment.timeStamp,
          nonceStr: result.data.payment.nonceStr,
          package: 'prepay_id=' + result.data.payment.prepay_id,
          signType: 'MD5',
          paySign: result.data.payment.paySign,
          success: function (res) {
            // 跳转到订单详情
            wx.redirectTo({
              url: '../order/detail?order_id=' + result.data.order_id,
            });
          },
          fail: function () {
            App.showError('订单未支付', function () {
              // 跳转到未付款订单
              wx.redirectTo({
                url: '../order/index?type=payment',
              });
            });
          },
        });
      };
      //按钮禁用, 防止二次提交
      _this.data.disabled = true;

      // 显示loading
      wx.showLoading({
        title: '正在处理...'
      });

      // 创建订单-立即购买
      if (options.order_type === 'buyNow') {
        App._post_form('order/buyNow', {
          goods_id: options.goods_id,
          goods_num: options.goods_num,
          goods_sku_id: options.goods_sku_id,
          delivery_time: this.data.multiIndex,
          remark: this.data.remark,
        }, function (result) {
          // success
          console.log('success');
          callback(result);
        }, function (result) {
          // fail
          console.log('fail');
        }, function () {
          // complete
          console.log('complete');
          // 解除按钮禁用
          _this.data.disabled = false;
        });
      }

      // 创建订单-购物车结算
      else if (options.order_type === 'cart') {
        App._post_form('order/cart', {
          delivery_time: this.data.multiIndex,
          remark: this.data.remark
        }, function (result) {
          // success
          console.log('success');
          callback(result);
        }, function (result) {
          // fail
          console.log('fail');
        }, function () {
          // complete
          console.log('complete');
          // 解除按钮禁用
          _this.data.disabled = false;
        });
      }
    }

    

    

  },
  bindchange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindKeyInput:function(e){
    this.setData({
      remark: e.detail.value
    })
  }
});