import { Author, Book, Category } from "../utils/Dbtypes";
import supabase from "../utils/supabase";

type resulttype = {
  res?: any[] | null
  errmsg: string | null | unknown
}


const useSupabase =  () => {
  // Functions 
  async function GetBooks():Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("books").select("*, authors(*)")
    if (error?.message) {
      return {res: null, errmsg: error.message}
    }

    if(data){
      if (data.length == 0) {
        return {
          res:null, errmsg: "Not Found"
        }
      }
      return {res: data, errmsg: null}
    }
    return { res: null, errmsg: "Unexpected error" };
  
    } catch (error: unknown) {
      return {res:null, errmsg:error}
    }
  }

  async function GetCategories():Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("category").select("*")
    if (error?.message) {
      return {res: null, errmsg: error.message}
    }

    if(data){
      if (data.length == 0) {
        return {
          res:null, errmsg: "Not Found"
        }
      }
      return {res: data, errmsg: null}
    }
    return { res: null, errmsg: "Unexpected error" };
  
    } catch (error: unknown) {
      return {res:null, errmsg:error}
    }
  }
  
  async function GetAuthors():Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("authors").select("*")
    if (error?.message) {
      return {res: null, errmsg: error.message}
    }
    if(data){
      if (data.length == 0) {
        return {
          res:null, errmsg: "Not Found"
        }
      }
      return {res: data, errmsg: null}
    }
    return { res: null, errmsg: "Unexpected error" };
  
    } catch (error: unknown) {
      return {res:null, errmsg:error}
    }
  }

  async function Authorslist():Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("authors").select("id, name")
    if (error?.message) {
      return {res: null, errmsg: error.message}
    }
    if(data){
      if (data.length == 0) {
        return {
          res:null, errmsg: "Not Found"
        }
      }
      return {res: data, errmsg: null}
    }
    return { res: null, errmsg: "Unexpected error" };
  
    } catch (error: unknown) {
      return {res:null, errmsg:error}
    }
  }
  
  async function GetUsers():Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("users").select("*")
    if (error?.message) {
      return {res: null, errmsg: error.message}
    }
    if(data){
      if (data.length == 0) {
        return {
          res:null, errmsg: "Not Found"
        }
      }
      return {res: data, errmsg: null}
    }
    return { res: null, errmsg: "Unexpected error" };
  
    } catch (error: unknown) {
      return {res:null, errmsg:error}
    }
  }


  async function GetOneBook(id:string):Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("books").select("*").eq("id", id)
      if (error?.message) {
        return {res: null, errmsg: error.message}
      }
      if(data){
        if (data.length == 0) {
          return {
            res:null, errmsg: "Not Found"
          }
        }
        return {res: data, errmsg: null}
      }
      return { res: null, errmsg: "Unexpected error" };
    } catch (error: unknown) {
      return {res:null, errmsg:error}
    }
  }

  async function GetOneAuthor(id:string):Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("authors").select("*").eq("id", id)
      if (error?.message) {
        return {res: null, errmsg: error.message}
      }
      if(data){
        if (data.length == 0) {
          return {
            res:null, errmsg: "Not Found"
          }
        }
        return {res: data, errmsg: null}
      }
  
      return { res: null, errmsg: "Unexpected error" };
    } catch (error: unknown) {
      return {res:null, errmsg:error}
    }
  }

  async function GetOneUser(id:string):Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("users").select("*").eq("id", id)
      if (error?.message) {
        return {res: null, errmsg: error.message}
      }
      if(data){
        if (data.length == 0) {
          return {
            res:null, errmsg: "Not Found"
          }
        }
        return {res: data, errmsg: null}
      }
  
      return { res: null, errmsg: "Unexpected error" };
    } catch (error: unknown) {
      return {res:null, errmsg:error}
    }
  }
  
  async function DeleteBook(bookdata:Book):Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("books").delete().eq("id", bookdata.id).select()
      if (error?.message) {
        return {res: null, errmsg: error.message}
      }
      if(data){
        if (data.length == 0) {
          return {
            res:null, errmsg: "Not Found"
          }
        }
        if (bookdata.book_cover) {
          await DeleteFile(bookdata.book_cover);
        }
        return {res: data, errmsg: null}
      }
  
      return { res: null, errmsg: "Unexpected error" };
    } catch (error) {
      return {res:null, errmsg:error}
    }
  }

  async function DeleteFile(pathto: string){
    const filePath = pathto.split("/storage/v1/object/public/bookoob/"); // Extract file path
    console.log('filePath :>> ', filePath);
    const { error } = await supabase.storage
      .from("bookoob")
      .remove([...filePath]);
    if (error) {
      throw new Error(`Image deletion failed: ${error.message}`);
    }
  }

  async function DeleteAuthor(authorData:Author):Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("authors").delete().eq("id", authorData.id).select()
      if (error?.message) {
        return {res: null, errmsg: error.message}
      }
      if(data){
        if (data.length == 0) {
          return {
            res:null, errmsg: "Not Found"
          }
        }
        await DeleteFile(authorData.avator)
        return {res: data, errmsg: null}
      }
  
      return { res: null, errmsg: "Unexpected error" };
    } catch (error) {
      return {res:null, errmsg:error}
    }
  }


  async function UpdateAuthor(id:string, Newdata:Author):Promise<resulttype> {
    try {
      const {data , error} = await supabase.from("authors").update(Newdata).eq("id", id).select()
      if (error?.message) {
        return {res: null, errmsg: error.message}
      }
      if(data){
        if (data.length == 0) {
          return {
            res:null, errmsg: "Not Found"
          }
        }
        return {res: data, errmsg: null}
      }
      return { res: null, errmsg: "Unexpected error" };
    } catch (error:unknown) {
      return {res:null, errmsg:error}
    }
  }
  
  async function UpdateBook(id:string, Newdata:Book):Promise<resulttype> {
    try {
      const {data , error} = await supabase.from("books").update(Newdata).eq("id", id).select()
      if (error?.message) {
        return {res: null, errmsg: error.message}
      }
      if(data){
        if (data.length == 0) {
          return {
            res:null, errmsg: "Not Found"
          }
        }
        return {res: data, errmsg: null}
      }
      return { res: null, errmsg: "Unexpected error" };
    } catch (error:unknown) {
      return {res:null, errmsg:error}
    }
  }

  async function NewBooks(NewData: Book):Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("books").insert(NewData).select()
      if (error?.message) {
        return {res: null, errmsg: error.message}
      }
      if(data){
        return {res: data, errmsg: null}
      }
  
      return { res: null, errmsg: "Unexpected error" };
    } catch (error: unknown) {
      return {res:null, errmsg:error}
    }
  }

  async function NewAuthor(NewData: Author):Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("authors").insert(NewData).select()
      if (error?.message) {
        return {res: null, errmsg: error.message}
      }
      if(data){
        return {res: data, errmsg: null}
      }
  
      return { res: null, errmsg: "Unexpected error" };
    } catch (error: unknown) {
      return {res:null, errmsg:error}
    }
  }

  async function GetReviews():Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("reviews").select("*")
    if (error?.message) {
      return {res: null, errmsg: error.message}
    }

    if(data){
      if (data.length == 0) {
        return {
          res:null, errmsg: "Not Found"
        }
      }
      return {res: data, errmsg: null}
    }
    return { res: null, errmsg: "Unexpected error" };
  
    } catch (error: unknown) {
      return {res:null, errmsg:error}
    }
  }

  async function NewCategory(NewData: Category):Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("category").insert(NewData).select()
      if (error?.message) {
        return {res: null, errmsg: error.message}
      }
      if(data){
        return {res: data, errmsg: null}
      }
  
      return { res: null, errmsg: "Unexpected error" };
    } catch (error: unknown) {
      return {res:null, errmsg:error}
    }
  }

  async function UpdateCategory(id:string, Newdata:Category):Promise<resulttype> {
    try {
      const {data , error} = await supabase.from("category").update(Newdata).eq("id", id).select()
      if (error?.message) {
        return {res: null, errmsg: error.message}
      }
      if(data){
        if (data.length == 0) {
          return {
            res:null, errmsg: "Not Found"
          }
        }
        return {res: data, errmsg: null}
      }
      return { res: null, errmsg: "Unexpected error" };
    } catch (error:unknown) {
      return {res:null, errmsg:error}
    }
  }

  async function DeleteCategory(categorydata:Category):Promise<resulttype> {
    try {
      const {data, error} = await supabase.from("category").delete().eq("id", categorydata.id).select()
      if (error?.message) {
        return {res: null, errmsg: error.message}
      }
      if(data){
        if (data.length == 0) {
          return {
            res:null, errmsg: "Not Found"
          }
        }
        await DeleteFile(categorydata.category_image)
        return {res: data, errmsg: null}
      }
  
      return { res: null, errmsg: "Unexpected error" };
    } catch (error) {
      return {res:null, errmsg:error}
    }
  }

  return { 
    Authorslist,
    
    NewAuthor,
    NewBooks,
    NewCategory,
    
    GetBooks,
    GetOneBook,
    GetOneAuthor,
    GetAuthors,
    GetOneUser,
    GetUsers,
    GetCategories,
    GetReviews,
    
    DeleteAuthor,
    DeleteBook,
    DeleteCategory,
    
    UpdateCategory,
    UpdateAuthor,
    UpdateBook,
    
  };
}

export default useSupabase;