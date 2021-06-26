// import algosdk
// const algosdk = require('algosdk');
// const fs = require('fs');
// const path = require('path');

// API server address and API token
const server = 'https://testnet-algorand.api.purestake.io/ps2';
const port = '';
const token = {
    'X-API-Key': 'q6SxddUqMjGfyRwofxRp69DS98gsfmf2bCv8H9qd'
}


// instantiate the algorand client
const algodclient = new algosdk.Algodv2(token, server, port);


// compileContract: maxfee,amount,assetId, aliceAddress
//AlicePayContract： maxfee,amount,asaId,aliceAddress,fee=1000,minlimit=100000
//hellobob： amount,asaId,aliceAddress,bobAddress,assetId

let maxfee = 200000;
let amount = 1000000;
let assetId = undefined;
let aliceAddress = undefined;
let bobAddress = undefined;

let fee = 1000;
let memememe = undefined;
let contract_content = undefined;
let contract_hash = undefined;

// let minLimit=100000; //一个账户当中应该有的最少钱数


function information() {
    let content = "";
    content = content + "      maxfee:" + maxfee + "<br/>";
    content = content + "      amount:" + amount + "<br/>";
    content = content + "    assertId:" + assetId + "<br/>";
    content = content + "aliceAddress:" + aliceAddress + "<br/>";
    content = content + "         fee:" + fee + "<br/>";
    // content=content+"    minLimit:"+minLimit+"<br/>";
    content = content + "  bobAddress:" + bobAddress + "<br/>";
    // alert(content);
    // document.getElementById("checkInformation-code").innerHTML=content;//JSON.stringify(tmp,0,2);

}

function add(tagId, content) {
    document.getElementById(tagId).innerHTML =
        document.getElementById(tagId).innerHTML + "<br/>" + content;
}


let txParams = {};
let tnAccounts = [];
let signedTx;
let tx = {};


async function Love() {

    if (signup_address == undefined) {
        alert("please to click [accounts] to sign in :|");
        return;
    }
    if (signup_state != 2) {
        alert("please click [sign up] to finish it :|");
        return;
    }

    aliceAddress = signup_address;

    if (aliceAddress == bobAddress) {
        alert("this NFT is yours");
        return;
    }


    await AlgoSigner.connect()
        .then((d) => {


        })
        .catch((e) => {
            alert(JSON.stringify(e, null, 2));
            return;

        });

    await AlgoSigner.algod({
        ledger: 'TestNet',
        path: '/v2/transactions/params'
    })
        .then((d) => {
            txParams = d;
            // alert(JSON.stringify(d, null, 2));
        })
        .catch((e) => {
            console.error(e);
            alert(JSON.stringify(e, null, 2));
            return;

        });

    // alert("to test"+assetId);
    let sdkTx = new algosdk.Transaction({
        from: signup_address,
        to: signup_address,
        assetIndex: +assetId,
        amount: 0,
        type: 'axfer',
        fee: txParams['min-fee'],
        firstRound: txParams['last-round'],
        lastRound: txParams['last-round'] + 1000,
        genesisID: txParams['genesis-id'],
        genesisHash: txParams['genesis-hash'],
        flatFee: true
    });


// Get the binary and base64 encode it
    let binaryTx = sdkTx.toByte();
    console.log("binaryTx", binaryTx);
    let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);
    console.log("base64Tx:", base64Tx);
    let third = document.getElementById("third");
    let signedTxs = null;
    await AlgoSigner.signTxn([
        {
            txn: base64Tx,
        },
    ]).then((d) => {
        signedTxs = d[0];
        // alert(JSON.stringify(d, null, 2));

    });
    console.log("signedTxs:", signedTxs);
    console.log("signedTxs.blob:", signedTxs.blob);
    AlgoSigner.send({
        ledger: 'TestNet',
        tx: signedTxs.blob
    })
        .then((d) => {
            tx = d;
            waitForConfirmation(algodclient, tx.txId, "bid-information-zero")
                .then(console.log)
                .catch(console.log);
        })
        .catch((e) => {
            console.error(e);
        });
}


