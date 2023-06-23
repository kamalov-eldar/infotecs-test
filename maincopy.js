function loadData() {
  fetch("./data.json")
    .then(function (response) {
      //then чтоб подождать ответа от сервиса, записываем ответ в response
      return response.json(); // возвращаем ответ ввиде json
    })
    .then(function (json) {
      //then чтоб подождать ответа записываем ответ в json
      pagination([...json.JSON]);
    });
}

// функция пагинация
function pagination(arrData) {
  const ul = document.querySelector(".pagination");

  // отобразить первую страницу при запуске/обновлении браузера
  const firstPage = arrData.slice(0, 10);
  tableOutput(firstPage);

  const countRowsOnPage = 10; //кол-во строк на сранице

  // создание  кнопок пагинации от кол-ва эл-ов в json файле
  const pagesCount = Math.ceil(arrData.length / countRowsOnPage);
  for (let i = 1; i <= pagesCount; i++) {
    let li = document.createElement("li");
    li.textContent = i;
    ul.append(li);
  }

  const pagesArr = document.querySelectorAll(".pagination li"); // кол-во кнопок пагинации страниц
  // выделить нажатую кнопку пагинации
  pagesArr.forEach((pageNumber) => {
    pageNumber.addEventListener("click", function () {
      const active = document.querySelector(" li.active");
      if (active) {
        active.classList.remove("active");
      }
      this.classList.add("active");
      // выбрать соответ строки для страницы
      const startCut = (+pageNumber.textContent - 1) * countRowsOnPage; // с какого эл-а массива начинаем вырезать
      const endCut = startCut + countRowsOnPage; // до какого эл-а массива вырезаем
      const arrRowsOnPage = arrData.slice(startCut, endCut);
      tableOutput(arrRowsOnPage); // передаем вырезанный массив строк для отрисовки
    });
  });
}

//функция отрисовки таблицы
const table = document.querySelector("table"); // переписать в 1 стр
table.insertAdjacentHTML("beforeend", `<tbody class = "tbody"></tbody>`);
const tbody = document.querySelector("tbody");

function tableOutput(arrRowsOnPage) {
  tbody.innerHTML = ""; // удалить прежнее содержание таблицы
  const numberRows = arrRowsOnPage.length - 1;
  // строки
  for (let i = 0; i <= numberRows; i++) {
    let tr = document.createElement("tr");
    tr.insertAdjacentHTML(
      "afterbegin",
      `<td style="background-color:${arrRowsOnPage[i]["eyeColor"]}">${arrRowsOnPage[i]["eyeColor"]}</td>`
    );
    tr.insertAdjacentHTML("afterbegin", `<td ><div class="about"> ${arrRowsOnPage[i]["about"]} </div></td>`);
    //console.log("div-global: ", div);

    tr.insertAdjacentHTML("afterbegin", `<td>${arrRowsOnPage[i]["name"]["lastName"]}</td>`);
    tr.insertAdjacentHTML("afterbegin", `<td>${arrRowsOnPage[i]["name"]["firstName"]}</td>`);
    /*  let div1 = document.querySelector("#div1");
    document.getElementById("text").innerHTML = "Height of below div is: " + div1.offsetHeight;
    div1.classList.add("text"); */
    //display: -webkit-box;
    //const div = document.querySelector(".about");
    //console.log("div-for: ", div);
    tbody.append(tr); // добавление строк
  }

  table.append(tbody); // добавление в таблицу

  // удалить класс сортировки
  const headers = document.querySelectorAll("table tr td"); // Получить заголовки
  headers.forEach((header) => {
    header.classList.remove("ascending");
    header.classList.remove("descending");
  });

  //  скрыть столбец при отрисовки таблицы
  const selectColumn = document.querySelectorAll(".hide__input input"); // список инпутов
  selectColumn.forEach((input, indexInput) => {
    if (input.checked) {
      // скрыть колонку
      const colTable = document.querySelectorAll(`table td:nth-child(${indexInput + 1})`);
      colTable.forEach((item) => {
        item.classList.add("hide");
      });
    }
  });
  editing(); // ??
}

//  по клику на инпут скрыть столбец
const selectColumn = document.querySelectorAll(".hide__input input"); // список инпутов

selectColumn.forEach((input, indexInput) => {
  //
  input.addEventListener("click", function () {
    // скрыть столбец таблицы
    const colTable = document.querySelectorAll(`table td:nth-child(${indexInput + 1})`);
    colTable.forEach((item) => {
      item.classList.toggle("hide");
    });
  });
});

