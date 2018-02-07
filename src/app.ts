///<reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
/// <reference types="bootstrap" />

namespace wallet
{
    export class App
    {
        walletController: WalletController;
        walletFunction: WalletFunction;
        navbar: module.NavbarModule;
        detail: module.DetailModule;
        sign: module.SignModule;
        transfer: module.TransferModule;
        transaction: module.TransactionModule;
        utxoModule: module.UtxosModule;
        dapp: module.Dapp;
        loadKey: entity.loadKey;
        utxos: entity.UTXO[];
        main: HTMLDivElement;
        constructor()
        {
            this.main = document.getElementById("main") as HTMLDivElement;
            this.detail = new module.DetailModule();
            this.sign = new module.SignModule()
            this.transfer = new module.TransferModule();
            this.transaction = new module.TransactionModule();
            this.walletController = new WalletController();
            this.walletFunction = new WalletFunction();
            this.utxoModule = new module.UtxosModule();
            this.navbar = new module.NavbarModule();
            this.dapp = new module.Dapp();
        }
        async start()
        {
            await tools.CoinTool.initAllAsset();

            this.detail.init(this);

            this.navbar.init(this);

            this.sign.init(this);

            this.utxoModule.init(this);

            this.transfer.init(this);

            this.transaction.init(this);

            this.dapp.init(this);

            this.walletController.start(this);

            this.walletFunction.init(this);
        }
    }

    $(() =>
    {
        let app = new App();
        app.start();
    })
}