// Utility function to wait for tx confirmaiton
async function waitForConfirmation(algodclient, txId, tagId) {
    var p = new Promise(function (resolve, reject) {
        console.log("Waiting transaction: " + txId + " to be confirmed...");
        let content = "Waiting transaction: " + txId + " to be confirmed...\n";

        console.log("::::::::::::::::::::");
        console.log(content);
        console.log(tagId);

        add(tagId, content);

        var counter = 1000;
        let interval = setInterval(() => {
            if (--counter === 0) reject("Confirmation Timeout");
            algodclient.pendingTransactionInformation(txId).do().then((pendingInfo) => {
                if (pendingInfo != undefined) {
                    let confirmedRound = pendingInfo["confirmed-round"];
                    if (confirmedRound !== null && confirmedRound > 0) {
                        clearInterval(interval);
                        resolve("Transaction confirmed in round " + confirmedRound);
                        let msg = "Transaction confirmed in round " + confirmedRound + "\n";

                        console.log("::::::::::::::::::::");
                        console.log(msg);
                        console.log(tagId);

                        add(tagId, msg);
                    }
                }
            }).catch(reject);
        }, 2000);
    });
    return p;
}

// compileContract: maxfee,amount,assetId, aliceAddress,bobAddress
async function compileContract_before() {
    // 这里需要验证参数
    var p = new Promise(function (resolve) {
        // read the contract file
        // const filePath = path.join(__dirname, contractDir);
        // const data = fs.readFileSync(filePath);
        const data = "// This example is provided for informational purposes only and has not been audited for security.\n" +
            "#pragma version 3\n" +
            "// 确定当前交易（即从合约中提取代币的交易）是该交易组里的第一笔\n" +
            "txn GroupIndex\n" +
            "int 0\n" +
            "==\n" +
            "\n" +
            "// 确定该交易的类型是 ALGO 的 Payment 交易\n" +
            "txn TypeEnum\n" +
            "int 1\n" +
            "==\n" +
            "&&\n" +
            "\n" +
            "// 确定交易手续费小于等于 0.02 ALGO\n" +
            "txn Fee\n" +
            "int " + maxfee + "\n" +
            "<=\n" +
            "&&\n" +
            "\n" +
            "// 确定当前交易的数额是 1000000\n" +
            "txn Amount\n" +
            "int " + amount + "\n" +
            "==\n" +
            "&&\n" +
            "\n" +
            "// 确定当前交易不是关闭帐户用的交易\n" +
            "txn CloseRemainderTo\n" +
            "addr " + bobAddress + "\n" +
            "==\n" +
            "&&\n" +
            "\n" +
            "// 确定该交易组中有且仅有两笔交易\n" +
            "global GroupSize\n" +
            "int 2\n" +
            "==\n" +
            "&&\n" +
            "\n" +
            "// 确定交易组中的第二笔交易是一个 ASA 的转账交易\n" +
            "gtxn 1 TypeEnum\n" +
            "int 4\n" +
            "==\n" +
            "&&\n" +
            "\n" +
            "// 确定该交易使用的 ASA 的 ID\n" +
            "gtxn 1 XferAsset\n" +
            "int " + assetId + "\n" +
            "==\n" +
            "&&\n" +
            "\n" +
            "// 确定该交易的接受者是 Alice 的地址\n" +
            "gtxn 1 AssetReceiver\n" +
            "addr " + aliceAddress + "\n" +
            "==\n" +
            "&&\n" +
            "\n" +
            "// 确定该交易不是一个 ASA 的召回交易； 参考：https://developer.algorand.org/docs/reference/transactions/#asset-transfer-transaction\n" +
            "gtxn 1 AssetSender\n" +
            "global ZeroAddress\n" +
            "==\n" +
            "&&\n" +
            "\n" +
            "// 确定该交易时转账 1 个 ASA\n" +
            "gtxn 1 AssetAmount\n" +
            "int 1\n" +
            "==\n" +
            "&&\n";
        contract_content = data;

        // Compile teal contract
        algodclient.compile(data).do().then(resolve).catch(console.log);
    })
    return p;
}


