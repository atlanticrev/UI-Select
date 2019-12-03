class UISelect extends HTMLElement {

  constructor() {

    super();

    this.onOptionClick = this.onOptionClick.bind(this);
    this.onOptionSelect = this.onOptionSelect.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.showDropdown = this.showDropdown.bind(this);
    this.hideDropdown = this.hideDropdown.bind(this);
    this.onClearInput = this.onClearInput.bind(this);
    this.showFoundOptions = this.showFoundOptions.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.onEscapePress = this.onEscapePress.bind(this);
    this.onMissClick = this.onMissClick.bind(this);

  }

  connectedCallback() {

    this.init();
    this.bindEvents();

  }

  disconnectedCallback() {

    this.unbindEvents();

  }

  init() {

    // Данные
    this.data = {
      'volvo': 'Volvo',
      'saab': 'Saab',
      'mercedes': 'Mercedes',
      'audi': 'Audi',
      '123': '123',
      'asd': 'asd',
      'qwe': 'qwe',
      'ert': 'ert',
      'tyu': 'tyu',
      'dfg': 'dfg',
      'ghj': 'ghj',
      'cvb': 'cvb',
      'jkl': 'jkl'
    };

    this.selectedOptions = [];

    // Преобразовать исходные данные
    this.normalizedData = this.normalizeData(this.data);

    this.wrapper = document.createElement('div');

    // Инпут для поиска options
    this.inputWrapper = document.createElement('div');
    this.inputWrapper.className = 'select-input-wrapper';

    this.clearInput = document.createElement('button');
    this.clearInput.className = 'select-clear-input hidden';
    this.clearInput.innerHTML = '&#10005;';

    this.input = document.createElement('input');
    this.input.setAttribute('type', 'text');
    this.input.placeholder = 'Enter country name';

    this.inputWrapper.append(this.input, this.clearInput);

    // Доделать, если название не нужно
    this.selectTitle = document.createElement('div');
    this.selectTitle.className = 'select-title';

    // Устанавливаем placeholder для названия select
    if (this.dataset.title) {
      this.selectTitle.innerHTML = `${this.dataset.title}`;
    }

    this.display = document.createElement('div');
    this.display.className = 'select-display';

    this.display.append(this.selectTitle);

    // Связывание нативного select и с options в dropdown
    this.select = this.createSelect(this.normalizedData);

    // Заполнение dropdown
    this.selectDropdown = document.createElement('div');
    this.selectDropdown.className = 'select-dropdown hidden';

    this.optionsContainer = document.createElement('div');
    this.optionsContainer.className = 'options-container';

    this.selectDropdown.appendChild(this.inputWrapper);

    this.normalizedData.forEach(option => {

      const optionElement = document.createElement('div');

      optionElement.value = option;
      optionElement.innerHTML = option;
      optionElement.className = 'select-option';
      optionElement.dataset.selected = '';

      optionElement.addEventListener('click', this.onOptionClick);

      this.optionsContainer.appendChild(optionElement);

    });

    this.nothingFound = document.createElement('div');
    this.nothingFound.className = 'nothing-found hidden';
    this.nothingFound.innerHTML = this.dataset.nothingFound ? this.dataset.nothingFound : `Ничего не найдено`;

    this.optionsContainer.appendChild(this.nothingFound);
    this.selectDropdown.appendChild(this.optionsContainer);

    // Заполение контейнера
    this.wrapper.append(this.display, this.selectDropdown, this.select);

    // Добавляем созданные элементы в виджет
    this.append(this.wrapper);

  }

  bindEvents() {

    this.clearInput.addEventListener('click', this.onClearInput);
    this.input.addEventListener('keyup', this.onInputChange);
    this.display.addEventListener('click', this.toggleDropdown);
    this.select.addEventListener('selected', this.onOptionSelect);
    document.addEventListener('keydown', this.onEscapePress);
    document.addEventListener('click', this.onMissClick);

  }

  unbindEvents() {

    document.removeEventListener('click', this.hideDropdown);
    document.removeEventListener('keydown', this.onEscapePress);

  }

  // Creation of native <select>
  createSelect(data) {

    // Создаем и скрываем нативный селект
    const select = document.createElement('select');
    select.style.display = 'none';

    if (this.dataset.multiple) {
      select.multiple = true;
    }

    // Формирование options из данных
    for (let i = 0; i < data.length; i++) {

      let option = document.createElement('option');
      option.value = data[i];
      option.innerHTML = data[i].toUpperCase();

      select.appendChild(option);

    }

    return select;

  }

  normalizeData(data) {

    const optionsContainer = document.createDocumentFragment();

    for (let option in data) {

      // const newOption = document.createElement('div');
      // newOption.setAttribute('data-value', `${}`)
      //
      // optionsContainer.appendChild();
    }

    return Object.keys(data);

  }

  // Вынести стили
  showFoundOptions(e) {

    const options = this.querySelectorAll('.select-option');

    let searchSuccess = false;

    options.forEach((option) => {

      if (option.value.indexOf(e.target.value) !== -1) {

        searchSuccess = true;
        option.style.display = '';

      } else {

        option.style.display = 'none';

      }

    });

    if (!searchSuccess) {

      this.nothingFound.classList.remove('hidden');

    } else {

      this.nothingFound.classList.add('hidden');

    }

  }

  showClearInputButton() {

    if (this.input.value) {

      this.clearInput.classList.remove('hidden');

    } else {

      this.clearInput.classList.add('hidden');

    }

  }

  showDropdown() {

    this.selectTitle.classList.add('expanded');
    this.selectDropdown.classList.remove('hidden');

    setTimeout(() => {
      this.input.focus();
    }, 200);

  }

  hideDropdown() {

    this.selectTitle.classList.remove('expanded');
    this.selectDropdown.classList.add('hidden');

  }

  toggleDropdown() {

    if (this.selectTitle.classList.contains('expanded')) {

      this.selectTitle.classList.remove('expanded');
      this.selectDropdown.classList.add('hidden');

    } else {

      this.showDropdown();

    }

  }


  // Event handlers

  onInputChange(e) {

    this.showClearInputButton(e);
    this.showFoundOptions(e);

  }

  onClearInput(e) {

    e.preventDefault();

    this.input.value = '';
    this.input.focus();
    this.onInputChange(e);

    // Снять все выделения options
    // const options = Array.from(this.optionsContainer.children);

    // if (this.dataset.multiple) {
    //   options.forEach((option) => {
    //     option.dataset.selected = '';
    //   });
    // }

  }

  onOptionClick(e) {

    e.target.dataset.selected = e.target.dataset.selected ? '' : 'true';

    if (!this.dataset.multiple) {

      const options = Array.from(this.querySelectorAll('.select-option'));

      options.forEach((option) => {

        if (option !== e.target) {

          option.dataset.selected = '';

        }

      });

      this.selectedOptions = options.filter((option) => {

        return option.dataset.selected;

      });

      this.selectTitle.classList.remove('expanded');
      this.selectDropdown.classList.add('hidden');
      this.selectTitle.innerHTML = e.target.value;

    }

    if (this.dataset.multiple) {

      const options = Array.from(this.querySelectorAll('.select-option'));

      this.selectedOptions = options.filter((option) => {

        return option.dataset.selected;

      });

      this.selectTitle.innerHTML = this.selectedOptions.length ? `${this.selectedOptions.length} выбрано` : `${this.dataset.title}`;

    }

    this.select.dispatchEvent(new CustomEvent('selected', { 'detail': e.target }))

  }

  onOptionSelect(e) {

    // Возможно вместо заполнения select вначале нужно добавлять options по мере выбора
    let options = Array.from(e.target.options);

    options.forEach((option) => {

      if (e.detail.value === option.value) {

        option.selected = option.selected ? '' : 'selected';

      }

    });

  }

  onMissClick(e) {

    if (!e.composedPath().includes(this)) {

      this.hideDropdown();

    }

  }

  onEscapePress(e) {

    if ( e.key === 'Escape' && this.selectTitle.classList.contains('expanded') ) {

      this.hideDropdown();

    }

  }

}

window.customElements.define('ui-select', UISelect);
