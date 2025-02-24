import supabase from "./supabase";

export function useUploader() {
  async function UploadImage(storeto:"bookcover" | "category" | "author",
    file:File, nameImg:string) {
    try {
      if (!file) return

      let filepath = "";
      switch (storeto) {
        case "bookcover":
          filepath = `bookcover/${nameImg}`;
          break;
        case "category":
          filepath = `category/${nameImg}`;
          break;
        case "author":
          filepath = `author/${nameImg}`;
          break;
        default:
          alert("storeto not found")
          return;
      }
      // const filePath = `produc/${props.product_name}/${Date.now()}-${
      //   file.name
      // }`; // Unique file name
      
      const { error } = await supabase.storage
        .from("bookoob")
        .upload(filepath, file);
        console.log("file :>> ", file);
      if (error) {
        alert(`Image upload failed for ${file.name}: ${error.message}`)
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from("bookoob")
        .getPublicUrl(filepath);

      // return supabase Url
      return publicUrlData;
    } catch (error) {
      console.log("error :>> ", error);
      alert(error)
      return null;
    }
  }

  const UploadAudio = async (file:File, audioName:string) => {
    try {
      console.log('file :>> ', file);
      const filepath = `bookAudio/${audioName}`;
      if (!file) return
      const { error } = await supabase.storage
        .from("bookoob")
        .upload(filepath, file);
        console.log("file :>> ", file);
      // return url
      const { data: publicUrlData } = supabase.storage
        .from("bookoob")
        .getPublicUrl(filepath);
  
      if (error) {
        alert(`Audio upload failed for ${file.name}: ${error.message}`)
        return null;
      }
      return publicUrlData;
    } catch (error) {
      console.log("error :>> ", error);
      alert(error)
      return null;
    }
  }

  return{
    UploadImage,
    UploadAudio
  }
}

