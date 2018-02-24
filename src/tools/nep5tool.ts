namespace wallet.tools
{
    export class Nep5
    {
        static async getInfoByContract(sid: string): Promise<any>
        {
            let res = {  name: "", symbol: "", decimals: 0, totalsupply: 0  };
            try
            {
                var sb = new ThinNeo.ScriptBuilder();

                sb.EmitParamJson(JSON.parse("[]"));//参数倒序入
                sb.EmitParamJson("(str)name");//参数倒序入
                var shash = sid.hexToBytes();
                sb.EmitAppCall(shash.reverse());//nep5脚本

                sb.EmitParamJson(JSON.parse("[]"));
                sb.EmitParamJson("(str)symbol");
                var shash = sid.hexToBytes();
                sb.EmitAppCall(shash.reverse());

                sb.EmitParamJson(JSON.parse("[]"));
                sb.EmitParamJson("(str)decimals");
                var shash = sid.hexToBytes();
                sb.EmitAppCall(shash.reverse());

                sb.EmitParamJson(JSON.parse("[]"));
                sb.EmitParamJson("(str)totalSupply");
                var shash = sid.hexToBytes();
                sb.EmitAppCall(shash.reverse());

                var data = sb.ToArray();

                let result = await tools.WWW.rpc_getInvokescript(data);


                try
                {
                    var state = result.state as string;
                    // info2.textContent = "";
                    if (state.includes("HALT"))
                    {
                        // info2.textContent += "Succ\n";
                    }
                    var stack = result.stack as any[];
                    //find name 他的type 有可能是string 或者ByteArray
                    if (stack[0].type == "String")
                    {
                        // info2.textContent += "name=" + stack[0].value + "\n";
                        res.name = stack[0].value;
                    }
                    else if (stack[0].type == "ByteArray")
                    {
                        var bs = (stack[0].value as string).hexToBytes();
                        var str = ThinNeo.Helper.Bytes2String(bs);
                        // info2.textContent += "name=" + str + "\n";
                        res.name = str
                    }
                    //find symbol 他的type 有可能是string 或者ByteArray
                    if (stack[1].type == "String")
                    {
                        // info2.textContent += "symbol=" + stack[1].value + "\n";
                        res.symbol = stack[1].value;
                    }
                    else if (stack[1].type == "ByteArray")
                    {
                        var bs = (stack[1].value as string).hexToBytes();
                        var str = ThinNeo.Helper.Bytes2String(bs);
                        // info2.textContent += "symbol=" + str + "\n";
                        res.symbol = str;
                    }

                    //find decimals 他的type 有可能是 Integer 或者ByteArray
                    if (stack[2].type == "Integer")
                    {
                        var decimals = (new Neo.BigInteger(stack[2].value as string)).toInt32();
                    }
                    else if (stack[2].type == "ByteArray")
                    {
                        var bs = (stack[2].value as string).hexToBytes();
                        var num = new Neo.BigInteger(bs);
                        var decimals = num.toInt32();
                    }
                    //find decimals 他的type 有可能是 Integer 或者ByteArray
                    if (stack[3].type == "Integer")
                    {
                        var totalsupply = (new Neo.BigInteger(stack[3].value as string)).toInt32();
                    }
                    else if (stack[3].type == "ByteArray")
                    {
                        var bs = (stack[3].value as string).hexToBytes();
                        var num = new Neo.BigInteger(bs);
                        totalsupply = num.toInt32();
                    }
                    // info2.textContent += "decimals=" + this.nep5decimals + "\n";
                    res.totalsupply = totalsupply;
                    res.decimals = decimals;
                    return res;
                }
                catch (e)
                {
                    return e.message;
                }
            }
            catch(e)
            {
                return e.message;
            }
        }
    }
}