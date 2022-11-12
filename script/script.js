const addBookButton = document.querySelector('#add-book-pop-up-btn')
const editBookButton = document.querySelector('#edit-book-pop-up-btn')
const removeBookButton = document.querySelector('#remove-book-btn')

const nameInput = document.querySelector('#book-input')
const pagesInput = document.querySelector('#pages-input')
const main = document.querySelector('.main')

const readBooksContainer = document.querySelector('.read-books-container')
const editBookSelect = document.querySelector('#book-select')
const removeBookSelect = document.querySelector('#book-select-remove')
const forms = document.querySelectorAll('.form')

const mobileMenuIcon = document.querySelector('.mobile-menu')
const mobileMenu = document.querySelector('.menu')
const mobileButtons = document.querySelector('.mobile-buttons')

const booksList = localStorage.length > 0 ? JSON.parse(localStorage.books) : []

let readBooksQuantity = booksList.length
let readPagesQuantity = 0



function userInformations() {
    const userInformationsText = document.querySelector('#user-informations-text')

    userInformationsText.innerText = `Quantidade de livros lidos: ${readBooksQuantity} / quantidade de páginas lidas: ${readPagesQuantity}`
}



function toggleMobileMenu() {
    mobileMenu.classList.toggle('open')
    main.classList.add('blur')

    main.addEventListener('click', () => {
        mobileMenu.classList.remove('open')
        main.classList.remove('blur')
        const currentModal = document.querySelector('.visible')

        if (currentModal) {
            currentModal.classList.remove('visible')
        }
    })

}




function popUp(event) {
    const popUpAddBookModal = document.querySelector('.add-book')
    const popUpEditBookModal = document.querySelector('.edit-book')
    const popUpRemoveBookModal = document.querySelector('.remove-book')
    const buttons = document.querySelector('.buttons')
    const hasAlreadyModalOpen = document.querySelector('.visible')


    buttons.addEventListener('click', e => {
        const target = e.target

        if (target.dataset.js) {
            popUp(`openPopUp${target.dataset.js}Book`)
        }
    })


    if (hasAlreadyModalOpen) {
        hasAlreadyModalOpen.classList.remove('visible')
    }


    const popUpEvents = {
    openPopUpAddBook: () => {
            popUpAddBookModal.classList.add('visible')
        },

        closePopUpAddBook: () => {
            popUpAddBookModal.classList.remove('visible')
        },

        openPopUpEditBook: () => {
            popUpEditBookModal.classList.add('visible')
            createOptions('editBook')
        },

        closePopUpEditBook: () => {
            popUpEditBookModal.classList.remove('visible')
        },

        openPopUpRemoveBook: () => {
            popUpRemoveBookModal.classList.add('visible')
            createOptions('removeBook')
        },

        closePopUpRemoveBook: () => {
            popUpRemoveBookModal.classList.remove('visible')
        }
    }

    if (event && !event.includes('undefined')) {
        const currentPopUpFunction = popUpEvents[event]
        currentPopUpFunction()
    }

}





function insertBooksHTML (booksList) {
readBooksContainer.innerHTML = ''

booksList.forEach(book => {
    const readBookDiv = document.createElement('div')
    readBookDiv.classList.add('book')
    readBookDiv.setAttribute('book', book.bookName)
    readBooksContainer.append(readBookDiv)
    readBookDiv.innerHTML = `<span data-bookid="${book.id}" data-bookName="${book.bookName}"> Nome do livro: ${book.bookName} / quantidade de páginas: ${book.quantityPages} </span>`

})
        
}






function addBook() {
    popUp('openPopUpAddBook')
    const nameInputValue = nameInput.value
    const pagesInputValue = Number(pagesInput.value)

    let ID = booksList.length

    if (nameInputValue) {     
        ID++
        
        nameInput.value = ''
        pagesInput.value = ''

        const generatedBookObject = {
            id: ID,
            bookName: nameInputValue,
            quantityPages: pagesInputValue
        }

        readPagesQuantity += pagesInputValue
        readBooksQuantity++

        popUp('closePopUpAddBook')
        userInformations()
        addBookToLocalStorage(generatedBookObject)
        insertBooksHTML(booksList)

        if (mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open')
            main.classList.remove('blur')
        }

    }

}




function addBookToLocalStorage(bookInformation) {
    booksList.push(bookInformation)
    const booksListJSON = JSON.stringify(booksList)
    localStorage.books = booksListJSON

}




