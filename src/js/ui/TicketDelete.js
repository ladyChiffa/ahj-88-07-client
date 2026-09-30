export default class TicketDelete {
  constructor(container, actions) {
    this.container = container;
    this.actions = actions;

    this._deleteTicket = null;

    this.formWidget = document.createElement('div');
    this.formWidget.classList.add('modal');

    this.formWidget.innerHTML = `
        <div class="modal-widget delete-widget">
            <div class="form-title">Удалить тикет</div>
            <form class="delete-form">
                <div class="delete-details delete-data"></div>
                <div class="delete-details">Вы уверены, что хотите удалить тикет? Это действие необратимо.</div>
                <div class="controls">
                    <div class="button button-cancel">Отмена</div>
                    <div class="button button-submit">OK</div>
                </div>
            </form>
        </div>
    `;

    this._details = this.formWidget.querySelector('.delete-data');

    const submitEditBtn = this.formWidget.querySelector('.button-submit');
    const cancelEditBtn = this.formWidget.querySelector('.button-cancel');
    
    cancelEditBtn.addEventListener('click', this.close.bind(this));
    submitEditBtn.addEventListener('click', this.submit.bind(this));

    this.formWidgetOpened = false;
  }

  askForSubmit (ticket){
    this._deleteTicket = ticket;

    this._details.innerHTML = '<b>Тикет:</b> ' + this._deleteTicket.name;

    this.formWidget.style.display = 'block';
    if(!this.formWidgetOpened) {
      this.formWidgetOpened = !this.formWidgetOpened;
      this.container.appendChild(this.formWidget);
    }
  }

  close () {
    this.formWidget.style.display = 'none';
  }

  submit () {
    this.close();

    if (!this.actions.onDeleteSubmitted) return;
    this.actions.onDeleteSubmitted(this._deleteTicket);
  }

}
