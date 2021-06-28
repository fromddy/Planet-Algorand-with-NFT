let bid_end_url = "101.133.135.126";

let bid_payed = "http://" + bid_end_url + ":8080/payed";
let bid_one = "http://"+bid_end_url+":8080/one";

let bid=undefined;

async function bid_withdraw(i){
    let choose=bid[i];
    aliceAddress = choose['AliceAddress'];
    bobAddress = choose['BobAddress'];
    amount = choose['Money'];
    assetId = choose['AsaId'];

    console.log("aliceAddress:"+aliceAddress);
    console.log("bobAddress:"+bobAddress);
    console.log("amount:"+amount);
    console.log("assetId:"+assetId);
    // mememe = parseInt(choose['AsaId']);
    await AliceGetMoney();
    // document.getElementById("__bid").click();

}


async  function bid_head() {
    document.getElementById("alice-information").innerHTML="";

    if(signup_address==undefined){
        alert("Querying bid information needs one address!\r\n You can click [account] then choose one :)");
        return;
    }
    let bidData = new FormData();
    bidData.append("aliceAddress", signup_address);
    await $.ajax({
        url: bid_payed,
        datatype: 'json',
        type: 'POST',
        async: true,
        timeout: 0,
        data: bidData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log("-------------------");
            console.log(data);
            let tx = data['data'];

            bid=tx;

            let cnt = 0;
            for (let o in tx) {
                cnt++;
            }
            if (cnt == 0) {

                // alert("没有订单");
                let content = " <br><br> <br> <div class=\"page-header\" >\n" +
                    "            <h1 class=\"text-center\">You have no bids to process :| </h1>\n" +
                    "          </div>";
                document.getElementById("bid-notice").innerHTML = content;

            }
            else {
                let content2 = " <br><br> <br> <div class=\"page-header\" >\n" +
                    "            <h1 class=\"text-center\">You have some bids that can be withdrawn</h1>\n" +
                    "          </div>";
                document.getElementById("bid-notice").innerHTML = content2;

                let tx_cnt = 0;
                for (let o in tx) {
                    tx_cnt++;
                }

                let content = "   <div class=\"bs-example\" data-example-id=\"thumbnails-with-custom-content\">\n" +
                    "                        <div class=\"row\">";
                console.log("new start"+content);


                for(let i=0;i<tx_cnt;i++){
                    console.log(i);

                    let choose=tx[i];

                    console.log(choose);
                    aliceAddress = choose['AliceAddress'];
                    bobAddress = choose['BobAddress'];
                    amount = choose['Money'];
                    assetId = choose['AsaId'];
                    mememe = parseInt(choose['AsaId']);

                    let one=new FormData();
                    one.append("asaId",assetId);
                    $.ajax({
                        url: bid_one,
                        datatype: 'json',
                        type: 'POST',
                        async: false,
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


                            let omg = "\n" +
                                "<div class=\"col-sm-6 col-md-4\">\n" +
                                "    <div class=\"thumbnail\">\n" +
                                "        <img src=\"" +
                                __OssAddress +
                                "\" alt=\"Generic placeholder thumbnail\">\n" +
                                "        <div class=\"caption\">\n" +
                                "            <h3>price:&nbsp;" + __Price +
                                "</h3>\n" +
                                "            <h5>NFT ID:&nbsp;" + assetId +
                                "</h5>\n" +

                                "<p> <a onclick=\"" +
                                "bid_withdraw(" + i+ ")" +
                                "\" class=\"btn btn-info\"> withdraw </a> &nbsp; " +

                                " </p>" +
                                "        </div>\n" +
                                "    </div>\n" +
                                "</div>";
                            content += omg;
                            if(i==tx_cnt-1){

                                content += "</div></div>";
                                console.log("==============bid====================");
                                console.log(bid);

                                document.getElementById("bid-work").innerHTML = content;
                            }


                        },
                        error: function (data) {

                             // alert(JSON.stringify(data, 0, 2));
                        }
                    });

                }



            }
        },
        error: function (data) {
            alert(JSON.stringify(data, 0, 2));
        }
    });
}
