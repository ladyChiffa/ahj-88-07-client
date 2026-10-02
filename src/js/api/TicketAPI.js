import config from '../../config/config.json';

export default class TicketAPI {
  async loadTaskList() {
        try {
            const request = fetch (config.hostProtocol + "://" + config.hostURI + '/?method=allTickets', {
                method: 'GET'
            });

            const result = await request;
            if(result.ok) {
                const json = await result.json();
                return json;
            }
            else {
                return {status: 'error', message: 'Data request failed'};
            }
        }
        catch (e) {
            return {status: 'error', message: 'Internal error, please try later'};
        }
  }

  async loadTicket(id) {
        try {
            const request = fetch (config.hostProtocol + "://" + config.hostURI + '/?method=ticketById&id=' + id, {
                method: 'GET'
            });

            const result = await request;
            if(result.ok) {
                const json = await result.json();
                return json;
            }
            else {
                return {status: 'error', message: 'Data request failed'};
            }
        }
        catch(e) {
            return {status: 'error', message: 'Internal error, please try later'};
        }
  }

  async createTicket(ticket) {
        try {
            delete ticket.id;
            const request = fetch (config.hostProtocol + "://" + config.hostURI + '/?method=createTicket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ticket)
            });

            const result = await request;
            if(result.ok) {
                const json = await result.json();
                return json;
            }
            else {
                return {status: 'error', message: 'Server create failed'};
            }
        }
        catch(e) {
            return {status: 'error', message: 'Internal error, please try later'};
        }
  }

  async updateTicket(ticket) {
        try {
            const request = fetch (config.hostProtocol + "://" + config.hostURI + '/?method=updateById&id=' + ticket.id, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ticket)
            });

            const result = await request;
            if(result.ok) {
                const json = await result.json();
                return json;
            }
            else {
                return {status: 'error', message: 'Server update failed'};
            }
        }
        catch(e) {
            return {status: 'error', message: 'Internal error, please try later'};
        }
  }

  async deleteTicket(ticket) {
        try {
            const request = fetch (config.hostProtocol + "://" + config.hostURI + '/?method=deleteById&id=' + ticket.id, {
                method: 'GET'
            });

            const result = await request;
            if(result.ok) {
                return {status: 'ok', message: 'Delete successful'};
            }
            else {
                return {status: 'error', message: 'Server delete failed'};
            }
        } catch(e) {
            return {status: 'error', message: 'Internal error, please try later'};
        }
        

  }

}
