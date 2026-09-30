import config from '../../config/config.json';

export default class TicketAPI {
  async loadTaskList() {
        const request = fetch (config.hostProtocol + "://" + config.hostURI + '/?method=allTickets', {
            method: 'GET'
        });

        const result = await request;
        try {
            const json = await result.json();
            return json;
        }
        catch(e) {
            return {status: 'error', message: 'Internal error, please try later: ' + e};
        }

    /*
        const user = { name: username };

        const request = fetch (config.hostProtocol + "://" + config.hostURI + '/new-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const result = await request;

        try {
            const json = await result.json();
            return json;
        }
        catch(e) {
            return {status: 'error', message: 'Internal error, please try later: ' + e};
        }
            */
  }

  async loadTicket(id) {
        const request = fetch (config.hostProtocol + "://" + config.hostURI + '/?method=ticketById&id=' + id, {
            method: 'GET'
        });

        const result = await request;
        try {
            const json = await result.json();
            return json;
        }
        catch(e) {
            return {status: 'error', message: 'Internal error, please try later: ' + e};
        }
  }

  async createTicket(ticket) {
        delete ticket.id;
        const request = fetch (config.hostProtocol + "://" + config.hostURI + '/?method=createTicket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticket)
        });

        const result = await request;
        try {
            const json = await result.json();
            return json;
        }
        catch(e) {
            return {status: 'error', message: 'Internal error, please try later: ' + e};
        }
  }

  async updateTicket(ticket) {
        const request = fetch (config.hostProtocol + "://" + config.hostURI + '/?method=updateById&id=' + ticket.id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ticket)
        });

        const result = await request;
        try {
            const json = await result.json();
            return json;
        }
        catch(e) {
            return {status: 'error', message: 'Internal error, please try later: ' + e};
        }
  }

  async deleteTicket(ticket) {
        const request = fetch (config.hostProtocol + "://" + config.hostURI + '/?method=deleteById&id=' + ticket.id, {
            method: 'GET'
        });

        const result = await request;
        if(result.ok) {
            return {status: 'ok', message: 'Delete successful'};
        }
        
        return {status: 'error', message: 'Server delete failed'};

  }

}
