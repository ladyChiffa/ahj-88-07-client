import TicketAPI from "../api/TicketAPI";

export default class TicketRepository {
  constructor() {
    this.api = new TicketAPI();
    this.data = [];
  }

  async load() {
    const result = await this.api.loadTaskList();
    this.data = result;
  }

  async requestTicket(id) {
    const result = await this.api.loadTicket(id);
    return result;
  }

  getTicket(id) {
    const result = this.data.find(ticket => ticket.id == id);
    return result;
  }

  async toggleStatus(id) {
    const ticket = this.data.find(ticket => ticket.id == id);
    ticket.status = !ticket.status;

    const result = await this.api.updateTicket(ticket);
    this.data = result;
  }

  async createTicket(ticket) {
    const result = await this.api.createTicket(ticket);
    this.data.push(result);
  }

  async updateTicket(ticket) {
    const result = await this.api.updateTicket(ticket);
    this.data = result;
  }

  async deleteTicket(ticket) {
    const result = await this.api.deleteTicket(ticket);
    if (result.status == 'ok') {
      this.data = this.data.filter(elem => elem.id != ticket.id);
    }
  }
}
