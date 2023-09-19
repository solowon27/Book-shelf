import React, { useState, useEffect } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';

import Auth from '../utils/auth';
import { searchGoogleBooks } from '../../src/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

import bookShelf from '../Images/bookshelf.png'
import alchemist from '../Images/the-alchemist.jpg'
import mockingbird from '../Images/to-kill-a-mockingbird.png'
import nineteenEightyFour from '../Images/1984.jpg'
import pride from '../Images/pride-and-prejudice.png'
import catcher from '../Images/the-catcher.png'
import davenci from '../Images/the-davenci-code.jpg'
import hobbit from '../Images/the-hobbit.jpg'
import shining from '../Images/the-shining.png'
import hungerGames from '../Images/the-hunger-games.jpg'
import gatsby from '../Images/the-great-gatsby.jpg'

const SearchBooks = () => {
  // create state for holding returned Google API data
  const [searchedBooks, setSearchedBooks] = useState([]);
  // create state for holding our search field data
  const [searchInput, setSearchInput] = useState('');
  // create state to hold saved bookId values
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook] = useMutation(SAVE_BOOK);

  // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
  useEffect(() => {
    saveBookIds(savedBookIds);
  }, [savedBookIds]);

  // create function to handle saving a book to our database
  const handleSaveBook = async (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // get token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveBook({
        variables: { input: bookToSave },
      });
      if (data.saveBook.errors) {
        throw new Error(data.saveBook.errors[0].message);
      }

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  // create method to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const { items } = await response.json();

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h6 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h6>
        <Row>
  {searchedBooks.map((book) => {
    return (
      <Col xs="12" sm="6" md="4" key={book.bookId}>
        <Card border='dark' className='h-100'>
          {book.image ? (
            <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
          ) : null}
          <Card.Body>
            <Card.Title>{book.title}</Card.Title>
            <p className='small'>Authors: {book.authors}</p>
            <Card.Text>{book.description}</Card.Text>
            {Auth.loggedIn() && (
              <Button
                disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                className='btn-block btn-info'
                onClick={() => handleSaveBook(book.bookId)}>
                {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                  ? 'This book has already been saved!'
                  : 'Save this Book!'}
              </Button>
            )}
          </Card.Body>
        </Card>
      </Col>
    );
  })}