// установить класс сортировки
const headers = document.querySelectorAll("table tr td"); // Получить заголовки

headers.forEach((currentHeader, index) => {
  currentHeader.addEventListener("click", function () {
    const isAscending = currentHeader.classList.contains("ascending");
    const isDescending = currentHeader.classList.contains("descending");
    //  содержит ли клик эл-т класс сортировки ascending/descending

    // удалить классы
    headers.forEach((header) => {
      header.classList.remove("ascending");
      header.classList.remove("descending");
    });
    if (isAscending) {
      currentHeader.classList.remove("ascending");
      currentHeader.classList.add("descending");
    } else if (isDescending) {
      currentHeader.classList.remove("descending");
      currentHeader.classList.add("ascending");
    } else {
      currentHeader.classList.add("ascending");
    }
    sort(index, isAscending); //  функция будет выполнять сортировку
  });
});

// функция сортировки
function sort(index, isAscending) {
  const arrRows = document.querySelectorAll("tbody tr");

  let sortedRows = Array.from(arrRows).sort(function (rowA, rowB) {
    return isAscending // сортирока по возростанию алфавита
      ? rowA.cells[index].innerHTML > rowB.cells[index].innerHTML
        ? -1
        : 1
      : rowA.cells[index].innerHTML > rowB.cells[index].innerHTML
      ? 1
      : -1;
  });
  tbody.append(...sortedRows); // добавление отсортированного массива
}

// функция редактирование строки
const modal = document.querySelector(".modal");

function editing() {
  const rows = tbody.querySelectorAll("tr");
  console.log('rows: ', rows);
  const inputArr = document.querySelectorAll(".modal__form input");
  const textarea = document.querySelector(".modal__form textarea");
  console.log("textarea: ", textarea);

  // отслеживать клик на строке
  rows.forEach((tr) => {
    tr.addEventListener("click", function () {
      const tdArr = this.querySelectorAll("td");
      console.log(this);
      // передать значения табл в инпуты
      inputArr[0].value = this.cells[0].textContent;
      inputArr[1].value = this.cells[1].textContent;
      textarea.value = this.cells[2].textContent;
      inputArr[2].value = this.cells[3].textContent;

      // записать текст из textarea в таблицу
      textarea.addEventListener("input", (event) => {
        tdArr[2].querySelector("div").textContent = event.target.value;
        console.log('tdArr[2].documentQuerySelector("div"): ', tdArr[2].querySelector("div").textContent);
        //insertAdjacentHTML("afterbegin", `<td ><div class="about"> ${arrRowsOnPage[i]["about"]} </div></td>`);

        // tdArr[2].insertAdjacentHTML("afterbegin", `<td ><div class="about"> ${event.target.value} </div></td>`);
        //textContent = event.target.value;
        console.log("tdArr[2]: ", tdArr[2]);
      });
      //  получить данные input/записать в таблицу
      inputArr.forEach((input, indexInput) => {
        input.addEventListener("input", function (event) {
          let inputTextValue = event.target.value;
          console.log("inputTextValue: ", inputTextValue);

          //  paste(inputTextValue, indexInput); // функция вставки получает параметры input
          for (let i = 0; i < tdArr.length; i++) {
            if (indexInput === i) {
              tdArr[i].textContent = inputTextValue;
            }

            /* if (indexInput === 2) {
              tdArr[i].textContent = inputTextValue;
            } else if (indexInput === i) {
              tdArr[i].textContent = inputTextValue;
            } */
          }
        });
      });

      // выделить редактируемую строку
      const isEditing = this.classList.contains("editing"); //  содержит ли клик эл-т класс editing
      // снять выделение строки
      rows.forEach((tr) => {
        tr.classList.remove("editing");
      });
      // выделение редактируемой строки/ показать форму редактирования
      if (isEditing) {
        this.classList.remove("editing");
        modal.classList.remove("modal--show"); // скрыть форму ввода
      } else {
        this.classList.add("editing");
        modal.classList.add("modal--show"); // показать форму ввода
        inputArr[0].focus(); // установить фокус в первый инпут
      }
    });
  });
}

// Клик по кнопке закрыть окно

document.querySelector(".modal-button__close").onclick = function closeModal() {
  const rows = tbody.querySelectorAll("tr");

  modal.classList.remove("modal--show");
  rows.forEach((tr) => {
    tr.classList.remove("editing");
  });
};

loadData();
