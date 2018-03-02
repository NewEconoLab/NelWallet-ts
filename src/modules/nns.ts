namespace wallet.module
{

    export class NNS
    {

        module: HTMLDivElement;
        body: HTMLDivElement;
        app: App;

        constructor() { }

        init(app: App)
        {
            this.app = app;

            let jum = wallet.tools.Jumbotron.creatJumbotron("Domain");
            this.module = jum.jumbotron;
            this.body = jum.body;
            app.main.appendChild(this.module);
            var domainInput = tools.BootsModule.createInput("text", "form-control", "Please enter the domain name you want to query");
            var queryBtn = tools.BootsModule.createBtn("search", "btn-info");
            var registerBtn = tools.BootsModule.createBtn("注册", "btn-info");
            var queryForm = tools.BootsModule.getFormGroup("Query domain");
            queryForm.appendChild(domainInput);
            this.body.appendChild(queryForm);
            this.body.appendChild(queryBtn);
            this.body.appendChild(registerBtn);

            queryBtn.onclick = async () =>
            {
                var domainarr: string[] = domainInput.value.split('.');
                var subdomain: string = domainarr[0];
                var root: string = await tools.NNS.getRootName();
                domainarr.shift();
                domainarr.push(root)
                var nnshash: Uint8Array = tools.NNS.nameHashArray(domainarr);
                let domains = await tools.NNS.getSubOwner(nnshash, subdomain);
                if (!domains.length[0])
                {
                    alert("此域名为空!!!");
                }
                //let rootname: Uint8Array = await tools.NNS.getRootNameHash();
                //let nnshash: Uint8Array = await tools.NNS.getNameHash(rootname);
                //let info: entity.DomainInfo = await tools.NNS.getDomainInfo(nnshash); 
                //let res = await tools.NNS.getSubOwner(nnshash, domainInput.value);
                //console.log(res[0]);
                //if (!res[0])
                //{
                //    alert("这个域名为空");
                //}
            }

            registerBtn.onclick = async () =>
            {
                var who: string = "";
                var nnshash = "";
                var subdomain = "";

                var utxos = await wallet.tools.WWW.api_getUTXO(this.app.loadKey.address);
                let allAsset: entity.Asset[] = await wallet.tools.WWW.api_getAllAssets();
                utxos.map((item) =>
                {
                    item.name = allAsset.find(val => val.id == item.asset).name.map((name) => { return name.name }).join("|");
                })
                var pkey = this.app.loadKey.pubkey;
                this.app.utxos = utxos;
                if (pkey != null)
                {
                    var pkeyhash = ThinNeo.Helper.GetPublicKeyScriptHashFromPublicKey(pkey);
                    let targeraddr = this.app.loadKey.address;  //给自己转账
                    let assetid = tools.CoinTool.id_GAS;
                    //let _count = Neo.Fixed8.Zero;   //十个gas内都不要钱滴
                    let tran = tools.CoinTool.makeTran(this.app.walletController.getassets(this.app.utxos), targeraddr, assetid, Neo.Fixed8.Zero);

                    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                    tran.extdata = new ThinNeo.InvokeTransData();
                    let script = null;
                    var sb = new ThinNeo.ScriptBuilder();
                    var scriptaddress = "dffbdd534a41dd4c56ba5ccba9dfaaf4f84e1362".hexToBytes().reverse();
                    sb.EmitParamJson(["(address)" + who, "(ByteArray)" + nnshash, "(str)" + subdomain]);//第二个参数是个数组
                    sb.EmitPushString("transfer");//第一个参数
                    sb.EmitAppCall(scriptaddress);  //资产合约
                    (tran.extdata as ThinNeo.InvokeTransData).script = sb.ToArray();
                    //估计一个gas用量
                    //如果估计gas用量少了，智能合约执行会失败。
                    //如果估计gas用量>10,交易必须丢弃gas，否则智能合约执行会失败
                    (tran.extdata as ThinNeo.InvokeTransData).gas = Neo.Fixed8.fromNumber(1.0);

                    this.app.transaction.setTran(tran);
                }
            }
        }
    }
}   