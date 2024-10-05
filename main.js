class Book
{
    constructor(title, author, isbn)
    {
        this.title = title
        this.author = author
        this.isbn = isbn
    }
    getDetails()
    {
        console.log(`Title: ${this.title}, Author: ${this.author}, ISBN: ${this.isbn}`)
    }
}

class Library
{
    constructor()
    {
        this.books = []
        this.init()
    }

    async init()
    {
        await this.fetchBooks()
        this.updateList()
    }

    async fetchBooks()
    {
        try
        {
            const response = await fetch('./book.json')
            const data = await response.json()
            data.forEach(bookData =>
            {
                const book = new Book(bookData.title, bookData.author, bookData.isbn)
                this.addBook(book)
            })
        } catch (error)
        {
            console.error(error, 'Please Try Again Later')
        }
    }

    addBook(book)
    {
        this.books.push(book)
    }
    removeBook(isbn)
    {
        if (this.books.length === 0)
        {
            console.log('No books available to remove.')
            return;
        }
        this.books = this.books.filter(book => book.isbn !== isbn)
        this.updateList()
    }
    findBook(isbnPart)
    {
        if (this.books.length === 0)
        {
            console.log('No books available to find')
            return;
        }
        return this.books.filter(book => book.isbn.toString().startsWith(isbnPart))
    }
    updateList()
    {
        const container = document.querySelector('table tbody')
        container.innerHTML = ''

        this.books.forEach(book =>
        {
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td><button class='remove' onclick="library.removeBook(${book.isbn})">remove</button></td>
            `
            container.append(row)
        })
    }
}

const library = new Library()

document.getElementById('add').addEventListener('click', () =>
{
    const title = document.getElementById('title')
    const author = document.getElementById('author')
    const isbn = document.getElementById('isbn')

    const newBook = new Book(title.value, author.value, isbn.value)

    library.addBook(newBook)

    title.value = ''
    author.value = ''
    isbn.value = ''

    library.updateList()
})

document.getElementById('find').addEventListener('keyup', () =>
{
    const isbnPart = document.getElementById('find').value
    const foundBooks = library.findBook(isbnPart)
    const container = document.querySelector('table tbody')
    container.innerHTML = ''
    if (foundBooks.length > 0)
    {
        foundBooks.forEach(book =>
        {
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td><button class='remove' onclick="library.removeBook(${parseFloat(isbn.value)})">remove</button></td>
            `
            container.append(row)
        })
    } else if(isbnPart)
    {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4">No books found starting with ${isbnPart}</td>`;
        container.append(row);
    }
})