// compileContract: maxfee,amount,assetId, aliceAddress,bobAddress
async function compileContract() {
    // 这里需要验证参数

    var p = new Promise(function (resolve) {
        // read the contract file
        // const filePath = path.join(__dirname, contractDir);
        // const data = fs.readFileSync(filePath);
        const data = "#pragma version 3\n" +
            "global GroupSize\n" +
            "int 1\n" +
            "==\n" +
            "txn GroupIndex\n" +
            "int 0\n" +
            "==\n" +
            "&&\n" +
            "txn TypeEnum\n" +
            "int pay\n" +
            "==\n" +
            "&&\n" +
            "txn Amount\n" +
            "int 0\n" +
            "==\n" +
            "&&\n" +
            "txn Fee\n" +
            "int 20000\n" +
            "<=\n" +
            "&&\n" +
            "txn CloseRemainderTo\n" +
            "addr "+aliceAddress+"\n" +
            "==\n" +
            "&&\n" +
            "txn RekeyTo\n" +
            "global ZeroAddress\n" +
            "==\n" +
            "&&\n" +
            "bz final\n" +
            "int 1\n" +
            "return\n" +
            "final:\n" +
            "int 0\n" +
            "global GroupSize\n" +
            "int 2\n" +
            "==\n" +
            "txn TypeEnum\n" +
            "int pay\n" +
            "==\n" +
            "&&\n" +
            "txn GroupIndex\n" +
            "int 0\n" +
            "==\n" +
            "&&\n" +
            "txn Fee\n" +
            "int 20000\n" +
            "<=\n" +
            "&&\n" +
            "txn Amount\n" +
            "int "+amount+"\n" +
            "==\n" +
            "&&\n" +
            "txn CloseRemainderTo\n" +
            "addr "+bobAddress+"\n" +
            "==\n" +
            "&&\n" +
            "gtxn 1 TypeEnum\n" +
            "int axfer\n" +
            "==\n" +
            "gtxn 1 XferAsset\n" +
            "int "+assetId+"\n" +
            "==\n" +
            "&&\n" +
            "gtxn 1 AssetReceiver\n" +
            "addr "+aliceAddress+"\n" +
            "==\n" +
            "&&\n" +
            "gtxn 1 AssetSender\n" +
            "global ZeroAddress\n" +
            "==\n" +
            "&&\n" +
            "gtxn 1 AssetAmount\n" +
            "int 1\n" +
            "==\n" +
            "&&\n" +
            "&&\n" +
            "||\n";
        contract_content = data;

        // Compile teal contract
        algodclient.compile(data).do().then(resolve).catch(console.log);
    })
    return p;
}


//AlicePayContract： maxfee,amount,assetId,aliceAddress,fee=1000,minlimit=100000


async function helloAlice() {
    if (signup_address == undefined) {
        alert("please to click [accounts] to sign in :|");
        return;
    }
    if (signup_state != 2) {
        alert("please click [sign up] to finish it :|");
        return;
    }

    aliceAddress = signup_address;

    // if(aliceAddress==undefined) alert("please push [accounts] to sign in :|");

    if (aliceAddress == bobAddress) {
        alert("this NFT is yours");
        return;
    }


    information();

    let contract = await compileContract();//.then((contract) => {
    console.log("contract:", contract);
    contract_hash = contract.hash;
    console.log("hash:", contract.hash);
    console.log("result:", contract.result);

    if (contract_hash == undefined) {
        alert("contract hash meet problem :|");
        return;
    }
    if (contract_content == undefined) {
        alert("contract content meet problem :|");
        return;
    }

    let payaccount = aliceAddress;
    let payto = contract.hash;
    let payamount = amount + fee;
    await AlgoSigner.connect();
    let suggestedParmas = await algodclient.getTransactionParams().do();
    let sdkTx = new algosdk.Transaction({
        to: payto,
        from: payaccount,
        amount: payamount,
        ...suggestedParmas,
    });
    let binaryTx = sdkTx.toByte();
    let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);
    let signedTxs = await AlgoSigner.signTxn([
        {
            txn: base64Tx,
        },
    ]);
    let binarySignedTx = AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);
    //await algodclient.sendRawTransaction(binarySignedTx).do();

    algodclient.sendRawTransaction(binarySignedTx).do().then((tx) => {
        waitForConfirmation(algodclient, tx.txId, "bid-information")
            .then((d) => {
                // alert(JSON.stringify(d,0,2));
                sendsuccess();

            })
            .catch((e) => {
                console.log(e);

                alert(JSON.stringify(e, 0, 2));


            });
    }).catch((e) => {
        alert("to check if you have enough algos:| \r\n" + JSON.stringify(e, 0, 2));
    });
}

