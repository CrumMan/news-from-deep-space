// this is the messenger componet 4. I will be using placeholders to build the controller. Please add your componet additions to this.
export function messengerResopnse(message:string){
    let response = null;
    //use placeholder for message to be "Daily Photograph"
    // let keywords = Componet2(message)
    //placeholder output Is below
    const keywords = ['eb1f1d5d-ab13-4888-aaec-e63bafafbe90', '3c600a65-102b-4ea8-aca1-827f2e4804d7'];
    // const keyword_combo = Componet3(keywords)
    // placeholder output is below:
    const keyword_combo = {"id":"3ed23766-49e3-4ac1-a164-8bdf35facb2c","fk_keyword1":"eb1f1d5d-ab13-4888-aaec-e63bafafbe90","fk_keyword2":"3c600a65-102b-4ea8-aca1-827f2e4804d7","type":"api","result":"testApi","api_key":"v9p8C8r4mLO73rj5RLn0hRROIGYMpyVBlXhL335n","word":"url","created_at":"2026-06-04 00:09:59.947916+00"}
    if (keyword_combo.type == 'api')
        if(keyword_combo.api_key=null){
            response = `{type:photo,word:${keyword_combo.word}, api:${keyword_combo.result}?api_key=${keyword_combo.api_key}`
        }
        response = `{type:photo,word:${keyword_combo.word}, api:${keyword_combo.result}?api_key=${keyword_combo.api_key}`
    if(keyword_combo.type == 'link'){
        response = `type:link, word:${keyword_combo.word}, api:${keyword_combo.result}`
    }
    // let keyword_combo = await Componet3(keywords)
    return response;
}
