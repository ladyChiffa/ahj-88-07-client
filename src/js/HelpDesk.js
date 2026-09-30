import TicketWidget from "./TicketWidget";

export default class HelpDesk {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;

    this.ticketWidget = new TicketWidget(container);
  }

  init() {
    this.ticketWidget.open();
  }

}