function sendsuccess() {
    let bidData = new FormData();
    bidData.append("aliceAddress", aliceAddress);
    bidData.append("bobAddress", bobAddress);
    bidData.append("amount", amount);
    bidData.append("asaId", assetId);
    bidData.append("hash", contract_hash);
    bidData.append("contract", contract_content);
    $.ajax({
        url: voyage_bid,
        datatype: 'json',
        type: 'POST',
        async: true,
        timeout: 0,
        data: bidData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            if (data['code'] == 0) {
                alert('your bid is successfull:)');
            } else {
                alert("your bid meets some problems \r\n" + JSON.stringify(data, 0, 2));
            }
        },
        error: function (data) {
            console.log(data);

            alert(JSON.stringify(data, 0, 2));
        }
    });
}


//hellobob： amount,assetId,aliceAddress,bobAddress,assetId
async function helloBob() {
    const closeRemainderTo = bobAddress;
    const note = undefined;
    const revocationTarget = undefined;
    let contract = await compileContract(maxfee, amount, assetId, aliceAddress);

    let programBytes = AlgoSigner.encoding.base64ToMsgpack(contract.result);
    const lsig = new algosdk.makeLogicSig(programBytes, undefined);
    const contractAddress = lsig.address();
    await AlgoSigner.connect();
    let params = await algodclient.getTransactionParams().do();
    // buyerAccount, contractAddr, lsig
    // make the algo payment tx from contract to buyer

    let algoPaymentTx = algosdk.makePaymentTxnWithSuggestedParams(contractAddress, bobAddress, amount, closeRemainderTo, note, params);
    // make the asset transfer tx from buyer to Alice
    // alert(assetId);
    // alert(mememe);


    let assetTransferTx = algosdk.makeAssetTransferTxnWithSuggestedParams(bobAddress, aliceAddress, undefined, revocationTarget,
        1, note, mememe, params);
    // put 2 tx into an array
    const txns = [algoPaymentTx, assetTransferTx];
    // assign the group tx ID
    const txGroup = algosdk.assignGroupID(txns);

    const signedAlgoPaymentTx = algosdk.signLogicSigTransactionObject(txGroup[0], lsig);


    let binaryTx = txGroup[1].toByte();
    let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);

    let zhong = await AlgoSigner.signTxn([
        {
            txn: base64Tx,
        },
    ]);

    let signedAssetTransferTx = AlgoSigner.encoding.base64ToMsgpack(zhong[0].blob);

    let signedTxs = [];
    signedTxs.push(signedAlgoPaymentTx.blob);
    signedTxs.push(signedAssetTransferTx);

    algodclient.sendRawTransaction(signedTxs).do().then((tx) => {
        waitForConfirmation(algodclient, tx.txId, "order-button-code")
            .then((d) => {
                let lastmsg = new FormData();

                lastmsg.append("aliceAddress", aliceAddress);
                lastmsg.append("bobAddress", bobAddress);
                lastmsg.append("asaId", assetId);
                // alert("assertId"+assetId);

                $.ajax({
                    url: success_url,
                    datatype: 'json',
                    type: 'POST',
                    async: true,
                    timeout: 0,
                    data: lastmsg,
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        alert("success accpet:) \r\n" + JSON.stringify(data, 0, 2));
                    },
                    error: function (data) {
                        alert(JSON.stringify(data, 0, 2));
                    }
                });

            })
            .catch((e) => {
                alert(JSON.stringify(e, 0, 2));

            });
    }).catch(console.log);




}

