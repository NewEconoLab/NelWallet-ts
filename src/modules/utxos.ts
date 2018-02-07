
namespace wallet.module{
    export class UtxosModule{
        module:HTMLDivElement;
        body: HTMLDivElement;
        app: App;
        init(app: App) {
            this.app = app;
            let jum = tools.Jumbotron.creatJumbotron("UTXO");
            this.module = jum.jumbotron;
            this.body = jum.body;
        }
        update(utxos: wallet.entity.UTXO[])
        {
            this.body.innerHTML = "";
            let table = new wallet.tools.Table();
            table.table.classList.add("table","table-hover","cool");
            table.init(this.body);
            utxos.forEach((utxo) => {
                let th = document.createElement('tr');
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                let td3 = document.createElement('td');
                th.appendChild(td1);
                th.appendChild(td2);
                th.appendChild(td3);
                td1.innerText = utxo.name;
                td2.innerText = utxo.value.toString();
                td3.innerHTML = "<a class='code' target='_blank' rel='external nofollow' href='./txInfo.html?txid=" + utxo.txid + "'>"
                    + utxo.txid + "</a>[" + utxo.n + "]";
                table.tbody.appendChild(th);
            })
            this.app.detail.body.appendChild(this.module);
    
        }
    }
}