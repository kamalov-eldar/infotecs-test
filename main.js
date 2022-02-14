function loadData() {
  fetch("./data.json")
    .then(function (response) {
      //then чтоб подождать ответа от сервиса, записываем ответ в response
      return response.json(); // возвращаем ответ ввиде json
    })
    .then(function (json) {
      //then чтоб подождать ответа записываем ответ в json
      tableOutput([...json.JSON]);
    });
}

//функция вывода таблицы
function tableOutput(data) {
  //console.log("data: ", data);
  const table = document.querySelector("table");
  const tbody = document.createElement("tbody");
  tbody.className = "tbody";

  // строки
  const numberRows = data.length - 1;
  for (let i = 0; i <= numberRows; i++) {
    let tr = document.createElement("tr");

    tr.insertAdjacentHTML("afterbegin", `<td>${data[i]["eyeColor"]}</td>`);
    tr.insertAdjacentHTML("afterbegin", `<td><div class="about"> ${data[i]["about"]} </div></td>`);
    tr.insertAdjacentHTML("afterbegin", `<td>${data[i]["name"]["lastName"]}</td>`);
    tr.insertAdjacentHTML("afterbegin", `<td>${data[i]["name"]["firstName"]}</td>`);
    tbody.append(tr); // добавление строк
  }
  table.append(tbody); // добавление эл-ов таблицы
  editing();
}

// click по строке вызов ф-ии сортировки
const table = document.querySelector("table");
const headers = table.querySelectorAll("th"); // Получить заголовки

[].forEach.call(headers, function (currentHeader, index) {
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

// по возростанию ascending
// по убыванию  descending

function sort(index, isAscending) {
  const tbody = document.querySelector("tbody");
  const arrRows = tbody.querySelectorAll("tr");

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

// редактирование строки
function editing() {
  const tbody = document.querySelector("tbody");
  const rows = tbody.querySelectorAll("tr");
  const modalForm = document.querySelector(".modal__form");
  const inputArr = modalForm.querySelectorAll("input");

  // следить за кликом на любой строке
  rows.forEach((tr) => {
    tr.addEventListener("click", function () {
      // 1. найти форму ввода
      const modal = document.querySelector(".modal");

      // 2. получить данные input
      inputArr.forEach((input, indexInput) => {
        input.addEventListener("input", function () {
          window.onkeyup = keyup; //создает прослушиватель, когда  нажимаете клавишу
          let indexEnter = Array.prototype.indexOf.call(inputArr, this); // получить индекс инпута где событие ввода

          function keyup(e) {
            //запись значения input в переменную
            let inputTextValue = e.target.value;
            //по нажатию enter выводит значение input
            if (e.keyCode === 13) {
              //|| e.code === "Tab"
              console.log("indexInput: ", indexInput);
              //  console.log("indexEnter: ", indexEnter);
              paste(inputTextValue, indexInput); // функция вставки получает параметры input
              indexEnter++;
              if (indexEnter <= inputArr.length - 1) {
                e.target.value = "";
                inputArr[indexEnter].focus(); //перемещать фокус на след инпут по enter
              } else {
                e.target.value = "";
                inputArr[0].focus(); // установить фокус в первый инпут
              }
            }
          }
        });
      });
      // 3. изменить текст строки
      function paste(inputTextValue, indexInput) {
        const tdArr = tr.querySelectorAll("td");
        for (let i = 0; i < tdArr.length; i++) {
          if (indexInput === i) {
            tdArr[i].textContent = inputTextValue;
          }
        }
      }

      //4. выделить редактируемую строку
      const isEditing = this.classList.contains("editing");
      //  содержит ли клик эл-т класс editing

      // удалить класс editing
      rows.forEach((tr) => {
        tr.classList.remove("editing");
      });
      // добавить класс editing
      if (isEditing) {
        this.classList.remove("editing");
        modal.classList.remove("modal--show"); // 1. скрыть форму ввода
      } else {
        this.classList.add("editing");
        modal.classList.add("modal--show"); // 1. показать форму ввода
        inputArr[0].focus(); // установить фокус в первый инпут
      }
    });
  });
}

// Клик кнопке закрыть окно
const modal = document.querySelector(".modal");
const modalContainer = document.querySelector(".modal__container");

document.querySelector(".modal-button__close").onclick = function () {
  modal.classList.remove("modal--show");
  const tbody = document.querySelector("tbody");
  const rows = tbody.querySelectorAll("tr");

  rows.forEach((tr) => {
    tr.classList.remove("editing");
  });
};

loadData();
