let star_end_url = "101.133.135.126";

let star_listcreate = "http://" + star_end_url + ":8080/listcreate";


function comeTo(star_asaId) {
    // alert(star_asaId);
    voyage_asaId = star_asaId;
    voyage_state = 1;
    document.getElementById("__voyage").click();
}

function listcreate() {
    let formData = new FormData();
    formData.append("address", signup_address);

    $.ajax({
        url: star_listcreate,
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

                let content = "<h3 clas=\'text-center\'>let's create some NFT:)</h3>";
                console.log(content);

                document.getElementById('star-work').innerHTML = content;


            } else {

                let content = "      <div class=\"bs-example\" data-example-id=\"thumbnails-with-custom-content\">\n" +
                    "                        <div class=\"row\">";

                for (let i = 0; i < cnt; i++) {
                    let o = all[i];
                    // console.log(o);
                    let __asaId = o['AsaId'];
                    let __OssAddress = "https://" + o['OssAddress'] + "?x-oss-process=image/resize,m_lfit,w_540";
                    let __createTime = o["CreatedAt"];
                    console.log(__asaId);
                    console.log(__OssAddress);
                    console.log(__createTime);

                    let omg = "\n" +
                        "<div class=\"col-sm-6 col-md-4\" " +
                        // "onclick='comeTo(" +__asaId+" )'" +
                        ">\n" +
                        "    <div class=\"thumbnail\">\n" +
                        "        <img src=\"" +
                        __OssAddress +
                        "\" alt=\"Generic placeholder thumbnail\">\n" +
                        "        <div class=\"caption\">\n" +
                        "            <h3>NFT ID:&nbsp;" + __asaId +
                        "</h3>\n" +

                        "            <p>create time:&nbsp;" + __createTime +
                        "</p>\n" +

                        "<p> <a onclick=\"" +

                        "comeTo(" + __asaId + ")" +

                        "\" class=\"btn btn-info\"> check </a> </p>" +

                        // "            <p><a href=\"#\" class=\"btn btn-primary\" role=\"button\">Button</a> <a href=\"#\" class=\"btn btn-default\" role=\"button\">Button</a></p>\n" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "</div>";

                    // console.log(omg);
                    content += omg;
                    // console.log(__OssAddress);


                }
                content += "</div></div>";
                console.log(content);

                document.getElementById("star-work").innerHTML = content;
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


function star() {
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
                let tmp = " <img id=\"star-avatar\" src=\"" +
                    signup_up_avatar +
                    "\" class=\"img-circle\" height=\"200px\" width=\"200px\">\n";

                document.getElementById("star-img").innerHTML = tmp;//signup_up_avatar;
                document.getElementById('star-name').innerText = signup_userName;
                document.getElementById('star-introduction').innerText = signup_introduction;
                listcreate();


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





