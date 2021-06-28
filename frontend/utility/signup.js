let end_url="101.133.135.126";

let signup_userinfo_url="http://"+end_url+":8080/userinfo";
let signup_url="http://"+end_url+":8080/signup";
let signup_email_validate_url="http://"+end_url+":8080/validate";

// 0 表示什么信息都没有
// 1 表示除了邮箱，其他都有了
//2  表示该有的信息都有了
let signup_state=0;
let sign=1;

let signup_address=connect_address;
let signup_userName="";
let signup_introduction="";
let signup_up_avatar="";
let signup_email="";
let signup_validate_code="";

function signup_show(){
    console.log("in function signup_show");
    console.log("signup_address:",signup_address);
    console.log("signup_userName:", signup_userName);
    console.log("signup_introduction:",signup_introduction);
    console.log("signup_up_avatar:",signup_up_avatar);
    console.log("signup_email:",signup_email);

    if(signup_userName!=""){
        document.getElementById("account").innerText=signup_userName;
    }
    return;
}


function signup_disappear(input){
    document.getElementById(input.id).innerHTML="";
    return;
}



function signup(){
    console.log("signup=================");
    console.log(signup_state);
    if(signup_state==0) signup_zero();
    else if(signup_state==1) signup_one();
    else if(signup_state==2) signup_two();
    else if(signup_state==3) signup_three();
    else if(signup_state==4) signup_four();



}


function signup_choose_address(props){
    // alert("test"+props);
    signup_address=connect_address;
    signup_state=0;
    signup_userName="";
    signup_introduction="";
    signup_up_avatar="";
    signup_email="";
    signup_validate_code="";

    document.getElementById("connect-yes-AlgoSigner").click();
    document.getElementById("connect-no-AlgoSigner").click();
    document.getElementById("connect-yes-access").click();
    document.getElementById("connect-no-access").click();
    document.getElementById("connect-yes-address").click();
    document.getElementById("connect-no-address").click();
    document.getElementById("signup-no-address").click();
    document.getElementById("signup-yes-address").click();
    document.getElementById("signup-query-fail").click();
    document.getElementById("signup-finish").click();
    document.getElementById("signup-no-information").click();
    document.getElementById("signup-no-email-validate").click();
    document.getElementById("signup-email-validate-success").click();
    document.getElementById("signup-email-validate-fail").click();
    document.getElementById("signup-get-information-fail").click();
    document.getElementById("signup-get-information-success").click();


    signup();

}





function signup_zero(props){
    if(signup_address==undefined) {

        let content="<div class=\"alert alert-warning text-center\">\n" +
            (sign==1?"signup-no-address":"")+
            "          <strong> Warning! </strong> signup need one address!<br>\n" +
            "          You can click [account] then choose one if you have :|\n" +
            "        </div>";
        document.getElementById("signup-no-address").innerHTML=content;

        alert("signup need one address!\r\n You can click [account] then choose one if you have :|");

    }else {
        // let content="<div class=\"alert alert-success text-center\">\n" +
        //     (sign==1?"signup-yes-address":"")+
        //     "          <strong> Well done! </strong> You have the address required for signup :)\n" +
        //     "        </div>";
        // document.getElementById("signup-yes-address").innerHTML=content;
        signup_state=1;
        signup_one();
    }
}


async function signup_one(props){
    let formData = new FormData();
    formData.append("address",signup_address);

    $.ajax({
        url: signup_userinfo_url,
        datatype:'json',
        type: 'POST',
        async: true,
        timeout: 0,
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function(data){

             // console.log("in signup_one");
             // console.log(data);
            if(data['code']==0){
                //sign_up 成功 email 成功
                signup_state=2;
                signup_userName=data['data']['UserName'];
                signup_introduction=data['data']['Introduction'];
                signup_up_avatar=data['data']['Avatar'];
                signup_email=data['data']['Email'];

                signup_show();

                let content="<div class=\"alert alert-success text-center\">\n" +
                    (sign==1?"signup-finish":"")+
                    "          <strong> Well done! </strong> You have finished signup and email validate :)\n" +
                    "        </div>";
                document.getElementById("signup-finish").innerHTML=content;

            }else if(data['code']==1){
                // sign_up 成功 email 没有验证成功
                console.log("sign_up 成功 email 没有验证成功");
                signup_userName=data['data']['UserName'];
                signup_introduction=data['data']['Introduction'];
                signup_up_avatar=data['data']['Avatar'];
                signup_email=data['data']['Email'];
                signup_show();


                let content=" <div class=\"alert alert-warning text-center\">\n" +

                    (sign==1?"signup-no-email-validate":"")+
                    "          <strong> Warning! </strong> You need to get email validated :|\n" +
                    "        </div>";
                document.getElementById("signup-no-email-validate").innerHTML=content;

                signup_state=3;
                // signup_three();

            }else {

                // console.log("in 2");
                // signup_show();

                // 其他情况
                let content=" <div class=\"alert alert-warning text-center\">\n" +
                    (sign==1?"signup-no-information":"")+
                    "          <strong> Warning! </strong> You need to signup and get email validated :|\n" +
                    "        </div>";
                document.getElementById("signup-no-information").innerHTML=content;
                alert("You need to signup and get email validated :|");

                signup_state=4;
            }
        },
        error: function(data) {

            // let content="  <div class=\"alert alert-warning text-center\">\n" +
            //     (sign==1?"signup-query-fail":"")+
            //     "          <strong> Warning! </strong> signup query fail <br>\n" +
            //     "        </div>";
            // document.getElementById("signup-query-fail").innerHTML=content;
            alert("signup query fail \r\n Please contact the administrator :|\n")
        }
        //,
        // complete: function(HttpRequest,textStatus){
        //     console.log(HttpRequest)
        //     $("#complete_result").html(textStatus)
        // }
    });
}

