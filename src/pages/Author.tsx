import { useEffect, useState } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import useSupabase from "../hooks/useSupabase";
import { Author } from "../utils/Dbtypes";
import AuthorsForm from "../components/AuthorsForm";



const AuthorPage = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [editing, setediting] = useState<Author>();

  const { GetAuthors, DeleteAuthor } = useSupabase();

  const handleDelete = async (index: number) => {
    console.log(index);
    console.log("object :>> ", authors[index]);
    const {res, errmsg} = await DeleteAuthor(authors[index])
    if (errmsg) {
      alert(errmsg);
    }
    if (res) {
      alert("file Deleted")
      setAuthors(authors.filter((author) => author.id != authors[index].id));
    }
  };

  const filteredAuthors = authors?.filter((author) =>
    author.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const handleEdit = (index:number)=>{
    setediting(authors[index])
    setShowForm(true)
  }
  useEffect(() => {
    const getdata = async () => {
      const {res , errmsg} = await GetAuthors();
      if (errmsg) {
        alert(errmsg);
      }
      if (res) {
        setAuthors(res);
      }
    };
    getdata()
  }, [GetAuthors]);

  return (
    <div className="p-6 min-h-screen overflow-auto bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center">Manage Authors</h1>

      {showForm ? (
        <AuthorsForm setShowForm={setShowForm} 
        Editing={{ editing: editing || ({} as Author), setediting }}

        CurrentAuthors={{Authors:authors, setAuthors}}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <input type="text" placeholder="Search authors..." value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded-lg w-full sm:w-1/3" />
            <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
              <Plus className="mr-2" /> Add Author
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAuthors.map((author, index) => (
              <div key={author.id} className="bg-white p-4 rounded-lg shadow-md">
                <img src={author.avator} alt={author.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-bold">{author.name}</h3>
                <p className="text-sm text-gray-600">{author.country}</p>
                <p className="text-sm text-gray-600">{author.author_type}</p>
                <p className="text-sm text-gray-600">Books: {author.number_of_books}</p>
                <p className="text-sm text-gray-500 mt-2">{author.about_author}</p>
                <a href={typeof author.social_links === 'string' ? author.social_links : '#'} className="text-blue-500 text-sm">Social Link</a>
                <div className="flex justify-between mt-3">
                      <button className="text-green-500" onClick={()=>handleEdit(index)}>
                        <Edit />
                      </button>
                      <button onClick={() => handleDelete(index)} className="text-red-500">
                        <Trash2 />
                      </button>
                    </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AuthorPage;