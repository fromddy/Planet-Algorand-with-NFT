let voyage_end_url = "101.133.135.126";

let voyage_one = "http://" + voyage_end_url + ":8080/one";
let voyage_list = "http://" + voyage_end_url + ":8080/list";
let voyage_bid = "http://" + voyage_end_url + ":8080/bid";


let voyage_state = 0;
let voyage_asaId = 0;

function voyage() {
    let voyage_url = undefined;
    let formData = new FormData();
    if (voyage_state == 0) {
        formData.append("limit", 1);
        voyage_url = voyage_list;
    } else {

        formData.append("asaId", voyage_asaId);
        voyage_url = voyage_one;

        console.log("voyage_asaId" + voyage_asaId);
        console.log("voyage_url:" + voyage_url);

    }
    if(signup_state==2){
        let before="<h4>your addresss is below </h4>";
        let buyer_address="<h5>"+signup_address+"</h5>";
            document.getElementById("buyer-address").innerHTML=before+buyer_address;
    }


    $.ajax({
        url: voyage_url,
        datatype: 'json',
        type: 'POST',
        async: true,
        timeout: 0,
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {

            let all = data['data'];

            let item = undefined;
            // alert(voyage_state);


            if (voyage_state == 0) {
                item = all[0];
            } else {
                item = all;

                console.log("-----------------------------");
                console.log(item);
            }

            console.log(item);

            let __Price = item['Price'] * 1.0 / 1000000;
            // let __CreatorAddress=item['CreatorAddress'];
            let __OwnerAddress = item['OwnerAddress'];
            let __OssAddress = "https://" + item['OssAddress'];


            let content = " <img src=\"" +
                __OssAddress +
                "\" class=\"text-center\" width=\"\" height=\"540\">";

            console.log("in voyage");
            console.log(content);
            console.log(__OssAddress);

            document.getElementById("voyage-img").innerHTML = content;

            let content2 = "price:&nbsp;" + __Price + "&nbsp;algo(s)";
            document.getElementById("voyage-price").innerHTML = content2;


            amount = item['Price'];

            if (voyage_state == 0) {
                assetId = item['AsaId'];
            } else {
                assetId = voyage_asaId;
            }
            bobAddress = __OwnerAddress;
            voyage_state = 0;

        },
        error: function (data) {
            alert(JSON.stringify(data, 0, 2));
        }
    });
}