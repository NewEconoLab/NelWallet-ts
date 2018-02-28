namespace wallet.tools
{
    export class NNS
    {
        //返回根域名
        static async getRootName(): Promise<string>
        {

            let name: string = "";

            var sb = new ThinNeo.ScriptBuilder();

            sb.EmitParamJson(JSON.parse("[]"));
            sb.EmitPushString("rootName");
            var scriptaddress = "0xdffbdd534a41dd4c56ba5ccba9dfaaf4f84e1362".hexToBytes().reverse();
            sb.EmitAppCall(scriptaddress);
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
                if (stack[0].type == "Array")
                {
                    // info2.textContent += "name=" + stack[0].value + "\n";
                    length = stack[0].lenght;
                }
                //find symbol 他的type 有可能是string 或者ByteArray
                if (stack[1].type == "String")
                {
                    // info2.textContent += "symbol=" + stack[1].value + "\n";
                    name = stack[1].value;
                }
                else if (stack[1].type == "ByteArray")
                {
                    var bs = (stack[1].value as string).hexToBytes();
                    name = ThinNeo.Helper.Bytes2String(bs);
                }

                return name;
            }
            catch (e)
            {
                return e.message;
            }
        }

        //返回根域名hash
        static async getRootNameHash(): Promise<Uint8Array>

        {

            let nameHash: Uint8Array ;

            var sb = new ThinNeo.ScriptBuilder();

            sb.EmitParamJson(JSON.parse("[]"));
            sb.EmitPushString("rootNameHash");
            var scriptaddress = "0xdffbdd534a41dd4c56ba5ccba9dfaaf4f84e1362".hexToBytes().reverse();
            sb.EmitAppCall(scriptaddress);
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
                if (stack[0].type == "ByteArray")
                {
                    nameHash = (stack[0].value as string).hexToBytes();
                }
                return nameHash;
            }
            catch (e)
            {
                return e.message;
            }
        }

        //返回域名详情
        static async getDomainInfo(domain: Uint8Array): Promise<entity.DomainInfo>
        {
            let info: entity.DomainInfo = new entity.DomainInfo();
            var sb = new ThinNeo.ScriptBuilder();
            var scriptaddress = "0xdffbdd534a41dd4c56ba5ccba9dfaaf4f84e1362".hexToBytes().reverse();
            sb.EmitParamJson(["(bytes)" + domain.toHexString]);//第二个参数是个数组
            sb.EmitPushString("getInfo");
            sb.EmitAppCall(scriptaddress);
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
                if (stack[0].type == "ByteArray")
                {
                    info.owner = (stack[0].value as string).hexToBytes();
                    
                }
                if (stack[1].type == "ByteArray")
                {
                    info.register = (stack[1].value as string).hexToBytes();
                }
                if (stack[2].type == "ByteArray")
                {
                    info.resolver = (stack[2].value as string).hexToBytes();
                }
                if (stack[3].type == "Integer")
                {
                    info.ttl = new Neo.BigInteger(stack[3].value as string);
                }
            }
            catch (e)
            {
            }
            return info;
        }

        //返回域名hash
        static async getNameHash(domain: string): Promise<Uint8Array>
        {
            let namehash: Uint8Array
            var sb = new ThinNeo.ScriptBuilder();
            var scriptaddress = "0xdffbdd534a41dd4c56ba5ccba9dfaaf4f84e1362".hexToBytes().reverse();
            sb.EmitParamJson(["(str)" + domain]);//第二个参数是个数组
            sb.EmitPushString("nameHash");
            sb.EmitAppCall(scriptaddress);
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
                if (stack[0].type == "ByteArray")
                {
                    namehash = (stack[0].value as string).hexToBytes();
                }
            }
            catch (e)
            {
                console.log(e);
            }

            return namehash;
        }

        //此接口为注册器规范要求，必须实现，完整解析域名时会调用此接口验证权利
        static async getSubOwner(nnshash: Uint8Array, subdomain: string): Promise<Uint8Array>
        {

            let owner: Uint8Array
            var sb = new ThinNeo.ScriptBuilder();
            var scriptaddress = entity.Consts.registerContract.hexToBytes().reverse();
            sb.EmitParamJson(["(bytes)" + nnshash.toHexString(), "(str)" + subdomain]);//第二个参数是个数组
            sb.EmitPushString("getSubOwner");
            sb.EmitAppCall(scriptaddress);
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
                if (stack[0].type == "ByteArray")
                {
                    owner = (stack[0].value as string).hexToBytes();
                }
            }
            catch (e)
            {
                console.log(e);
            }
            return owner;
        }

        //此接口为演示的先到先得注册器使用，用户调用注册器的这个接口申请域名
        static async requestSubDomain(who: string, nnshash: Uint8Array, subdomain: string): Promise<any>
        {

            let namehash: Uint8Array
            var sb = new ThinNeo.ScriptBuilder();
            var scriptaddress = entity.Consts.registerContract.hexToBytes().reverse();
            sb.EmitParamJson(["(bytes)" + nnshash.toHexString(), "(str)" + subdomain]);//第二个参数是个数组
            sb.EmitPushString("getSubOwner");
            sb.EmitAppCall(scriptaddress);
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
                if (stack[0].type == "ByteArray")
                {
                    namehash = (stack[0].value as string).hexToBytes();
                }
            }
            catch (e)
            {
                console.log(e);
            }
            return;
        }
    }
}