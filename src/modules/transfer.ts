
namespace wallet.module{
    export class TransferModule{
        module:HTMLDivElement;
        body: HTMLDivElement;
        app: App;
        init(app: App)
        {
            this.app = app;
            let jum = wallet.tools.Jumbotron.creatJumbotron("Transfer");
            this.module = jum.jumbotron;
            this.body = jum.body;
            app.main.appendChild(this.module);
            let toaddr = tools.BootsModule.getFormGroup("To Address");
            let toInput = document.createElement("input");
            toInput.type = "text";
            toInput.classList.add("form-control");
            toInput.placeholder = "Enter the address you want to trade";
            toaddr.appendChild(toInput);
            let amount = tools.BootsModule.getFormGroup("Amount");
            let amountInput = document.createElement("input");
            amountInput.type = "number";
            amountInput.classList.add("form-control");
            amountInput.placeholder = "Enter the amount you want to trade ";
            amount.appendChild(amountInput);
            let type = tools.BootsModule.getFormGroup("Type");
            let typeSelect = document.createElement("select");
            let option = document.createElement("option");
            option.value = "GAS";
            option.innerText = "GAS";
            type.appendChild(typeSelect);
            typeSelect.appendChild(option);
            let send = tools.BootsModule.getFormGroup("");
            let btn = document.createElement("button");
            btn.classList.add("btn", "btn-info");
            btn.textContent = "Make transfer";
            send.appendChild(btn);

            this.body.appendChild(toaddr);
            this.body.appendChild(amount);
            this.body.appendChild(type);
            this.body.appendChild(send);


            btn.onclick = () =>
            {
                this.app.transaction.setTran(toInput.value, typeSelect.value, amountInput.value, app.utxos);
            }

        }
    }
}