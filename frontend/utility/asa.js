let asa_txParams = {};
// let tnAccounts = [];
let asa_signedTx;
let asa_tx = {};
let asa_address = undefined;


async function asa_upload() {
    await AlgoSigner.connect()
        .then((d) => {
            // alert("connect\n"+JSON.stringify(d, null, 2));
        })
        .catch((e) => {
            console.error(e);
            alert("connect-cache\n" + JSON.stringify(e, null, 2));
        });

    asa_address = signup_address;
    // alert(asa_address);


    //获得参数
    await AlgoSigner.algod({
        ledger: 'TestNet',
        path: '/v2/transactions/params'
    })
        .then((d) => {
            // paramsCodeElem.innerHTML = JSON.stringify(d, null, 2);
            asa_txParams = d;
            // alert(JSON.stringify(asa_txParams,0,2));

        })
        .catch((e) => {
            console.error(e);
            // paramsCodeElem.innerHTML = JSON.stringify(e, null, 2);
        });


    //签署交易
    let assetName = "star";
    let hhh = 28;
    if (asa_address.length < hhh) hhh = asa_address.length;

    for (let i = 0; i < hhh; i++)
        assetName += asa_address[i];
    let note = upload_tupian_oss;
    // alert(note);


    await AlgoSigner.sign({
        from: asa_address,
        assetName: assetName,
        assetUnitName: 'V',
        assetTotal: 1,
        assetDecimals: 0,
        // assetMetadataHash: tupian_sha1,
        note: note,
        // assetURL: "",
        type: 'acfg',
        fee: asa_txParams['min-fee'],
        firstRound: asa_txParams['last-round'],
        lastRound: asa_txParams['last-round'] + 1000,
        genesisID: asa_txParams['genesis-id'],
        genesisHash: asa_txParams['genesis-hash'],
        flatFee: true
    })
        .then((d) => {
            asa_signedTx = d;

            // alert( JSON.stringify(d, null, 2));
        })
        .catch((e) => {

            console.error(e);
            alert("sign meet problems\n" + JSON.stringify(e, null, 2));
        });

    await AlgoSigner.send({
        ledger: 'TestNet',
        tx: asa_signedTx.blob
    })
        .then((d) => {
            // alert(JSON.stringify(d, null, 2));
            let content = " <br>\n" +
                "                    <div class=\"panel panel-warning\">\n" +
                "                        <div class=\"panel-heading\">\n" +
                "                            <h3 class=\"panel-title text-center\">Your NFT has been signed  </h3>\n" +
                "                        </div>\n" +
                "                        <div class=\"panel-body text-center\">\n" +
                "                            Please click below button to get Unique ID :)\n" +
                "                        </div>\n" +
                "                    </div>";

            document.getElementById("upload-first-code").innerHTML = content;

            asa_tx = d;
        })
        .catch((e) => {
            console.error(e);
            alert(JSON.stringify(e, null, 2));
        });

}


async function asa_getId() {
    AlgoSigner.algod({
        ledger: 'TestNet',
        path: '/v2/transactions/pending/' + asa_tx.txId
    })
        .then((d) => {
            if (d['asset-index'] == undefined) {
                let content = "  <br>\n" +
                    "                    <div class=\"panel panel-info\">\n" +
                    "                        <div class=\"panel-heading\">\n" +
                    "                            <h3 class=\"panel-title text-center\"> Please remain patient </h3>\n" +
                    "                        </div>\n" +
                    "                        <div class=\"panel-body text-center\">\n" +
                    "                            Wait a few seconds and then click again...\n" +
                    "\n" +
                    "                        </div>\n" +
                    "                    </div>";

                document.getElementById('asa-code').innerHTML = content;

                return -1;
            } else {

                // alert("asset-index: "+d['asset-index']);
                let content = "          <br>\n" +
                    "\n" +
                    "                <div class=\"panel panel-warning\">\n" +
                    "                    <div class=\"panel-heading\">\n" +
                    "                        <h3 class=\"panel-title text-center\"> Your Unique NFT ID is below </h3>\n" +
                    "                    </div>\n" +
                    "                    <div class=\"panel-body text-center\">\n" +
                    d['asset-index'] +
                    "                    </div>\n" +
                    "                </div>\n" +
                    "\n";

                document.getElementById('asa-code').innerHTML = content;
                upload_asaId = d['asset-index'];
                return d['asset-index'];

            }

        })
        .catch((e) => {
            // console.error(e);
            alert(JSON.stringify(e, 0, 2));
            // pendingCodeElem.innerHTML = JSON.stringify(e, null, 2);
        });

    return -2;
}


function asa_last() {

    let asaData = new FormData();
    asaData.append("address", upload_address);
    asaData.append("sha1", upload_tupian_sha1);
    asaData.append("asaId", upload_asaId);
    asaData.append("amount", upload_amount);
    asaData.append("up_file", upload_tupian);


    $.ajax
    ({
        url: upload_asa_url,
        dataType: 'json',
        type: 'POST',
        async: true,
        timeout: 0, // first
        data: asaData,
        cache: false, // second   first和second组合在一起 试图解决ajax的fail问题
        processData: false, // 使数据不做处理
        contentType: false, // 不要设置Content-Type请求头
        success: function (data) {

            let content = "\n" +
                "                    <br>\n" +
                "                    <div class=\"panel panel-success\">\n" +
                "                        <div class=\"panel-heading\">\n" +
                "                            <h1 class=\"panel-title text-center\"> Congratulations!</h1>\n" +
                "                        </div>\n" +
                "                        <div class=\"panel-body text-center\">\n" +
                "                            <h4>Your NFT work has been minted :)</h4>\n" +
                "               <h4> You can check it in [star] .</h4></n>" +
                "\n" +
                "                        </div>\n" +
                "                    </div>\n";
            document.getElementById("asa-last-code").innerHTML = content;
            // alert(JSON.stringify(data, null, 2));
        },
        error: function (data) {

            alert(JSON.stringify(data, null, 2));
        },
        // complete: function(HttpRequest,textStatus){
        //     console.log(HttpRequest)
        //     $("#complete_result").html(textStatus)
        // }
    });


}