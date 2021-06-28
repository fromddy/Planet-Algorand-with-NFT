let collect_end_url = "101.133.135.126";

let collect_listown = "http://" + collect_end_url + ":8080/listown";

function collectComeTo(star_asaId) {
    // alert(star_asaId);
    voyage_asaId = star_asaId;
    voyage_state = 1;

    document.getElementById("__voyage").click();
}

function listown() {
    document.getElementById("star-work").innerHTML="";

    let formData = new FormData();
    formData.append("address", signup_address);

    $.ajax({
        url: collect_listown,
        datatype: 'json',
        type: 'POST',
        async: true,
        timeout: 0,
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            // 这里signup_state 一定等于2
            //signup_state=2;
            // signup_userName = data['data']['UserName'];
            // signup_introduction = data['data']['Introduction'];
            // // signup_up_avatar = data['data']['Avatar'];
            // signup_email = data['data']['Email'];
            // signup_up_avatar = "https://" + data['data']['Avatar'];
            // console.log(signup_up_avatar);

            let all = data['data'];
            let cnt = 0;
            for (let o in all) {
                cnt++;
            }
            console.log("cnt:", cnt);

            if (cnt == 0) {

                let content = "<h3 class=\'text-center\'>let's buy some NFT:)</h3>";
                console.log(content);

                document.getElementById('collect-work').innerHTML = content;


            } else {
                let before="<div class=\"page-header\">\n" +

                    "                <h2 id=\"star-introduction\">what I collected </h2>\n" +
                    "            </div>\n";

                let content = before+"      <div class=\"bs-example\" data-example-id=\"thumbnails-with-custom-content\">\n" +
                    "                        <div class=\"row\">";

                for (let i = 0; i < cnt; i++) {
                    let o = all[i];
                    // console.log(o);
                    let __asaId = o['AsaId'];

                    let __OssAddress = "https://algotest123.oss-cn-beijing.aliyuncs.com/test/" + o['FileHash'] + "?x-oss-process=image/resize,m_lfit,w_540";
                    let __createTime = o["CreatedAt"];
                    let __Money = o['Money'] * 1.0 / 1000000;

                    console.log(__asaId);
                    console.log(__OssAddress);
                    console.log(__createTime);
                    console.log(__Money);


                    let omg = "\n" +
                        "<div class=\"col-sm-6 col-md-4\">\n" +
                        "    <div class=\"thumbnail\">\n" +
                        "        <img src=\"" +
                        __OssAddress +
                        "\" alt=\"Generic placeholder thumbnail\">\n" +
                        "        <div class=\"caption\">\n" +
                        "            <h3>price:&nbsp;" + __Money +
                        "</h3>\n" +
                        "            <h5>NFT ID:&nbsp;" + __asaId +
                        "</h5>\n" +
                        "            <p>create time:&nbsp;" + __createTime +
                        "</p>\n" +
                        "<p> <a onclick=\"" +
                        "collectComeTo(" + __asaId + ")" +
                        "\" class=\"btn btn-info\"> check </a> &nbsp; " +
                        " <a onclick=\"" +
                        "sell(" + __asaId+")" +
                        "\" class=\"btn btn-info\"> &nbsp;&nbsp;sell &nbsp;&nbsp;</a> </p>" +
                        // "            <p><a href=\"#\" class=\"btn btn-primary\" role=\"button\">Button</a> <a href=\"#\" class=\"btn btn-default\" role=\"button\">Button</a></p>\n" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "</div>";
                    content += omg;
                    console.log(__OssAddress);

                }
                content += "</div></div>";
                console.log(content);
                document.getElementById("collect-work").innerHTML = content;
            }

        },
        error: function (data) {
            alert(JSON.stringify(data, 0, 2));
        }
        //,
        // complete: function(HttpRequest,textStatus){
        //     console.log(HttpRequest)
        //     $("#complete_result").html(textStatus)
        // }
    });
}


function collect() {
    if (connect_address == null) {
        alert("you need to click [accounts] first");
    } else if (signup_state != 2) {
        alert("you need to click [signup] first");
    } else {

        let formData = new FormData();
        formData.append("address", signup_address);

        $.ajax({
            url: signup_userinfo_url,
            datatype: 'json',
            type: 'POST',
            async: true,
            timeout: 0,
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            success: function (data) {
                // 这里signup_state 一定等于2
                //signup_state=2;
                signup_userName = data['data']['UserName'];
                signup_introduction = data['data']['Introduction'];
                // signup_up_avatar = data['data']['Avatar'];
                signup_email = data['data']['Email'];
                signup_up_avatar = "https://" + data['data']['Avatar'];
                // console.log(signup_up_avatar);
                let tmp = " <img  src=\"" +
                    signup_up_avatar +
                    "\" class=\"img-circle\" height=\"200px\" width=\"200px\">\n";

                document.getElementById("collect-img").innerHTML = tmp;//signup_up_avatar;
                document.getElementById('collect-name').innerText = signup_userName;
                document.getElementById('collect-introduction').innerText = signup_introduction;


                listown();

            },
            error: function (data) {
                alert(JSON.stringify(data, 0, 2));
            }
            //,
            // complete: function(HttpRequest,textStatus){
            //     console.log(HttpRequest)
            //     $("#complete_result").html(textStatus)
            // }
        });
    }
}





