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
    
        public setBody(body:string){
            this.body.innerHTML=body;
            this.palneDiv.appendChild(this.body);
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
}