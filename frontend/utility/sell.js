let sell_end_url = "101.133.135.126";

let sell_url = "http://" + sell_end_url + ":8080/sell";
let sell_one = "http://" + sell_end_url + ":8080/one";


let sell_asaId=undefined;
let sell_address=undefined;
let sell_amount=undefined;


function sell_check(){
    if(sell_asaId==undefined) {
        alert("you should to choose one NFT you collected\r\n you can find then in [asset] :)");

        return;
    }
}

function sell(asaId){
    // console.log(asa_pic);
    sell_asaId=asaId;
    sell_address=signup_address;

    console.log("==========sell================");
    console.log(asaId);
    console.log(sell_address);

    document.getElementById("__sell").click();

    let formData = new FormData();
    formData.append("asaId", sell_asaId);
    $.ajax({
        url: sell_one,
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
            console.log(all);
            let item = all;
                console.log("-----------------------------");
                console.log(item);
            let __OssAddress = "https://" + item['OssAddress'];
            let content = " <img src=\"" +
                __OssAddress +
                "\" class=\"text-center\" width=\"\" height=\"400\">";
            document.getElementById("sell-img").innerHTML = content;


        },
        error: function (data) {
            alert(JSON.stringify(data, 0, 2));
        }
    });
}


function sell_button() {

    let tmp=document.getElementById("sell-amount").value;
    if(tmp==undefined || tmp==null){
        alert("please input the new amount :)");
        return;
    }else {
        sell_amount=tmp*1000000;
        console.log(sell_amount);


    }

    let formData = new FormData();
    formData.append("asaId", sell_asaId);
    formData.append("amount",sell_amount);
    formData.append("address",sell_address);


    $.ajax({
        url: sell_url,
        datatype: 'json',
        type: 'POST',
        async: true,
        timeout: 0,
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            alert(JSON.stringify(data,0,2));

            sell_asaId=undefined;
            sell_amount=undefined;
            document.getElementById("sell-img").innerHTML="";
            document.getElementById("__sell").click();



        },
        error: function (data) {
            alert(JSON.stringify(data, 0, 2));
        }
    });
}