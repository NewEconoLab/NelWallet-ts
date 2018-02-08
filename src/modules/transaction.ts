
namespace wallet.module{
    export class TransactionModule
    {
        model: tools.Model;
        app: App;
        assets: { [id: string]: entity.UTXO[] }
        tran: ThinNeo.Transaction;
        init(app: App)
        {
            this.app = app;
            this.model = new tools.Model();
            this.model.init("Transaction", "Transaction", document.body);
            this.model.send.innerText = "Sign";
        }

        public setTran(tran: ThinNeo.Transaction)
        {
            this.model.body.innerHTML = "";
            this.tran = tran;
            let type: string = ThinNeo.TransactionType[tran.type].toString();
            let version: string = tran.version.toString();
            let inputcount = tran.inputs.length;
            var inputAddrs: string[] = [];
            let ul = document.createElement("ul");
            ul.classList.add("list-group");
            tools.BootsModule.setLiInUl(ul, "type:" + type);
            tools.BootsModule.setLiInUl(ul, "version:" + version);
            tools.BootsModule.setLiInUl(ul, "inputcount:" + inputcount);


            for (var i = 0; i < tran.inputs.length; i++)
            {
                var _addr = tran.inputs[i]["_addr"];
                if (inputAddrs.indexOf(_addr) < 0)
                {
                    inputAddrs.push(_addr);
                }

                //必须clone后翻转,因爲這個hash是input的成員，直接反轉會改變它
                var rhash = tran.inputs[i].hash.clone().reverse();
                var inputhash = rhash.toHexString();
                var outstr = "    input[" + i + "]" + inputhash + "(" + tran.inputs[i].index + ")";
                var txid = inputhash;
                tools.BootsModule.setLiInUl(ul, '<a class="code" href="http://be.nel.group/page/txInfo.html?txid=' + inputhash + '">' + outstr + '</a>');

            }


            for (var i = 0; i < tran.outputs.length; i++)
            {
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
                if (inputAddrs.length == 1 && address == inputAddrs[0])
                {
                    // lightsPanel.QuickDom.addSpan(this.panel, "    (change)" + CoinTool.assetID2name[assetid] + "=" + tran.outputs[i].value.toString());
                    let addr = "(change)" + tools.CoinTool.assetID2name[assetid] + "=" + tran.outputs[i].value.toString();
                    tools.BootsModule.setLiInUl(ul, a.outerHTML + addr);

                }
                else
                {
                    // lightsPanel.QuickDom.addSpan(this.panel, "    " + CoinTool.assetID2name[assetid] + "=" + tran.outputs[i].value.toString());
                    let addr = tools.CoinTool.assetID2name[assetid] + "=" + tran.outputs[i].value.toString();
                    tools.BootsModule.setLiInUl(ul, a.outerHTML + addr);
                }
                // lightsPanel.QuickDom.addElement(this.panel, "br");
            }
            let msg = tran.GetMessage();
            var msglen = msg.length;
            var txid = tran.GetHash().toHexString();
            tools.BootsModule.setLiInUl(ul, "--this TXLen=" + msglen + "--this TXID=" + txid);
            for (var i = 0; i < inputAddrs.length; i++)
            {
                let must = "must witness[" + i + "]=" + inputAddrs[i];
                tools.BootsModule.setLiInUl(ul, must);
            }
            this.model.body.appendChild(ul);
            $("#Transaction").modal("show");

            this.model.send.onclick = () =>
            {
                tran.witnesses = [];
                this.app.sign.setTran(tran, inputAddrs);
            }
        }
    }
}