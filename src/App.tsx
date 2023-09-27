import "./styles.css";
import {
  Book,
  BookInformation,
  User,
  Review,
  ReviewInformation,
} from "./lib/types";
import { getBooks, getUsers, getReviews } from "./lib/api";
import { useEffect, useState, FC } from "react";
import { Card } from "./Card";

const toBookInformation = (
  book: Book,
  users: User[],
  reviews: Review[]
): BookInformation => {
  const bookAuthor: User | undefined = users.find(
    (author) => book.authorId === author.id
  );

  const bookReviews: ReviewInformation[] = reviews.map((review) => {
    const user: User | undefined = users.find(
      (user) => user.id === review.userId
    );

    return {
      id: review.id,
      text: review.text ?? "Книга без отзыва",
      user: {
        id: user?.id ?? "Идентификатор не существует",
        name: user?.name ?? "Автор не известен",
      },
    };
  });

  return {
    id: book.id,
    name: book.name ?? "Книга без названия",
    author: { id: bookAuthor?.id!, name: bookAuthor?.name! },
    reviews: bookReviews,
    description: book.description,
  };
};
export const App: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, SetUsers] = useState<User[]>([]);
  const [reviews, setRewiews] = useState<Review[]>([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setBooks(await getBooks());
      SetUsers(await getUsers());
      setRewiews(await getReviews());
      setIsLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1>Мои книги:</h1>
      {isLoading && <div>Загрузка...</div>}
      {!isLoading &&
        books.map((book) => (
          <Card key={book.id} book={toBookInformation(book, users, reviews)} />
        ))}
    </div>
  );
};