function addReadBooksFromLocalStorage(event) {

    if (localStorage.length === 0) {
        localStorage.setItem('books', JSON.stringify([]))
    }

    insertBooksHTML(booksList)
    booksList.forEach(bookObject => {
            readPagesQuantity += bookObject.quantityPages
        })

    }

function createOptions(modal) {
    const booksSpan = document.querySelectorAll('.book > span')
    editBookSelect.innerHTML = ''
    removeBookSelect.innerHTML = ''

    if (modal === 'editBook') {

        booksSpan.forEach(span => {
            const option = document.createElement('option')
            editBookSelect.append(option)
            option.innerText = span.dataset.bookname
        })

    }



    if (modal === 'removeBook') {

        booksSpan.forEach(span => {
            const option = document.createElement('option')
            removeBookSelect.append(option)
            option.innerText = span.dataset.bookname
        })
    }

}


function editBookInformation() {

    const editNameInput = document.querySelector('#edit-name-input')
    const editPagesInput = document.querySelector('#edit-pages-input')

    const currentBook = booksList.find(bookObject => {
        return bookObject.bookName === editBookSelect.value
    })

    const currentBookIndex = booksList.indexOf(currentBook)

    const editedBookName = editNameInput.value
    const editedQuantityPages = Number(editPagesInput.value)

    if (currentBook && editedBookName) {

        readPagesQuantity -= currentBook.quantityPages
        readPagesQuantity += editedQuantityPages ? editedQuantityPages : currentBook.quantityPages

        booksList[currentBookIndex].bookName = editedBookName
        booksList[currentBookIndex].quantityPages = editedQuantityPages ? editedQuantityPages : currentBook.quantityPages

        editNameInput.value = ''
        editPagesInput.value = ''
        
        const booksListJSON = JSON.stringify(booksList)
        localStorage.books = booksListJSON

        insertBooksHTML(booksList)
        userInformations()
        popUp('closePopUpEditBook')

        mobileMenu.classList.remove('open')
        main.classList.remove('blur')

    }


}




function removeBook() {
     const currentBook = booksList.find(bookObject => {
        return bookObject.bookName.trim() === removeBookSelect.value
    })

    const index = booksList.indexOf(currentBook)

    if (currentBook) {

        readBooksQuantity--
        booksList.splice(index, 1)
        localStorage.books = JSON.stringify(booksList)

        insertBooksHTML(booksList)
        readPagesQuantity -= currentBook.quantityPages

        popUp('closePopUpRemoveBook')
        userInformations()
        mobileMenu.classList.remove('open')
        main.classList.remove('blur')

    }


}

function searchBook() {
    const searchBookInput = document.querySelector('#search-input')

    function addSearchedBook() {

        const searchBookInputValue = searchBookInput.value.toLowerCase().trim()

        const listSearchedBooks = booksList.filter(book => {
            return book.bookName.toLowerCase().includes(searchBookInputValue)
        })

        if (listSearchedBooks) {            
          insertBooksHTML(listSearchedBooks)
        }

        if (!searchBookInputValue) {
           insertBooksHTML(booksList)
        }
}
    
    searchBookInput.addEventListener('keyup', addSearchedBook)

}

function addListeners() {
    const closeIcons = document.querySelectorAll('.close-icon')
    const mobileMenuCloseIcon = document.querySelector('.close-icon .material-symbols-outlined')


    closeIcons.forEach(icon => {
        icon.addEventListener('click', event => {

            if (event.target !== mobileMenuCloseIcon) {
                const currentModal = document.querySelector('.visible')
                currentModal.classList.remove('visible')
            } else {
                mobileMenu.classList.remove('open')
                main.classList.remove('blur')
            }
        })
    })

    forms.forEach(form => {
        form.addEventListener('submit', event => {
            event.preventDefault()
        })
    })

}

addBookButton.addEventListener('click', addBook)

editBookButton.addEventListener('click', editBookInformation)

removeBookButton.addEventListener('click', removeBook)

mobileMenuIcon.addEventListener('click', toggleMobileMenu)

mobileButtons.addEventListener('click', event => {
    const targetModal = event.target.dataset.js
    popUp(`openPopUp${targetModal}Book`)

})

popUp()
addReadBooksFromLocalStorage('load')
addListeners()
searchBook()
userInformations()