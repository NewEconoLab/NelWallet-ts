import {walletView} from'../views/walletView';
import { Balance, UTXO, Asset, Addr, result, Detail,AssetEnum } from '../Entitys';
import { NeoUtil } from '../tools/neotool';
import { WWW } from '../tools/wwwtool';
import { CoinTool } from '../tools/cointool';
import { App } from '../app';
export class WalletController{
    private walletView:walletView;
    private loadKeys:{pubkey:Uint8Array,prikey:Uint8Array,address:string}[];
    public utxos:UTXO[];
    public app:App;
    constructor(){}

    /**
     * showUtxo
     */
    public showUtxo() {
        
    }



    /**
     * importWif
     */
    public importWif() {
        $("#import-wif").click(()=>{
            $("#importWif").modal('show');
        });
        $('#send-wif').click(()=>{
            let wif:string = $("#wif-input").find("input").val().toString();  //获得输入的wif
            let res:result;
            if(!wif.length){
                res = {err:true,result:"不得为空"};
            }else{
                try {
                    let result= NeoUtil.wifDecode(wif);
                    if(!result.err){
                        this.loadKeys = [result.result];
                        this.details(result.result['address']);
                    }
                    res={err:false,result:"验证通过"}
                } catch (error) {
                    alert(error);
                    res = {err:true,result:error};
                }
            }
            walletView.verifWif(res);
        })        
    }
    
    /**
     * importNep2
     */
    public importNep2() {
        $("#import-nep2").click(()=>{
            $("#importNep2").modal('show');
        });
        $("#send-nep2").click(()=>{
            this.nep2init();
        })
    }
    
    /**
     * importNep6
     */
    public importNep6() {        
        $("#import-nep6").click(()=>{
            $("#importNep6").modal('show');
        });
        let file = document.getElementById("nep6-select") as HTMLInputElement;
        var wallet: ThinNeo.nep6wallet;
        var reader = new FileReader();
        reader.onload = (e: Event) => {
            var walletstr = reader.result as string;
            wallet = new ThinNeo.nep6wallet();
            wallet.fromJsonStr(walletstr);
            var textContent = "";
            for (var i = 0; i < wallet.accounts.length; i++) {
                textContent += wallet.accounts[i].address;
                if (wallet.accounts[i].nep2key != null)
                    textContent += "(have key)";
                textContent += "\r\n";
            }
            // alert(2+":"+textContent);
        };
        file.onchange = (ev: Event) => {
            if (file.files[0].name.includes(".json")) {
                // alert("1:json");
                reader.readAsText(file.files[0]);
            }
        }
        $("#send-nep6").click(async()=>{
            let password = $("#nep6-password").val().toString();
            try {
                let res:result = await NeoUtil.nep6Load(wallet,password);
                console.log("成功返回："+res.result[0]);
                $('#importNep6').modal('hide');
                if(res.result.length>1){
                    let addrs:string[] = res.result.map(item=>{return item.address});
                    walletView.showSelectAddrs(addrs);
                }                
                if(!res.err){
                    this.loadKeys = res.result;
                }
            } catch (error) {
                console.log("失败："+error);
            }
        })
        $("#send-Addr").click(()=>{
            let addr = $('#selectAddress input[name="addrRadio"]:checked ').val().toString();
            this.details(addr);
            $("#selectAddr").modal("hide");
        })
    }

    /**
     * Transfer
     */
    public Transfer() {    
        $("#send-transfer").click(()=>{
            var targetaddr:string = $("#targetaddr").val().toString();
            var asset= $("#transfer-asset").val().toString();
            var assetid = CoinTool.name2assetID[asset];
            var count = $("#transfer-amount").val().toString();
            var utxos:{[id:string]:UTXO[]} = this.getassets(this.utxos);
            var _count = Neo.Fixed8.parse(count);
            var tran = CoinTool.makeTran( utxos,targetaddr,assetid,_count)
            let type:string = ThinNeo.TransactionType[tran.type].toString();
            let version:string = tran.version.toString();
            let inputcount = tran.inputs.length;
            var inputAddrs: string[] = [];

        });
        $("#Sing-send").click(()=>{

        });
    }    
    public getassets(utxos:UTXO[]):{[id:string]:UTXO[]}{

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
            var utxo = new UTXO();
            utxo.addr = item.addr;
            utxo.asset = asset;
            utxo.n = n;
            utxo.txid = txid;
            utxo.count = Neo.Fixed8.parse(count+"");
            assets[asset].push(utxo);
        }
        return assets;
    }

    
    /**
     * details
     */
    public async details(address:string) {
        let height:number = 0;
        try {
            let balances:Balance[] = await WWW.api_getBalance(address);
            balances.map((balance)=>{
                if(balance.asset==AssetEnum.NEO){
                    balance.name=[{lang:'en',name:'NEO'}];
                }
                if(balance.asset==AssetEnum.GAS){
                    balance.name=[{lang:'en',name:"GAS"}];
                }
            });
            
            let blockHeight = await WWW.api_getHeight();
            let detail:Detail = new Detail(address,blockHeight,balances);
            this.app.detail.update(detail);
            try {
                let allAsset:Asset[] = await WWW.api_getAllAssets();
                allAsset.map((asset)=>{
                    if(asset.id==AssetEnum.NEO){
                        asset.name=[{lang:'en',name:'NEO'}];
                    }
                    if(asset.id==AssetEnum.GAS){
                        asset.name=[{lang:'en',name:"GAS"}];
                    }
                });
                var utxos = await WWW.api_getUTXO(address);
                this.utxos = utxos;
                utxos.map((item)=>{
                    item.name = allAsset.find(val => val.id==item.asset).name.map((name)=>{ return name.name}).join("|");
                })
                walletView.showUtxo(utxos);
                $("#wallet-details").show();
                $("#wallet-utxo").show();
                $("#wallet-transaction").show();
            } catch (error) {
                
            }
        } catch (error) {
            
        }
        
    }

    /**
     * async nep2init
     */
    public async nep2init() {
        let nep2:string = $("#nep2-string").val().toString();
        let password:string = $("#nep2-password").val().toString();
        try {
            let res:result = await NeoUtil.nep2ToWif(nep2,password);
            console.log(res);
            if(!res.err){
                $("#importNep2").modal('hide');
                $("#wallet-details").empty();
                this.details(res.result["address"]);
            }
        } catch (err) {
            console.log("err:"+err);
        }
    }

    
    start(app:App){
        this.app = app;
        this.importNep2();
        this.importWif();
        this.importNep6();
        this.Transfer();   
    }
}