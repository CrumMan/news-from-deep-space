// this is the messenger componet 4. I will be using placeholders to build the controller. Please add your componet additions to this.
import { fetchCombination } from "../../admin/bot-config";
export async function messengerResopnse(message:string){


    let response = null;
    //use placeholder for message to be "Daily Photograph"
    // let keywords = Componet2(message)
    //placeholder output Is below
    const keywords = ['eb1f1d5d-ab13-4888-aaec-e63bafafbe90', '3c600a65-102b-4ea8-aca1-827f2e4804d7'];
   
    // let keyword_combo = await Componet3(keywords)
    // placeholder output is below:
    const keyword_combo = {"id":"3ed23766-49e3-4ac1-a164-8bdf35facb2c","fk_keyword1":"eb1f1d5d-ab13-4888-aaec-e63bafafbe90","fk_keyword2":"3c600a65-102b-4ea8-aca1-827f2e4804d7","type":"api","result":"testApi","api_key":"v9p8C8r4mLO73rj5RLn0hRROIGYMpyVBlXhL335n","word":"url","created_at":"2026-06-04 00:09:59.947916+00"}
   
    //Componet 5 calls the api_config
    //const api_words = await componet5(keyword_combo.id)
    //placeholder is below
    const api_words = {"id":"8fafe567-993d-4e21-9781-6e34aaac2fba","type":"photo","title":"change","subtitle":"change","text":"change","imagelinkword":"change","created_at":"2026-06-08 04:54:22.621905"};
    const api_result = await runApiAndGetResult(api_words.id)
    if (api_words.type = "photo"){
        response = `<a href=(ADD THE LINK FOR THE DYNAMIC PHOTO PAGE/${api_words.id})><img src=${api_result.api_words.imageLinkWord} alt=${api_result.api_words.title}></a>`
    }
    if (api_words.type = "link"){
        response = `<a href=(ADD THE LINK FOR THE DYNAMIC PHOTO PAGE/${api_words.id})>`
    }
    return response;
    
}
   async function runApiAndGetResult (combinationId: string) {

     const data = await fetchCombination(combinationId);
      console.log("DB DATA:", data);
     if (!data) {
     throw new Error("No API build found for this combinationId");
   }
   
     const apiUrl = data.api_key
       ? `${data.result}?${data.api_key}`
       : data.result;
   
      console.log("API URL:", apiUrl);
     const response = await fetch(apiUrl);
     if (!response.ok) {
       throw new Error("External API failed or is loading... Please reload API manually after ten seconds.");
     }
   
     const result = await response.json();
     return result;
   };