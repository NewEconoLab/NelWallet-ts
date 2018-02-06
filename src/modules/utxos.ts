
namespace wallet.module{
    export class UtxosModule{
        module:HTMLDivElement;
        body:HTMLDivElement;
        init(app:App){
            let jum = wallet.tools.Jumbotron.creatJumbotron("UTXO");
            this.module = jum.jumbotron;
            this.body = jum.body;
            app.main.appendChild(this.module);
        }
        update(utxos: wallet.entity.UTXO[])
        {
            // this.module.hidden=false;
            this.body.innerHTML="";
    
        }
    }
}