import { App } from '../app';
import { Jumbotron } from '../tools/viewtool';

namespace modules{
    export class SignModule{
        module:HTMLDivElement;
        body:HTMLDivElement;
        init(app:App){
            let jum = Jumbotron.creatJumbotron("Sign");
            this.module = jum.jumbotron;
            this.body = jum.body;
            app.main.appendChild(this.module);
        }
    }
}