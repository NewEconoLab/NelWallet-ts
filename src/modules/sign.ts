
namespace wallet.module{
    export class SignModule
    {
        app: App;
        model: tools.Model;
        init(app: App)
        {
            this.app = app;
        }
        public setTran(tran: ThinNeo.Transaction, inputaddr: string[])
        {
            this.model = this.app.transaction.model;
            this.model.title = "Sign";
            this.model.body.innerHTML = "";
            this.model.send.innerText = "boardcast it.";

            if (tran.witnesses == null)
                tran.witnesses = [];
            let ul = document.createElement("ul");
            ul.classList.add("list-group");
            let txid = tran.GetHash().clone().reverse().toHexString();
            tools.BootsModule.setLiInUl(ul, "txid:" + txid);
            let a = tools.BootsModule.creatA("TXID:" + txid, "http://be.nel.group/page/txInfo.html?txid=" + txid);
            tools.BootsModule.setLiInUl(ul, a.outerHTML);
            a.target = "_blank";
            tools.BootsModule.setLiInUl(ul, "need witness:");
            for (var i = 0; i < inputaddr.length; i++)
            {
                tools.BootsModule.setLiInUl(ul, "Withess[" + i + "]:" + inputaddr[i]);
                var hadwit = false;
                for (var w = 0; w < tran.witnesses.length; w++)
                {
                    if (tran.witnesses[w].Address == inputaddr[i])//Уќжа
                    {
                        //m
                        tools.BootsModule.setLiInUl(ul, "V_script:" + tran.witnesses[w].VerificationScript.toHexString());
                        tools.BootsModule.setLiInUl(ul, "I_script:" + tran.witnesses[w].InvocationScript.toHexString());
                        let witi = w;
                        let del = tools.BootsModule.createBtn("delete witness", "btn-info");
                        this.model.body.appendChild(ul);
                        this.model.body.appendChild(del);
                        del.onclick = () =>
                        {
                            tran.witnesses.splice(witi, 1);
                            this.setTran(tran, inputaddr);
                            return;
                        };
                        hadwit = true;
                        break;
                    }
                }
                if (hadwit == false)
                {
                    tools.BootsModule.setLiInUl(ul, "NoWitness");
                    if (inputaddr[i] == this.app.loadKey.address)
                    {
                        var add = tools.BootsModule.createBtn("Add witness by current key", "btn-info");
                        this.model.body.appendChild(ul);
                        this.model.body.appendChild(add);
                        add.onclick = () =>
                        {
                            var msg = tran.GetMessage();
                            var pubkey = this.app.loadKey.pubkey;
                            var signdata = ThinNeo.Helper.Sign(msg, this.app.loadKey.prikey);
                            tran.AddWitness(signdata, pubkey, this.app.loadKey.address);
                            this.setTran(tran, inputaddr);
                        }
                    }

                }
                this.model.send.onclick = async () =>
                {
                    var result = await tools.WWW.rpc_postRawTransaction(tran.GetRawData());
                    if (result as boolean == true)
                    {
                        alert("txid=" + txid);
                    }
                    $("#Transaction").modal("hide");
                };
            }
        }
    }
}