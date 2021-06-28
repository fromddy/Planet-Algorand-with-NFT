let upload_end_url = "101.133.135.126";

let upload_tupian_url = "http://" + upload_end_url + ":8080/upload";
let upload_asa_url = "http://" + upload_end_url + ":8080/upload/asa";

let upload_address = undefined;
let upload_state = undefined;
let upload_tupian = undefined;
let upload_tupian_sha1 = undefined;
let upload_amount = undefined;
let upload_tupian_oss = undefined;
let upload_asaId = undefined;


function upload_init(){


    console.log("upload_init");
    // let obj=document.getElementById("upload-NFT-input");
    // obj.outerHTML=obj.outerHTML;
    // document.getElementById("upload-NFT-button-img").innerHTML="";

    document.getElementById("upload-first-code").innerHTML="";
    document.getElementById("asa-code").innerHTML="";
    document.getElementById("asa-last-code").innerHTML="";

    return;
}

function upload_verify() {
    upload_address = signup_address;
    upload_state = signup_state;
    if (upload_address == undefined) {
        return 1;
    } else if (upload_state != 2) {
        return 2;
    } else {
        return 0;
    }
}

function upload_checkfile() {
    const item = document.getElementById('upload-NFT-input');
    const file = item.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) return 2; // 文件大小超过了5MB
        else return 0;  // ok
    } else {
        // 没有文件
        return 1;
    }
}


function upload_NFT() {
    let input = document.getElementById('upload-NFT-input');
    if (input.files.length) {
        document.getElementById('upload-NFT-button-text').innerHTML = "";
        let content = "<img id=\"upload-NFT-button-img-inside\"  src=\"\" width=\"460px\" height=\"250px\">";
        let test = document.getElementById('upload-NFT-button-img');
        test.innerHTML = content;

        let file = input.files[0];
        let reader = new FileReader();
        reader.onload = function () {
            document.getElementById('upload-NFT-button-img-inside').src = this.result;
        }
        reader.readAsDataURL(file);
    }
    upload_calSHA1();
}

async function upload_calSHA1() {
    const item = document.getElementById('upload-NFT-input');
    const file = item.files[0];
    if (file) {
        console.log(file.name);

        var reader = new FileReader();
        reader.onload = function (event) {
            var res = event.target.result;

            res = CryptoJS.lib.WordArray.create(res);
            let omg = CryptoJS.SHA1(res).toString();
            upload_tupian = file;
            upload_tupian_sha1 = omg;
            return omg;
        }
        reader.readAsArrayBuffer(file);
    }
    return -1;
}


async function upload() {


    if (connect_address == null) {
        alert("you need to click [accounts] first");
        return;
    } else if (signup_state != 2) {
        alert("you need to click [signup] first");
        return;
    }

    let checkpoint1 = upload_verify();
    if (checkpoint1 == 1) {
        alert("没有地址");
        return;

    } else if (checkpoint1 == 2) {
        // 请先注册
        alert("请先注册");
        return;

    }
    let checkpoint2 = upload_checkfile();
    if (checkpoint2 == 1) {
        // 没有文件
        alert("没有文件");
        return;

    } else if (checkpoint2 == 2) {
        // 文件大小超过了5MB
        alert("文件大小超过了5MB");
        return;

    }

    upload_amount = document.getElementById("upload-amount").value * 1000000;
    let content = "  <br>\n" +
        "                    <div class=\"panel panel-info\">\n" +
        "                        <div class=\"panel-heading\">\n" +
        "                            <h3 class=\"panel-title text-center\"> Please remain patient </h3>\n" +
        "                        </div>\n" +
        "                        <div class=\"panel-body text-center\">\n" +
        "                            Wait a few seconds ...\n" +
        "\n" +
        "                        </div>\n" +
        "                    </div>";
    document.getElementById("upload-first-code").innerHTML = content;

    var formData = new FormData();
    formData.append("up_file", upload_tupian);
    formData.append("sha1", upload_tupian_sha1);
    formData.append("address", upload_address);

    $.ajax
    ({
        url: upload_tupian_url,
        dataType: 'json',
        type: 'POST',
        async: true,
        timeout: 0, // first
        data: formData,
        cache: false, // second   first和second组合在一起 试图解决ajax的fail问题
        processData: false, // 使数据不做处理
        contentType: false, // 不要设置Content-Type请求头
        success: function (data) {

            // 上传成功 需要进一步处理
            // alert('success');
            console.log("===========================");
            console.log(data);


            if (data['code'] == 0) {
                upload_tupian_oss = data.data.ossAddress;
                asa_upload();

            } else {

                let msg = data['msg'];
                // 失败信息报错
                alert(msg);
            }


        },
        error: function (data) {
            //上传失败要报错
            alert("something wrong :( 上传失败要报错\r\n" + JSON.stringify(data, 0, 2))
        }
        // complete: function(HttpRequest,textStatus){
        //     console.log(HttpRequest)
        //     $("#complete_result").html(textStatus)
        // }
    });
}


