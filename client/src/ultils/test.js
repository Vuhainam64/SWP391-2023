var url = prompt("Nhập Link Shopee:", "Nhập Link");
var regex = /i\.(\d+)\.(\d+)\?/;
var match = url.match(regex);
if (match) {
    var shopId = match[1];
    var itemId = match[2];
    var data = {
        shop_id: shopId,
        item_id: itemId
    };
    fetch("http://food.myftp.biz/get-product", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(productData => {
            const model = productData.models[0];
            const modelId = model.modelid;
            if (model.promotionid !== 0) {
                var newData = {
                    address: {
                        city: "Thành Phố Biên Hòa",
                        detail: "35 Đ. 30 Tháng 4, Trung Dũng, Thành phố Biên Hòa, Đồng Nai",
                        district: "Phường Trung Dũng",
                        location: "Phường Trung Dũng - Thành Phố Biên Hòa - Đồng Nai",
                        mail: "vuhainam272+abc@gmail.com",
                        name: "Vũ Hải Nam",
                        phone: "0915747528",
                        state: "Đồng Nai",
                    },
                    products: [{
                        shopid: productData.shopid,
                        itemid: productData.itemid,
                        name: productData.name,
                        link: url,
                        option: modelId,
                        qty: "1",
                        price: productData.price,
                    }],
                    voucher: "50",
                };
                fetch("http://food.myftp.biz/pre-checkout", {
                        method: "POST",
                        body: JSON.stringify(newData),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                    .then((response) => response.json())
                    .then((result) => {
                        console.log("Kết quả từ http://food.myftp.biz/pre-checkout:", result);
                    })
                    .catch((error) => {
                        console.error("Lỗi khi gửi yêu cầu:", error);
                        console.log(newData)
                    });
            } else {
                console.log("Sản phẩm này không áp dụng giảm giá");
            }
        })
        .catch(error => {
            console.error("Lỗi khi gửi yêu cầu:", error);
        });
} else {
    console.log("Không tìm thấy dữ liệu cần trích xuất trong URL.");
}