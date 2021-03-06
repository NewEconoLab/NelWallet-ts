﻿namespace wallet.tools{

    export class WWW
    {
        static api: string = "http://47.96.168.8:81/api/testnet";
        static rpc: string = "http://47.96.168.8:20332/";
        static rpcName: string = "";
        static makeRpcUrl(url: string, method: string, ..._params: any[])
        {


            if (url[url.length - 1] != '/')
                url = url + "/";
            var urlout = url + "?jsonrpc=2.0&id=1&method=" + method + "&params=[";
            for (var i = 0; i < _params.length; i++)
            {
                urlout += JSON.stringify(_params[i]);
                if (i != _params.length - 1)
                    urlout += ",";
            }
            urlout += "]";
            return urlout;
        }
        static makeRpcPostBody(method: string, ..._params: any[]): {}
        {
            var body = {};
            body["jsonrpc"] = "2.0";
            body["id"] = 1;
            body["method"] = method;
            var params = [];
            for (var i = 0; i < _params.length; i++)
            {
                params.push(_params[i]);
            }
            body["params"] = params;
            return body;
        }


        static async  api_getHeight()
        {
            var str = WWW.makeRpcUrl(WWW.api, "getblockcount");
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            var height = parseInt(r[0]["blockcount"] as string) - 1;
            return height;
        }
        static async api_getAllAssets()
        {
            var str = WWW.makeRpcUrl(WWW.api, "getallasset");
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }
        static async api_getUTXO(address: string)
        {
            var str = WWW.makeRpcUrl(WWW.api, "getutxo", address);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;

        }
        static async api_getBalance(address: string){
            var str = WWW.makeRpcUrl(WWW.api, "getbalance", address);
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            return r;
        }

        static async rpc_postRawTransaction(data: Uint8Array): Promise<boolean>
        {
            var postdata = WWW.makeRpcPostBody("sendrawtransaction", data.toHexString());
            var result = await fetch(WWW.rpc, { "method": "post", "body": JSON.stringify(postdata) });
            var json = await result.json();
            var r = json["result"] as boolean;
            return r;
        }

        static async rpc_getURL()
        {
            var str = WWW.makeRpcUrl(WWW.api, "getnoderpcapi");
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"][0];
            var url = r.nodeList[0];
            WWW.rpc = url;
            WWW.rpcName = r.nodeType;
            return url;
        }

        static async  rpc_getHeight()
        {
            var str = WWW.makeRpcUrl(WWW.rpc, "getblockcount");
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            var r = json["result"];
            var height = parseInt(r as string) - 1;
            return height;
        }

        static async  rpc_getStorage(scripthash: Uint8Array, key: Uint8Array): Promise<string>
        {
            var str = WWW.makeRpcUrl(WWW.rpc, "getstorage", scripthash.toHexString(), key.toHexString());
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            if (json["result"] == null)
                return null;
            var r = json["result"] as string;
            return r;
        }

        static async rpc_getInvokescript(scripthash: Uint8Array): Promise<any>
        {
            var str = WWW.makeRpcUrl(WWW.rpc, "invokescript", scripthash.toHexString());
            var result = await fetch(str, { "method": "get" });
            var json = await result.json();
            if (json["result"] == null)
                return null;
            var r = json["result"]
            return r;
        }
    }

}