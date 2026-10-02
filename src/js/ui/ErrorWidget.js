export default class ErrorWidget {
  constructor(container) {
    this.container = container;

    this.errorWidget = document.createElement('div');
    this.errorWidget.classList.add('error');
  }
  show(message) {
    this.errorWidget.innerText = message;
    this.container.appendChild(this.errorWidget);
    setTimeout(this.hide.bind(this), 2000);
  }
  hide() {
    this.errorWidget.remove();
  }
}
