import { useEffect, useState, useRef } from "react";
import { Plus, Edit, Trash2, Play, Pause } from "lucide-react";
import useSupabase from "../hooks/useSupabase";
import { BooksForm } from "../components/BooksForm";
import { Author } from "../utils/Dbtypes";

interface Booktable {
  id?: string;
  title: string; // Make title required
  book_cover?: string;
  author_id?: string;
  authors?: Author;
  language: string | undefined;
  category: string | undefined;
  audio?: string;
  pages?: number;
  description?: string;
  paid?: boolean;
  rating?: number; // Added rating property
}
// {
//   "id": 19,
//   "book_cover": "https://mir-s3-cdn-cf.behance.net/project_modules/1400/ca4188148431747.62d5a7764995f.jpg",
//   "author_id": 6,
//   "rating": 4.9,
//   "language": "English",
//   "audio": true,
//   "pages": 320,
//   "description": "The Wow",
//   "download_pdf": "https://example.com/hp1.pdf",
//   "paid": false,
//   "category": "Fantasy",
//   "title": "Title Nine",
//   "authors": {
//     "id": 6,
//     "name": "J.K. Rowling",
//     "country": "United Kingdom",
//     "author_type": "Fantasy",
//     "about_author": "British author, best known for the Harry Potter series.",
//     "social_links": {
//       "twitter": "https://twitter.com/jk_rowling"
//     },
//     "number_of_books": 7
//   }
// }

