const axios =  require("axios")
const fs = require("fs")
const cheerio = require("cheerio");
const xlsx = require("xlsx")

const pageUrl = "https://www.amazon.com/s?k=phone&page=2&crid=18EUYBSP7O1SQ&qid=1702535235&sprefix=phon%2Caps%2C280&ref=sr_pg_2";

const pageUrl2 = "https://www.amazon.com/s?k=laptops&crid=3B6Z8KEULQEWM&sprefix=laptops%2Caps%2C612&ref=nb_sb_noss_1"

const getData = async () => {
    try {
        const response = await axios.get(pageUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const data  =  response.data;
        console.log(data); // Log the response data
        fs.writeFileSync("data.txt", response.data);
    } catch (e) {
        console.error("Error: ", e.message);
    }
}

// getData();


    const pageData = fs.readFileSync("data.txt",)

    const $ = cheerio.load(pageData.toString());

   const titles  =  $(".a-size-medium.a-color-base.a-text-normal");

    
   const products = []

 titles.each((index,element)=>{
    const title = $(element).text();
    
    products.push(title)
 })

 const prices  = $(".a-price-whole")

 const pricesArray = []

 prices.each((index,element)=>{
    const price = $(element).text();
    pricesArray.push(price)

 })

 const ratings = $('a.a-popover-trigger.a-declarative i');

 const ratingArray = [];

 ratings.each((index,element)=>{
    const rating = $(element).text();
    ratingArray.push(rating)
 })

 
 const InStock = $(".a-button.a-button-primary.a-button-icon")

 const InStockArray = [];

 InStock.each((index,ele)=>{
    const inStock = $(ele).text();
    if(inStock !== "Add to cart"){
        InStockArray.push("Out of Stock")
    }else {
        InStockArray.push("Stock is Available")
    }
 })

 const productjson = products.map((title,index)=>{
        return{
            title,
            price:pricesArray[index],
            rating:ratingArray[index],
            Avaiable:InStockArray[index]
        }
 })

 console.log(productjson)




 fs.writeFileSync("products.json",JSON.stringify(productjson));


 const workbook = xlsx.utils.book_new();

 const sheet = xlsx.utils.json_to_sheet(productjson);

 xlsx.utils.book_append_sheet(workbook,sheet,"Products_Sheet")

 xlsx.writeFile(workbook,"products.xlsx")