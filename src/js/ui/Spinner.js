import loadingIcon from '../..//img/spinner.svg';

export default class Spinner {
  constructor(container) {
    this.container = container;

    this.spinnerWidget = document.createElement('div');
    this.spinnerWidget.classList.add('spinner');

    this._loading = document.createElement('img');
    this._loading.src = loadingIcon;
    this._loading.classList = 'loading';
    this._loading.alt = 'Loading data...';

    this.spinnerWidget.appendChild(this._loading);
    
  }
  start() {
    this.container.appendChild(this.spinnerWidget);
  }
  stop() {
    this.spinnerWidget.remove();
  }
}
