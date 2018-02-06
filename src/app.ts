///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
/// <reference types="bootstrap" />
///<reference path="./controllers/walletFunction.ts"/>
///<reference path="./controllers/walletFunction.ts"/>
///<reference path="./controllers/walletFunction.ts"/>
///<reference path="./controllers/walletFunction.ts"/>

namespace wallet{
    export class App{
        walletController:WalletController;
        walletFunction:wallet.WalletFunction;
        navbar:wallet.NavbarModule;
        detail:DetailModule;
        sign:SignModule;
        transfer:TransferModule;
        transaction:TransactionModule;
        utxo:UtxosModule;
        main:HTMLDivElement;
        constructor(){
            this.main = document.getElementById("main") as HTMLDivElement;
            this.detail = new DetailModule();
            this.sign = new SignModule() 
            this.transfer = new TransferModule();
            this.transaction = new TransactionModule();
            this.walletController = new WalletController();
            this.navbar = new NavbarModule();   
        }
        async start(){
            await CoinTool.initAllAsset();
            
            this.detail.init(this); 
            
            this.navbar.init(this); 
    
            this.sign.init(this); 
    
            this.transfer.init(this);
    
            this.transaction.init(this);
    
            this.walletController.start(this);
        }
    }
    
    $(()=>{
        let app = new App();
        app.start();
    })
}