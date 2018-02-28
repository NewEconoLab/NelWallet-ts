namespace wallet.module
{

    export class NNS
    {

        module: HTMLDivElement;
        body: HTMLDivElement;
        app: App;

        constructor() { }

        init(app: App)
        {
            this.app = app;

            let jum = wallet.tools.Jumbotron.creatJumbotron("Domain");
            this.module = jum.jumbotron;
            this.body = jum.body;
            app.main.appendChild(this.module);
            var domainInput = tools.BootsModule.createInput("text", "form-control", "Please enter the domain name you want to query");
            var queryBtn = tools.BootsModule.createBtn("search", "btn-info");
            var queryForm = tools.BootsModule.getFormGroup("Query domain");
            queryForm.appendChild(domainInput);
            this.body.appendChild(queryForm);
            this.body.appendChild(queryBtn);

            queryBtn.onclick = async () =>
            {
                let rootname: Uint8Array = await tools.NNS.getRootNameHash();
                //let nnshash: Uint8Array = await tools.NNS.getNameHash(rootname);
                //let info: entity.DomainInfo = await tools.NNS.getDomainInfo(nnshash); 
                let res = await tools.NNS.getSubOwner(rootname, domainInput.value);
                console.log(res[0]);
                if (!res[0])
                {
                    alert("这个域名为空");
                }
            }
        }
    }
}   