import loadingIcon from '../img/spinner.svg';
export default class TicketList {

    constructor(widget) {
        this.STATUS_DONE = '&#x2713;';

        this._widget = document.querySelector('.' + widget);
        this._table = document.createElement('table');
        this._tablebody = document.createElement('tbody');
        this._table.classList = 'list-table';
        this._status = document.createElement('div');
        this._widget.appendChild(this._table);
        this._widget.appendChild(this._status);
        this._table.appendChild(this._tablebody);

        this._table.addEventListener('click', (e) => {
            const element = e.target.closest('.ticket');
            const action = e.target.closest('.action');
            if (action === null) {
                this.toggleDetails (element);
                return;
            }
            console.log(action.dataset.type);
            switch (action.dataset.type) {
                case 'status': 
                    this.toggleStatus (element);
                    break;
                case 'edit':
                    this.openEditForm (element);
                    break;
                case 'delete':
                    this.openDeleteForm (element);
                    break;
                default:
                    console.log('Unknown action: ' +  action.dataset.type);
            }
        });

        this._addBtn = document.querySelector('.button-add');
        this._addBtn.addEventListener('click', (e) => {
            this.openEditForm({id: 0});
        });

        this._editForm = document.getElementById('edit-form');

        this._editWidget = document.querySelector('.edit-form').closest('.modal');
        const submitEditBtn = this._editWidget.querySelector('.button-submit');
        const cancelEditBtn = this._editWidget.querySelector('.button-cancel');
        this._editTicket = null;
        cancelEditBtn.addEventListener('click', (e) => {
            this.closeEdit();
        });
        submitEditBtn.addEventListener('click', (e) => {
            this.submitEdit(e);
        });


        this._deleteWidget = document.querySelector('.delete-form').closest('.modal');
        const submitDeleteBtn = this._deleteWidget.querySelector('.button-submit');
        const cancelDeleteBtn = this._deleteWidget.querySelector('.button-cancel');
        this._deleteTicket = null;
        cancelDeleteBtn.addEventListener('click', (e) => {
            this.closeDelete();
        });
        submitDeleteBtn.addEventListener('click', (e) => {
            this.submitDelete(e);
        });

        this.loadData();
    }

    openDeleteForm(ticketElement) {
        this._deleteTicket = this._data.find( elem => elem.id == ticketElement.id );

        const deleteData = this._deleteWidget.querySelector('.delete-data');
        deleteData.innerHTML = '<b>Тикет:</b> ' + this._deleteTicket.name;
        this._deleteWidget.style.display = 'block';
    }

    closeDelete() {
        this._deleteWidget.style.display = 'none';
    }

    submitDelete (e) {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                this.closeDelete();
                this.loadData();
            }
        });
        xhr.open('GET', 'http://localhost:7070/?method=deleteById&id=' + this._deleteTicket.id);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
    }

    openEditForm(ticketElement) {
        if (ticketElement.id == 0) {
            this._editTicket = {id: 0, name: '', description: '', status: false};
        }
        else {
            this._editTicket = this._data.find( elem => elem.id == ticketElement.id );
        }
        const name = this._editForm.querySelector('[name="short-description"]');
        const description = this._editForm.querySelector('[name="detailed-description"]');
        name.value = this._editTicket.name;
        description.value = this._editTicket.description;

        this._editWidget.style.display = 'block';
    }

    closeEdit() {
        this._editWidget.style.display = 'none';
    }

    submitEdit (e) {
        const name = this._editForm.querySelector('[name="short-description"]');
        const description = this._editForm.querySelector('[name="detailed-description"]');

        this._editTicket.name = name.value;
        this._editTicket.description = description.value;

        let methodURL;
        
        if (this._editTicket.id == 0) {
            delete this._editTicket.id;
            methodURL = 'method=createTicket';
        } 
        else {
            methodURL = 'method=updateById&id=' + this._editTicket.id;
        }
        const body = JSON.stringify(this._editTicket);

        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                this.closeEdit();
                this.loadData();
            }
        });
        xhr.open('POST', 'http://localhost:7070/?' + methodURL );
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(body);
    }

    toggleDetails (ticketElement) {
        const fillElement = ticketElement.querySelector('.ticket-description');
        if (fillElement.innerHTML != "") {
            fillElement.style.display = fillElement.style.display != 'block' ? 'block' : 'none';
            return;
        }
                
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.responseText)
                try {
                    const data = JSON.parse(xhr.responseText);

                    if (data.description != "") {
                        fillElement.innerHTML = data.description;
                        fillElement.style.display = fillElement.style.display != 'block' ? 'block' : 'none';
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        });
        xhr.open('GET', 'http://localhost:7070/?method=ticketById&id=' + ticketElement.id);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
    }
    
    toggleStatus (ticketElement) {
        const ticket = this._data.find( elem => elem.id == ticketElement.id );
        console.log(ticket);
        ticket.status = !ticket.status;
        console.log(this._data);

        const body = JSON.stringify(ticket);
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                console.log(xhr.responseText)
                try {
                    this._data = JSON.parse(xhr.responseText);
                } catch (e) {
                    console.error(e);
                }
                this.renderData();
            }
        });
        xhr.open('POST', 'http://localhost:7070/?method=updateById&id=' + ticketElement.id);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(body);
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
        this._tablebody.innerHTML = '';
        this._data.forEach((ticket) => {
            const dateString = new Date(ticket.created).toLocaleString();
            const status = ticket.status ? this.STATUS_DONE : '-';
            this._tablebody.innerHTML += `<tr id="${ticket.id}" class="ticket">
                                        <td><div class="action" data-type="status">${status}</div></td>
                                        <td><div>${ticket.name}</div><div class="ticket-description"></div></td>
                                        <td>${dateString}</td>
                                        <td><div class="action" data-type="edit">&#x270E;</div></td>
                                        <td><div class="action" data-type="delete">&#10006;</div></td>
                                        </tr>`;
        });
    
    }

}