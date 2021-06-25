
let myAddress="";

function setAddress(tmp){
    myAddress=tmp;
    console.log("myAddress:",myAddress);
}

//
// function alterDisapper(){
//     document.getElementById("alert").innerHTML="";
// }

function changeContent(tagId,content){
    document.getElementById(tagId).innerHTML=content;
}


function check() {
   // let checkCodeElem = document.getElementById('check-code');
    if (typeof AlgoSigner !== 'undefined') {
       console.log( 'AlgoSigner is installed.');
       // change("check-success","AlgoSigner is intalled");
       // checkCodeElem.innerHTML = 'AlgoSigner is installed.';
    } else {
        console.log('AlgoSigner is NOT installed.');
       // change("check-fail","AlgoSigner is NOT installed.");
        //checkCodeElem.innerHTML = 'AlgoSigner is NOT installed.';
    }
}

function connect() {
    // let connectCodeElem = document.getElementById('connect-code');

    AlgoSigner.connect()
        .then((d) => {
            console.log(d);

            // connectCodeElem.innerHTML = JSON.stringify(d, null, 2);
        })
        .catch((e) => {
            console.error(e);
            // connectCodeElem.innerHTML = JSON.stringify(e, null, 2);
        });
}


function foo() {
    var obj_lis = document.getElementById("accounts-list").getElementsByTagName("li");
    console.log("obj_lis:", obj_lis);

    for (i = 0; i < obj_lis.length; i++) {
        console.log(i, obj_lis[i]);

        obj_lis[i].onclick = function () {
            alert(this.innerHTML);
            setAddress(this.innerHTML);

        }
    }
}


function accounts() {
    console.log("in accounts");
    let accountsCodeElem = document.getElementById('account-list');

    AlgoSigner.accounts({
        ledger: 'TestNet'
    })
        .then((d) => {
            tnAccounts = d;
            // 这里account 我把第一个当作了要给后端传送的地址
            // console.log("in wallest");
            // console.log(d);
            // console.log(d[0].address);
            // address=d[0].address;
            // console.log(address);


            // Append accounts to account select

            let content="";
            for (var i = d.length - 1; i >= 0; i--) {

                let thisAddress=d[i].address;
                let opt="";
                for(var j=0;j<16;j++) opt+=thisAddress[j];
                opt+="...";

                //<li> <a onclick="setAddress()" herf="#> </a> </li>
                let rhs="<li> "+thisAddress+"</li>\n";
                console.log(rhs);
                content=content+rhs;
                // let option = document.createElement('option');
                // option.text = d[i].address;
                // option.value = d[i].address;
                // select.appendChild(option);
            }
            document.getElementById("accounts-list").innerHTML=content;
            foo();

            console.log(content);

        })
        .catch((e) => {
            console.error(e);
        });
}

