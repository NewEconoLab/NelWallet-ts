///<reference path="../../lib/neo-ts.d.ts"/>
///<reference path="../app.ts"/>
namespace wallet
{

    export class WalletFunction
    {

        public app: App;
        public init(app: App)
        {
            this.app = app;
        }
        public static getassets(utxos: wallet.entity.UTXO[]): { [id: string]: wallet.entity.UTXO[] }
        {

            var assets = {};
            for (var i in utxos)
            {
                var item = utxos[i];
                var txid = item.txid;
                var n = item.n;
                var asset = item.asset;
                var count = item.value;
                if (assets[asset] == undefined)
                {
                    assets[asset] = [];
                }
                var utxo = new wallet.entity.UTXO();
                utxo.addr = item.addr;
                utxo.asset = asset;
                utxo.n = n;
                utxo.txid = txid;
                utxo.count = Neo.Fixed8.parse(count + "");
                assets[asset].push(utxo);
            }
            return assets;
        }


        /**
         * details
         */
        public async details(address: string)
        {
            let height: number = 0;
            try
            {
                let balances: wallet.entity.Balance[] = await wallet.tools.WWW.api_getBalance(address);
                balances.map((balance) =>
                {
                    if (balance.asset == entity.AssetEnum.NEO)
                    {
                        balance.name = [{ lang: 'en', name: 'NEO' }];
                    }
                    if (balance.asset == entity.AssetEnum.GAS)
                    {
                        balance.name = [{ lang: 'en', name: "GAS" }];
                    }
                });

                let blockHeight = await tools.WWW.api_getHeight();
                let detail: entity.Detail = new entity.Detail(address, blockHeight, balances);
                this.app.detail.update(detail);
            } catch (error)
            {

            }

        }

        /**
         * utxo
         */
        public async utxoShow(address: string)
        {
            this.app.utxoModule.module.hidden = this.app.utxoModule.module.hidden == true ? false : true;

            try
            {
                let allAsset: entity.Asset[] = await tools.WWW.api_getAllAssets();
                allAsset.map((asset) =>
                {
                    if (asset.id == entity.AssetEnum.NEO)
                    {
                        asset.name = [{ lang: 'en', name: 'NEO' }];
                    }
                    if (asset.id == entity.AssetEnum.GAS)
                    {
                        asset.name = [{ lang: 'en', name: "GAS" }];
                    }
                });
                let utxos = await tools.WWW.api_getUTXO(address);
                utxos.map((item) =>
                {
                    item.name = allAsset.find(val => val.id == item.asset).name.map((name) => { return name.name }).join("|");
                })
                this.app.utxoModule.update(utxos);
            } catch (error)
            {

            }
        }

        
    }

}