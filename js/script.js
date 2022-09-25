/*
{
  id: string | number,
  title: string,
  author: string,
  year: number,
  isComplete: boolean,
}
*/

const books = [];
const LOAD_BOOKS = "load-books";
const SAVED_BOOKS = "saved-books";
const STORAGE_KEY = "MY_BOOKS";

function generateID() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (let i = 0; i < books.length; i++) {
    if (books[i].id === bookId) {
      return i;
    }
  }
  return -1;
}

function isStorageExists() {
  if (typeof Storage === undefined) {
    alert("Browser Anda Tidak Mendukung Local Storage");
    return false;
  }
  return true;
}

function saveBooks() {
  if (isStorageExists()) {
    const parsedBooks = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsedBooks);
    document.dispatchEvent(new Event(SAVED_BOOKS));
  }
}

function loadDataFromStorage() {
  const serializedBooks = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedBooks);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(LOAD_BOOKS));
}

function makeBookList(bookObject) {
  const bookTitle = document.createElement("h2");
  bookTitle.setAttribute("id", "bookTitle");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.setAttribute("id", "bookAuthor");
  bookAuthor.innerText = `Penulis: ${bookObject.author}`;

  const bookYear = document.createElement("p");
  bookYear.setAttribute("id", "bookYear");
  bookYear.innerText = `Tahun Publikasi: ${bookObject.year}`;

  const container = document.createElement("div");
  container.setAttribute("id", "books");
  container.append(bookTitle, bookAuthor, bookYear);

  if (bookObject.isComplete) {
    const readButton = document.createElement("button");
    readButton.classList.add("check");

    readButton.addEventListener("click", function () {
      unreadBook(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");

    deleteButton.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("edit");

    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    container.append(readButton, deleteButton, editButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("read");

    checkButton.addEventListener("click", function () {
      addBookToRead(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");

    deleteButton.addEventListener("click", function () {
      deleteBook(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.classList.add("edit");

    editButton.addEventListener("click", function () {
      editBook(bookObject.id);
    });

    container.append(checkButton, deleteButton, editButton);
  }

  return container;
}

function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;
  const isComplete = document.getElementById("isComplete").checked;

  const id = generateID();
  const bookObject = generateBookObject(id, title, author, year, isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(LOAD_BOOKS));
  saveBooks();
}

function addBookToRead(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  if (books) bookTarget.isComplete = true;
  document.dispatchEvent(new Event(LOAD_BOOKS));
  saveBooks();
}

function deleteBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  const index = books.indexOf(bookTarget);
  books.splice(index, 1);
  document.dispatchEvent(new Event(LOAD_BOOKS));
  saveBooks();
}

function unreadBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(LOAD_BOOKS));
  saveBooks();
}

function editBook(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  const newTitle = document.querySelector("#bookTitle");
  const newAuthor = document.querySelector("#bookAuthor");
  const newYear = document.querySelector("#bookYear");

  newTitle.innerText = bookTarget.title = prompt("Masukkan Judul Baru", "Tentang Kamu");
  newAuthor.innerText = bookTarget.author = prompt("Masukkan Nama Penulis Baru", "Tere Liye");
  newYear.innerText = bookTarget.year = prompt("Masukkan Tahun Publikasi Baru", "2016");

  document.dispatchEvent(new Event(LOAD_BOOKS));
  saveBooks();
}

function resetForm() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("year").value = "";
  document.getElementById("isComplete").checked = false;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("formAddBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    resetForm();
  });

  if (isStorageExists()) {
    loadDataFromStorage();
  }

  const searchButton = document.querySelector("#searchButton");

  searchButton.addEventListener("click", (e) => {
    const inputSearch = document.querySelector("#inputSearch").value;
    const bookItems = document.querySelectorAll("#books");

    bookItems.forEach((bookItem) => {
      const bookTitle = bookItem.querySelector("#bookTitle").innerText;
      if (bookTitle.toLowerCase().includes(inputSearch.toLowerCase())) {
        bookItem.setAttribute("style", "display: block;");
      } else {
        bookItem.setAttribute("style", "display: none;");
      }
    });

    e.preventDefault();
  });
});

document.addEventListener(SAVED_BOOKS, () => {
  console.log("Data berhasil di simpan.");
});

document.addEventListener(LOAD_BOOKS, function () {
  const inCompletedBook = document.querySelector("#inCompleted");
  inCompletedBook.innerHTML = "";

  const completedBook = document.querySelector("#completed");
  completedBook.innerHTML = "";

  for (const bookItem of books) {
    const newBookLists = makeBookList(bookItem);
    if (!bookItem.isComplete) {
      inCompletedBook.append(newBookLists);
    } else {
      completedBook.append(newBookLists);
    }
  }
});
