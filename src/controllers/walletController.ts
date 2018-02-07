///<reference path="../tools/neotool.ts"/>
namespace wallet
{
    export class WalletController
    {
        private loadKeys: { pubkey: Uint8Array, prikey: Uint8Array, address: string }[];
        public utxos: wallet.entity.UTXO[];
        public app: wallet.App;
        constructor() { }

        /**
         * showUtxo
         */




        /**
         * importWif
         */
        public importWif()
        {
            $("#import-wif").click(() =>
            {
                $("#importWif").modal('show');
            });
            $('#send-wif').click(async () =>
            {
                let wif: string = $("#wif-input").find("input").val().toString();  //获得输入的wif
                let res: wallet.entity.result;
                if (!wif.length)
                {
                    res = { err: true, result: "不得为空" };
                } else
                {
                    try
                    {
                        let result = wallet.tools.NeoUtil.wifDecode(wif);
                        if (!result.err)
                        {
                            this.loadKeys = [result.result];
                            this.app.loadKey = result.result;
                            await this.details(result.result['address']);
                            await $("#importWif").modal('hide');
                        }
                        res = { err: false, result: "验证通过" }
                    } catch (error)
                    {
                        alert(error);
                        res = { err: true, result: error };
                    }
                }
                //walletView.verifWif(res);
            })
        }

        /**
         * importNep2
         */
        public importNep2()
        {
            $("#import-nep2").click(() =>
            {
                $("#importNep2").modal('show');
            });
            $("#send-nep2").click(() =>
            {
                this.nep2init();
            })
        }

        /**
         * importNep6
         */
        public importNep6()
        {
            $("#import-nep6").click(() =>
            {
                $("#importNep6").modal('show');
            });
            let file = document.getElementById("nep6-select") as HTMLInputElement;
            var _wallet: ThinNeo.nep6wallet;
            var reader = new FileReader();
            reader.onload = (e: Event) =>
            {
                var walletstr = reader.result as string;
                _wallet = new ThinNeo.nep6wallet();
                _wallet.fromJsonStr(walletstr);
                var textContent = "";
                for (var i = 0; i < _wallet.accounts.length; i++)
                {
                    textContent += _wallet.accounts[i].address;
                    if (_wallet.accounts[i].nep2key != null)
                        textContent += "(have key)";
                    textContent += "\r\n";
                }
                // alert(2+":"+textContent);
            };
            file.onchange = (ev: Event) =>
            {
                if (file.files[0].name.includes(".json"))
                {
                    // alert("1:json");
                    reader.readAsText(file.files[0]);
                }
            }
            $("#send-nep6").click(async () =>
            {
                let password = $("#nep6-password").val().toString();
                try
                {
                    let res: wallet.entity.result = await wallet.tools.NeoUtil.nep6Load(_wallet, password);
                    console.log("成功返回：" + res.result[0]);
                    $('#importNep6').modal('hide');
                    if (res.result.length > 1)
                    {
                        let addrs: string[] =
                            res.result.map((item) =>
                            {
                                return item["address"]
                            });
                        tools.walletView.showSelectAddrs(addrs);
                    }
                    if (!res.err)
                    {
                        this.loadKeys = res.result;
                    }
                } catch (error)
                {
                    console.log("失败：" + error);
                }
            })
            $("#send-Addr").click(() =>
            {
                let addr = $('#selectAddress input[name="addrRadio"]:checked ').val().toString();
                this.details(addr);
                this.app.loadKey = this.loadKeys.find(item => { return item.address == addr });
                $("#selectAddr").modal("hide");
            })
        }

        /**
         * Transfer
         */
        public Transfer()
        {
            $("#send-transfer").click(() =>
            {
                var targetaddr: string = $("#targetaddr").val().toString();
                var asset = $("#transfer-asset").val().toString();
                var assetid = wallet.tools.CoinTool.name2assetID[asset];
                var count = $("#transfer-amount").val().toString();
                var utxos: {
                    [id: string]: wallet.entity.UTXO[]
                } = this.getassets(this.utxos);
                var _count = Neo.Fixed8.parse(count);
                var tran = wallet.tools.CoinTool.makeTran(utxos, targetaddr, assetid, _count)
                let type: string = ThinNeo.TransactionType[tran.type].toString();
                let version: string = tran.version.toString();
                let inputcount = tran.inputs.length;
                var inputAddrs: string[] = [];

            });
            $("#Sing-send").click(() =>
            {

            });
        }
        public getassets(utxos: wallet.entity.UTXO[]): { [id: string]: wallet.entity.UTXO[] }
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
                    if (balance.asset == wallet.entity.AssetEnum.NEO)
                    {
                        balance.name = [{ lang: 'en', name: 'NEO' }];
                    }
                    if (balance.asset == wallet.entity.AssetEnum.GAS)
                    {
                        balance.name = [{ lang: 'en', name: "GAS" }];
                    }
                });

                let blockHeight = await wallet.tools.WWW.api_getHeight();
                let detail: wallet.entity.Detail = new wallet.entity.Detail(address, blockHeight, balances);
                this.app.detail.update(detail);
                try
                {
                    let allAsset: entity.Asset[] = await wallet.tools.WWW.api_getAllAssets();
                    allAsset.map((asset) =>
                    {
                        if (asset.id == wallet.entity.AssetEnum.NEO)
                        {
                            asset.name = [{ lang: 'en', name: 'NEO' }];
                        }
                        if (asset.id == wallet.entity.AssetEnum.GAS)
                        {
                            asset.name = [{ lang: 'en', name: "GAS" }];
                        }
                    });
                    var utxos = await wallet.tools.WWW.api_getUTXO(address);
                    this.utxos = utxos;
                    utxos.map((item) =>
                    {
                        item.name = allAsset.find(val => val.id == item.asset).name.map((name) => { return name.name }).join("|");
                    })
                    this.app.utxos = utxos;
                } catch (error)
                {

                }
            } catch (error)
            {

            }

        }

        /**
         * async nep2init
         */
        public async nep2init()
        {
            let nep2: string = $("#nep2-string").val().toString();
            let password: string = $("#nep2-password").val().toString();
            try
            {
                let res: wallet.entity.result = await wallet.tools.NeoUtil.nep2ToWif(nep2, password);
                if (!res.err)
                {
                    $("#importNep2").modal('hide');
                    $("#wallet-details").empty();
                    this.app.loadKey = res.result;
                    this.details(res.result["address"]);
                }
            } catch (err)
            {
                console.log("err:" + err);
            }
        }


        start(app: App)
        {
            this.app = app;
            this.importNep2();
            this.importWif();
            this.importNep6();
            this.Transfer();
        }
    }
}