async function AliceGetMoney() {
    const closeRemainderTo = aliceAddress;
    const note = undefined;
    const revocationTarget = undefined;
    let contract = await compileContract();

    let programBytes = AlgoSigner.encoding.base64ToMsgpack(contract.result);
    const lsig = new algosdk.makeLogicSig(programBytes, undefined);
    const contractAddress = lsig.address();

    let params = await algodclient.getTransactionParams().do();
    // buyerAccount, contractAddr, lsig
    // make the algo payment tx from contract to buyer

    let algoPaymentTx = algosdk.makePaymentTxnWithSuggestedParams(contractAddress, aliceAddress, 0, closeRemainderTo, note, params);
    // make the asset transfer tx from buyer to Alice
    // alert(assetId);
    // alert(mememe);

    // put 2 tx into an array
    const txns = [algoPaymentTx];
    // assign the group tx ID
    const txGroup = algosdk.assignGroupID(txns);
    const signedAlgoPaymentTx = algosdk.signLogicSigTransactionObject(txGroup[0], lsig);

    let signedTxs = [];


    signedTxs.push(signedAlgoPaymentTx.blob);


    algodclient.sendRawTransaction(signedTxs).do().then((tx) => {
        waitForConfirmation(algodclient, tx.txId, "alice-information")
            .then((d) => {
                console.log("I have been there");
                // alert(JSON.stringify(d,0,2));
                aliceGetMoney();

            })
            .catch((e) => {
                alert(JSON.stringify(e, 0, 2));

            });
    }).catch((e) => {
        console.log("catch");
        console.log(JSON.stringify(e));

        alert(JSON.stringify(e, 0, 2));
    });

}



function aliceGetMoney() {
    let bidData = new FormData();
    bidData.append("aliceAddress", aliceAddress);
    bidData.append("bobAddress", bobAddress);
    // bidData.append("amount", amount);
    bidData.append("asaId", assetId);
    // bidData.append("hash", contract_hash);
    // bidData.append("contract", contract_content);

    console.log("aliceGetMoney==============");
    console.log("aliceAddress:"+aliceAddress);
    console.log("bobAddress:"+bobAddress);
    console.log("assetId:"+assetId);



    $.ajax({
        url: voyage_withdraw,
        datatype: 'json',
        type: 'POST',
        async: false,
        timeout: 0,
        data: bidData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data);

            alert("alice get money successful !"+JSON.stringify(data,0,2));
            document.getElementById("__bid").click();

            // if (data['code'] == 0) {
            //     alert('your bid is successfull:)');
            // } else {
            //     alert("your bid meets some problems \r\n" + JSON.stringify(data, 0, 2));
            // }
        },
        error: function (data) {
            alert("alice get money meet something wrong!"+JSON.stringify(data, 0, 2));
        }
    });
}




async function aliceWithdraw() {
    const closeRemainderTo = aliceAddress;
    const note = undefined;
    const revocationTarget = undefined;
    let contract = await compileContract(maxfee, amount, assetId, aliceAddress);

    let programBytes = AlgoSigner.encoding.base64ToMsgpack(contract.result);
    const lsig = new algosdk.makeLogicSig(programBytes, undefined);
    const contractAddress = lsig.address();
    await AlgoSigner.connect();
    let params = await algodclient.getTransactionParams().do();
    // buyerAccount, contractAddr, lsig
    // make the algo payment tx from contract to buyer
    let algoPaymentTx = algosdk.makePaymentTxnWithSuggestedParams(contractAddress, aliceAddress, amount, closeRemainderTo, note, params);

    // make the asset transfer tx from buyer to Alice
    let assetTransferTx = algosdk.makeAssetTransferTxnWithSuggestedParams(bobAddress, aliceAddress, closeRemainderTo, revocationTarget,
        1, note, assetId, params);
    // put 2 tx into an array
    const txns = [algoPaymentTx, assetTransferTx];
    // assign the group tx ID
    const txGroup = algosdk.assignGroupID(txns);

    const signedAlgoPaymentTx = algosdk.signLogicSigTransactionObject(txGroup[0], lsig);


    let binaryTx = txGroup[1].toByte();
    let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);

    let zhong = await AlgoSigner.signTxn([
        {
            txn: base64Tx,
        },
    ]);

    let signedAssetTransferTx = AlgoSigner.encoding.base64ToMsgpack(zhong[0].blob);

    let signedTxs = [];
    signedTxs.push(signedAlgoPaymentTx.blob);
    signedTxs.push(signedAssetTransferTx);

    algodclient.sendRawTransaction(signedTxs).do().then((tx) => {
        waitForConfirmation(algodclient, tx.txId, "helloBob-code")
            .then(console.log)
            .catch(console.log);

    }).catch(console.log);
}


