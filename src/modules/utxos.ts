import { App } from "../app";
import { Jumbotron, Panel } from '../tools/viewtool';
import { Detail, UTXO } from '../Entitys';


export class UtxosModule{
    module:HTMLDivElement;
    body:HTMLDivElement;
    init(app:App){
        let jum = Jumbotron.creatJumbotron("UTXO");
        this.module = jum.jumbotron;
        this.body = jum.body;
        app.main.appendChild(this.module);
    }
    update(utxos:UTXO[]){
        // this.module.hidden=false;
        this.body.innerHTML="";
    }
}