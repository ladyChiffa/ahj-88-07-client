export default class TicketEdit {
  constructor(container, actions) {
    this.container = container;
    this.actions = actions;
    this._editTicket = null;

    this.formWidget = document.createElement('div');
    this.formWidget.classList.add('modal');
    this.formWidget.innerHTML = `
          <div class="modal-widget edit-widget">
              <div class="form-title">Добавить тикет</div>
              <form class="edit-form">
                  <label>Краткое описание</label>
                  <input type="text" name="short-description">
                  <label>Подробное описание</label>
                  <textarea name="detailed-description"></textarea>
                  <div class="controls">
                      <div class="button button-cancel">Отмена</div>
                      <div class="button button-submit">OK</div>
                  </div>
              </form>
          </div>
    `;

    this._title = this.formWidget.querySelector('.form-title');
    this._name = this.formWidget.querySelector('[name="short-description"]');
    this._description = this.formWidget.querySelector('[name="detailed-description"]');

    const submitEditBtn = this.formWidget.querySelector('.button-submit');
    const cancelEditBtn = this.formWidget.querySelector('.button-cancel');
    
    cancelEditBtn.addEventListener('click', this.close.bind(this));
    submitEditBtn.addEventListener('click', this.submit.bind(this));

    this.formWidgetOpened = false;
  }

  edit (ticket){
    this._editTicket = ticket;

    if(ticket.id != 0) {
      this._name.value = this._editTicket.name;
      this._description.value = this._editTicket.description;
      this._title.innerText = 'Редактировать тикет';
    }
    else {
      this._title.innerText = 'Добавить тикет';
    }

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
    this._editTicket.name = this._name.value;
    this._editTicket.description = this._description.value;

    this.close();

    if (!this.actions.onEditSubmitted) return;
    this.actions.onEditSubmitted();
  }

  getUpdated() {
    return this._editTicket;
  }
}
