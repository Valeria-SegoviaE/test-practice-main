import { useActionState, useEffect, useRef, useState } from "react"

export type Book = {
  id: string
  title: string
  author: string
  pages: number
}

type FormState = {
  message: string
}

const initialBooks: Book[] = [
  {
    id: "project-hail-mary",
    title: "Project Hail Mary",
    author: "Andy Weir",
    pages: 496,
  },
  {
    id: "circe",
    title: "Circe",
    author: "Madeline Miller",
    pages: 393,
  },
  {
    id: "the-midnight-library",
    title: "The Midnight Library",
    author: "Matt Haig",
    pages: 304,
  },
]

export function useReadingList() {
  const [books, setBooks] = useState(initialBooks)
  const titleInputRef = useRef<HTMLInputElement>(null)

  async function addBook(_previousState: FormState, formData: FormData) {
    const title = String(formData.get("title") ?? "").trim()
    const author = String(formData.get("author") ?? "").trim()
    const pagesValue = String(formData.get("pages") ?? "").trim()
    const pages = Number(pagesValue)

    let message: string

    if (!title) {
      message = "Enter a book title."
    } else if (!author) {
      message = "Enter the author's name."
    } else if (!Number.isInteger(pages) || pages <= 0) {
      message = "Pages must be a whole number greater than 0."
    } else {
      setBooks((currentBooks) => [
        ...currentBooks,
        { id: crypto.randomUUID(), title, author, pages },
      ])
      message = "Book added to your shelf."
    }

    return { message }
  }

  const [formState, submitBook, isPending] = useActionState(addBook, {
    message: "",
  })

  useEffect(() => {
    if (formState.message) {
      titleInputRef.current?.focus()
    }
  }, [formState])

  return {
    books,
    formState,
    submitBook,
    isPending,
    titleInputRef,
  }
}