async function sendAssetTransaction(from, to, assetId) {
    add("assetSend-code", from);
    add("assetSend-code", to);
    add("assetSend-code", assetId);
    //连接钱包
    await AlgoSigner.connect()
        .then((d) => {
            add("assetSend-code", JSON.stringify(d, null, 2));
        })
        .catch((e) => {
            console.error(e);
            add("assetSend-code", JSON.stringify(e, null, 2));
        });

    //获得params
    await AlgoSigner.algod({
        ledger: 'TestNet',
        path: '/v2/transactions/params'
    })
        .then((d) => {
            add("assetSend-code", JSON.stringify(d, null, 2))
            txParams = d;
        })
        .catch((e) => {
            console.error(e);
            add("assetSend-code", JSON.stringify(e, null, 2));


        });

    let sdkTx = new algosdk.Transaction({
        from: from,
        to: to,
        assetIndex: assetId,
        amount: 1,

        type: 'axfer',
        // type: 'axfer',

        fee: txParams['min-fee'],
        firstRound: txParams['last-round'],
        lastRound: txParams['last-round'] + 1000,
        genesisID: txParams['genesis-id'],
        genesisHash: txParams['genesis-hash'],
        flatFee: true
    });
    //Get the binary and base64 encode it
    let binaryTx = sdkTx.toByte();


    let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);
    let signedTxs = await AlgoSigner.signTxn([
        {
            txn: base64Tx,
        },
    ]);
    let binarySignedTx = AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);
    //await algodclient.sendRawTransaction(binarySignedTx).do();
    algodclient.sendRawTransaction(binarySignedTx).do().then((tx) => {
        waitForConfirmation(algodclient, tx.txId, "assetSend-code")
            .then(console.log)
            .catch(console.log);
    }).catch(console.log);


    // let binaryTx = sdkTx.toByte();
    // console.log("binaryTx",binaryTx);
    // let base64Tx = AlgoSigner.encoding.msgpackToBase64(binaryTx);
    // console.log("base64Tx:",base64Tx);
    // let third=document.getElementById("third");
    // let signedTxs =null;
    // await AlgoSigner.signTxn([
    //     {
    //         txn: base64Tx,
    //     },
    // ]).then((d)=>{
    //     signedTxs=d[0];
    //     JSON.stringify(d, null, 2);
    // });
    //
    // // AlgoSigner.send({
    // //     ledger: 'TestNet',
    // //     tx: signedTxs.blob
    // // })
    // //     .then((d) => {
    // //         tx = d;
    // //     })
    // //     .catch((e) => {
    // //         console.error(e);
    // //     });
    // algodclient.sendRawTransaction(signedTxn.blob).do().then((tx) => {
    //     waitForConfirmation(algodclient, tx.txId,"assetSend-code")
    //         .then(resolve)
    //         .catch(console.log);
    //         }).catch(console.log);
    //
    // let signedTxs = await AlgoSigner.signTxn([
    //     {
    //         txn: base64Tx,
    //     },
    // ]);
    //
    // let binarySignedTx = AlgoSigner.encoding.base64ToMsgpack(signedTxs[0].blob);
    // //await algodclient.sendRawTransaction(binarySignedTx).do();
    // algodclient.sendRawTransaction(binarySignedTx).do().then((tx) => {
    //     waitForConfirmation(algodclient, tx.txId,"helloAlice-code")
    //         .then(console.log)
    //         .catch(console.log);
    // }).catch(console.log);
    //

}


