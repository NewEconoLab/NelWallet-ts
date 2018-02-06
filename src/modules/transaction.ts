
namespace wallet.module{
    export class TransactionModule{
        module:HTMLDivElement;
        body:HTMLDivElement;
        init(app:App){
            let jum = wallet.tools.Jumbotron.creatJumbotron("Transaction");
            this.module = jum.jumbotron;
            this.body = jum.body;
            app.main.appendChild(this.module);
        }
    }
}