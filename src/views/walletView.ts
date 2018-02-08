namespace wallet.tools
{

    export class walletView
    {
        static verifWif(res: wallet.entity.result)
        {
            if (res.err)
            {   //如果填写了wif则进行验证
                $("#wif-input").removeClass("has-success");
                $("#wif-input").addClass("has-error");
                $("#wif-input").children("p").text(res.result);
            } else
            {
                $("#wif-input").addClass("has-success");
                $("#wif-input").removeClass("has-error");
                $("#wif-input").children("p").text(res.result);
                $("#importWif").modal("hide");
            }
        }

        static showDetails(detail: wallet.entity.Detail)
        {
            let detailview = document.getElementById("wallet-details") as HTMLDivElement;

            detailview.innerHTML = "";
            let ul = '';
            for (let n = 0; n < detail.balances.length; n++)
            {
                const balance = detail.balances[n];
                let name = balance.name.map((name) => { return name.name }).join('|');
                ul += '<li class="list-group-item"> ' + name + ' : ' + balance.balance + '</li>';
            }
            let addrpanel = new wallet.tools.Panel();
            addrpanel.setTitle("Address");
            addrpanel.setBodyStr(detail.address);
            addrpanel.init(detailview);
            let balanPanel = new wallet.tools.Panel();
            balanPanel.setTitle("Balance");
            balanPanel.setUl(ul);
            balanPanel.init(detailview);
            // $("#wallet-details").append(html);
        }
        /**
         * showUtxo
         */
        static showUtxo(utxos: wallet.entity.UTXO[])
        {
            $("#wallet-utxos").empty();
            utxos.forEach((utxo) =>
            {
                let html = '';
                html += "<tr>"
                html += "<td class='code'>" + utxo.name;
                html += "</td>"
                html += "<td>" + utxo.value;
                html += "</td>"
                html += "<td><a class='code' target='_blank' rel='external nofollow' href='./txInfo.html?txid=" + utxo.txid + "'>" + utxo.txid
                html += "</a>[" + utxo.n + "]</td>"
                html += "</tr>"
                $("#wallet-utxos").append(html);
            });
        }
        /**
         * showSelectAddrs
         */
        static showSelectAddrs(addrs: string[])
        {
            $("#selectAddress").empty();
            addrs.forEach((addr) =>
            {
                $("#selectAddress").append('<label><input type="radio" name="addrRadio" id="addrRadio1" value="' + addr + '" aria-label="...">' + addr + '</label>');
            })

            $("#selectAddr").modal("show");
        }
    }
}