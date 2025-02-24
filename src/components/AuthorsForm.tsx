import React, { useEffect, useState } from "react";
import { Author } from "../utils/Dbtypes";
import useSupabase from "../hooks/useSupabase";
import { Upload, X } from "lucide-react";
import { useUploader } from "../utils/useUploader";

interface AuthorFormsprops {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
  
  CurrentAuthors:{ 
    setAuthors : React.Dispatch<React.SetStateAction<Author[]>>
    Authors: Author[]
  };
  Editing:{
    setediting: React.Dispatch<React.SetStateAction<Author | undefined>>;
    editing: Author
  }
}

export default function AuthorsForm({
  CurrentAuthors,
  Editing,
  setShowForm,
  }:AuthorFormsprops) {

  // const [search, setSearch] = useState("");
  // const [showForm, setShowForm] = useState(false);
  // const [authors, setAuthors] = useState<Author[]>();

  const [newAuthor, setNewAuthor] = useState<Author>(
    Editing.editing ??
    {
    name: "",
    avator: "",
    country: "",
    author_type: "",
    number_of_books: 0,
    about_author: "",
    social_links: { facebook: "", X: "" },
  });

  const [newPlatform, setNewPlatform] = useState("");
  const { UploadImage } = useUploader();
  const { NewAuthor, UpdateAuthor } = useSupabase();
  const [isLoading, setisLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [coverPreview, setCoverPreview] = useState<string>(
    Editing.editing ? Editing.editing.avator : ""
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAuthor({ ...newAuthor, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imgfile = e.target.files[0];
      setFile(imgfile)
      const imageUrl = URL.createObjectURL(imgfile);
      setCoverPreview(imageUrl)
      setNewAuthor({ ...newAuthor, avator: imageUrl });
    }
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setNewAuthor((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
    }));
  };
  useEffect(() => {
   console.log('object :>> ', Editing);
  
 }, []);
  const addNewPlatform = () => {
    if (newPlatform && !newAuthor.social_links?.[newPlatform]) {
      setNewAuthor((prev) => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [newPlatform]: "",
        },
      }));
      setNewPlatform("");
    }
  };

  const addAuthor = async () => {
    setisLoading(true);
    
    if(newAuthor.name && newAuthor.about_author && newAuthor.country ){
      let imgUrl = Editing.editing?.avator; // Use existing image URL if editing
      // if(!supabaseUrlObj){
      //   setisLoading(false)
      //   return;
      // }

      if (file) {
        const supabaseUrlObj = await UploadImage("author", file, newAuthor.name)
        if (!supabaseUrlObj?.publicUrl) {
          alert("Failed to upload Image");
          setisLoading(false);
          return;
        }
        imgUrl = supabaseUrlObj.publicUrl;
      }

      const submitData:Author={
        avator: imgUrl,
        name: newAuthor.name,
        about_author: newAuthor.about_author,
        author_type: newAuthor.author_type,
        number_of_books: newAuthor.number_of_books,
        country: newAuthor.country,
        social_links: newAuthor.social_links
      }

      if(Editing.editing.id){
        const {res, errmsg} = await UpdateAuthor(Editing.editing.id.toString(), submitData )
        if(errmsg){
          alert(errmsg)
          setisLoading(false);
          return
        }
        if(res){
          alert(`Author ${submitData.name} Updated`);
        }
      } else {

        const {res, errmsg} = await NewAuthor(submitData);
        if(errmsg){
          alert(errmsg)
          setisLoading(false);
          return
        }
        if(res){
          alert(`Author ${submitData.name} uploaded`)
          setCoverPreview("")
        }
      }
      CurrentAuthors.setAuthors([...CurrentAuthors.Authors, newAuthor]);
      setNewAuthor({
        id: 1,
        name: "",
        avator: "",
        country: "",
        author_type: "",
        number_of_books: 0,
        about_author: "",
        social_links: { facebook: "", X: "" }
      });
      setisLoading(false)
    }
    else{
      setisLoading(false)
      alert("Fill Fields")
    }
  };

      
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2 mx-auto relative">
          <button onClick={() => 
          {
              setShowForm(false)
              Editing.setediting(undefined)
          }
            } className="absolute top-4 right-4 text-red-500">
            <X size={24} />
          </button>
          <h2 className="text-xl font-semibold mb-4">Add New Author</h2>
          <input type="text" name="name" placeholder="Author Name" value={newAuthor.name} onChange={handleInputChange} className="w-full border p-2 rounded-lg mb-2" />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="imageUpload" />
          <label htmlFor="imageUpload" className="cursor-pointer bg-gray-200 p-2 rounded-lg flex items-center justify-center mb-2">
            <Upload className="mr-2" /> Upload Image
          </label>
          {coverPreview && (
          <img
            src={coverPreview}
            alt="Cover Preview"
            className="w-20 h-20 mb-3"
          />
        )}
          <input type="text" name="country" placeholder="Country" value={newAuthor.country} onChange={handleInputChange} className="w-full border p-2 rounded-lg mb-2" />
          <input type="text" name="author_type" placeholder="Author Type" value={newAuthor.author_type} onChange={handleInputChange} className="w-full border p-2 rounded-lg mb-2" />
          <input type="number" name="number_of_books" placeholder="Number of Books" value={newAuthor.number_of_books} onChange={handleInputChange} className="w-full border p-2 rounded-lg mb-2" />
          <textarea name="about_author" placeholder="About Author" value={newAuthor.about_author} onChange={handleInputChange} className="w-full border p-2 rounded-lg mb-2"></textarea>

          {/* <input type="text" name="social_links" placeholder="Social Link" value={JSON.stringify(newAuthor.social_links)} onChange={handleInputChange} className="w-full border p-2 rounded-lg mb-4" /> */}
          <div className="w-full border p-2 rounded-lg mb-2">
        <h3 className="text-lg font-semibold mb-2">Social Links</h3>
        {/* {Object.entries(newAuthor.social_links)} */}
        {Object.entries(newAuthor.social_links ?? {}).map(([platform, link]) => (
          <div key={platform} className="flex items-center mb-2">
            <label className="w-24">
              {platform.charAt(0).toUpperCase() + platform.slice(1)}:
            </label>
            <input
              type="text"
              value={link}
              onChange={(e) => handleSocialLinkChange(platform, e.target.value)}
              className="flex-1 border p-1 rounded-lg"
              placeholder={`Enter ${platform} link`}
            />
          </div>
        ))}

      <div className="flex items-center mb-2">
          <input
            type="text"
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="flex-1 border p-1 rounded-lg"
            placeholder="Add new platform (e.g., Instagram)"
          />
          <button
            onClick={addNewPlatform}
            className="ml-2 bg-blue-500 text-white px-4 py-1 rounded-lg"
          >
            Add
          </button>
        </div>
          {/* <button onClick={addAuthor} className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">Submit</button> */}


        </div>
          {isLoading 
            ?
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
              >
                Uploading...
              </button>
            :

              <button
                onClick={addAuthor}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
              >
                Add
              </button>
            }
        </div>
  );
}
// function UploadImage(arg0: string, category_image: any, category_name: any) {
//   throw new Error("Function not implemented.");
// }

