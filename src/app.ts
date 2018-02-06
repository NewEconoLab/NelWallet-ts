///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
/// <reference types="bootstrap" />

namespace wallet
{
    export class App
    {
        walletController: WalletController;
        walletFunction: wallet.WalletFunction;
        navbar: module.NavbarModule;
        detail: module.DetailModule;
        sign: module.SignModule;
        transfer: module.TransferModule;
        transaction: module.TransactionModule;
        utxo: module.UtxosModule;
        main: HTMLDivElement;
        constructor()
        {
            this.main = document.getElementById("main") as HTMLDivElement;
            this.detail = new module.DetailModule();
            this.sign = new module.SignModule()
            this.transfer = new module.TransferModule();
            this.transaction = new module.TransactionModule();
            this.walletController = new WalletController();
            this.navbar = new module.NavbarModule();
        }
        async start()
        {
            await tools.CoinTool.initAllAsset();

            this.detail.init(this);

            this.navbar.init(this);

            this.sign.init(this);

            this.transfer.init(this);

            this.transaction.init(this);

            this.walletController.start(this);
        }
    }

    $(() =>
    {
        let app = new App();
        app.start();
    })
}