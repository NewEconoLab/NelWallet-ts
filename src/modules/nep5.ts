namespace wallet.module
{
    export class Nep5
    {

        module: HTMLDivElement;
        body: HTMLDivElement;
        app: App;
        init(app: App)
        {
            this.app = app;
            let jum = wallet.tools.Jumbotron.creatJumbotron("Transfer");
            this.module = jum.jumbotron;
            this.body = jum.body;
            app.main.appendChild(this.module);
            let toaddr = tools.BootsModule.getFormGroup("To Address");
            let toInput = document.createElement("input");
            toInput.type = "text";
            toInput.classList.add("form-control");
            toInput.placeholder = "Enter the address you want to trade";
            toaddr.appendChild(toInput);
            let amount = tools.BootsModule.getFormGroup("Amount");
            let amountInput = document.createElement("input");
            amountInput.type = "number";
            amountInput.classList.add("form-control");
            amountInput.placeholder = "Enter the amount you want to trade ";
            amount.appendChild(amountInput);
            let type = tools.BootsModule.getFormGroup("Type");
            let typeSelect = document.createElement("select");
            let option = document.createElement("option");
            option.value = "0x3fccdb91c9bb66ef2446010796feb6ca4ed96b05";
            option.innerText = "NNS Coin";
            let option2 = document.createElement("option");
            option2.value = "c88acaae8a0362cdbdedddf0083c452a3a8bb7b8";
            option2.innerText = "CPX Token";
            type.appendChild(typeSelect);
            typeSelect.appendChild(option);
            typeSelect.appendChild(option2);
            let send = tools.BootsModule.getFormGroup("");
            let btn = document.createElement("button");
            btn.classList.add("btn", "btn-info");
            btn.textContent = "Make transfer";
            send.appendChild(btn);

            this.body.appendChild(toaddr);
            this.body.appendChild(amount);
            this.body.appendChild(type);
            this.body.appendChild(send);


            btn.onclick = () =>
            {

                this.initDApp_WhoAmI(toInput.value, amountInput.value, typeSelect.value);

            }

        }


        async initDApp_WhoAmI(to: string, value: string, type: string)
        {
            var pkey = this.app.loadKey.pubkey;
            var target = this.app.loadKey.address;
            var res = await tools.Nep5.getInfoByContract(type);
            var decimals = res["decimals"];
            var bnum = Neo.BigInteger.parse(value);

            var v = 1;
            for (var i = 0; i < decimals; i++)
            {
                v *= 10;
            }
            var intv = bnum.multiply(v).toInt32();
            
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
                var scriptaddress = type.hexToBytes().reverse();
                sb.EmitParamJson(["(address)" + this.app.loadKey.address, "(address)" + to, "(integer)" + intv]);//第二个参数是个数组
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