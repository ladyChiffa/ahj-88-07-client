import TicketRepository from "./repo/TicketRepository";

import Spinner from "./ui/Spinner";
import ErrorWidget from "./ui/ErrorWidget";
import TicketMenu from "./ui/TicketMenu";
import TicketView from "./ui/TicketView";
import TicketEdit from "./ui/TicketEdit";
import TicketDelete from "./ui/TicketDelete";

export default class TicketWidget {
  constructor(container) {
        this.container = container;

        this.spinner = new Spinner(container);
        this.errorWidget = new ErrorWidget(container);

        this.ticketRepository = new TicketRepository(this.errorCallback.bind(this));

        this.ticketMenu = new TicketMenu(this.container, {
            onAdd: this.add.bind(this)
        });

        this.ticketView = new TicketView(this.container, {
            onToggleStatus : this.toggleStatus.bind(this),
            onEdit: this.edit.bind(this),
            onDelete: this.delete.bind(this),
            getTicket: this.requestTicket.bind(this)
        });

        this.ticketEditForm = new TicketEdit(container, {
            onEditSubmitted: this.editSubmitted.bind(this)
        });
        this.ticketDeleteForm = new TicketDelete(container, {
            onDeleteSubmitted: this.deleteSubmitted.bind(this)
        });
    }

    errorCallback (response) {
        this.errorWidget.show(response.message);
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async open() {
        this.spinner.start();
        await this.ticketRepository.load();
        this.spinner.stop();

        this.ticketView.render(this.ticketRepository.data);
        this.ticketView.open();
    }

    async requestTicket(id) {
        this.spinner.start();
        const task = await this.ticketRepository.requestTicket(id);
        this.spinner.stop();
        return task;
    }

    async toggleStatus(id) {
        this.spinner.start();
        await this.ticketRepository.toggleStatus(id);
        this.spinner.stop();
        this.ticketView.render(this.ticketRepository.data);
    }

    add() {
        const ticket = {id: 0, name: '', description: '', status: false};
        this.ticketEditForm.edit(ticket);
    }
    async edit(id) {
        this.spinner.start();
        const ticket = await this.ticketRepository.requestTicket(id);
        this.spinner.stop();

        this.ticketEditForm.edit(ticket);
    }
    async editSubmitted() {
        const updatedTicket = this.ticketEditForm.getUpdated();
        this.spinner.start();
        if(updatedTicket.id == 0){ 
            await this.ticketRepository.createTicket(updatedTicket);
        }
        else {
            await this.ticketRepository.updateTicket(updatedTicket);
        }
        this.spinner.stop();

        this.ticketView.render(this.ticketRepository.data);
    }

    delete(id) {
        const ticket = this.ticketRepository.getTicket(id);
        this.ticketDeleteForm.askForSubmit(ticket);
    }
    async deleteSubmitted(ticket) {
        this.spinner.start();
        await this.ticketRepository.deleteTicket(ticket);
        this.spinner.stop();

        this.ticketView.render(this.ticketRepository.data);
    }
}