</Row>
    
      <section className="showRoom">
        <div className='text-center'>
          <img src={bookShelf} alt="bookshelf" className='bookShelf ' />
        </div>
          <h2 className="mainHeader text-center mt-4">explore the world of books</h2>
          <div className="row">
            <div className="col-md-3 col-sm-6 mb-4 mt-4">
              <div className="book-item">
                <Card border="dark" className="h-100">
                  <Card.Img
                    src={alchemist}
                    alt="The cover for The Alchemist"
                    variant="top"
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>The Alchemist</Card.Title>
                    <p className="small mb-2">Authors: Paulo Coelho</p>
                    <Card.Text className='flex-grow-1'>
                      A philosophical book about following your dreams.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </div>

            <div className="col-md-3 col-sm-6 mb-4 mt-4">
              <div className="book-item">
                <Card border="dark" className="h-100">
                  <Card.Img
                    src={mockingbird}
                    alt="The cover for To Kill a Mockingbird"
                    variant="top"
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>To Kill a Mockingbird</Card.Title>
                    <p className="small mb-2">Authors: Harper Lee</p>
                    <Card.Text className='flex-grow-1'>
                      A classic novel addressing racial injustice in the American South.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </div>

            <div className="col-md-3 col-sm-6 mb-4 mt-4">
              <div className="book-item">
                <Card border="dark" className="h-100">
                  <Card.Img
                    src={nineteenEightyFour}
                    alt="The cover for 1984"
                    variant="top"
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>1984</Card.Title>
                    <p className="small mb-2">Authors: George Orwell</p>
                    <Card.Text className='flex-grow-1'>
                      A dystopian novel depicting a totalitarian society and government surveillance.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </div>

            <div className="col-md-3 col-sm-6 mb-4 mt-4">
              <div className="book-item">
              <Card border="dark" className="h-100">
                  <Card.Img
                      src={gatsby}
                      alt="The cover for The Great Gatsby"
                      variant="top"
                    />
                  <Card.Body>
                    <Card.Title>The Great Gatsby</Card.Title>
                    <p className="small mb-2">Authors: F. Scott Fitzgerald</p>
                    <Card.Text>
                      A novel about the American Dream and the Roaring Twenties.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </div>

            <div className="col-md-3 col-sm-6 mb-4 mt-4">
              <div className="book-item">
              <Card border="dark" className="h-100">
                  <Card.Img
                    src={hobbit}
                    alt="The cover for The Hobbit"
                    variant="top"
                  />

                  <Card.Body>
                    <Card.Title>The Hobbit</Card.Title>
                    <p className="small mb-2">Authors: J.R.R. Tolkien</p>
                    <Card.Text>
                      A fantasy novel about a hobbit who goes on an adventure.
                    </Card.Text>
                  </Card.Body>
                </Card>
                </div>
                </div>

                <div className="col-md-3 col-sm-6 mb-4 mt-4">
                <div className="book-item">
                <Card border="dark" className="h-100">
                  <Card.Img
                   src={pride}
                    alt="The cover for Pride and Prejudice"
                    variant="top"
                  />

                  <Card.Body>
                    <Card.Title>Pride and Prejudice</Card.Title>
                    <p className="small mb-2">Authors: Jane Austen</p>
                    <Card.Text>
                      A classic novel about love and marriage in 19th century England.
                    </Card.Text>
                  </Card.Body>
                </Card>
                </div>
                </div>

                <div className="col-md-3 col-sm-6 mb-4 mt-4">
                <div className="book-item">
                <Card border="dark">
                  <Card.Img
                    src={hungerGames}
                    alt="The cover for The Hunger Games"
                    variant="top"
                  />

                  <Card.Body>
                    <Card.Title>The Hunger Games</Card.Title>
                    <p className="small mb-2">Authors: Suzanne Collins</p>
                    <Card.Text>
                      A suspenseful novel about a dystopian society and a fight to the death.
                    </Card.Text>
                  </Card.Body>
                </Card>
                </div>
                </div>

                <div className="col-md-3 col-sm-6 mb-4 mt-4">
                <div className="book-item">
                <Card border="dark">
                  <Card.Img
                    src={shining}
                    alt="The cover for The Shining"
                    variant="top"
                  />

                  <Card.Body>
                    <Card.Title>The Shining</Card.Title>
                    <p className="small mb-2">Authors: Stephen King</p>
                    <Card.Text>
                      A horror novel about a family who stays at a haunted hotel.
                    </Card.Text>
                  </Card.Body>
                </Card>
                </div>
                </div>

                <div className="col-md-3 col-sm-6 mb-4 mt-4">
                <div className="book-item">
                <Card border="dark">
                  <Card.Img
                    src={davenci}
                    alt="The cover for The Davenci Code"
                    variant="top"
                  />

                  <Card.Body>
                    <Card.Title>The Davenci Code</Card.Title>
                    <p className="small mb-2">Authors: Dan Brown</p>
                    <Card.Text>
                    a mystery thriller novel by Dan Brown.
                    </Card.Text>
                  </Card.Body>
                </Card>
                </div>
                </div>

                <div className="col-md-3 col-sm-6 mb-4 mt-4">
                <div className="book-item">
                <Card border="dark">
                  <Card.Img
                    src={catcher}
                    alt="The cover for The Catcher in the Rye"
                    variant="top"
                  />

                  <Card.Body>
                    <Card.Title>The Catcher in the Rye</Card.Title>
                    <p className="small mb-2">Authors: J.D. Salinger</p>
                    <Card.Text>
                      A coming-of-age novel about a teenager who runs away from school.
                    </Card.Text>
                  </Card.Body>
                </Card>
                </div>
                </div>
          </div>
        </section>
     </Container>
    </>
  );
};

export default SearchBooks;
