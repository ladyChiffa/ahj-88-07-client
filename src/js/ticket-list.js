import loadingIcon from '../img/spinner.svg';
export default class TicketList {
    constructor(widget) {
        this._widget = document.querySelector('.' + widget);
        this._table = document.createElement('table');
        this._tablebody = document.createElement('tbody');
        this._table.classList = 'list-table';
        this._status = document.createElement('div');
        this._widget.appendChild(this._table);
        this._widget.appendChild(this._status);
        this._table.appendChild(this._tablebody);

        this.loadData();
    }

    setProgressOn() {
        if (!this._loading) {
            this._loading = document.createElement('img');
            this._loading.src = loadingIcon;
            this._loading.classList = 'loading';
            this._loading.alt = 'Loading data...';
            this._loadingOn = false;
        }
        
        this._status.appendChild(this._loading);
        this._loadingOn = true;
    }

    setProgressOff() {
        if(this._loadingOn) {
            this._status.removeChild(this._loading);
        }
    }

    loadData() {
        this.setProgressOn();

        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    this._data = JSON.parse(xhr.responseText);
                } catch (e) {
                    console.error(e);
                }
            }
            this.renderData();
            this.setProgressOff();
        });
        xhr.addEventListener('error', (e) => {
            console.error(e);
            this.setProgressOff();
        });

        xhr.open('GET', 'http://localhost:7070/?method=allTickets');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
    }

    renderData() {
        console.log(this._data)
        this._tablebody.innerHTML = '';
        this._data.forEach((ticket) => {
            const dateString = new Date(ticket.created).toLocaleString();
            this._tablebody.innerHTML += `<tr>
                                        <td><div class="action status">&#x2713;</div></td>
                                        <td>${ticket.name}</td>
                                        <td>${dateString}</td>
                                        <td><div class="action">&#x270E;</div></td>
                                        <td><div class="action">&#10006;</div></td>
                                        </tr>`;
        });
    
    }

}