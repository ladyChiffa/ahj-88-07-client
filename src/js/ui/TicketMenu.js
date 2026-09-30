export default class TicketMenu {
  constructor(container, actions) {
    this.container = container;
    this.actions = actions;

    this.menuWidget = document.createElement('div');
    this.menuWidget.classList.add('controls');
    this.menuWidget.innerHTML = `
        <div class="button button-add">Добавить тикет</div>
    `;

    const button = this.menuWidget.querySelector('.button-add');
    button.addEventListener('click', this.add.bind(this));

    this.container.appendChild(this.menuWidget);
  }
  add () {
    if (!this.actions.onAdd) return;
    this.actions.onAdd();
  }
}
