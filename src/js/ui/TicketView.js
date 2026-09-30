export default class TicketView {
    constructor(container, actions) {
        this.container = container;
        this.actions = actions;

        this.STATUS_DONE = '&#x2713;';

        this.ticketView = document.createElement('div')
        this.ticketView.classList.add('ticket__widget');

        this._table = document.createElement('table');
        this._table.classList = 'ticket__widget-table';

        this._tablebody = document.createElement('tbody');
        this._table.appendChild(this._tablebody);

        this._status = document.createElement('div');

        this.ticketView.appendChild(this._table);
        this.ticketView.appendChild(this._status);

        this._table.addEventListener('click', this.onTicketAction.bind(this));
    }
    open () {
        this.container.appendChild(this.ticketView);
    }

    onTicketAction(e) {
            const element = e.target.closest('.ticket');
            const action = e.target.closest('.action');
            if (action === null) {
                this.toggleDetails (element);
                return;
            }
            switch (action.dataset.type) {
                case 'status': 
                    this.toggleStatus (element);
                    break;
                case 'edit':
                    this.edit (element);
                    break;
                case 'delete':
                    this.delete (element);
                    break;
                default:
                    console.log('Unknown action: ' +  action.dataset.type);
            }
    }

    render(data) {
        this._tablebody.innerHTML = '';
        data.forEach((ticket) => {
            const dateString = new Date(ticket.created).toLocaleString('ru-RU');
            const status = ticket.status ? this.STATUS_DONE : '';

            const ticketRow = document.createElement('tr');
            ticketRow.dataset.id = ticket.id;
            ticketRow.classList.add('ticket');
            ticketRow.innerHTML = `<td><div class="action" data-type="status">${status}</div></td>
                                   <td><div></div><div class="ticket-description"></div></td>
                                   <td>${dateString}</td>
                                   <td><div class="action" data-type="edit">&#x270E;</div></td>
                                   <td><div class="action" data-type="delete">&#10006;</div></td>`;
            ticketRow.children[1].children[0].textContent = ticket.name;

            this._tablebody.appendChild(ticketRow);
        });
    }

    async toggleDetails(element) {
        const fillElement = element.querySelector('.ticket-description');
        if (fillElement.innerHTML != "") {
            fillElement.style.display = fillElement.style.display != 'block' ? 'block' : 'none';
            return;
        }

        if(!this.actions.getTicket) return;

        const task = await this.actions.getTicket(element.dataset.id);
        if (task.description && task.description != "") {
            fillElement.innerHTML = task.description;
            fillElement.style.display = fillElement.style.display != 'block' ? 'block' : 'none';
        }
    }

    toggleStatus(element) {
        if(!this.actions.onToggleStatus) return;
        this.actions.onToggleStatus(element.dataset.id);
    }

    edit(element) {
        if(!this.actions.onEdit) return;
        this.actions.onEdit(element.dataset.id);
    }

    delete(element) {
        if(!this.actions.onDelete) return;
        this.actions.onDelete(element.dataset.id);
    }
}
