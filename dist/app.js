var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
/// <reference types="bootstrap" />
var wallet;
///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
/// <reference types="bootstrap" />
(function (wallet) {
    class App {
        constructor() {
            this.main = document.getElementById("main");
            this.detail = new wallet.module.DetailModule();
            this.sign = new wallet.module.SignModule();
            this.transfer = new wallet.module.TransferModule();
            this.transaction = new wallet.module.TransactionModule();
            this.walletController = new wallet.WalletController();
            this.walletFunction = new wallet.WalletFunction();
            this.utxoModule = new wallet.module.UtxosModule();
            this.navbar = new wallet.module.NavbarModule();
            this.dapp = new wallet.module.Dapp();
            this.nep5 = new wallet.module.Nep5();
        }
        start() {
            return __awaiter(this, void 0, void 0, function* () {
                yield wallet.tools.CoinTool.initAllAsset();
                this.detail.init(this);
                this.navbar.init(this);
                this.sign.init(this);
                this.utxoModule.init(this);
                this.transfer.init(this);
                this.transaction.init(this);
                this.dapp.init(this);
                this.nep5.init(this);
                this.walletController.start(this);
                this.walletFunction.init(this);
            });
        }
    }
    wallet.App = App;
    $(() => {
        let app = new App();
        app.start();
    });
})(wallet || (wallet = {}));
var wallet;
(function (wallet) {
    var entity;
    (function (entity) {
        class UTXO {
        }
        entity.UTXO = UTXO;
        class Detail {
            constructor(address, height, balances) {
                this.address = address;
                this.height = height;
                this.balances = balances;
            }
        }
        entity.Detail = Detail;
        let AssetEnum;
        (function (AssetEnum) {
            AssetEnum["NEO"] = "0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
            AssetEnum["GAS"] = "0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";
        })(AssetEnum = entity.AssetEnum || (entity.AssetEnum = {}));
        class Nep5as {
        }
        entity.Nep5as = Nep5as;
        class loadKey {
            constructor(pubkey, prikey, address) {
                this.prikey = prikey;
                this.pubkey = pubkey;
                this.address = address;
            }
        }
        entity.loadKey = loadKey;
    })(entity = wallet.entity || (wallet.entity = {}));
})(wallet || (wallet = {}));
///<reference path="../../lib/neo-ts.d.ts"/>
var wallet;
///<reference path="../../lib/neo-ts.d.ts"/>
(function (wallet_1) {
    var tools;
    (function (tools) {
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
                            if (account.nep2key == null)
                                continue;
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
        tools.NeoUtil = NeoUtil;
    })(tools = wallet_1.tools || (wallet_1.tools = {}));
})(wallet || (wallet = {}));
///<reference path="../tools/neotool.ts"/>
var wallet;
///<reference path="../tools/neotool.ts"/>
(function (wallet) {
    class WalletController {
        constructor() { }
        /**
         * showUtxo
         */
        /**
         * importWif
         */
        importWif() {
            $("#import-wif").click(() => {
                $("#importWif").modal('show');
            });
            $('#send-wif').click(() => __awaiter(this, void 0, void 0, function* () {
                let wif = $("#wif-input").find("input").val().toString(); //获得输入的wif
                let res;
                if (!wif.length) {
                    res = { err: true, result: "不得为空" };
                }
                else {
                    try {
                        let result = wallet.tools.NeoUtil.wifDecode(wif);
                        if (!result.err) {
                            this.loadKeys = [result.result];
                            this.app.loadKey = result.result;
                            yield this.details(result.result['address']);
                            yield $("#importWif").modal('hide');
                        }
                        res = { err: false, result: "验证通过" };
                    }
                    catch (error) {
                        alert(error);
                        res = { err: true, result: error };
                    }
                }
                //walletView.verifWif(res);
            }));
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
            var _wallet;
            var reader = new FileReader();
            reader.onload = (e) => {
                var walletstr = reader.result;
                _wallet = new ThinNeo.nep6wallet();
                _wallet.fromJsonStr(walletstr);
                var textContent = "";
                for (var i = 0; i < _wallet.accounts.length; i++) {
                    textContent += _wallet.accounts[i].address;
                    if (_wallet.accounts[i].nep2key != null)
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
                    let res = yield wallet.tools.NeoUtil.nep6Load(_wallet, password);
                    console.log("成功返回：" + res.result[0]);
                    $('#importNep6').modal('hide');
                    if (res.result.length > 1) {
                        let addrs = res.result.map((item) => {
                            return item["address"];
                        });
                        wallet.tools.walletView.showSelectAddrs(addrs);
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
                this.app.loadKey = this.loadKeys.find(item => { return item.address == addr; });
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
                var assetid = wallet.tools.CoinTool.name2assetID[asset];
                var count = $("#transfer-amount").val().toString();
                var utxos = this.getassets(this.utxos);
                var _count = Neo.Fixed8.parse(count);
                var tran = wallet.tools.CoinTool.makeTran(utxos, targetaddr, assetid, _count);
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
                var utxo = new wallet.entity.UTXO();
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
                    let balances = yield wallet.tools.WWW.api_getBalance(address);
                    balances.map((balance) => {
                        if (balance.asset == wallet.entity.AssetEnum.NEO) {
                            balance.name = [{ lang: 'en', name: 'NEO' }];
                        }
                        if (balance.asset == wallet.entity.AssetEnum.GAS) {
                            balance.name = [{ lang: 'en', name: "GAS" }];
                        }
                    });
                    let blockHeight = yield wallet.tools.WWW.api_getHeight();
                    let detail = new wallet.entity.Detail(address, blockHeight, balances);
                    this.app.detail.update(detail);
                    try {
                        let allAsset = yield wallet.tools.WWW.api_getAllAssets();
                        allAsset.map((asset) => {
                            if (asset.id == wallet.entity.AssetEnum.NEO) {
                                asset.name = [{ lang: 'en', name: 'NEO' }];
                            }
                            if (asset.id == wallet.entity.AssetEnum.GAS) {
                                asset.name = [{ lang: 'en', name: "GAS" }];
                            }
                        });
                        var utxos = yield wallet.tools.WWW.api_getUTXO(address);
                        this.utxos = utxos;
                        utxos.map((item) => {
                            item.name = allAsset.find(val => val.id == item.asset).name.map((name) => { return name.name; }).join("|");
                        });
                        this.app.utxos = utxos;
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
                    let res = yield wallet.tools.NeoUtil.nep2ToWif(nep2, password);
                    if (!res.err) {
                        $("#importNep2").modal('hide');
                        $("#wallet-details").empty();
                        this.app.loadKey = res.result;
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
    wallet.WalletController = WalletController;
})(wallet || (wallet = {}));
///<reference path="../../lib/neo-ts.d.ts"/>
///<reference path="../app.ts"/>
var wallet;
///<reference path="../../lib/neo-ts.d.ts"/>
///<reference path="../app.ts"/>
(function (wallet) {
    class WalletFunction {
        init(app) {
            this.app = app;
        }
        static getassets(utxos) {
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
                var utxo = new wallet.entity.UTXO();
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
                    let balances = yield wallet.tools.WWW.api_getBalance(address);
                    balances.map((balance) => {
                        if (balance.asset == wallet.entity.AssetEnum.NEO) {
                            balance.name = [{ lang: 'en', name: 'NEO' }];
                        }
                        if (balance.asset == wallet.entity.AssetEnum.GAS) {
                            balance.name = [{ lang: 'en', name: "GAS" }];
                        }
                    });
                    let blockHeight = yield wallet.tools.WWW.api_getHeight();
                    let detail = new wallet.entity.Detail(address, blockHeight, balances);
                    this.app.detail.update(detail);
                }
                catch (error) {
                }
            });
        }
        /**
         * utxo
         */
        utxoShow(address) {
            return __awaiter(this, void 0, void 0, function* () {
                this.app.utxoModule.module.hidden = this.app.utxoModule.module.hidden == true ? false : true;
                try {
                    let allAsset = yield wallet.tools.WWW.api_getAllAssets();
                    allAsset.map((asset) => {
                        if (asset.id == wallet.entity.AssetEnum.NEO) {
                            asset.name = [{ lang: 'en', name: 'NEO' }];
                        }
                        if (asset.id == wallet.entity.AssetEnum.GAS) {
                            asset.name = [{ lang: 'en', name: "GAS" }];
                        }
                    });
                    let utxos = yield wallet.tools.WWW.api_getUTXO(address);
                    utxos.map((item) => {
                        item.name = allAsset.find(val => val.id == item.asset).name.map((name) => { return name.name; }).join("|");
                    });
                    this.app.utxoModule.update(utxos);
                }
                catch (error) {
                }
            });
        }
        initDApp_WhoAmI() {
            var pkey = this.app.loadKey.pubkey;
            console.log("(No need key)");
            console.log("Target");
            var target = "AdzQq1DmnHq86yyDUkU3jKdHwLUe2MLAVv";
            let btn = document.createElement("button");
            btn.innerText = "test";
            this.app.main.appendChild(btn);
            btn.onclick = () => __awaiter(this, void 0, void 0, function* () {
                //dapp ��ʽ1 ��GetStorage  ����ʽ2 invokeScript����NEP5������
                var targetaddr = target;
                var scriptaddress = "0x42832a25cf11d0ceee5629cb8b4daee9bac207ca";
                var key = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targetaddr);
                var script = scriptaddress.hexToBytes(); //script Ҫ����
                var r = yield wallet.tools.WWW.rpc_getStorage(script, key);
                if (r == null) {
                    alert("no name");
                }
                else {
                    var hex = r.hexToBytes();
                    alert("name=" + ThinNeo.Helper.Bytes2String(hex));
                }
            });
            if (pkey != null) {
                var pkeyhash = ThinNeo.Helper.GetPublicKeyScriptHashFromPublicKey(pkey);
                console.log("(need key)");
                console.log("cur addr=" + this.app.loadKey.address);
                console.log("setName");
                //btnSetName.onclick = () =>
                //{
                //    var targetaddr = this.app.panelLoadKey.address;//���Լ�ת��
                //    var assetid = CoinTool.id_GAS;
                //    var _count = Neo.Fixed8.Zero;//�������У��Ǹ�gas���ڶ��ǲ�ҪǮ��
                //    var tran = CoinTool.makeTran(this.main.panelUTXO.assets, targetaddr, assetid, _count);
                //    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                //    tran.extdata = new ThinNeo.InvokeTransData();
                //    let script = null;
                //    var sb = new ThinNeo.ScriptBuilder();
                //    var scriptaddress = "0x42832a25cf11d0ceee5629cb8b4daee9bac207ca".hexToBytes().reverse();
                //    sb.EmitPushString(inputName.value);//���Ƶڶ���������������
                //    sb.EmitPushBytes(this.main.panelLoadKey.pubkey);//���Ƶڶ����������Լ��Ĺ�Կ
                //    sb.EmitAppCall(scriptaddress);
                //    (tran.extdata as ThinNeo.InvokeTransData).script = sb.ToArray();
                //    //����һ��gas����
                //    //�������gas�������ˣ����ܺ�Լִ�л�ʧ�ܡ�
                //    //�������gas����>10,���ױ��붪��gas���������ܺ�Լִ�л�ʧ��
                //    (tran.extdata as ThinNeo.InvokeTransData).gas = Neo.Fixed8.fromNumber(1.0);
                //    this.main.panelTransaction.setTran(tran);
                //};
            }
        }
    }
    wallet.WalletFunction = WalletFunction;
})(wallet || (wallet = {}));
var wallet;
(function (wallet) {
    var module;
    (function (module) {
        class Dapp {
            init(app) {
                this.app = app;
                let jum = wallet.tools.Jumbotron.creatJumbotron("Dapp");
                this.module = jum.jumbotron;
                this.body = jum.body;
                this.getName = document.createElement("button");
                this.getName.innerText = "GetName";
                this.getName.classList.add("btn", "btn-info");
                this.setName = document.createElement("button");
                this.setName.classList.add("btn", "btn-info");
                this.setName.innerText = "SetName";
                this.getNamePanel = new wallet.tools.Panel();
                this.getNamePanel.title.appendChild(this.getName);
                this.setNamePanel = new wallet.tools.Panel();
                this.setNamePanel.title.appendChild(this.setName);
                this.input = wallet.tools.BootsModule.createInput("text", "form-control", "Please enter the name you want to create ");
                this.setNamePanel.setBody(this.input);
                this.setCol = wallet.tools.BootsModule.creatCol(6);
                this.getCol = wallet.tools.BootsModule.creatCol(6);
                this.setCol.appendChild(this.setNamePanel.palneDiv);
                this.getCol.appendChild(this.getNamePanel.palneDiv);
                this.app.main.appendChild(this.module);
            }
            initDApp_WhoAmI() {
                var pkey = this.app.loadKey.pubkey;
                console.log("(No need key)");
                console.log("Target");
                var target = this.app.loadKey.address;
                this.getName.onclick = () => __awaiter(this, void 0, void 0, function* () {
                    //dapp 方式1 ，GetStorage  ，方式2 invokeScript，查NEP5余额就是
                    var targetaddr = target;
                    var scriptaddress = "0x42832a25cf11d0ceee5629cb8b4daee9bac207ca";
                    var key = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targetaddr);
                    var script = scriptaddress.hexToBytes(); //script 要反序
                    var r = yield wallet.tools.WWW.rpc_getStorage(script, key);
                    if (r == null) {
                        this.getNamePanel.setBodyStr("no name");
                    }
                    else {
                        var hex = r.hexToBytes();
                        this.getNamePanel.setBodyStr("name：" + ThinNeo.Helper.Bytes2String(hex));
                    }
                });
                if (pkey != null) {
                    this.row = wallet.tools.BootsModule.creatRow(this.getCol, this.setCol);
                    this.body.appendChild(this.row);
                    var pkeyhash = ThinNeo.Helper.GetPublicKeyScriptHashFromPublicKey(pkey);
                    console.log("(need key)");
                    console.log("cur addr=" + this.app.loadKey.address);
                    console.log("setName");
                    this.setName.onclick = () => {
                        let targeraddr = this.app.loadKey.address; //给自己转账
                        let assetid = wallet.tools.CoinTool.id_GAS;
                        //let _count = Neo.Fixed8.Zero;   //十个gas内都不要钱滴
                        var _count = Neo.Fixed8.parse("1");
                        let tran = wallet.tools.CoinTool.makeTran(this.app.walletController.getassets(this.app.utxos), targeraddr, assetid, Neo.Fixed8.Zero);
                        tran.type = ThinNeo.TransactionType.InvocationTransaction;
                        tran.extdata = new ThinNeo.InvokeTransData();
                        let script = null;
                        var sb = new ThinNeo.ScriptBuilder();
                        var scriptaddress = "0x42832a25cf11d0ceee5629cb8b4daee9bac207ca".hexToBytes().reverse();
                        sb.EmitPushString(this.input.value); //先推第二个参数，新名字
                        sb.EmitPushBytes(this.app.loadKey.pubkey); //再推第二个参数，自己的公钥
                        sb.EmitAppCall(scriptaddress);
                        tran.extdata.script = sb.ToArray();
                        //估计一个gas用量
                        //如果估计gas用量少了，智能合约执行会失败。
                        //如果估计gas用量>10,交易必须丢弃gas，否则智能合约执行会失败
                        tran.extdata.gas = Neo.Fixed8.fromNumber(1.0);
                        this.app.transaction.setTran(tran);
                    };
                }
            }
        }
        module.Dapp = Dapp;
    })(module = wallet.module || (wallet.module = {}));
})(wallet || (wallet = {}));
var wallet;
(function (wallet) {
    var module;
    (function (module) {
        class DetailModule {
            init(app) {
                this.app = app;
                let jum = wallet.tools.Jumbotron.creatJumbotron("Details");
                this.module = jum.jumbotron;
                this.body = jum.body;
                this.btn = document.createElement("button");
                this.btn.classList.add("btn", "btn-link");
                this.btn.innerText = "UTXO";
                app.main.appendChild(this.module);
                this.btn.onclick = () => {
                    this.app.walletFunction.utxoShow(this.app.loadKey.address);
                };
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
                let addrpanel = new wallet.tools.Panel();
                let div1 = document.createElement("div");
                let div2 = document.createElement("div");
                addrpanel.setTitle("Address");
                addrpanel.setBodyStr(detail.address);
                addrpanel.init(div1);
                div1.classList.add("col-lg-6");
                let balanPanel = new wallet.tools.Panel();
                balanPanel.setTitle("Balance");
                balanPanel.setUl(ul);
                balanPanel.init(div2);
                div2.classList.add("col-lg-6");
                this.body.appendChild(div1);
                this.body.appendChild(div2);
                this.body.appendChild(this.btn);
                this.app.dapp.initDApp_WhoAmI();
            }
        }
        module.DetailModule = DetailModule;
    })(module = wallet.module || (wallet.module = {}));
})(wallet || (wallet = {}));
var wallet;
(function (wallet) {
    var module;
    (function (module) {
        class NavbarModule {
            constructor() {
                this.ul = document.createElement("ul");
                this.liNep5 = document.createElement("li");
                this.aNep5 = document.createElement("a");
                this.liDapp = document.createElement("li");
                this.aDapp = document.createElement("a");
                this.liTransfer = document.createElement("li");
                this.aTransfer = document.createElement("a");
            }
            init(app) {
                this.app = app;
                this.ul.classList.add('nav', 'nav-pills');
                this.aNep5.textContent = "Nep5";
                this.liNep5.appendChild(this.aNep5);
                this.aDapp.textContent = "Dapp...";
                this.liDapp.appendChild(this.aDapp);
                this.aTransfer.textContent = "Transfer";
                this.liTransfer.appendChild(this.aTransfer);
                this.liTransfer.classList.add("active");
                this.ul.appendChild(this.liTransfer);
                this.ul.appendChild(this.liDapp);
                this.ul.appendChild(this.liNep5);
                // let main = document.getElementById("nav") as HTMLDivElement;
                let main = this.app.main;
                main.appendChild(this.ul);
                this.aNep5.onclick = () => {
                    this.cutlabe("Nep5");
                };
                this.aDapp.onclick = () => {
                    this.cutlabe("Dapp");
                };
                this.aTransfer.onclick = () => {
                    this.cutlabe("transfer");
                };
            }
            cutlabe(str) {
                if (str == "Nep5") {
                    this.liNep5.classList.add("active");
                    this.app.nep5.module.hidden = false;
                }
                else {
                    this.liNep5.classList.remove("active");
                    this.app.nep5.module.hidden = true;
                }
                if (str == "transfer") {
                    this.liTransfer.classList.add("active");
                    this.app.transfer.module.hidden = false;
                }
                else {
                    this.liTransfer.classList.remove("active");
                    this.app.transfer.module.hidden = true;
                }
                if (str == "Dapp") {
                    this.liDapp.classList.add("active");
                    this.app.dapp.module.hidden = false;
                }
                else {
                    this.liDapp.classList.remove("active");
                    this.app.dapp.module.hidden = true;
                }
            }
        }
        module.NavbarModule = NavbarModule;
    })(module = wallet.module || (wallet.module = {}));
})(wallet || (wallet = {}));
var wallet;
(function (wallet) {
    var module;
    (function (module) {
        class Nep5 {
            init(app) {
                this.app = app;
                let jum = wallet.tools.Jumbotron.creatJumbotron("Transfer");
                this.module = jum.jumbotron;
                this.body = jum.body;
                app.main.appendChild(this.module);
                let toaddr = wallet.tools.BootsModule.getFormGroup("To Address");
                let toInput = document.createElement("input");
                toInput.type = "text";
                toInput.classList.add("form-control");
                toInput.placeholder = "Enter the address you want to trade";
                toaddr.appendChild(toInput);
                let amount = wallet.tools.BootsModule.getFormGroup("Amount");
                let amountInput = document.createElement("input");
                amountInput.type = "number";
                amountInput.classList.add("form-control");
                amountInput.placeholder = "Enter the amount you want to trade ";
                amount.appendChild(amountInput);
                let type = wallet.tools.BootsModule.getFormGroup("Type");
                let typeSelect = document.createElement("select");
                let option = document.createElement("option");
                option.value = "GAS";
                option.innerText = "GAS";
                type.appendChild(typeSelect);
                typeSelect.appendChild(option);
                let send = wallet.tools.BootsModule.getFormGroup("");
                let btn = document.createElement("button");
                btn.classList.add("btn", "btn-info");
                btn.textContent = "Make transfer";
                send.appendChild(btn);
                this.body.appendChild(toaddr);
                this.body.appendChild(amount);
                this.body.appendChild(type);
                this.body.appendChild(send);
                btn.onclick = () => {
                    this.initDApp_WhoAmI("AHDV7M54NHukq8f76QQtBTbrCqKJrBH9UF", "9");
                };
            }
            initDApp_WhoAmI(to, value) {
                var pkey = this.app.loadKey.pubkey;
                var target = this.app.loadKey.address;
                if (pkey != null) {
                    var pkeyhash = ThinNeo.Helper.GetPublicKeyScriptHashFromPublicKey(pkey);
                    let targeraddr = this.app.loadKey.address; //给自己转账
                    let assetid = wallet.tools.CoinTool.id_GAS;
                    //let _count = Neo.Fixed8.Zero;   //十个gas内都不要钱滴
                    let tran = wallet.tools.CoinTool.makeTran(this.app.walletController.getassets(this.app.utxos), targeraddr, assetid, Neo.Fixed8.Zero);
                    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                    tran.extdata = new ThinNeo.InvokeTransData();
                    let script = null;
                    var sb = new ThinNeo.ScriptBuilder();
                    var scriptaddress = "c88acaae8a0362cdbdedddf0083c452a3a8bb7b8".hexToBytes().reverse();
                    sb.EmitParamJson(["(address)" + this.app.loadKey.address, "(address)" + to, "(integer)" + value]); //第二个参数是个数组
                    sb.EmitPushString("transfer"); //第一个参数
                    sb.EmitAppCall(scriptaddress); //资产合约
                    tran.extdata.script = sb.ToArray();
                    //估计一个gas用量
                    //如果估计gas用量少了，智能合约执行会失败。
                    //如果估计gas用量>10,交易必须丢弃gas，否则智能合约执行会失败
                    tran.extdata.gas = Neo.Fixed8.fromNumber(1.0);
                    this.app.transaction.setTran(tran);
                }
            }
        }
        module.Nep5 = Nep5;
    })(module = wallet.module || (wallet.module = {}));
})(wallet || (wallet = {}));
var wallet;
(function (wallet) {
    var module;
    (function (module) {
        class SignModule {
            init(app) {
                this.app = app;
            }
            setTran(tran, inputaddr) {
                this.model = this.app.transaction.model;
                this.model.title = "Sign";
                this.model.body.innerHTML = "";
                this.model.send.innerText = "boardcast it.";
                if (tran.witnesses == null)
                    tran.witnesses = [];
                let ul = document.createElement("ul");
                ul.classList.add("list-group");
                let txid = tran.GetHash().clone().reverse().toHexString();
                wallet.tools.BootsModule.setLiInUl(ul, "txid:" + txid);
                let a = wallet.tools.BootsModule.creatA("TXID:" + txid, "http://be.nel.group/page/txInfo.html?txid=" + txid);
                wallet.tools.BootsModule.setLiInUl(ul, a.outerHTML);
                a.target = "_blank";
                wallet.tools.BootsModule.setLiInUl(ul, "need witness:");
                for (var i = 0; i < inputaddr.length; i++) {
                    wallet.tools.BootsModule.setLiInUl(ul, "Withess[" + i + "]:" + inputaddr[i]);
                    var hadwit = false;
                    for (var w = 0; w < tran.witnesses.length; w++) {
                        if (tran.witnesses[w].Address == inputaddr[i]) {
                            //m
                            wallet.tools.BootsModule.setLiInUl(ul, "V_script:" + tran.witnesses[w].VerificationScript.toHexString());
                            wallet.tools.BootsModule.setLiInUl(ul, "I_script:" + tran.witnesses[w].InvocationScript.toHexString());
                            let witi = w;
                            let del = wallet.tools.BootsModule.createBtn("delete witness", "btn-info");
                            this.model.body.appendChild(ul);
                            this.model.body.appendChild(del);
                            del.onclick = () => {
                                tran.witnesses.splice(witi, 1);
                                this.setTran(tran, inputaddr);
                                return;
                            };
                            hadwit = true;
                            break;
                        }
                    }
                    if (hadwit == false) {
                        wallet.tools.BootsModule.setLiInUl(ul, "NoWitness");
                        if (inputaddr[i] == this.app.loadKey.address) {
                            var add = wallet.tools.BootsModule.createBtn("Add witness by current key", "btn-info");
                            this.model.body.appendChild(ul);
                            this.model.body.appendChild(add);
                            add.onclick = () => {
                                var msg = tran.GetMessage();
                                var pubkey = this.app.loadKey.pubkey;
                                var signdata = ThinNeo.Helper.Sign(msg, this.app.loadKey.prikey);
                                tran.AddWitness(signdata, pubkey, this.app.loadKey.address);
                                this.setTran(tran, inputaddr);
                            };
                        }
                    }
                    this.model.send.onclick = () => __awaiter(this, void 0, void 0, function* () {
                        var result = yield wallet.tools.WWW.rpc_postRawTransaction(tran.GetRawData());
                        if (result == true) {
                            alert("txid=" + txid);
                        }
                        $("#Transaction").modal("hide");
                    });
                }
            }
        }
        module.SignModule = SignModule;
    })(module = wallet.module || (wallet.module = {}));
})(wallet || (wallet = {}));
var wallet;
(function (wallet) {
    var module;
    (function (module) {
        class TransactionModule {
            init(app) {
                this.app = app;
                this.model = new wallet.tools.Model();
                this.model.init("Transaction", "Transaction", document.body);
                this.model.send.innerText = "Sign";
            }
            setTran(tran) {
                this.model.body.innerHTML = "";
                this.tran = tran;
                let type = ThinNeo.TransactionType[tran.type].toString();
                let version = tran.version.toString();
                let inputcount = tran.inputs.length;
                var inputAddrs = [];
                let ul = document.createElement("ul");
                ul.classList.add("list-group");
                wallet.tools.BootsModule.setLiInUl(ul, "type:" + type);
                wallet.tools.BootsModule.setLiInUl(ul, "version:" + version);
                wallet.tools.BootsModule.setLiInUl(ul, "inputcount:" + inputcount);
                for (var i = 0; i < tran.inputs.length; i++) {
                    var _addr = tran.inputs[i]["_addr"];
                    if (inputAddrs.indexOf(_addr) < 0) {
                        inputAddrs.push(_addr);
                    }
                    //����clone��ת,���@��hash��input�ĳɆT��ֱ�ӷ��D����׃��
                    var rhash = tran.inputs[i].hash.clone().reverse();
                    var inputhash = rhash.toHexString();
                    var outstr = "    input[" + i + "]" + inputhash + "(" + tran.inputs[i].index + ")";
                    var txid = inputhash;
                    wallet.tools.BootsModule.setLiInUl(ul, '<a class="code" href="http://be.nel.group/page/txInfo.html?txid=' + inputhash + '">' + outstr + '</a>');
                }
                for (var i = 0; i < tran.outputs.length; i++) {
                    var addrt = tran.outputs[i].toAddress;
                    var address = ThinNeo.Helper.GetAddressFromScriptHash(addrt);
                    // a.target = "_blank";
                    var outputs = "outputs[" + i + "]" + address;
                    var assethash = tran.outputs[i].assetId.clone().reverse();
                    var assetid = "0x" + assethash.toHexString();
                    let a = document.createElement("a");
                    a.innerText = outputs;
                    a.href = 'http://be.nel.group/page/address.html?addr=' + address;
                    a.target = "_blank";
                    if (inputAddrs.length == 1 && address == inputAddrs[0]) {
                        // lightsPanel.QuickDom.addSpan(this.panel, "    (change)" + CoinTool.assetID2name[assetid] + "=" + tran.outputs[i].value.toString());
                        let addr = "(change)" + wallet.tools.CoinTool.assetID2name[assetid] + "=" + tran.outputs[i].value.toString();
                        wallet.tools.BootsModule.setLiInUl(ul, a.outerHTML + addr);
                    }
                    else {
                        // lightsPanel.QuickDom.addSpan(this.panel, "    " + CoinTool.assetID2name[assetid] + "=" + tran.outputs[i].value.toString());
                        let addr = wallet.tools.CoinTool.assetID2name[assetid] + "=" + tran.outputs[i].value.toString();
                        wallet.tools.BootsModule.setLiInUl(ul, a.outerHTML + addr);
                    }
                    // lightsPanel.QuickDom.addElement(this.panel, "br");
                }
                let msg = tran.GetMessage();
                var msglen = msg.length;
                var txid = tran.GetHash().toHexString();
                wallet.tools.BootsModule.setLiInUl(ul, "--this TXLen=" + msglen + "--this TXID=" + txid);
                for (var i = 0; i < inputAddrs.length; i++) {
                    let must = "must witness[" + i + "]=" + inputAddrs[i];
                    wallet.tools.BootsModule.setLiInUl(ul, must);
                }
                this.model.body.appendChild(ul);
                $("#Transaction").modal("show");
                this.model.send.onclick = () => {
                    tran.witnesses = [];
                    this.app.sign.setTran(tran, inputAddrs);
                };
            }
        }
        module.TransactionModule = TransactionModule;
    })(module = wallet.module || (wallet.module = {}));
})(wallet || (wallet = {}));
var wallet;
(function (wallet) {
    var module;
    (function (module) {
        class TransferModule {
            init(app) {
                this.app = app;
                let jum = wallet.tools.Jumbotron.creatJumbotron("Transfer");
                this.module = jum.jumbotron;
                this.body = jum.body;
                app.main.appendChild(this.module);
                let toaddr = wallet.tools.BootsModule.getFormGroup("To Address");
                let toInput = document.createElement("input");
                toInput.type = "text";
                toInput.classList.add("form-control");
                toInput.placeholder = "Enter the address you want to trade";
                toaddr.appendChild(toInput);
                let amount = wallet.tools.BootsModule.getFormGroup("Amount");
                let amountInput = document.createElement("input");
                amountInput.type = "number";
                amountInput.classList.add("form-control");
                amountInput.placeholder = "Enter the amount you want to trade ";
                amount.appendChild(amountInput);
                let type = wallet.tools.BootsModule.getFormGroup("Type");
                let typeSelect = document.createElement("select");
                let option = document.createElement("option");
                option.value = "GAS";
                option.innerText = "GAS";
                type.appendChild(typeSelect);
                typeSelect.appendChild(option);
                let send = wallet.tools.BootsModule.getFormGroup("");
                let btn = document.createElement("button");
                btn.classList.add("btn", "btn-info");
                btn.textContent = "Make transfer";
                send.appendChild(btn);
                this.body.appendChild(toaddr);
                this.body.appendChild(amount);
                this.body.appendChild(type);
                this.body.appendChild(send);
                btn.onclick = () => {
                    var assetid = wallet.tools.CoinTool.name2assetID[typeSelect.value];
                    var utxoss = wallet.WalletFunction.getassets(app.utxos);
                    var _count = Neo.Fixed8.parse(amountInput.value);
                    var tran = wallet.tools.CoinTool.makeTran(utxoss, toInput.value, assetid, _count);
                    this.app.transaction.setTran(tran);
                };
            }
        }
        module.TransferModule = TransferModule;
    })(module = wallet.module || (wallet.module = {}));
})(wallet || (wallet = {}));
var wallet;
(function (wallet) {
    var module;
    (function (module) {
        class UtxosModule {
            init(app) {
                this.app = app;
                let jum = wallet.tools.Jumbotron.creatJumbotron("UTXO");
                this.module = jum.jumbotron;
                this.body = jum.body;
            }
            update(utxos) {
                this.body.innerHTML = "";
                let table = new wallet.tools.Table();
                table.table.classList.add("table", "table-hover", "cool");
                table.init(this.body);
                utxos.forEach((utxo) => {
                    let th = document.createElement('tr');
                    let td1 = document.createElement('td');
                    let td2 = document.createElement('td');
                    let td3 = document.createElement('td');
                    th.appendChild(td1);
                    th.appendChild(td2);
                    th.appendChild(td3);
                    td1.innerText = utxo.name;
                    td2.innerText = utxo.value.toString();
                    td3.innerHTML = "<a class='code' target='_blank' rel='external nofollow' href='./txInfo.html?txid=" + utxo.txid + "'>"
                        + utxo.txid + "</a>[" + utxo.n + "]";
                    table.tbody.appendChild(th);
                });
                this.app.detail.body.appendChild(this.module);
            }
        }
        module.UtxosModule = UtxosModule;
    })(module = wallet.module || (wallet.module = {}));
})(wallet || (wallet = {}));
///<reference path="../../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
var wallet;
///<reference path="../../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
(function (wallet) {
    var tools;
    (function (tools) {
        class CoinTool {
            static initAllAsset() {
                return __awaiter(this, void 0, void 0, function* () {
                    var allassets = yield tools.WWW.api_getAllAssets();
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
                //if (sendcount.compareTo(Neo.Fixed8.Zero) <= 0)
                //    throw new Error("can not send zero.");
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
                    if (sendcount.compareTo(Neo.Fixed8.Zero) > 0) {
                        var output = new ThinNeo.TransactionOutput();
                        output.assetId = assetid.hexToBytes().reverse();
                        output.value = sendcount;
                        output.toAddress = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targetaddr);
                        tran.outputs.push(output);
                    }
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
        tools.CoinTool = CoinTool;
    })(tools = wallet.tools || (wallet.tools = {}));
})(wallet || (wallet = {}));
var wallet;
(function (wallet) {
    var tools;
    (function (tools) {
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
                this.body.appendChild(body);
                this.palneDiv.appendChild(this.body);
            }
            setBodyStr(str) {
                this.body.innerHTML = str;
                this.palneDiv.appendChild(this.body);
            }
            setClass(...param) {
                //this.palneDiv.classList.add(param);
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
        tools.Panel = Panel;
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
        tools.Table = Table;
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
        tools.Jumbotron = Jumbotron;
        class BootsModule {
            static getFormGroup(title) {
                let form = document.createElement("div");
                form.classList.add("form-group");
                if (title) {
                    let label = document.createElement("label");
                    label.textContent = title;
                    label.classList.add("form-lable");
                    form.appendChild(label);
                }
                return form;
            }
            static setLiInUl(ul, value) {
                let li = document.createElement("li");
                li.classList.add("list-group-item", "code");
                li.innerHTML = value;
                ul.appendChild(li);
            }
            static creatRow(...param) {
                let row = document.createElement("div");
                row.className = "row";
                for (let i = 0; i < param.length; i++) {
                    row.appendChild(param[i]);
                }
                return row;
            }
            static creatCol(size) {
                let col = document.createElement("div");
                col.classList.add("col-md-" + size);
                return col;
            }
            static createInput(type, cname, placeholder) {
                let input = document.createElement("input");
                input.type = type;
                input.className = cname;
                input.placeholder = placeholder;
                return input;
            }
            static createBtn(value, style) {
                let btn = document.createElement("button");
                btn.innerHTML = value;
                btn.classList.add("btn", style);
                return btn;
            }
            static creatA(val, href) {
                let a = document.createElement("a");
                a.innerHTML = val;
                a.href = href;
                return a;
            }
        }
        tools.BootsModule = BootsModule;
        class Model {
            constructor() {
                this.head = document.createElement("h4");
                this.model = document.createElement("div");
                this.dialog = document.createElement("div");
                this.content = document.createElement("div");
                this.header = document.createElement("div");
                this.body = document.createElement("div");
                this.footer = document.createElement("div");
                this.send = document.createElement("button");
                this.close = document.createElement("button");
                this.X = document.createElement("button");
                this.model.classList.add("modal", "fade");
                this.dialog.classList.add("modal-dialog");
                this.content.classList.add("modal-content");
                this.header.classList.add("modal-header");
                this.footer.classList.add("modal-footer");
                this.head.classList.add("modal-title");
                this.X.classList.add("close");
                this.X.innerHTML = "&times;";
                this.close.innerText = "Close";
                this.send.innerText = "Send";
                this.X.setAttribute("data-dismiss", "modal");
                this.X.setAttribute("aria-hidden", "true");
                this.close.classList.add("btn", "btn-default");
                this.close.setAttribute("data-dismiss", "modal");
                this.send.classList.add("btn", "btn-primary");
                this.model.appendChild(this.dialog);
                this.model.tabIndex = -1;
                this.dialog.appendChild(this.content);
                this.content.appendChild(this.header);
                this.content.appendChild(this.body);
                this.content.appendChild(this.footer);
                this.footer.appendChild(this.close);
                this.footer.appendChild(this.send);
                this.header.appendChild(this.X);
            }
            init(id, title, pater) {
                this.title = title;
                this.model.id = id;
                this.head.innerText = this.title;
                this.header.appendChild(this.head);
                pater.appendChild(this.model);
            }
            set title(title) {
                this._title = title;
                this.head.textContent = this._title;
                this.header.appendChild(this.head);
            }
            get title() {
                return this._title;
            }
        }
        tools.Model = Model;
    })(tools = wallet.tools || (wallet.tools = {}));
})(wallet || (wallet = {}));
var wallet;
(function (wallet) {
    var tools;
    (function (tools) {
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
            static rpc_getStorage(scripthash, key) {
                return __awaiter(this, void 0, void 0, function* () {
                    var str = WWW.makeRpcUrl(WWW.rpc, "getstorage", scripthash.toHexString(), key.toHexString());
                    var result = yield fetch(str, { "method": "get" });
                    var json = yield result.json();
                    if (json["result"] == null)
                        return null;
                    var r = json["result"];
                    return r;
                });
            }
        }
        WWW.api = "http://47.96.168.8:81/api/testnet";
        WWW.rpc = "http://47.96.168.8:20332/";
        WWW.rpcName = "";
        tools.WWW = WWW;
    })(tools = wallet.tools || (wallet.tools = {}));
})(wallet || (wallet = {}));
var wallet;
(function (wallet) {
    var tools;
    (function (tools) {
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
                let addrpanel = new wallet.tools.Panel();
                addrpanel.setTitle("Address");
                addrpanel.setBodyStr(detail.address);
                addrpanel.init(detailview);
                let balanPanel = new wallet.tools.Panel();
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
        tools.walletView = walletView;
    })(tools = wallet.tools || (wallet.tools = {}));
})(wallet || (wallet = {}));
//# sourceMappingURL=app.js.map