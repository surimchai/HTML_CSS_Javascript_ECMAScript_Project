export const EMPTY_FORM = {
  title: "",
  author: "",
  isbn: "",
  price: "",
  publishDate: "",
  description: "",
  language: "",
  pageCount: "",
  publisher: "",
  edition: "",
  coverImageUrl: "",
};

function toNumberOrNull(value) {
  const trimmed = String(value).trim();

  if (trimmed === "") {
    return null;
  }

  return Number(trimmed);
}

export function toRequest(form) {
  return {
    title: form.title.trim(),
    author: form.author.trim(),
    isbn: form.isbn.trim(),
    price: toNumberOrNull(form.price),
    publishDate: form.publishDate || null,
    bookDetail: {
      description: form.description.trim(),
      language: form.language.trim(),
      pageCount: toNumberOrNull(form.pageCount),
      publisher: form.publisher.trim(),
      edition: form.edition.trim(),
      coverImageUrl: form.coverImageUrl.trim(),
    },
  };
}

export function toFormValues(book) {
  const detail = book.bookDetail;

  return {
    title: book.title ?? "",
    author: book.author ?? "",
    isbn: book.isbn ?? "",
    price: book.price ?? "",
    publishDate: book.publishDate ?? "",
    description: detail?.description ?? "",
    language: detail?.language ?? "",
    pageCount: detail?.pageCount ?? "",
    publisher: detail?.publisher ?? "",
    edition: detail?.edition ?? "",
    coverImageUrl: detail?.coverImageUrl ?? "",
  };
}