function signup_two(){
    if(signup_state!=2) return;


    let content="<div class=\"alert alert-success text-center\">\n" +
        (sign==1?"signup-finish":"")+
        "          <strong> Well done! </strong> You have finished signup and email validate :)\n" +
        "        </div>";
    document.getElementById("signup-finish").innerHTML=content;
}


async function signup_three(){
    if(signup_state!=3) return;

    signup_validate_code=document.getElementById("email-verification-code").value;
    let formData = new FormData();
    formData.append("email",signup_email);
    formData.append("code",signup_validate_code);
    // console.log("in three");
    // console.log(signup_email);
    // console.log(signup_validate_code);
    $.ajax({
        url: signup_email_validate_url,
        datatype:'json',
        type: 'POST',
        async: true,
        timeout: 0,
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function(data){

            console.log(JSON.stringify(data,0,2));

            if(data['code']==0) {


                let content = "   <div class=\"alert alert-success text-center\">\n" +
                    (sign==1?"signup-email-validate-success":"")+
                    "          <strong> Well done! </strong> You have finished signup and email validate :)\n" +
                    "        </div>";
                document.getElementById('signup-email-validate-success').innerHTML=content;

                signup_state=2;
                signup_show();


            }else {
                // let content="   <div class=\"alert alert-warning text-center\">\n" +
                //     (sign==1?"signup-email-validate-fail":"")+
                //
                //     "          <strong> Warning! </strong> Your  email validate is failed :|\n" +
                //     "<br>"+
                //     data['msg']+
                //     "        </div>";
                // document.getElementById("signup-email-validate-fail").innerHTML=content;

                alert("email validate fail");
            }
        },
        error: function(data) {
            let content="   <div class=\"alert alert-warning text-center\">\n" +
                (sign==1?"signup-email-validate-fail":"")+
                "          <strong> Warning! </strong> Your  email validate is failed :|\n" +
                "<br>"+
                data['msg']+
                "        </div>";
            document.getElementById("signup-email-validate-fail").innerHTML=content;


        }
        //,
        // complete: function(HttpRequest,textStatus){
        //     console.log(HttpRequest)
        //     $("#complete_result").html(textStatus)
        // }
    });
}


async function signup_four(){
    if(signup_state!=4) return;
    signup_address=connect_address;
    signup_introduction=document.getElementById('introduction').value;
    signup_userName=document.getElementById('userName').value;
    signup_email=document.getElementById('email').value;
    signup_up_avatar=document.getElementById('signup-avatar-input').files[0];
   signup_show();
    let formData = new FormData();
    formData.append("address",signup_address);
    formData.append("introduction",signup_introduction);
    formData.append("userName",signup_userName);
    formData.append("email",signup_email);
    formData.append("up_avatar",signup_up_avatar);

    $.ajax({
        url: signup_url,
        datatype:'json',
        type: 'POST',
        async: true,
        timeout: 0,
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function(data){
            // alert('in four');
            // alert(JSON.stringify(data,0,2));

             if(data['code']==-1 ){
                 // let content="   <div class=\"alert alert-warning text-center\">\n" +
                 //     (sign==1?"signup-get-information-fail":"")+
                 //     "          <strong> Warning! </strong> Your  signup is failed :|\n" +
                 //     "<br/>"+
                 //     data['msg']+
                 //     "        </div>";
                 // document.getElementById("signup-get-information-fail").innerHTML=content;
                 alert("signup-get-information-fail\r\n Your signup is failed\r\n Please contact the administrator");

             }else {

                 let content = "<div class=\"alert alert-success text-center\">\n" +
                     (sign==1?"signup-get-information-success":"")+
                     "          <strong> Well done! </strong> You have finished signup  :)\n" +
                     "        </div>";
                 document.getElementById('signup-get-information-success').innerHTML = content;
                 signup_state = 3;
             }
        },
        error: function(data) {
            // let content="   <div class=\"alert alert-warning text-center\">\n" +
            //     (sign==1?"signup-get-information-fail":"")+
            //     "          <strong> Warning! </strong> Your  signup is failed :|\n" +
            //     "        </div>";
            // document.getElementById("signup-get-information-fail").innerHTML=content;
            alert("signup-get-information-fail\r\n Your signup is failed\r\n Please contact the administrator");
        }
        //,
        // complete: function(HttpRequest,textStatus){
        //     console.log(HttpRequest)
        //     $("#complete_result").html(textStatus)
        // }
    });
}