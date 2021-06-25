let connect_state = 0;
let connect_address = null;

function connect_disappear(input) {
    document.getElementById(input.id).innerHTML = "";
}

function connect_Genesis() {
    if (connect_state == 0) connect_zero();
    else if (connect_state == 1) connect_one();
    else if (connect_state == 2) connect_two();
    else if (connect_state == 3) ;

}


function connect_zero() {
    if (typeof AlgoSigner !== 'undefined') {

        connect_state = 1;
        connect_one();


    } else {

        let content = " <div class=\"alert alert-warning text-center\">\n" +
            "        <strong> Warning! </strong> You don't have AlgoSigner in your browser :|\n" +
            "      </div>";
        document.getElementById("connect-no-AlgoSigner").innerHTML = content;
    }
}

function connect_one() {
    AlgoSigner.connect()
        .then((d) => {

            connect_state = 2;
            connect_two();


        })
        .catch((e) => {

            let content = " <div class=\"alert alert-warning text-center\">\n" +
                "          <strong> Warning! </strong> You  have no access to AlgoSigner :|\n" +
                "        </div>";
            document.getElementById("connect-no-access").innerHTML = content;

        });
}


function connect_two() {
    let accountsCodeElem = document.getElementById('account-list');
    AlgoSigner.accounts({
        ledger: 'TestNet'
    })
        .then((d) => {
            //let tnAccounts = d;
            // 这里account 我把第一个当作了要给后端传送的地址
            if (d.length == 0) {

                let content = "<div class=\"alert alert-warning text-center\">\n" +
                    "          <strong> Warning! </strong> You  have no address :|\n" +
                    "        </div>";
                document.getElementById("connect-no-address").innerHTML = content;


            } else {

                // Append accounts to account select

                let content = "";
                for (var i = d.length - 1; i >= 0; i--) {
                    let thisAddress = d[i].address;
                    let rhs = "<li>" + thisAddress + "</li>\n";
                    console.log(rhs);
                    content = content + rhs;
                }
                document.getElementById("accounts-list").innerHTML = content;
                connect_setAddress();
                connect_state = 3;
            }

        })
        .catch((e) => {
            console.error(e);
            alert(JSON.stringify(e, 0, 2));
        });
}


function connect_setAddress() {
    var obj_lis = document.getElementById("accounts-list").getElementsByTagName("li");
    console.log("obj_lis:", obj_lis);

    for (i = 0; i < obj_lis.length; i++) {
        console.log(i, obj_lis[i]);

        obj_lis[i].onclick = function () {
            // alert(this.innerHTML);
            connect_address = this.innerHTML;
            //  setAddress(this.innerHTML);
            signup_choose_address(this.innerHTML);
        }
    }
}

