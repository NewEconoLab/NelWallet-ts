///<reference path="../../lib/neo-ts.d.ts"/>
///<reference path="../app.ts"/>
namespace wallet
{

    export class WalletFunction
    {

        public app: App;
        public init(app: App)
        {
            this.app = app;
        }
        public static getassets(utxos: wallet.entity.UTXO[]): { [id: string]: wallet.entity.UTXO[] }
        {

            var assets = {};
            for (var i in utxos)
            {
                var item = utxos[i];
                var txid = item.txid;
                var n = item.n;
                var asset = item.asset;
                var count = item.value;
                if (assets[asset] == undefined)
                {
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
        public async details(address: string)
        {
            let height: number = 0;
            try
            {
                let balances: wallet.entity.Balance[] = await wallet.tools.WWW.api_getBalance(address);
                balances.map((balance) =>
                {
                    if (balance.asset == entity.AssetEnum.NEO)
                    {
                        balance.name = [{ lang: 'en', name: 'NEO' }];
                    }
                    if (balance.asset == entity.AssetEnum.GAS)
                    {
                        balance.name = [{ lang: 'en', name: "GAS" }];
                    }
                });

                let blockHeight = await tools.WWW.api_getHeight();
                let detail: entity.Detail = new entity.Detail(address, blockHeight, balances);
                this.app.detail.update(detail);
            } catch (error)
            {

            }

        }

        /**
         * utxo
         */
        public async utxoShow(address: string)
        {
            this.app.utxoModule.module.hidden = this.app.utxoModule.module.hidden == true ? false : true;

            try
            {
                let allAsset: entity.Asset[] = await tools.WWW.api_getAllAssets();
                allAsset.map((asset) =>
                {
                    if (asset.id == entity.AssetEnum.NEO)
                    {
                        asset.name = [{ lang: 'en', name: 'NEO' }];
                    }
                    if (asset.id == entity.AssetEnum.GAS)
                    {
                        asset.name = [{ lang: 'en', name: "GAS" }];
                    }
                });
                let utxos = await tools.WWW.api_getUTXO(address);
                utxos.map((item) =>
                {
                    item.name = allAsset.find(val => val.id == item.asset).name.map((name) => { return name.name }).join("|");
                })
                this.app.utxoModule.update(utxos);
            } catch (error)
            {

            }
        }


        initDApp_WhoAmI(): void
        {
            var pkey = this.app.loadKey.pubkey;
            console.log("(No need key)");
            console.log("Target");
            var target = "AdzQq1DmnHq86yyDUkU3jKdHwLUe2MLAVv";
            let btn = document.createElement("button");
            btn.innerText = "test";
            this.app.main.appendChild(btn);
            btn.onclick = async () =>
            {
                //dapp 方式1 ，GetStorage  ，方式2 invokeScript，查NEP5余额就是
                var targetaddr = target;
                var scriptaddress = "0x42832a25cf11d0ceee5629cb8b4daee9bac207ca";
                var key = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targetaddr);
                var script = scriptaddress.hexToBytes();//script 要反序
                var r = await tools.WWW.rpc_getStorage(script, key);
                if (r == null)
                {
                    alert("no name");
                }
                else
                {
                    var hex = r.hexToBytes();
                    alert( "name=" + ThinNeo.Helper.Bytes2String(hex));
                }
            };
            

            if (pkey != null)
            {
                var pkeyhash = ThinNeo.Helper.GetPublicKeyScriptHashFromPublicKey(pkey);
                console.log("(need key)");
                console.log("cur addr=" + this.app.loadKey.address);
                console.log("setName");
                //btnSetName.onclick = () =>
                //{
                //    var targetaddr = this.app.panelLoadKey.address;//给自己转账
                //    var assetid = CoinTool.id_GAS;
                //    var _count = Neo.Fixed8.Zero;//有数就行，是个gas以内都是不要钱的
                //    var tran = CoinTool.makeTran(this.main.panelUTXO.assets, targetaddr, assetid, _count);

                //    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                //    tran.extdata = new ThinNeo.InvokeTransData();
                //    let script = null;
                //    var sb = new ThinNeo.ScriptBuilder();
                //    var scriptaddress = "0x42832a25cf11d0ceee5629cb8b4daee9bac207ca".hexToBytes().reverse();
                //    sb.EmitPushString(inputName.value);//先推第二个参数，新名字
                //    sb.EmitPushBytes(this.main.panelLoadKey.pubkey);//再推第二个参数，自己的公钥
                //    sb.EmitAppCall(scriptaddress);
                //    (tran.extdata as ThinNeo.InvokeTransData).script = sb.ToArray();
                //    //估计一个gas用量
                //    //如果估计gas用量少了，智能合约执行会失败。
                //    //如果估计gas用量>10,交易必须丢弃gas，否则智能合约执行会失败
                //    (tran.extdata as ThinNeo.InvokeTransData).gas = Neo.Fixed8.fromNumber(1.0);

                //    this.main.panelTransaction.setTran(tran);
                //};
            }
        }
        
    }

}