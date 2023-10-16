var index = new Vue({
    el: '#app',
    data: {
        axios: axios,
        SlickLoader: SlickLoader,
        localStorage: localStorage,
        listAddress: [],
        address: {},
        isAddress: false,
        listProduct: [],
        checkoutData: {
            'total_payable': 0
        },
        listOrder: [],
        accountInfo: {
            'address': ''
        },
        isLoading: false,
        addressOld: '',
        messageData: '',
        status: '',
        totalOrder: 0,
        editMode: '',
        transId: '',
        typeVoucher: '40'
    },
    created: function () {
        SlickLoader.setText('Shopee');
        SlickLoader.element.getElementsByTagName("text")[0].style.fontSize = '11px';
        SlickLoader.enable();
        axios.interceptors.request.use((config) => {
            if (config.url != '/get-account-info?balance') {
                SlickLoader.enable();
            }
            return config;
        }, (error) => {
            SlickLoader.disable();
            return Promise.reject(error);
        });
        axios.interceptors.response.use((response) => {
            if (response.config.url != '/get-account-info?balance') {
                SlickLoader.disable();
            }
            return response;
        }, (error) => {
            SlickLoader.disable();
            return Promise.reject(error);
        });
    },
    mounted: function () {
        if (localStorage.getItem('address')) {
            this.address = JSON.parse(localStorage.getItem('address'));
            this.isAddress = true;
        } else {
            this.isAddress = false;
        }
        this.newProduct();
        this.getListOrder();
        axios.get('/get-account-info')
            .then((response) => {
                var address = {
                    'name': '',
                    'phone': '',
                    'description': '',
                    'detail': '',
                    'place_id': '',
                    'balance': 0
                }
                var accountInfo = response.data;
                if (response.data.address == null) {
                    accountInfo.address = address;
                    this.accountInfo = accountInfo;
                } else {
                    accountInfo.address = JSON.parse(accountInfo.address);
                    if (accountInfo.address.place_id == undefined || accountInfo.address.place_id == '' || accountInfo.address.description == '') {
                        this.accountInfo = accountInfo;
                        this.listAddress = [];
                        return;
                    }
                    this.accountInfo = accountInfo;
                    this.addressOld = accountInfo.address;
                    this.listAddress = [];
                    if (localStorage.getItem('cart') != null) {
                        let cart = JSON.parse(localStorage.getItem('cart'));
                        localStorage.clear();
                        this.getStore(cart.merchantId, JSON.parse(cart.dishes), cart.type_voucher);
                    } else {
                        // this.getListStore();
                        // this.getListOrder();
                    }
                    setTimeout(() => {
                        index.getAccInfo();
                    }, 10000);
                    //this.msgBox('Xin lỗi các bạn đợt vừa qua shopee quét hủy đơn và thu hồi toàn bộ mã 50k nên hiện tại đơn hàng của các bạn mình không thể thực hiện được, mình đã hoàn tiền các bạn cần thì đặt lại mã 40k mình đi đơn liền nhé, mong các bạn thông cảm nhé !');
                }
            });
    },
    methods: {
        getAccInfo: function () {
            axios.get('/get-account-info?balance')
                .then((response) => {
                    var accountInfo = response.data;
                    if (accountInfo.balance > this.accountInfo.balance) {
                        this.msgBox('Nạp tiền thành công, Số tiền : ' + this.fomartNumber(accountInfo.balance - this.accountInfo.balance));
                    }
                    this.accountInfo.balance = accountInfo.balance;
                    setTimeout(() => {
                        index.getAccInfo();
                    }, 10000);
                })
                .catch(function (error) {
                    setTimeout(() => {
                        index.getAccInfo();
                    }, 10000);
                })
        },
        loadBalance: function () {
            axios.get('/get-account-info?balance')
                .then((response) => {
                    this.accountInfo.balance = response.data.balance;
                })
        },
        getListOrder: function () {
            axios.get('/list-checkout')
                .then((response) => {
                    this.listOrder = response.data;
                })
        },
        searchAddress: function (event) {
            axios.post('/search-address', {
                    'text': event.target.value
                })
                .then((response) => {
                    this.listAddress = response.data.data[0].predictions;
                })
        },
        selectAddress: function (address) {
            this.address.district = address.terms[0].value;
            this.address.city = address.terms[1].value;
            this.address.state = address.terms[2].value;
            this.address.location = address.terms[0].value + ' - ' + address.terms[1].value + ' - ' + address.terms[2].value;
            this.listAddress = [];
        },
        saveAddress: function () {
            if (!this.validatePhoneNumber(this.address.phone)) {
                this.msgBox("Số điện thoại không hợp lệ !")
                return;
            }
            if (this.address.name.indexOf(' ') == -1) {
                this.msgBox("Phải nhập họ và tên !")
                return;
            }
            if (!this.address.phone || !this.address.name || !this.address.detail || !this.address.location || !this.address.mail) {
                this.msgBox("Vui lòng điền đầy đủ thông tin !")
                return;
            }
            this.localStorage.setItem('address', JSON.stringify(this.address));
            this.isAddress = true;
            this.msgBox("Đã lưu địa chỉ thành công !")
        },
        validatePhoneNumber: function (phoneNumber) {
            const regex = /^(?:0|\84)[1-9]\d{8}$/;
            return regex.test(phoneNumber);
        },
        newProduct: function () {
            this.listProduct.push({
                'shopid': '',
                'itemid': '',
                'name': '',
                'link': '',
                'option': '',
                'qty': '1',
                'options': [],
                'price': ''
            });
        },
        delProduct: function (index) {
            this.listProduct.splice(index, 1);
        },
        getProduct: function (event, index, url) {
            if (!url) {
                url = event.target.value;
            }
            if (url.indexOf('-i.') != -1 || url.indexOf('product/') != -1) {
                if (url.indexOf('-i.') != -1) {
                    var regex = /-i\.(\d+)\.(\d+)/;
                    var matches = url.match(regex);
                    var shop_id = matches[1];
                    var item_id = matches[2];
                } else {
                    regex = /product\/(\d+)\/(\d+)/;
                    var matches = url.match(regex);
                    var shop_id = matches[1];
                    var item_id = matches[2];
                }
                axios.post('/get-product', {
                        'shop_id': shop_id,
                        'item_id': item_id
                    })
                    .then((response) => {
                        var isShop = true;
                        for (var i = 0; i < this.listProduct.length; i++) {
                            if (this.listProduct[i].shopid != '' && this.listProduct[i].shopid != response.data.shopid && this.listProduct.length > 1) {
                                isShop = false;
                            }
                        }
                        if (!isShop) {
                            this.msgBox('Vui lòng đặt các sản phẩm cùng 1 shop !');
                            return;
                        }
                        this.listProduct[index].name = response.data.name;
                        this.listProduct[index].options = response.data.models;
                        this.listProduct[index].price = response.data.price;
                        this.listProduct[index].shopid = response.data.shopid;
                        this.listProduct[index].itemid = response.data.itemid;
                        this.checkoutData = {
                            'total_payable': 0
                        };
                        if (response.data.models.length > 0) {
                            this.listProduct[index].option = response.data.models[0].modelid;
                        }
                    })
            }
            if (url.indexOf('.ee/') != -1) {
                axios.post('/get-product', {
                        'url': url
                    })
                    .then((response) => {
                        var isShop = true;
                        for (var i = 0; i < this.listProduct.length; i++) {
                            if (this.listProduct[i].shopid != '' && this.listProduct[i].shopid != response.data.shopid && this.listProduct.length > 1) {
                                isShop = false;
                            }
                        }
                        if (!isShop) {
                            this.msgBox('Vui lòng đặt các sản phẩm cùng 1 shop !');
                            return;
                        }
                        this.listProduct[index].name = response.data.name;
                        this.listProduct[index].options = response.data.models;
                        this.listProduct[index].price = response.data.price;
                        this.listProduct[index].shopid = response.data.shopid;
                        this.listProduct[index].itemid = response.data.itemid;
                        this.checkoutData = {
                            'total_payable': 0
                        };
                        if (response.data.models.length > 0) {
                            this.listProduct[index].option = response.data.models[0].modelid;
                        }
                    })
            }
        },
        preCheckout: function () {
            for (var i = 0; i < this.listProduct.length; i++) {
                if (this.listProduct[i].option == '') {
                    this.msgBox('Vui lòng nhập thông tin sản phẩm bạn nhé !');
                    return;
                }
            }
            axios.post('/pre-checkout', {
                    'address': this.address,
                    'products': this.listProduct,
                    'voucher': this.typeVoucher
                })
                .then((response) => {
                    if (!response.data.promocode_applied) {
                        this.msgBox("Sản phẩm không áp được mã giảm giá !")
                    }
                    this.checkoutData = response.data;
                })
        },
        checkout: function () {
            for (var i = 0; i < this.listProduct.length; i++) {
                if (this.listProduct[i].option == '') {
                    this.msgBox('Vui lòng nhập thông tin sản phẩm bạn nhé !');
                    return;
                }
            }
            // if (!this.checkoutData.promocode_applied) {
            //     this.msgBox('Vui lòng bấm tính tiền trước khi đặt hàng bạn nhé !');
            //     return;
            // }
            $.confirm({
                theme: 'modern',
                title: 'Xác nhận',
                content: 'Vì đặt để giảm tỉ lệ hủy nên hệ thống sẽ đặt bằng tay, Đơn hàng sẽ được đặt và gửi mail thông báo cho các bạn khi đặt thành công ! <br> Nhấn CONFIRM để đặt hàng nhé ?',
                buttons: {
                    confirm: () => {
                        axios.post('/checkout', {
                                'address': this.address,
                                'products': this.listProduct,
                                'actual_price': this.checkoutData.total_payable,
                                'voucher': this.typeVoucher
                            })
                            .then((response) => {
                                if ('error' in response.data) {
                                    this.msgBox(response.data.error);
                                } else {
                                    this.listOrder = response.data;
                                    this.loadBalance();
                                }
                            })
                    },
                    cancel: () => {

                    }
                }
            });
        },
        cancelCheckout: function (order_id) {
            $.confirm({
                theme: 'modern',
                title: 'Xác nhận',
                content: 'Bạn có chắc hủy đơn hàng này chứ ?',
                buttons: {
                    confirm: () => {
                        axios.post('/cancel-checkout', {
                                'order_id': order_id
                            })
                            .then((response) => {
                                this.listOrder = response.data;
                                this.loadBalance();
                            })
                    },
                    cancel: () => {

                    }
                }
            });
        },
        delCheckout: function (order_id) {
            $.confirm({
                theme: 'modern',
                title: 'Xác nhận',
                content: 'Bạn có chắc xóa đơn hàng này chứ ?',
                buttons: {
                    confirm: () => {
                        axios.post('/del-checkout', {
                                'order_id': order_id
                            })
                            .then((response) => {
                                this.listOrder = response.data;
                            })
                    },
                    cancel: () => {

                    }
                }
            });
        },
        editOrder: function (order) {
            this.editMode = order.order_id;
            this.address = order.address;
            this.listProduct = order.product;
        },
        selectAcc: function (order_id, detail, name) {
            $.confirm({
                theme: 'modern',
                title: 'Xác nhận',
                // content: 'Bạn đang thao tác đơn hàng này ?',
                content: '' +
                    '<form action="" class="formName">' +
                    '<div class="form-group">' +
                    '<label>Địa chỉ nếu thay đổi</label>' +
                    '<input type="text" placeholder="Địa chỉ" value="' + name + '" class="name-address form-control" required />' +
                    '<input type="text" placeholder="Địa chỉ" value="' + detail + '" class="address form-control" required />' +
                    '</div>' +
                    '</form>',
                buttons: {
                    Thêm_ĐC: () => {
                        var address = document.getElementsByClassName("address")[0].value;
                        var name = document.getElementsByClassName("name-address")[0].value;
                        axios.post('/select-checkout', {
                                'order_id': order_id,
                                'account': $("#account").val(),
                                'type': 3,
                                'detail': address,
                                'name': name
                            })
                            .then((response) => {
                                // this.listOrder = response.data;
                            })
                    },
                    Tạo_ĐC: () => {
                        var address = document.getElementsByClassName("address")[0].value;
                        var name = document.getElementsByClassName("name-address")[0].value;
                        axios.post('/select-checkout', {
                                'order_id': order_id,
                                'account': $("#account").val(),
                                'type': 2,
                                'detail': address,
                                'name': name
                            })
                            .then((response) => {
                                // this.listOrder = response.data;
                            })
                    },
                    Đã_Mua: () => {
                        var address = document.getElementsByClassName("address")[0].value;
                        var name = document.getElementsByClassName("name-address")[0].value;
                        axios.post('/select-checkout', {
                                'order_id': order_id,
                                'account': $("#account").val(),
                                'type': 1,
                                'detail': address,
                                'name': name
                            })
                            .then((response) => {
                                this.listOrder = response.data;
                            })
                    },
                    Hủy: () => {

                    }
                },
                onContentReady: function () {
                    // bind to events
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        // if the user submits the form by pressing enter in the field.
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });
        },
        reCheckout: function (order) {
            $.confirm({
                theme: 'modern',
                title: 'Xác nhận',
                content: 'Đặt lại sản phẩm này, chọn diachi để sử dụng địa chỉ như đơn này, hoặc chọn sanpham để chỉ mua lại sản phẩm ?',
                buttons: {
                    diachi: () => {
                        this.address = order.address;
                        this.listProduct = order.product;
                        for (var i = 0; i < this.listProduct.length; i++) {
                            this.getProduct(null, i, this.listProduct[i].link)
                        }
                    },
                    sanpham: () => {
                        this.listProduct = order.product;
                        for (var i = 0; i < this.listProduct.length; i++) {
                            this.getProduct(null, i, this.listProduct[i].link)
                        }
                    },
                    huy: () => {

                    }
                }
            });
        },
        getOption: function (product) {
            foundItem = product.options.find(item => item.modelid === product.option);
            return foundItem.name
        },
        formart: function (money) {
            return (Number(money) / 100000).toLocaleString('it-IT', {
                style: 'currency',
                currency: 'VND'
            });
        },
        getStatus: function (status) {
            switch (status) {
                case 0:
                    return 'Đang đặt, bên mình sẽ xử lý sớm nhất cho bạn nhé'
                    /* return 'Vì đang lỗi chưa fix được, nên đơn hàng này ko đặt được bây h, các bạn hủy đơn hàng hoặc chờ mấy ngày để mình tìm nguyên nhân và fix nhé.' */
                case 1:
                    return 'Bạn Đã hủy'
                case 2:
                    return 'Đơn hàng đã bị shopee hủy và đã được hoàn tiền, nếu cần đặt lại bạn thay đổi địa chỉ tí rồi đặt lại nhé, mong bạn thông cảm !'
                case 3:
                    return 'Bạn vui lòng đặt sản phẩm khác nhé'
                case 4:
                    return 'Đã đặt, chờ shopee xác nhận'
                case 5:
                    return 'Shop đang chuẩn bị hàng'
                case 6:
                    return 'Đơn hàng đang vận chuyển'
                case 7:
                    return 'Đơn hàng đang giao'
                case 8:
                    return 'Đơn hàng đã giao'
                case 9:
                    return 'Không cập nhật được trạng thái đơn, Vui lòng kiểm tra mã vận đơn để biết trạng thái'
                default:
                    return status
            }
        },
        getStatusClass: function (status) {
            switch (status) {
                case 0:
                    return 'bg-yellow'
                case 1:
                    return 'bg-darkgrey'
                case 2:
                    return 'bg-darkgrey'
                case 3:
                    return 'bg-cancel'
                case 8:
                    return 'bg-success'
                case 9:
                    return 'bg-cancel'
                default:
                    return ''
            }
        },
        filterListOrder: function (listOrder) {
            let listFilter = [];
            if (this.status == '5') {
                listFilter = listOrder.filter(order => (order.status == '4' || order.status == '5'))
                this.totalOrder = listFilter.length;
                return listFilter;
            }
            if (this.status !== '') {
                listFilter = listOrder.filter(order => order.status == this.status);
                this.totalOrder = listFilter.length;
                return listFilter
            }
            listFilter = listOrder;
            this.totalOrder = listFilter.length;
            return listFilter;
        },
        fomartNumber: function (x) {
            return String(x).replace(/(.)(?=(\d{3})+$)/g, '$1,') + ' Đ';
        },
        reCharge: function () {
            $("#modalReCharge").modal('show');
        },
        msgBox: function (messageData) {
            this.messageData = messageData;
            $("#modalMsg").modal('show');
        },
        setBooking: function (booking) {
            axios.post('/set-booking', {
                    'booking': booking
                })
                .then((response) => {
                    location.reload();
                })
        },
        updateOrder: function () {
            $.confirm({
                theme: 'modern',
                title: 'Xác nhận',
                content: 'Cập nhật order',
                buttons: {
                    confirm: () => {
                        axios.post('/update-checkout', {
                                'address': this.address,
                                'products': this.listProduct,
                                'id': this.editMode
                            })
                            .then((response) => {
                                if ('error' in response.data) {
                                    this.msgBox(response.data.error);
                                } else {
                                    this.listOrder = response.data;
                                    this.editMode = '';
                                }
                            })
                    },
                    cancel: () => {

                    }
                }
            });
        },
        napTien: function () {
            if (this.transId == '') {
                this.msgBox("Mã giao dịch không hợp lệ !");
                return;
            }
            axios.post('/nap-tien', {
                    'transId': this.transId
                })
                .then((response) => {
                    this.msgBox(response.data);
                })
        }
    }
})