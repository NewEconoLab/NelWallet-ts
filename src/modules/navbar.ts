
namespace wallet.module
{
    export class NavbarModule
    {
        public ul: HTMLUListElement = document.createElement("ul");
        public liNep5: HTMLLIElement = document.createElement("li");
        public aNep5: HTMLAnchorElement = document.createElement("a");
        public liDapp: HTMLLIElement = document.createElement("li");
        public aDapp: HTMLAnchorElement = document.createElement("a");
        public liTransfer: HTMLLIElement = document.createElement("li");
        public aTransfer: HTMLAnchorElement = document.createElement("a");

        app: App;
        init(app: App)
        {
            this.app = app;

            this.ul.classList.add('nav', 'nav-pills');
            this.aNep5.textContent = "Nep5";
            this.liNep5.appendChild(this.aNep5);
            this.aDapp.textContent = "Dapp...";
            this.liDapp.appendChild(this.aDapp);
            this.aTransfer.textContent = "Transfer";
            this.liTransfer.appendChild(this.aTransfer);
            this.liTransfer.classList.add("active");

            this.ul.appendChild(this.liTransfer);
            this.ul.appendChild(this.liDapp);
            this.ul.appendChild(this.liNep5);
            // let main = document.getElementById("nav") as HTMLDivElement;
            let main = this.app.main;
            main.appendChild(this.ul);

            this.aNep5.onclick = () =>
            {
                this.cutlabe("Nep5");
            }
            this.aDapp.onclick = () =>
            {
                this.cutlabe("Dapp");
            }
            this.aTransfer.onclick = () =>
            {
                this.cutlabe("transfer");
            }

        }
        cutlabe(str: string)
        {
            if (str == "Nep5")
            {
                this.liNep5.classList.add("active");
                // this.app.sign.module.hidden=false;
            } else
            {
                this.liNep5.classList.remove("active");
                // this.app.sign.module.hidden=true;
            }
            if (str == "transfer")
            {
                this.liTransfer.classList.add("active");
                this.app.transfer.module.hidden = false;
            } else
            {
                this.liTransfer.classList.remove("active");
                this.app.transfer.module.hidden = true;
            }
            if (str == "Dapp")
            {
                this.liDapp.classList.add("active");
                this.app.dapp.module.hidden = false;
            } else
            {
                this.liDapp.classList.remove("active");
                this.app.dapp.module.hidden = true;
            }
        }
    }
}