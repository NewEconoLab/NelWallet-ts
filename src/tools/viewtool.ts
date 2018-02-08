namespace wallet.tools{
    export class Panel{
        public palneDiv:HTMLDivElement;
        public title:HTMLHeadingElement;
        public body:HTMLDivElement;
        public ul:HTMLUListElement;
        public classname:string;
        constructor(){
            this.palneDiv = document.createElement("div");
            let heading:HTMLDivElement = document.createElement("div");
            this.title = document.createElement("h3");
            this.body = document.createElement("div");
            this.ul = document.createElement("ul");
    
            heading.appendChild(this.title);
            this.palneDiv.appendChild(heading);
    
            this.palneDiv.classList.add("panel","panel-default");
            heading.classList.add("panel-heading");
            this.body.classList.add("panel-body");
            this.ul.classList.add("list-group");
        }
    
        /**
         * setTitle
         */
        public setTitle(title:string) {
            this.title.innerHTML=title;
        }

        public setBody(body: HTMLElement)
        {
            this.body.appendChild(body);
            this.palneDiv.appendChild(this.body);
        }
        public setBodyStr(str: string)
        {
            this.body.innerHTML = str;
            this.palneDiv.appendChild(this.body);
        }

        public setClass(...param: string[]) {
            //this.palneDiv.classList.add(param);
        }
        /**
         * setUl
         */
        public setUl(lis:string) {
            this.ul.innerHTML = lis;
            this.palneDiv.appendChild(this.ul);
        }
    
        init(pater:HTMLDivElement){
            pater.appendChild(this.palneDiv);
        }
        
    }
    export class Table{
        table:HTMLTableElement;
        thead:HTMLTableSectionElement;
        tbody:HTMLTableSectionElement;
        constructor(){
            this.table = document.createElement("table");
            this.thead = document.createElement("thead");
            this.tbody = document.createElement("tbody");
            this.table.appendChild(this.thead);
            this.table.appendChild(this.tbody);
        }
        init(pater:HTMLDivElement){
            pater.appendChild(this.table);
        }
        creatTable(){
    
        }
    }
    
    export class Jumbotron{
        static creatJumbotron(title:string):{jumbotron:HTMLDivElement,body:HTMLDivElement}{
            let jumbotron = document.createElement("div");
            let caption = document.createElement("caption");
            let body = document.createElement("div");
            let h3 = document.createElement("h3");
    
            jumbotron.classList.add('jumbotron','masthead');
            jumbotron.hidden=true;
    
            caption.appendChild(h3);
            jumbotron.appendChild(caption);
            jumbotron.appendChild(body);
            h3.textContent = title;
            return {jumbotron:jumbotron,body:body};
        }
    }

    export class BootsModule
    {
        static getFormGroup(title): HTMLDivElement
        {
            let form = document.createElement("div");
            form.classList.add("form-group");
            if (title)
            {
                let label = document.createElement("label");
                label.textContent = title;
                label.classList.add("form-lable");
                form.appendChild(label);
            }
            return form;
        }
        static setLiInUl(ul: HTMLUListElement, value: string)
        {
            let li = document.createElement("li");
            li.classList.add("list-group-item","code");
            li.innerHTML = value;
            ul.appendChild(li);
        }
        static creatRow(...param: HTMLDivElement[]): HTMLDivElement
        {
            let row = document.createElement("div");
            row.className = "row";
            for (let i = 0; i < param.length; i++)
            {
                row.appendChild(param[i] as HTMLDivElement);
            }
            return row;
        }
        static creatCol(size: number): HTMLDivElement
        {
            let col = document.createElement("div");
            col.classList.add("col-md-" + size);
            return col
        }
        static createInput(type: string, cname: string, placeholder: string): HTMLInputElement
        {
            let input = document.createElement("input");
            input.type = type;
            input.className = cname;
            input.placeholder = placeholder;
            return input;
        }
        static createBtn(value: string, style: string): HTMLButtonElement
        {
            let btn = document.createElement("button");
            btn.innerHTML = value;
            btn.classList.add("btn", style);
            return btn;
        }
        static creatA(val: string, href: string): HTMLAnchorElement
        {
            let a = document.createElement("a");
            a.innerHTML = val;
            a.href = href;
            return a;
        }
    }

    export class Model
    {
        model: HTMLDivElement;
        dialog: HTMLDivElement;
        content: HTMLDivElement;
        body: HTMLDivElement;
        footer: HTMLDivElement;
        head: HTMLHeadingElement;
        header: HTMLDivElement;
        send: HTMLButtonElement;
        X: HTMLButtonElement;
        close: HTMLButtonElement;
        _title: string;
        id: string;

        constructor()
        {
            this.head = document.createElement("h4");
            this.model = document.createElement("div");
            this.dialog = document.createElement("div");
            this.content = document.createElement("div");
            this.header = document.createElement("div");
            this.body = document.createElement("div");
            this.footer = document.createElement("div");
            this.send = document.createElement("button");
            this.close = document.createElement("button");
            this.X = document.createElement("button");

            this.model.classList.add("modal", "fade");
            this.dialog.classList.add("modal-dialog");
            this.content.classList.add("modal-content");
            this.header.classList.add("modal-header");
            this.footer.classList.add("modal-footer");
            this.head.classList.add("modal-title");
            this.X.classList.add("close");
            this.X.innerHTML = "&times;";
            this.close.innerText = "Close";
            this.send.innerText = "Send";
            this.X.setAttribute("data-dismiss", "modal");
            this.X.setAttribute("aria-hidden", "true");
            this.close.classList.add("btn", "btn-default")
            this.close.setAttribute("data-dismiss", "modal");
            this.send.classList.add("btn","btn-primary");


            this.model.appendChild(this.dialog);
            this.model.tabIndex = -1;            
            this.dialog.appendChild(this.content);
            this.content.appendChild(this.header);
            this.content.appendChild(this.body);
            this.content.appendChild(this.footer);
            this.footer.appendChild(this.close);
            this.footer.appendChild(this.send);
            this.header.appendChild(this.X);


        }
        init(id: string, title: string, pater: HTMLElement)
        {
            this.title = title;
            this.model.id = id;
            this.head.innerText = this.title;
            this.header.appendChild(this.head);
            pater.appendChild(this.model);
        }

        set title(title: string)
        {
            this._title = title;
            this.head.textContent = this._title;
            this.header.appendChild(this.head);
        }
        get title()
        {
            return this._title;
        }

    }
}