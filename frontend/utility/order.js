let order_end_url = "101.133.135.126";

let order_url = "http://" + order_end_url + ":8080/order";
let success_url = "http://" + order_end_url + ":8080/success";


function order() {
    document.getElementById("order-button-code").innerHTML="";
    let bidData = new FormData();
    bidData.append("bobAddress", signup_address);
    $.ajax({
        url: order_url,
        datatype: 'json',
        type: 'POST',
        async: true,
        timeout: 0,
        data: bidData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            // alert(JSON.stringify(data,0,2));
            console.log("-------------------");
            console.log(data);
            let tx = data['data'];
            let cnt = 0;
            for (let o in tx) {
                cnt++;
            }
            if (cnt == 0) {
                // alert("没有订单");
                let content = " <br><br> <br> <div class=\"page-header\" >\n" +
                    "            <h1 class=\"text-center\">You have no orders to process :| </h1>\n" +
                    "          </div>";
                document.getElementById("order-Notice").innerHTML = content;
                document.getElementById("order-img").innerHTML = "";
                document.getElementById("order-price").innerHTML = "";
                document.getElementById("order-assetId").innerHTML = "";
                document.getElementById("order-button").innerHTML = "";
                document.getElementById("order-next-button").innerHTML = "";
            } else {


                let tx_cnt = 0;
                for (let o in tx) {
                    tx_cnt++;
                }

                let choose = tx[0];
                // alert("有订单");
                console.log(choose);
                aliceAddress = choose['AliceAddress'];
                bobAddress = choose['BobAddress'];
                // ,amount,assetId, aliceAddress,bobAddress
                amount = choose['Money'];
                assetId = choose['AsaId'];
                mememe = parseInt(choose['AsaId']);

                let one = new FormData();
                one.append("asaId", assetId);
                $.ajax({
                    url: voyage_one,
                    datatype: 'json',
                    type: 'POST',
                    async: true,
                    timeout: 0,
                    data: one,
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (data) {

                        let all = data['data'];
                        let item = all;
                        console.log(item);

                        let __Price = item['Price'] * 1.0 / 1000000;
                        let __OwnerAddress = item['OwnerAddress'];
                        let __OssAddress = "https://" + item['OssAddress'];

                        let content0 = " <div class=\"page-header\" >\n" +
                            "            <h1 class=\"text-center\"> Come and process your order :) </h1>\n" +
                            "          </div>";
                        document.getElementById("order-Notice").innerHTML = content0;


                        let content = " <img src=\"" +
                            __OssAddress +
                            "\" class=\"text-center\" width=\"\" height=\"360\">";

                        console.log("in order====================");
                        console.log(content);
                        console.log(__OssAddress);

                        document.getElementById("order-img").innerHTML = content;

                        let content2 = "<h2>price:&nbsp;" + __Price + "&nbsp;algo(s)</h2>";
                        document.getElementById("order-price").innerHTML = content2;


                        let content3 = " <button onclick=\"helloBob()\" type=\"button\" class=\"btn btn-lg btn-info\" style=\"display:block;margin:0 auto;width: 30%\" >accept</button>";
                        document.getElementById("order-button").innerHTML = content3;

                        let content4 = " <br> <button onclick=\"order()\" type=\"button\" class=\"btn btn-lg btn-default\" style=\"display:block;margin:0 auto;width: 30%\" >Process the next order</button>";
                        if (tx_cnt > 1) document.getElementById("order-next-button").innerHTML = content4;
                        else {
                            let content5 = " <br> <button onclick=\"order()\" type=\"button\" class=\"btn btn-lg btn-default\" style=\"display:block;margin:0 auto;width: 30%\" >the order above is the only one :) </button>";
                            document.getElementById('order-next-button').innerHTML = content5;
                        }


                        amount = item['Price'];
                        bobAddress = __OwnerAddress;


                    },
                    error: function (data) {

                        alert(JSON.stringify(data, 0, 2));
                    }
                });
            }
        },
        error: function (data) {
            alert(JSON.stringify(data, 0, 2));
        }
    });
}