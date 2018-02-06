
namespace wallet.module{
    export class TransferModule{
        module:HTMLDivElement;
        body:HTMLDivElement;
        init(app:App){
            let jum = wallet.tools.Jumbotron.creatJumbotron("Transfer");
            this.module = jum.jumbotron;
            this.body = jum.body;
            app.main.appendChild(this.module);
        }
    }
}