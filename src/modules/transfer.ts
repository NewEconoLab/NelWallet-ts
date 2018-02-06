import { App } from "../app";
import { Jumbotron } from '../tools/viewtool';

namespace module{
    export class TransferModule{
        module:HTMLDivElement;
        body:HTMLDivElement;
        init(app:App){
            let jum = Jumbotron.creatJumbotron("Transfer");
            this.module = jum.jumbotron;
            this.body = jum.body;
            app.main.appendChild(this.module);
        }
    }
}