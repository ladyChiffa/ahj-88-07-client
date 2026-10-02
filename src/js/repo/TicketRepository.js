import TicketAPI from "../api/TicketAPI";

export default class TicketRepository {
  constructor(errorCallback) {
    this.api = new TicketAPI();
    this.errorCallback = errorCallback;
    this.data = [];
  }

  async load() {
    const result = await this.api.loadTaskList();
    if (result.status == 'error') {
      this.data = [];
      this.errorCallback(result);
    }
    else {
      this.data = result;
    }
  }

  async requestTicket(id) {
    const result = await this.api.loadTicket(id);
    if(result.status == 'error') {
      this.errorCallback(result);
    }
    return result;
  }

  getTicket(id) {
    const result = this.data.find(ticket => ticket.id == id);
    if(result.status == 'error') {
      this.errorCallback(result);
    }
    return result;
  }

  async toggleStatus(id) {
    const ticket = this.data.find(ticket => ticket.id == id);
    ticket.status = !ticket.status;

    const result = await this.api.updateTicket(ticket);
    if (result.status == 'error') {
      this.data = [];
      this.errorCallback(result);
    }
    else {
      this.data = result;
    }
  }

  async createTicket(ticket) {
    const result = await this.api.createTicket(ticket);
    if (result.status == 'error') {
      this.errorCallback(result);
    }
    else {
      this.data.push(result);
    }
  }

  async updateTicket(ticket) {
    const result = await this.api.updateTicket(ticket);
    if (result.status == 'error') {
      this.data = [];
      this.errorCallback(result);
    }
    else {
      this.data = result;
    }
  }

  async deleteTicket(ticket) {
    const result = await this.api.deleteTicket(ticket);
    if (result.status == 'ok') {
      this.data = this.data.filter(elem => elem.id != ticket.id);
    }
    else {
      this.errorCallback(result);
    }
  }
}
