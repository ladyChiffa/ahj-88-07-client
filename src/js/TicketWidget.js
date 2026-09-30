import TicketRepository from "./repo/TicketRepository";

import TicketMenu from "./ui/TicketMenu";
import TicketView from "./ui/TicketView";
import TicketEdit from "./ui/TicketEdit";
import TicketDelete from "./ui/TicketDelete";

export default class TicketWidget {
  constructor(container) {
        this.container = container;

        this.ticketRepository = new TicketRepository();

        this.ticketMenu = new TicketMenu(this.container, {
            onAdd: this.add.bind(this)
        });

        this.ticketView = new TicketView(this.container, {
            onToggleStatus : this.toggleStatus.bind(this),
            onEdit: this.edit.bind(this),
            onDelete: this.delete.bind(this),
            getTicket: this.requestTicket.bind(this) // здесь специально несоответствие методов 
                                                     // - для демонстрации подгрузки описания из P.S. постановки задачи
                                                     // в остальных местах, где нужен тикет - берем его готовый из репозитория
        });

        this.ticketEditForm = new TicketEdit(container, {
            onEditSubmitted: this.editSubmitted.bind(this)
        });
        this.ticketDeleteForm = new TicketDelete(container, {
            onDeleteSubmitted: this.deleteSubmitted.bind(this)
        });
    }
    async open() {
        await this.ticketRepository.load();
        this.ticketView.render(this.ticketRepository.data);
        this.ticketView.open();
    }

    async requestTicket(id) {
        const task = await this.ticketRepository.requestTicket(id);
        return task;
    }

    async toggleStatus(id) {
        await this.ticketRepository.toggleStatus(id);
        this.ticketView.render(this.ticketRepository.data);
    }

    add() {
        const ticket = {id: 0, name: '', description: '', status: false};
        this.ticketEditForm.edit(ticket);
    }
    edit(id) {
        const ticket = this.ticketRepository.getTicket(id);
        this.ticketEditForm.edit(ticket);
    }
    async editSubmitted() {
        const updatedTicket = this.ticketEditForm.getUpdated();
        if(updatedTicket.id == 0){ 
            await this.ticketRepository.createTicket(updatedTicket);
        }
        else {
            await this.ticketRepository.updateTicket(updatedTicket);
        }
        this.ticketView.render(this.ticketRepository.data);
    }

    delete(id) {
        const ticket = this.ticketRepository.getTicket(id);
        this.ticketDeleteForm.askForSubmit(ticket);
    }
    async deleteSubmitted(ticket) {
        await this.ticketRepository.deleteTicket(ticket);
        this.ticketView.render(this.ticketRepository.data);
    }
}