const BookPage = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Booktable | undefined>(undefined);

  const [openRow, setOpenRow] = useState<number | null>(null);
  const [openAuthor, setopenAuthor] = useState<string | null>(null);
  const [playingStates, setPlayingStates] = useState<{ [key: number]: boolean }>({});
  
  // const [isEditing, setisEditing] = useState(false);

  // Supabase function
  const { GetBooks, DeleteBook } = useSupabase();

  
  const [books, setBooks] = useState< Booktable[] >([]);
  // const [error, setError] = useState("");
  // const [coverPreview, setCoverPreview] = useState<string>("");


  const audioRefs = useRef<HTMLAudioElement[]>([]);

  

  const togglePlayPause = (index:number) => {
    const audio = audioRefs.current[index];
    if (!audio) return;

    if (playingStates[index]) {
      console.log('playingStates :>> ', playingStates);
      audio.pause();
      audio.currentTime = 0; // Reset to start
    } else {
      audio.play();
    }

    // Update the playing state
    setPlayingStates((prevStates) => ({
      ...prevStates, [index]: !prevStates[index],
    }));
  };

  
  const handleEdit = (rowIndex: number) => {
    console.log("object :>> ", books[rowIndex]);
    setEditingBook(books[rowIndex]);
    setShowForm(true);
  };
  
  const handleDelete = async (index: number) => {
    console.log("object :>> ", books[index]);
    console.log('object :>> ', books.filter((b) => b.id !== books[index].id));
    setBooks(books.filter((b) => b.id !== books[index].id))
    // authors.filter((author) => author.id !== id)
    const bookToDelete = { ...books[index], id: books[index].id ? parseInt(books[index].id) : undefined, author_id: books[index].author_id ? parseInt(books[index].author_id) : 0, rating: books[index].rating ?? 0, audio: books[index].audio ?? "", paid: books[index].paid ?? false };
    const {res, errmsg} = await DeleteBook(bookToDelete)
    if (errmsg) {
      alert(errmsg);
    }
    if (res) {
      alert("file Deleted")
    }
  };

    const filteredBooks = books.filter(
      (book) =>
        (book.title ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (book.authors?.name ?? "").toLowerCase().includes(search.toLowerCase())
    ) ?? [];
  //! Api section
  const toggleRow = (index: number) => {
    setOpenRow(openRow === index ? null : index);
  };
  const toggleRowAuthor = (index: string) => {
    setopenAuthor(openAuthor === index ? null : index);
    console.log("index :>> ", index);
  };

  const [durations, setDurations] = useState<{ [key: number]: number }>({});
   const handleLoadedMetadata = (index: number, event: React.SyntheticEvent<HTMLAudioElement>) => {
    const duration = (event.target as HTMLAudioElement).duration;
    setDurations((prevDurations) => ({
      ...prevDurations,
      [index]: duration,
    }));
  };

  // Format duration (seconds to minutes:seconds)
  const formatDuration = (duration: number) => {
    if (!duration || isNaN(duration)) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const getdata = async () => {
      const booksRes = await GetBooks();
      if (booksRes.errmsg) {
        alert(booksRes.errmsg);
      }
      if (booksRes.res) {
        setBooks(booksRes.res);
      }
    };

    getdata();
  }, []);

  return (
    <div className="p-2 md:p-6">
      {showForm ? (
        <BooksForm setShowForm={setShowForm} editBook={editingBook ? { ...editingBook, id: String(editingBook.id) } : undefined} />
      ) : (
        <div className="">
          <h1 className="text-2xl font-bold mb-4">Manage Books</h1>

          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded-lg w-full sm:w-1/3"
            />
            <button
              onClick={() => {
                setShowForm(true);
                setEditingBook(undefined);
                // setCoverPreview("");
              }}
              className="bg-blue-500 text-white p-2 md:px-4 md:py-2 rounded-lg flex items-center hover:bg-blue-700"
            >
              <Plus className="md:mr-2" />{" "}
              <p className="hidden md:block">Add Book</p>
            </button>
          </div>

          <div className="hidden md:block">
              
            <table className="w-full bg-white  ">
              <thead>
                <tr className="bg-gray-200">
                  {/* <th>ID</th> */}
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Language</th>
                  <th>Category</th>
                  <th>Pages</th>
                  <th>Description</th>
                  <th>Paid</th>
                  <th>Audio</th>
                  <th>Actions</th>
                </tr>
              </thead>
            {books 
              ?
              <tbody>

                { filteredBooks.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.book_cover}
                        width={40}
                        height={40}
                        alt=""
                      />
                    </td>

                    <td className="text-center">{item.title}</td>

                    <td className="p-2 relative transition-transform duration-300 w-32">
                      <button
                        onClick={() => toggleRowAuthor(item.title)}
                        className="text-black hover:bg-gray-50 bg-gray-200 px-3 py-1 rounded-md"
                      >
                        {item.authors ? item.authors.name : "Not Found"}
                      </button>
                      {/* Smooth Collapsible Div */}
                      <div
                        className={`overflow-hidden   ${
                          openAuthor === item.title
                            ? "max-h-40  opacity-100"
                            : "max-h-0 opacity-0 "
                        }`}
                      >
                        <div
                          className={`absolute z-10 w-44 bg-white p-2 mt-2 shadow-sm shadow-gray-400 rounded-md`}
                        >
                          <ul>
                            <li>name: {item.authors ? item.authors.name : "" }</li>
                            <li>type: {item.authors ? item.authors.author_type : "" }</li>
                            <li>books: {item.authors ? item.authors.number_of_books: "" }</li>
                            <li>country: {item.authors ? item.authors.country : "" }</li>
                          </ul>
                        </div>
                      </div>
                    </td>

                    <td className="text-center">{item.language}</td>

                    <td className="text-center">{item.category}</td>

                    <td className="text-center">{item.pages}</td>

                    <td className="p-2 w-36 relative transition-transform duration-300">
                      <button
                        onClick={() => toggleRow(index)}
                        className="text-black hover:bg-gray-50 bg-gray-200 px-3 py-1 rounded-md"
                      >
                        {openRow === index ? "Hide" : "Show"} Details
                      </button>
                      {/* Smooth Collapsible Div */}
                      <div
                        className={`overflow-hidden  ${
                          openRow === index
                            ? "max-h-40  opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div
                          className={`w-44 absolute z-10 bg-white p-2 mt-2 shadow-sm shadow-gray-400 rounded-md`}
                        >
                          {item.description}
                        </div>
                      </div>
                    </td>

                    <td>{item.paid ? <p> Paid </p> : <p>Free</p>}</td>

                    <td className=" flex flex-col items-center">
                      <div className="flex ">
                        <audio  
                          ref={(e) => { if (e) audioRefs.current[index] = e; }}
                          src={item.audio}
                          onLoadedMetadata={(e) => handleLoadedMetadata(index, e)}
                          />
                        <div className="flex flex-row gap-1 ">
                        <button onClick={() => togglePlayPause(index)}>
                          {playingStates[index] 
                            ? 
                            <Pause />
                            :
                            <Play />
                          }
                        </button>
                        </div>
                      </div>
                        {formatDuration(durations[index])}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        className="text-blue-500 mr-3"
                        onClick={() => handleEdit(index)}
                      >
                        <Edit />
                      </button>
                      <button onClick={() => handleDelete(index)} className="text-red-500" >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              :
              <p>loading ...</p>
            }
            </table>
          </div>
          {/* Mobile View  */}
          <div className="lg:hidden md:hidden flex flex-col space-y-4">
            {filteredBooks.map((item, index) => (
              <div key={item.id} className="bg-white rounded-lg p-4 shadow-md">
                <div className="flex items-center gap-4">
                  <img
                    src={item.book_cover}
                    className="w-16 h-16 rounded-md"
                    alt=""
                  />
                  <div>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="text-gray-500">
                      {item.authors?.name || "Unknown"}
                    </p>
                  </div>
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  <strong>Language:</strong> {item.language}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Category:</strong> {item.category}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Pages:</strong> {item.pages}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Paid:</strong> {item.paid ? "Paid" : "Free"}
                </p>

                {/* Collapsible Description */}
                <button
                  onClick={() => toggleRow(index)}
                  className="mt-2 w-full bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded-md text-sm"
                >
                  {openRow === index ? "Hide" : "Show"} Details
                </button>
                {openRow === index && (
                  <div className="mt-2 bg-gray-100 p-2 rounded-md transition-all">
                    {item.description}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex justify-between items-center">
                  <button
                    className="text-blue-500 flex items-center gap-2"
                    onClick={() => handleEdit(index)}
                  >
                    <Edit /> Edit
                  </button>
                  <button className="text-red-500 flex items-center gap-2" onClick={() => handleDelete(index)}>
                    <Trash2 /> Delete
                  </button>
                  {/* <button className="bg-gray-200 px-3 py-1 rounded-md flex items-center gap-2" onClick={() => handleEdit(index)}>
                    <Play /> Play Audio
                  </button> */}
                  <div className="flex ">
                        <audio  
                          ref={(e) => { if (e) audioRefs.current[index] = e; }}
                          src={item.audio}
                          onLoadedMetadata={(e) => handleLoadedMetadata(index, e)}
                          />
                        <div className="flex flex-row gap-1 ">
                        <button onClick={() => togglePlayPause(index)}>
                          {playingStates[index] 
                            ? 
                            <Pause />
                            :
                            <Play />
                          }
                        </button>
                        </div>
                        {formatDuration(durations[index])}
                      </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default BookPage;
