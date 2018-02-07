
namespace wallet.module{
    export class SignModule
    {
        app: App;
        model: tools.Model;
        init(app: App)
        {
            this.app = app;
            this.model = app.transaction.model;
        }
        public setTran(tran: ThinNeo.Transaction, inputaddr: string[])
        {
            if (tran.witnesses == null)
                tran.witnesses = [];
            let txid = tran.GetHash().clone().reverse().toHexString();

            this.model.title = "Sign";
            this.model.body.innerHTML = "";
        }
    }
}