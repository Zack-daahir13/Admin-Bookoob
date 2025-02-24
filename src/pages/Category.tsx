import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import useSupabase from "../hooks/useSupabase";
import { Category } from "../utils/Dbtypes";
import CategoryForm from "../components/CategoryForm";


const CategoryPage = () => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setediting] = useState<Category | undefined>(undefined);
  const [showForm, setshowForm] = useState(false);
  const { GetCategories, DeleteCategory } = useSupabase();

  // Handle search
  const filteredCategories = categories.filter((category) =>
    category.category_name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle delete category
  

  const handleDelete = async (index: number) => {
    console.log("object :>> ", categories[index]);
    const {res, errmsg} = await DeleteCategory(categories[index])
    if (errmsg) {
      alert(errmsg);
    }
    if (res) {
      alert("file Deleted")
      setCategories(categories.filter((category) => category.id !== categories[index].id));
    }
  };

  const handleEdit = (rowData: Category) => {
    if (showForm) {
      setshowForm(false)
    }
    setediting(rowData)
    setshowForm(true)
  }

  useEffect(() => {
    const getdata = async () => {
      const {res, errmsg} = await GetCategories();
      if (res) {
        setCategories(res)
      }
      if(errmsg){
        alert(errmsg)
      }
    }
    getdata();
  }, [GetCategories]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      {/* Top Bar (Search + Add Button) */}
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-1/3"
        />
        <button
          onClick={() => setshowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="mr-2" />
          Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {showForm && <CategoryForm
        setShowForm={setshowForm}
        CurrentCategory={{categories, setCategories}}
        Editing={{ editing: editing || ({} as Category), setediting }}

        />}

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category, index) => (
              <tr key={category.id} className="border-t">
                <td className="py-3 px-4">{category.category_name}</td>
                <td className="py-3 px-4">
                  <img src={category.category_image} alt={category.category_name} className="w-12 h-12 rounded-lg" />
                </td>
                <td className="py-3 px-4 text-center">
                  <button className="text-blue-500 mr-3" onClick={() => handleEdit(category)}>
                    <Edit />
                  </button>
                  <button onClick={() => handleDelete(index)} className="text-red-500">
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryPage;
