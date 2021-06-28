let planet_end_url = "101.133.135.126";

let planet_list_url = "http://" + planet_end_url + ":8080/list";


function collectComeTo(star_asaId) {
    // alert(star_asaId);
    voyage_asaId = star_asaId;
    voyage_state = 1;
    document.getElementById("__voyage").click();
}

function planet() {
    let formData = new FormData();
    formData.append("limit", 7);
    $.ajax({
        url: planet_list_url,
        datatype: 'json',
        type: 'POST',
        async: true,
        timeout: 0,
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data);

            let all = data['data'];
            let cnt = 0;
            for (let o in all) {
                cnt++;
            }
            console.log("cnt:", cnt);
            if (cnt <1) {
                alert("list number should be more than 1 !");
                // let content = "<h3 class=\'text-center\'>let's buy some NFT:)</h3>";
                // console.log(content);
                //
                // document.getElementById('collect-work').innerHTML = content;
                // return;
            }else {

                let rhs=all[0];
                let __asaId = rhs['AsaId'];
                let __OssAddress = "https://"+rhs['OssAddress']+"?x-oss-process=image/resize,m_lfit,w_540";
                let __Money = rhs['Price'] * 1.0 / 1000000;

                let __avatar="https://"+rhs['CreatorAvatar']+"?x-oss-process=image/resize,m_lfit,w_540";

                let left="   <img src=\"" +
                    __OssAddress+"\"  width=\"70%\" class=\"text-center\">";
                document.getElementById("planet-photo").innerHTML=left;

                let right= "      <br><br>      " +
                    " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src=\"" +
                    __avatar +
                    "\" class=\"img-circle\" height=\"80px\" width=\"80px\" >"+
                    "<h3 >price:&nbsp;" + __Money +
                    "&nbsp;algo(s) </h3>\n" +
                    "            <h4>NFT ID:&nbsp;" + __asaId +
                    "</h4>\n" +
                    // "            <p>create time:&nbsp;" + __createTime +
                    // "</p>\n" +
                    "<p> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a onclick=\"" +
                    "collectComeTo(" + __asaId + ")" +
                    "\" class=\"btn btn-info\"> check </a> </p>" ;
                document.getElementById("planet-intro").innerHTML=right;


                let header="   <div class=\"page-header\">\n" +
                    "                <h4>   <p class=\"glyphicon glyphicon-eye-open\"></p> enjoy more</h4>\n" +
                    "            </div>";



                let content = header+"<div class=\"bs-example\"> <div class=\"row\">";
                let sum=cnt-1-(cnt-1)%3;

                for (let i = 1; i <1+sum; i++) {
                    let o = all[i];
                    // console.log(o);
                    let __asaId = o['AsaId'];
                    let __OssAddress = "https://"+o['OssAddress']+"?x-oss-process=image/resize,m_lfit,w_540";//"https://algotest123.oss-cn-beijing.aliyuncs.com/test/" + o['FileHash'] + ;
                    // let __createTime = o["CreatedAt"];
                    let __Money = o['Price'] * 1.0 / 1000000;

                    console.log(__asaId);
                    console.log(__OssAddress);
                    // console.log(__createTime);
                    console.log(__Money);


                    let omg = "\n" +
                        "<div class=\"col-sm-6 col-md-4\">\n" +
                        "    <div class=\"thumbnail\" >\n" +
                        "        <img src=\"" +
                        __OssAddress +
                        "\" alt=\"Generic placeholder thumbnail\">\n" +
                        "        <div class=\"caption\">\n" +
                        "            <h3>price:&nbsp;" + __Money +
                        "</h3>\n" +
                        "            <h5>NFT ID:&nbsp;" + __asaId +
                        "</h5>\n" +
                        // "            <p>create time:&nbsp;" + __createTime +
                        // "</p>\n" +
                        "<p> <a onclick=\"" +
                        "collectComeTo(" + __asaId + ")" +
                        "\" class=\"btn btn-info\"> check </a> </p>" +
                        // "            <p><a href=\"#\" class=\"btn btn-primary\" role=\"button\">Button</a> <a href=\"#\" class=\"btn btn-default\" role=\"button\">Button</a></p>\n" +
                        "        </div>\n" +
                        "    </div>\n" +
                        "</div>";
                    content += omg;
                    console.log(__OssAddress);

                }
                content += "</div></div>";
                console.log(content);
                document.getElementById("planet-work").innerHTML = content;
            }

        },
        error: function (data) {
            alert(JSON.stringify(data, 0, 2));
        }
    });
}
