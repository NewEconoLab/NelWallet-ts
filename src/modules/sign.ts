
namespace wallet.module{
    export class SignModule{
        module:HTMLDivElement;
        body:HTMLDivElement;
        init(app: App)
        {
            let jum = wallet.tools.Jumbotron.creatJumbotron("Sign");
            this.module = jum.jumbotron;
            this.body = jum.body;
            app.main.appendChild(this.module);
        }
    }
}