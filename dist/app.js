/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Panel {
    constructor() {
        this.palneDiv = document.createElement("div");
        let heading = document.createElement("div");
        this.title = document.createElement("h3");
        this.body = document.createElement("div");
        this.ul = document.createElement("ul");
        heading.appendChild(this.title);
        this.palneDiv.appendChild(heading);
        this.palneDiv.classList.add("panel", "panel-default");
        heading.classList.add("panel-heading");
        this.body.classList.add("panel-body");
        this.ul.classList.add("list-group");
    }
    /**
     * setTitle
     */
    setTitle(title) {
        this.title.innerHTML = title;
    }
    setBody(body) {
        this.body.innerHTML = body;
        this.palneDiv.appendChild(this.body);
    }
    /**
     * setUl
     */
    setUl(lis) {
        this.ul.innerHTML = lis;
        this.palneDiv.appendChild(this.ul);
    }
    init(pater) {
        pater.appendChild(this.palneDiv);
    }
}
exports.Panel = Panel;
class Table {
    constructor() {
        this.table = document.createElement("table");
        this.thead = document.createElement("thead");
        this.tbody = document.createElement("tbody");
        this.table.appendChild(this.thead);
        this.table.appendChild(this.tbody);
    }
    init(pater) {
        pater.appendChild(this.table);
    }
    creatTable() {
    }
}
exports.Table = Table;
class Jumbotron {
    static creatJumbotron(title) {
        let jumbotron = document.createElement("div");
        let caption = document.createElement("caption");
        let body = document.createElement("div");
        let h3 = document.createElement("h3");
        jumbotron.classList.add('jumbotron', 'masthead');
        jumbotron.hidden = true;
        caption.appendChild(h3);
        jumbotron.appendChild(caption);
        jumbotron.appendChild(body);
        h3.textContent = title;
        return { jumbotron: jumbotron, body: body };
    }
}
exports.Jumbotron = Jumbotron;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="../../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
const wwwtool_1 = __webpack_require__(2);
class CoinTool {
    static initAllAsset() {
        return __awaiter(this, void 0, void 0, function* () {
            var allassets = yield wwwtool_1.WWW.api_getAllAssets();
            for (var a in allassets) {
                var asset = allassets[a];
                var names = asset.name;
                var id = asset.id;
                var name = "";
                if (id == CoinTool.id_GAS) {
                    name = "GAS";
                }
                else if (id == CoinTool.id_NEO) {
                    name = "NEO";
                }
                else {
                    for (var i in names) {
                        name = names[i].name;
                        if (names[i].lang == "en")
                            break;
                    }
                }
                CoinTool.assetID2name[id] = name;
                CoinTool.name2assetID[name] = id;
            }
        });
    }
    static makeTran(utxos, targetaddr, assetid, sendcount) {
        if (sendcount.compareTo(Neo.Fixed8.Zero) <= 0)
            throw new Error("can not send zero.");
        var tran = new ThinNeo.Transaction();
        tran.type = ThinNeo.TransactionType.ContractTransaction;
        tran.version = 0; //0 or 1
        tran.extdata = null;
        tran.attributes = [];
        tran.inputs = [];
        var scraddr = "";
        utxos[assetid].sort((a, b) => {
            return a.count.compareTo(b.count);
        });
        var us = utxos[assetid];
        var count = Neo.Fixed8.Zero;
        for (var i = 0; i < us.length; i++) {
            var input = new ThinNeo.TransactionInput();
            input.hash = us[i].txid.hexToBytes().reverse();
            input.index = us[i].n;
            input["_addr"] = us[i].addr; //利用js的隨意性，臨時傳個值
            tran.inputs.push(input);
            count = count.add(us[i].count);
            scraddr = us[i].addr;
            if (count.compareTo(sendcount) > 0) {
                break;
            }
        }
        if (count.compareTo(sendcount) >= 0) {
            tran.outputs = [];
            //输出
            var output = new ThinNeo.TransactionOutput();
            output.assetId = assetid.hexToBytes().reverse();
            output.value = sendcount;
            output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targetaddr);
            tran.outputs.push(output);
            //找零
            var change = count.subtract(sendcount);
            if (change.compareTo(Neo.Fixed8.Zero) > 0) {
                var outputchange = new ThinNeo.TransactionOutput();
                outputchange.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(scraddr);
                outputchange.value = change;
                outputchange.assetId = assetid.hexToBytes().reverse();
                tran.outputs.push(outputchange);
            }
        }
        else {
            throw new Error("no enough money.");
        }
        return tran;
    }
}
CoinTool.id_GAS = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
CoinTool.id_NEO = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
CoinTool.assetID2name = {};
CoinTool.name2assetID = {};
exports.CoinTool = CoinTool;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class WWW {
    static makeRpcUrl(url, method, ..._params) {
        if (url[url.length - 1] != '/')
            url = url + "/";
        var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=[";
        for (var i = 0; i < _params.length; i++) {
            urlout += JSON.stringify(_params[i]);
            if (i != _params.length - 1)
                urlout += ",";
        }
        urlout += "]";
        return urlout;
    }
    static makeRpcPostBody(method, ..._params) {
        var body = {};
        body["jsonrpc"] = "2.0";
        body["id"] = 1;
        body["method"] = method;
        var params = [];
        for (var i = 0; i < _params.length; i++) {
            params.push(_params[i]);
        }
        body["params"] = params;
        return body;
    }
    static api_getHeight() {
        return __awaiter(this, void 0, void 0, function* () {
            var str = WWW.makeRpcUrl(WWW.api, "getblockcount");
            var result = yield fetch(str, { "method": "get" });
            var json = yield result.json();
            var r = json["result"];
            var height = parseInt(r[0]["blockcount"]) - 1;
            return height;
        });
    }
    static api_getAllAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            var str = WWW.makeRpcUrl(WWW.api, "getallasset");
            var result = yield fetch(str, { "method": "get" });
            var json = yield result.json();
            var r = json["result"];
            return r;
        });
    }
    static api_getUTXO(address) {
        return __awaiter(this, void 0, void 0, function* () {
            var str = WWW.makeRpcUrl(WWW.api, "getutxo", address);
            var result = yield fetch(str, { "method": "get" });
            var json = yield result.json();
            var r = json["result"];
            return r;
        });
    }
    static api_getBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            var str = WWW.makeRpcUrl(WWW.api, "getbalance", address);
            var result = yield fetch(str, { "method": "get" });
            var json = yield result.json();
            var r = json["result"];
            return r;
        });
    }
    static rpc_postRawTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var postdata = WWW.makeRpcPostBody("sendrawtransaction", data.toHexString());
            var result = yield fetch(WWW.rpc, { "method": "post", "body": JSON.stringify(postdata) });
            var json = yield result.json();
            var r = json["result"];
            return r;
        });
    }
    static rpc_getURL() {
        return __awaiter(this, void 0, void 0, function* () {
            var str = WWW.makeRpcUrl(WWW.api, "getnoderpcapi");
            var result = yield fetch(str, { "method": "get" });
            var json = yield result.json();
            var r = json["result"][0];
            var url = r.nodeList[0];
            WWW.rpc = url;
            WWW.rpcName = r.nodeType;
            return url;
        });
    }
    static rpc_getHeight() {
        return __awaiter(this, void 0, void 0, function* () {
            var str = WWW.makeRpcUrl(WWW.rpc, "getblockcount");
            var result = yield fetch(str, { "method": "get" });
            var json = yield result.json();
            var r = json["result"];
            var height = parseInt(r) - 1;
            return height;
        });
    }
}
WWW.api = "http://47.96.168.8:81/api/testnet";
WWW.rpc = "";
WWW.rpcName = "";
exports.WWW = WWW;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const details_1 = __webpack_require__(4);
const navbar_1 = __webpack_require__(5);
const sign_1 = __webpack_require__(6);
const transfer_1 = __webpack_require__(7);
const transaction_1 = __webpack_require__(8);
const cointool_1 = __webpack_require__(1);
const WalletController_1 = __webpack_require__(9);
class App {
    constructor() {
        this.main = document.getElementById("main");
        this.detail = new details_1.DetailModule();
        this.sign = new sign_1.SignModule();
        this.transfer = new transfer_1.TransferModule();
        this.transaction = new transaction_1.TransactionModule();
        this.walletController = new WalletController_1.WalletController();
        this.navbar = new navbar_1.NavbarModule();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield cointool_1.CoinTool.initAllAsset();
            this.detail.init(this);
            this.navbar.init(this);
            this.sign.init(this);
            this.transfer.init(this);
            this.transaction.init(this);
            this.walletController.start(this);
        });
    }
}
exports.App = App;
$(() => {
    let app = new App();
    app.start();
});


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const viewtool_1 = __webpack_require__(0);
class DetailModule {
    init(app) {
        let jum = viewtool_1.Jumbotron.creatJumbotron("Details");
        this.module = jum.jumbotron;
        this.body = jum.body;
        this.btn = document.createElement("button");
        this.btn.classList.add("btn", "btn-link");
        this.btn.innerText = "UTXO";
        app.main.appendChild(this.module);
    }
    update(detail) {
        this.module.hidden = false;
        this.body.innerHTML = "";
        this.body.classList.add("row");
        let ul = '';
        for (let n = 0; n < detail.balances.length; n++) {
            const balance = detail.balances[n];
            let name = balance.name.map((name) => { return name.name; }).join('|');
            ul += '<li class="list-group-item"> ' + name + ' : ' + balance.balance + '</li>';
        }
        let addrpanel = new viewtool_1.Panel();
        let div1 = document.createElement("div");
        let div2 = document.createElement("div");
        addrpanel.setTitle("Address");
        addrpanel.setBody(detail.address);
        addrpanel.init(div1);
        div1.classList.add("col-lg-6");
        let balanPanel = new viewtool_1.Panel();
        balanPanel.setTitle("Balance");
        balanPanel.setUl(ul);
        balanPanel.init(div2);
        div2.classList.add("col-lg-6");
        this.body.appendChild(div1);
        this.body.appendChild(div2);
        this.body.appendChild(this.btn);
    }
}
exports.DetailModule = DetailModule;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class NavbarModule {
    constructor() {
        this.ul = document.createElement("ul");
        this.liNep5 = document.createElement("li");
        this.aNep5 = document.createElement("a");
        this.liTransaction = document.createElement("li");
        this.aTransaction = document.createElement("a");
        this.liTransfer = document.createElement("li");
        this.aTransfer = document.createElement("a");
    }
    init(app) {
        this.app = app;
        this.ul.classList.add('nav', 'nav-pills');
        this.aNep5.textContent = "Nep5";
        this.liNep5.appendChild(this.aNep5);
        this.aTransaction.textContent = "Transaction";
        this.liTransaction.appendChild(this.aTransaction);
        this.aTransfer.textContent = "Transfer";
        this.liTransfer.appendChild(this.aTransfer);
        this.liTransfer.classList.add("active");
        this.ul.appendChild(this.liTransfer);
        this.ul.appendChild(this.liTransaction);
        this.ul.appendChild(this.liNep5);
        // let main = document.getElementById("nav") as HTMLDivElement;
        let main = this.app.main;
        main.appendChild(this.ul);
        this.aNep5.onclick = () => {
            this.cutlabe("Nep5");
        };
        this.aTransaction.onclick = () => {
            this.cutlabe("transaction");
        };
        this.aTransfer.onclick = () => {
            this.cutlabe("transfer");
        };
    }
    cutlabe(str) {
        if (str == "Nep5") {
            this.liNep5.classList.add("active");
            // this.app.sign.module.hidden=false;
        }
        else {
            this.liNep5.classList.remove("active");
            // this.app.sign.module.hidden=true;
        }
        if (str == "transaction") {
            this.liTransaction.classList.add("active");
            this.app.transaction.module.hidden = false;
        }
        else {
            this.liTransaction.classList.remove("active");
            this.app.transaction.module.hidden = true;
        }
        if (str == "transfer") {
            this.liTransfer.classList.add("active");
            this.app.transfer.module.hidden = false;
        }
        else {
            this.liTransfer.classList.remove("active");
            this.app.transfer.module.hidden = true;
        }
    }
}
exports.NavbarModule = NavbarModule;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const viewtool_1 = __webpack_require__(0);
class SignModule {
    init(app) {
        let jum = viewtool_1.Jumbotron.creatJumbotron("Sign");
        this.module = jum.jumbotron;
        this.body = jum.body;
        app.main.appendChild(this.module);
    }
}
exports.SignModule = SignModule;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const viewtool_1 = __webpack_require__(0);
class TransferModule {
    init(app) {
        let jum = viewtool_1.Jumbotron.creatJumbotron("Transfer");
        this.module = jum.jumbotron;
        this.body = jum.body;
        app.main.appendChild(this.module);
    }
}
exports.TransferModule = TransferModule;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const viewtool_1 = __webpack_require__(0);
class TransactionModule {
    init(app) {
        let jum = viewtool_1.Jumbotron.creatJumbotron("Transaction");
        this.module = jum.jumbotron;
        this.body = jum.body;
        app.main.appendChild(this.module);
    }
}
exports.TransactionModule = TransactionModule;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const walletView_1 = __webpack_require__(10);
const Entitys_1 = __webpack_require__(11);
const neotool_1 = __webpack_require__(12);
const wwwtool_1 = __webpack_require__(2);
const cointool_1 = __webpack_require__(1);
class WalletController {
    constructor() { }
    /**
     * showUtxo
     */
    showUtxo() {
    }
    /**
     * importWif
     */
    importWif() {
        $("#import-wif").click(() => {
            $("#importWif").modal('show');
        });
        $('#send-wif').click(() => {
            let wif = $("#wif-input").find("input").val().toString(); //获得输入的wif
            let res;
            if (!wif.length) {
                res = { err: true, result: "不得为空" };
            }
            else {
                try {
                    let result = neotool_1.NeoUtil.wifDecode(wif);
                    if (!result.err) {
                        this.loadKeys = [result.result];
                        this.details(result.result['address']);
                    }
                    res = { err: false, result: "验证通过" };
                }
                catch (error) {
                    alert(error);
                    res = { err: true, result: error };
                }
            }
            walletView_1.walletView.verifWif(res);
        });
    }
    /**
     * importNep2
     */
    importNep2() {
        $("#import-nep2").click(() => {
            $("#importNep2").modal('show');
        });
        $("#send-nep2").click(() => {
            this.nep2init();
        });
    }
    /**
     * importNep6
     */
    importNep6() {
        $("#import-nep6").click(() => {
            $("#importNep6").modal('show');
        });
        let file = document.getElementById("nep6-select");
        var wallet;
        var reader = new FileReader();
        reader.onload = (e) => {
            var walletstr = reader.result;
            wallet = new ThinNeo.nep6wallet();
            wallet.fromJsonStr(walletstr);
            var textContent = "";
            for (var i = 0; i < wallet.accounts.length; i++) {
                textContent += wallet.accounts[i].address;
                if (wallet.accounts[i].nep2key != null)
                    textContent += "(have key)";
                textContent += "\r\n";
            }
            // alert(2+":"+textContent);
        };
        file.onchange = (ev) => {
            if (file.files[0].name.includes(".json")) {
                // alert("1:json");
                reader.readAsText(file.files[0]);
            }
        };
        $("#send-nep6").click(() => __awaiter(this, void 0, void 0, function* () {
            let password = $("#nep6-password").val().toString();
            try {
                let res = yield neotool_1.NeoUtil.nep6Load(wallet, password);
                console.log("成功返回：" + res.result[0]);
                $('#importNep6').modal('hide');
                if (res.result.length > 1) {
                    let addrs = res.result.map(item => { return item.address; });
                    walletView_1.walletView.showSelectAddrs(addrs);
                }
                if (!res.err) {
                    this.loadKeys = res.result;
                }
            }
            catch (error) {
                console.log("失败：" + error);
            }
        }));
        $("#send-Addr").click(() => {
            let addr = $('#selectAddress input[name="addrRadio"]:checked ').val().toString();
            this.details(addr);
            $("#selectAddr").modal("hide");
        });
    }
    /**
     * Transfer
     */
    Transfer() {
        $("#send-transfer").click(() => {
            var targetaddr = $("#targetaddr").val().toString();
            var asset = $("#transfer-asset").val().toString();
            var assetid = cointool_1.CoinTool.name2assetID[asset];
            var count = $("#transfer-amount").val().toString();
            var utxos = this.getassets(this.utxos);
            var _count = Neo.Fixed8.parse(count);
            var tran = cointool_1.CoinTool.makeTran(utxos, targetaddr, assetid, _count);
            let type = ThinNeo.TransactionType[tran.type].toString();
            let version = tran.version.toString();
            let inputcount = tran.inputs.length;
            var inputAddrs = [];
        });
        $("#Sing-send").click(() => {
        });
    }
    getassets(utxos) {
        var assets = {};
        for (var i in utxos) {
            var item = utxos[i];
            var txid = item.txid;
            var n = item.n;
            var asset = item.asset;
            var count = item.value;
            if (assets[asset] == undefined) {
                assets[asset] = [];
            }
            var utxo = new Entitys_1.UTXO();
            utxo.addr = item.addr;
            utxo.asset = asset;
            utxo.n = n;
            utxo.txid = txid;
            utxo.count = Neo.Fixed8.parse(count + "");
            assets[asset].push(utxo);
        }
        return assets;
    }
    /**
     * details
     */
    details(address) {
        return __awaiter(this, void 0, void 0, function* () {
            let height = 0;
            try {
                let balances = yield wwwtool_1.WWW.api_getBalance(address);
                balances.map((balance) => {
                    if (balance.asset == Entitys_1.AssetEnum.NEO) {
                        balance.name = [{ lang: 'en', name: 'NEO' }];
                    }
                    if (balance.asset == Entitys_1.AssetEnum.GAS) {
                        balance.name = [{ lang: 'en', name: "GAS" }];
                    }
                });
                let blockHeight = yield wwwtool_1.WWW.api_getHeight();
                let detail = new Entitys_1.Detail(address, blockHeight, balances);
                this.app.detail.update(detail);
                try {
                    let allAsset = yield wwwtool_1.WWW.api_getAllAssets();
                    allAsset.map((asset) => {
                        if (asset.id == Entitys_1.AssetEnum.NEO) {
                            asset.name = [{ lang: 'en', name: 'NEO' }];
                        }
                        if (asset.id == Entitys_1.AssetEnum.GAS) {
                            asset.name = [{ lang: 'en', name: "GAS" }];
                        }
                    });
                    var utxos = yield wwwtool_1.WWW.api_getUTXO(address);
                    this.utxos = utxos;
                    utxos.map((item) => {
                        item.name = allAsset.find(val => val.id == item.asset).name.map((name) => { return name.name; }).join("|");
                    });
                    walletView_1.walletView.showUtxo(utxos);
                    $("#wallet-details").show();
                    $("#wallet-utxo").show();
                    $("#wallet-transaction").show();
                }
                catch (error) {
                }
            }
            catch (error) {
            }
        });
    }
    /**
     * async nep2init
     */
    nep2init() {
        return __awaiter(this, void 0, void 0, function* () {
            let nep2 = $("#nep2-string").val().toString();
            let password = $("#nep2-password").val().toString();
            try {
                let res = yield neotool_1.NeoUtil.nep2ToWif(nep2, password);
                console.log(res);
                if (!res.err) {
                    $("#importNep2").modal('hide');
                    $("#wallet-details").empty();
                    this.details(res.result["address"]);
                }
            }
            catch (err) {
                console.log("err:" + err);
            }
        });
    }
    start(app) {
        this.app = app;
        this.importNep2();
        this.importWif();
        this.importNep6();
        this.Transfer();
    }
}
exports.WalletController = WalletController;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const viewtool_1 = __webpack_require__(0);
class walletView {
    static verifWif(res) {
        if (res.err) {
            $("#wif-input").removeClass("has-success");
            $("#wif-input").addClass("has-error");
            $("#wif-input").children("p").text(res.result);
        }
        else {
            $("#wif-input").addClass("has-success");
            $("#wif-input").removeClass("has-error");
            $("#wif-input").children("p").text(res.result);
            $("#importWif").modal("hide");
        }
    }
    static showDetails(detail) {
        let detailview = document.getElementById("wallet-details");
        detailview.innerHTML = "";
        let ul = '';
        for (let n = 0; n < detail.balances.length; n++) {
            const balance = detail.balances[n];
            let name = balance.name.map((name) => { return name.name; }).join('|');
            ul += '<li class="list-group-item"> ' + name + ' : ' + balance.balance + '</li>';
        }
        let addrpanel = new viewtool_1.Panel();
        addrpanel.setTitle("Address");
        addrpanel.setBody(detail.address);
        addrpanel.init(detailview);
        let balanPanel = new viewtool_1.Panel();
        balanPanel.setTitle("Balance");
        balanPanel.setUl(ul);
        balanPanel.init(detailview);
        // $("#wallet-details").append(html);
    }
    /**
     * showUtxo
     */
    static showUtxo(utxos) {
        $("#wallet-utxos").empty();
        utxos.forEach((utxo) => {
            let html = '';
            html += "<tr>";
            html += "<td class='code'>" + utxo.name;
            html += "</td>";
            html += "<td>" + utxo.value;
            html += "</td>";
            html += "<td><a class='code' target='_blank' rel='external nofollow' href='./txInfo.html?txid=" + utxo.txid + "'>" + utxo.txid;
            html += "</a>[" + utxo.n + "]</td>";
            html += "</tr>";
            $("#wallet-utxos").append(html);
        });
    }
    /**
     * showSelectAddrs
     */
    static showSelectAddrs(addrs) {
        $("#selectAddress").empty();
        addrs.forEach((addr) => {
            $("#selectAddress").append('<label><input type="radio" name="addrRadio" id="addrRadio1" value="' + addr + '" aria-label="...">' + addr + '</label>');
        });
        $("#selectAddr").modal("show");
    }
}
exports.walletView = walletView;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class UTXO {
}
exports.UTXO = UTXO;
class Detail {
    constructor(address, height, balances) {
        this.address = address;
        this.height = height;
        this.balances = balances;
    }
}
exports.Detail = Detail;
var AssetEnum;
(function (AssetEnum) {
    AssetEnum["NEO"] = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
    AssetEnum["GAS"] = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
})(AssetEnum = exports.AssetEnum || (exports.AssetEnum = {}));
class Nep5as {
}
exports.Nep5as = Nep5as;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class NeoUtil {
    constructor() { }
    /**
     * verifyPublicKey 验证公钥
     * @param publicKey 公钥
     */
    static verifyPublicKey(publicKey) {
        var array = Neo.Cryptography.Base58.decode(publicKey);
        //var hexstr = array.toHexString();
        //var salt = array.subarray(0, 1);
        //var hash = array.subarray(1, 1 + 20);
        var check = array.subarray(21, 21 + 4); //
        var checkdata = array.subarray(0, 21); //
        var hashd = Neo.Cryptography.Sha256.computeHash(checkdata); //
        hashd = Neo.Cryptography.Sha256.computeHash(hashd); //
        var hashd = hashd.slice(0, 4); //
        var checked = new Uint8Array(hashd); //
        var error = false;
        for (var i = 0; i < 4; i++) {
            if (checked[i] != check[i]) {
                error = true;
                break;
            }
        }
        return !error;
    }
    /**
     * wifDecode wif解码
     * @param wif wif私钥
     */
    static wifDecode(wif) {
        let result = { err: false, result: { pubkey: Uint8Array, prikey: Uint8Array, address: "" } };
        var prikey;
        var pubkey;
        var address;
        try {
            prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
            var hexstr = prikey.toHexString();
            result.result.prikey = hexstr;
        }
        catch (e) {
            result.err = true;
            result.result = e.message;
            return result;
        }
        try {
            pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
            var hexstr = pubkey.toHexString();
            result.result.pubkey = hexstr;
        }
        catch (e) {
            result.err = true;
            result.result = e.message;
            return result;
        }
        try {
            address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
            result.result.address = address;
        }
        catch (e) {
            result.err = true;
            result.result = e.message;
            return result;
        }
        return result;
    }
    /**
     * nep2FromWif
     */
    static nep2FromWif(wif, password) {
        var prikey;
        var pubkey;
        var address;
        let res = { err: false, result: { address: "", nep2: "" } };
        try {
            prikey = ThinNeo.Helper.GetPrivateKeyFromWIF(wif);
            var n = 16384;
            var r = 8;
            var p = 8;
            ThinNeo.Helper.GetNep2FromPrivateKey(prikey, password, n, r, p, (info, result) => {
                res.err = false;
                res.result.nep2 = result;
                pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                var hexstr = pubkey.toHexString();
                address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                res.result.address = address;
                return res;
            });
        }
        catch (e) {
            res.err = true;
            res.result = e.message;
            return res;
        }
    }
    /**
     * nep2TOWif
     */
    static nep2ToWif(nep2, password) {
        return __awaiter(this, void 0, void 0, function* () {
            var prikey;
            var pubkey;
            var address;
            let promise = new Promise((resolve, reject) => {
                let n = 16384;
                var r = 8;
                var p = 8;
                ThinNeo.Helper.GetPrivateKeyFromNep2(nep2, password, n, r, p, (info, result) => {
                    //spanNep2.textContent = "info=" + info + " result=" + result;
                    console.log("result=" + "info=" + info + " result=" + result);
                    prikey = result;
                    if (prikey != null) {
                        var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(prikey);
                        var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                        var wif = ThinNeo.Helper.GetWifFromPrivateKey(prikey);
                        console.log('1:' + address);
                        resolve({ err: false, result: { pubkey, address, prikey } });
                    }
                    else {
                        // spanWif.textContent = "result=" + "info=" + info + " result=" + result;
                        reject({ err: false, result: result });
                    }
                });
            });
            return promise;
        });
    }
    /**
     * nep6Load
     */
    static nep6Load(wallet, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // let promise:Promise<result> = new Promise((resolve,reject)=>{
            try {
                //getPrivateKey 是异步方法，且同时只能执行一个
                var istart = 0;
                let res = new Array();
                var getkey = null;
                // getkey = async (keyindex: number) => {
                for (let keyindex = 0; keyindex < wallet.accounts.length; keyindex++) {
                    let account = wallet.accounts[keyindex];
                    try {
                        let result = yield NeoUtil.getPriKeyfromAccount(wallet.scrypt, password, account);
                        res.push(result.result);
                    }
                    catch (error) {
                        console.error(error);
                        return { err: true, result: error };
                    }
                }
                return { err: false, result: res };
            }
            catch (e) {
            }
            // });
            // return promise;
        });
    }
    /**
     * getPriKeyform
     */
    static getPriKeyfromAccount(scrypt, password, account) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = new Promise((resolve, reject) => {
                account.getPrivateKey(scrypt, password, (info, result) => {
                    if (info == "finish") {
                        var pubkey = ThinNeo.Helper.GetPublicKeyFromPrivateKey(result);
                        var address = ThinNeo.Helper.GetAddressFromPublicKey(pubkey);
                        var wif = ThinNeo.Helper.GetWifFromPrivateKey(result);
                        var hexkey = result.toHexString();
                        console.log(info + "|" + address + " wif=" + wif);
                        resolve({ err: false, result: { pubkey: pubkey, address: address, prikey: result } });
                    }
                    else {
                        // info2.textContent += info + "|" + result;
                        reject({ err: true, result: result });
                    }
                });
            });
            return promise;
        });
    }
}
exports.NeoUtil = NeoUtil;


/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map