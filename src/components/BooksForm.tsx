import { Author, Category, Book } from "../utils/Dbtypes";
import { useEffect, useState } from "react";
import useSupabase from "../hooks/useSupabase";
import { useUploader } from "../utils/useUploader";
import { X } from "lucide-react";
import { Editor } from "./RichTextEditor";
// import { Editor } from "./RichTextEditor";

// id integer generated always as identity not null,
// book_cover text null,
// author_id integer not null,
// rating numeric(3, 2) null default 0.0,
// language character varying(50) null,
// audio boolean null default false,
// pages integer null,
// description text null,
// download_pdf text null,
// paid boolean null default false,
// category character varying(100) null,
// title text null,

interface Booktable {
  id?: string;
  title?: string;
  book_cover?: string;
  author_id?: string;
  authors?: Author;
  language: string | undefined;
  category: string | undefined;
  audio?: string;
  pages?: number;
  description?: string;
  paid?: boolean;
  download_pdf?: string;
}

interface BookForms {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing?: boolean;
  editBook?: Booktable | undefined;
}

export const BooksForm = ({
  setShowForm,
  isEditing = false,
  editBook,
}: BookForms) => {
  const [isLoading, setisLoading] = useState(false);
  const [Categories, setCategories] = useState<Category[] | null>(null);
  const [selectedcategory, setselectedcategory] = useState<string>(
    editBook?.category ? editBook.category : ""
  );
  
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedBooktype, setselectedBooktype] = useState<string>(
    editBook?.paid ? "paid" : "free"
  );
  const [error, setError] = useState("");
  const [isopen, setIsopen] = useState<boolean>(false);
  const [coverPreview, setCoverPreview] = useState<string>(
    editBook?.book_cover ? editBook?.book_cover : ""
  );
  const [audiofile, setAudiofile] = useState<File>();
  const [file, setFile] = useState<File>();
  const [pdf, setpdf] = useState<string>(editBook?.download_pdf ?? "");
  const [search, setSearch] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<number>(editBook?.author_id ? Number(editBook.author_id) : 0);

  // Filter authors based on search input
  const filteredAuthors =
    authors.filter((author) =>
      author.name.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

  // const [books, setBooks] = useState<Book>();
  // const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newBook, setNewBook] = useState<Booktable>(
    !editBook
      ? {
          title: "",
          book_cover: "",
          authors: undefined,
          author_id: "",
          language: "",
          category: "",
          audio: "",
          pages: 0,
          description: "",
          paid: true,
          download_pdf: "",
        }
      : {
          id: editBook.author_id,
          title: editBook?.title,
          book_cover: editBook.book_cover,
          authors: editBook.authors,
          author_id: editBook.author_id,
          language: editBook.language,
          category: editBook.category,
          audio: editBook.audio,
          pages: editBook.pages,
          description: editBook.description,
          paid: editBook.paid,
          download_pdf: editBook.download_pdf
        }
  );

  //Hooks
  const { GetCategories, Authorslist, NewBooks, UpdateBook } = useSupabase();
  const { UploadImage, UploadAudio } = useUploader();

  //function
  const handleCategory = (selected: string) => {
    setselectedcategory(selected);
  };
  

  const handleAudio = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('file :>> ', file);
    if (file && file.type == "audio/mpeg") {
      setAudiofile(file);
      // await UploadAudio(file,"test")
    } else {
      alert("Please upload a valid Mp3 file.");
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // image/png
    // image/jpeg
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
    if (file?.type == "image/png" || file?.type == "image/jpeg") {
      setFile(file);
      console.log("file :>> ", file);
    } else {
      alert("Wrong Format, png and jpeg only");
    }
  };

  const handleAddOrUpdateBook = async () => {
    setisLoading(true);
    console.log('pdf :>> ', pdf);
    // Validate required fields for new books
    if (!editBook && (!newBook.title || !selectedAuthor || !selectedcategory || !file || !audiofile)) {
      setError("Please fill all required fields!");
      setisLoading(false);
      return;
    }
  
    try {
    let imgUrl = editBook?.book_cover; // Use existing image URL if editing
    let audioUrl = editBook?.audio; // Use existing audio URL if editing
    // let editpdf = editBook?.pdf;

    console.log('imgUrl :>> ', imgUrl);
    console.log('audioUrl :>> ', audioUrl);
    // Upload new image if provided
    if (file) {
      const uploadedImg = await UploadImage("bookcover", file, newBook.title || "");
      if (!uploadedImg?.publicUrl) {
        alert("Failed to upload Image");
        setisLoading(false);
        return;
      }
      imgUrl = uploadedImg.publicUrl;
    }
    // Upload new audio if provided
    if (audiofile) {
      const uploadedAudio = await UploadAudio(audiofile, newBook.title || "");
      if (!uploadedAudio?.publicUrl) {
        alert("Failed to upload Audio");
        setisLoading(false);
        return;
      }
      audioUrl = uploadedAudio.publicUrl;
    }
      // Prepare book data
      const ispaid = selectedBooktype === "paid";
      const submitdata: Book = {
        title: newBook.title || "",
        category: selectedcategory,
        description: newBook.description,
        language: newBook.language,
        pages: newBook.pages,
        audio: audioUrl || "",
        paid: ispaid,
        rating: 0,
        book_cover: imgUrl,
        author_id: selectedAuthor,
        download_pdf: pdf, // Add PDF URL if applicable
      };
  
      console.log("Submitting data:", submitdata);
  
      // Update or add book
      if (editBook) {
        const { res, errmsg } = await UpdateBook(editBook.id!, submitdata);
        if (errmsg) {
          alert(errmsg);
          setisLoading(false);
          return;
        }
        if (res) {
          alert(`${submitdata.title} updated successfully!`);
        }
      } else {
        const { res, errmsg } = await NewBooks(submitdata);
        if (errmsg) {
          alert(errmsg);
          setisLoading(false);
          return;
        }
        if (res) {
          alert(`${submitdata.title} uploaded successfully!`);
        }
      }
  
      // Reset form state
      setNewBook({
        id: Date.now().toString(),
        title: "",
        book_cover: "",
        author_id: "",
        authors: undefined,
        language: "",
        category: "",
        audio: "",
        pages: 0,
        description: "",
        paid: ispaid,
      });
  
      setError("");
    } catch (error) {
      console.error("Error in handleAddOrUpdateBook:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setisLoading(false);
    }
  };

  const handleRadioChange = (value: string) => {
    setselectedBooktype(value);
  };

  useEffect(() => {
    const getdata = async () => {
      const categoriesRes = await GetCategories();
      if (categoriesRes.errmsg) {
        alert(categoriesRes.errmsg);
      }
      if (categoriesRes.res) {
        setCategories(categoriesRes.res);
      }

      const authorList = await Authorslist();
      if (authorList.errmsg) {
        alert(authorList.errmsg);
      }
      if (authorList.res) {
        setAuthors(authorList.res);
      }
    };

    getdata();
  }, []);

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">
          {editBook ? "Edit Book" : "Add New Book"}
        </h2>
        {error && <p className="text-red-500">{error}</p>}
        {/* TitleInput */}
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full mb-3"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        {/* AuthorInput */}
        <div className="relative w-full mb-3">
          {/* Input Field */}
          <input
            type="text"
            value={search} // Show selected author if chosen
            onChange={(e) => {
              setSearch(e.target.value);
              setIsopen(true); // Show dropdown when typing
            }}
            onFocus={() => {
              setIsopen(true);
            }}
            placeholder={editBook?.authors?.name ?? "Select Author"}
            className="border p-2 w-full "
          />
          {isopen && filteredAuthors.length > 0 && (
            <div className="absolute z-10 left-0 mt-1 w-full bg-white shadow-md rounded-md border border-gray-200 max-h-40 overflow-y-auto">
              <ul>
                {filteredAuthors.map((author, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedAuthor(Number(author.id));
                      setSearch(author.name); // Reset search after selection
                      setIsopen(false);
                    }}
                  >
                    {author.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <input
          type="text"
          placeholder="Language"
          className="border p-2 w-full mb-3"
          value={newBook.language}
          onChange={(e) => setNewBook({ ...newBook, language: e.target.value })}
        />

        <p className="text-lg ">Choose Category:</p>
        <div className="flex flex-wrap flex-1 gap-2 mb-2 shadow-gray-400 shadow-sm rounded-lg">
          {Categories
            ?  Categories?.map((item) => (
                <button
                  className={`${
                    selectedcategory == item.category_name
                      ? "bg-blue-500 text-white"
                      : ""
                  } cursor-pointer rounded-2xl overflow-hidden p-2 m-1`}
                  onClick={() => handleCategory(item.category_name)}
                >
                  <h3 className="text-lg font-bold">
                    {item.category_name}
                  </h3>
                </button>
              ))
            : ""}
        </div>

        <div className="flex flex-col gap-2 justify-between">
          {/* Upload audio */}
          <div className="flex flex-row flex-wrap gap-3 items-center">
            <input
              type="file"
              onChange={handleAudio}
              style={{ display: "none" }}
              id={`audio`}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => document.getElementById(`audio`)?.click()}
            >
              Upload Audio
            </button>
            {audiofile ? (
              <audio src={URL.createObjectURL(audiofile)} controls />
            ) : (
              <p>no file</p>
            )}
          </div>
          {/* Upload Cover */}
          <div>
            <input
              type="file"
              className="hidden w-0"
              onChange={handleCoverChange}
              id={`cover`}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-2"
              onClick={() => document.getElementById(`cover`)?.click()}
            >
              Upload Image
            </button>
            {coverPreview && (
              <div className="relative">
                <X className="absolute border" onClick={() => {
                  setCoverPreview("")
                  setFile(undefined)
                }}/>
                <img
                  src={coverPreview}
                  className="w-40 "
                />
              </div>
            )}
          </div>
        </div>

        
        <p className="text-lg ">Number of words:</p>
        <input
          type="number"
          placeholder="Enter pages number"
          className="border p-2 w-full mb-3"
          value={newBook.pages}
          onChange={(e) =>
            setNewBook({ ...newBook, pages: parseInt(e.target.value) })
          }
        />
        <div className="py-3">
          <p className="text-lg ">Book type:</p>
          <div className="flex flex-row gap-2">
            <div className="flex flex-row gap-x-2">
              <input
                type="radio"
                id="paid"
                value="paid"
                checked={selectedBooktype === "paid"}
                onChange={(e) => handleRadioChange(e.target.value)}
              />
              <label htmlFor="paid" className=" font-semibold ">
                paid
              </label>
            </div>
            <div className="flex flex-row gap-x-2">
              <input
                type="radio"
                id="free"
                value="free"
                checked={selectedBooktype === "free"}
                onChange={(e) => handleRadioChange(e.target.value)}
              />
              <label htmlFor="free" className=" font-semibold ">
                free
              </label>
            </div>
          </div>
        </div>
        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-3"
          value={newBook.description}
          onChange={(e) =>
            setNewBook({ ...newBook, description: e.target.value })
          }
        />

        <p className="text-lg ">Pdf:</p>
        <div className="flex-1 mb-2">
          <Editor setpdf={setpdf} pdf={pdf}/>
        </div>


        <div className="flex justify-between">
          <button
            onClick={() => setShowForm(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          {isLoading ? (
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
              Uploading...
            </button>
          ) : (
            <button
              onClick={handleAddOrUpdateBook}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {isEditing ? "Update" : "Add"}
            </button>
          )}
        </div>
      </div>

      

    </div>
  );
};
