///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
/// <reference types="bootstrap" />
import { WWW } from './tools/wwwtool';
import { DetailModule } from './modules/details';
import { NavbarModule } from './modules/navbar';
import { SignModule } from './modules/sign';
import { TransferModule } from './modules/transfer';
import { TransactionModule } from './modules/transaction';
import { CoinTool }from'./tools/cointool';
import { WalletController }from'./controllers/WalletController';

export class App{
    walletController:WalletController;
    navbar:NavbarModule;
    detail:DetailModule;
    sign:SignModule;
    transfer:TransferModule;
    transaction:TransactionModule;
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