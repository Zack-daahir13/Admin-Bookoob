import { useEffect, useState } from "react";
import { Category } from "../utils/Dbtypes";
import useSupabase from "../hooks/useSupabase";
import { CheckCircle, XCircle } from "lucide-react";
import { useUploader } from "../utils/useUploader";

interface categoryFormsprops {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
  CurrentCategory:{ 
    setCategories : React.Dispatch<React.SetStateAction<Category[]>>
    categories: Category[]
  };
  Editing:{
    setediting: React.Dispatch<React.SetStateAction<Category | undefined>>;
    editing: Category | undefined;
  }
}

export default function CategoryForm({
  setShowForm,
  CurrentCategory,
  Editing,
}:categoryFormsprops) {
  const [newCategory, setNewCategory] = useState<Category>
  (
    Editing.editing ??
    {
      category_name: "",
      category_image: "",
    }
  );
  const [isLoading, setisLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string>(
    Editing.editing ? Editing.editing.category_image : ""
  );
  const { NewCategory, UpdateCategory } = useSupabase();
  const { UploadImage } = useUploader();

  useEffect(() => {
    if (Editing.editing?.id) {
      setNewCategory(Editing.editing)
      setCoverPreview(Editing.editing.category_image)
    }
  }, [Editing.editing]);

  // Handle form submission
  const handleAddCategory = async () => {
    // console.log("Called");
    setisLoading(true);
    // console.log('newCategory :>> ', newCategory);
    if (newCategory.category_name && newCategory.category_image) {
      const supabaseUrlObj = await UploadImage("category", newCategory.category_image, newCategory.category_name)
      if (!supabaseUrlObj) {
        setisLoading(false);
        return
      }

      const submitData:Category = {
        category_image: supabaseUrlObj.publicUrl,
        category_name: newCategory.category_name,
      }

      if(Editing.editing?.id){
        const {res, errmsg} = await UpdateCategory(Editing.editing.id!, submitData)
        if(errmsg){
          alert(errmsg)
          setisLoading(false);
          return
        }
        if(res){
          alert(`${submitData.category_name} Updated`)
        }
      } else{
        const {res, errmsg} = await NewCategory(submitData);
        if(errmsg){
          alert(errmsg)
          setisLoading(false);
          return
        }
        if(res){
          alert(`${submitData.category_name} uploaded`)
          setCoverPreview("")
          setNewCategory({
            category_name: "",
            category_image: "",
          })
        }
      }
      const imageUrl = URL.createObjectURL(newCategory.category_image);
      CurrentCategory.setCategories([...CurrentCategory.categories, { category_name: newCategory.category_name, category_image: imageUrl }]);
      setNewCategory({ category_name: "", category_image: null });
    }
    setisLoading(false);
    console.log('categories :>> ', CurrentCategory.categories);
  };


return (
  <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
    <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
    <input
      type="text"
      placeholder="Category Name"
      value={newCategory.category_name}
      onChange={(e) =>
        setNewCategory({ ...newCategory, category_name: e.target.value })
      }
      className="border p-2 rounded-lg w-full mb-4"
    />
    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        setNewCategory({ ...newCategory, category_image: e.target.files?.[0] || null })
      }
      className="border p-2 rounded-lg w-full mb-4"
    />
    {coverPreview && (
          <img
            src={coverPreview}
            alt="Cover Preview"
            className="w-20 h-20 mb-3"
          />
        )}
    <div className="flex justify-end space-x-3">
      <button
        onClick={() => {
          setCoverPreview("")
          setShowForm(false)
          Editing.setediting({
            category_name: "",
            category_image: "",
          })
          setNewCategory({
            category_name: "",
            category_image: "",
          })
        }}
        className="bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <XCircle className="mr-2" />
        Cancel
      </button>
      {isLoading 
      ?
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          Uploading...
        </button>
      :

        <button
          onClick={handleAddCategory}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <CheckCircle className="mr-2" />
          Add
        </button>
      }
    </div>
  </div>
);
}
