

namespace wallet.module{
    export class DetailModule{
        module:HTMLDivElement;
        body:HTMLDivElement;
        btn: HTMLButtonElement;
        app: App;
        init(app: App) {
            this.app = app;
            let jum = wallet.tools.Jumbotron.creatJumbotron("Details");
            this.module = jum.jumbotron;
            this.body = jum.body;
            this.btn = document.createElement("button");
            this.btn.classList.add("btn","btn-link");
            this.btn.innerText="UTXO";
            app.main.appendChild(this.module);

            this.btn.onclick = () => {
                this.app.walletFunction.utxoShow(this.app.loadKey.address);
            }
            
        }
        update(detail: wallet.entity.Detail)
        {
            this.module.hidden=false;
            this.body.innerHTML="";
            this.body.classList.add("row");
            let ul ='';
            for (let n = 0; n < detail.balances.length; n++) {
                const balance = detail.balances[n];
                let name = balance.name.map((name)=>{ return name.name}).join('|');
                ul += '<li class="list-group-item"> '+name+' : '+balance.balance+'</li>';
            }
            let addrpanel = new wallet.tools.Panel();
            let div1=document.createElement("div");
            let div2=document.createElement("div");
            addrpanel.setTitle("Address");
            addrpanel.setBodyStr(detail.address);
            addrpanel.init(div1);
            div1.classList.add("col-lg-6");
            let balanPanel = new wallet.tools.Panel();
            balanPanel.setTitle("Balance");
            balanPanel.setUl(ul);
            balanPanel.init(div2);
            div2.classList.add("col-lg-6");
            
            this.body.appendChild(div1);
            this.body.appendChild(div2);
            this.body.appendChild(this.btn);
            this.app.dapp.initDApp_WhoAmI();
    
        }
    }
}