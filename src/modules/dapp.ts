namespace wallet.module
{
    export class Dapp
    {
        module: HTMLDivElement;
        body: HTMLDivElement;
        app: App;
        getName: HTMLButtonElement;
        setName: HTMLButtonElement;
        input: HTMLInputElement;
        getNamePanel: tools.Panel;
        setNamePanel: tools.Panel;
        private row: HTMLDivElement;
        private setCol: HTMLDivElement;
        private getCol: HTMLDivElement;

        
        init(app: App)
        {
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
            this.getNamePanel = new tools.Panel();
            this.getNamePanel.title.appendChild(this.getName);
            this.setNamePanel = new tools.Panel();
            this.setNamePanel.title.appendChild(this.setName);
            this.input = tools.BootsModule.createInput("text", "form-control", "Please enter the name you want to create ");
            this.setNamePanel.setBody(this.input);
            this.setCol = tools.BootsModule.creatCol(6);
            this.getCol = tools.BootsModule.creatCol(6);
            this.setCol.appendChild(this.setNamePanel.palneDiv);
            this.getCol.appendChild(this.getNamePanel.palneDiv);
            this.app.main.appendChild(this.module);
        }

        initDApp_WhoAmI(): void
        {
            var pkey = this.app.loadKey.pubkey;
            console.log("(No need key)");
            console.log("Target");
            var target = this.app.loadKey.address;

            this.getName.onclick = async () =>
            {
                //dapp 方式1 ，GetStorage  ，方式2 invokeScript，查NEP5余额就是
                var targetaddr = target;
                var scriptaddress = "0x42832a25cf11d0ceee5629cb8b4daee9bac207ca";
                var key = ThinNeo.Helper.GetPublicKeyScriptHash_FromAddress(targetaddr);
                var script = scriptaddress.hexToBytes();//script 要反序
                var r = await tools.WWW.rpc_getStorage(script, key);
                if (r == null)
                {
                    this.getNamePanel.setBodyStr("no name");
                }
                else
                {
                    var hex = r.hexToBytes();
                    this.getNamePanel.setBodyStr("name：" + ThinNeo.Helper.Bytes2String(hex));
                }
            };


            if (pkey != null)
            {
                this.row = tools.BootsModule.creatRow(this.getCol, this.setCol);
                this.body.appendChild(this.row);

                var pkeyhash = ThinNeo.Helper.GetPublicKeyScriptHashFromPublicKey(pkey);
                console.log("(need key)");
                console.log("cur addr=" + this.app.loadKey.address);
                console.log("setName");
                this.setName.onclick = () =>
                {

                    let targeraddr = this.app.loadKey.address;  //给自己转账
                    let assetid = tools.CoinTool.id_GAS;
                    //let _count = Neo.Fixed8.Zero;   //十个gas内都不要钱滴
                    var _count = Neo.Fixed8.parse("1");
                    let tran = tools.CoinTool.makeTran(this.app.walletController.getassets(this.app.utxos), targeraddr, assetid, Neo.Fixed8.Zero);

                    tran.type = ThinNeo.TransactionType.InvocationTransaction;
                    tran.extdata = new ThinNeo.InvokeTransData();
                    let script = null;
                    var sb = new ThinNeo.ScriptBuilder();
                    var scriptaddress = "0x42832a25cf11d0ceee5629cb8b4daee9bac207ca".hexToBytes().reverse();
                    sb.EmitPushString(this.input.value);//先推第二个参数，新名字
                    sb.EmitPushBytes(this.app.loadKey.pubkey);//再推第二个参数，自己的公钥
                    sb.EmitAppCall(scriptaddress);
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