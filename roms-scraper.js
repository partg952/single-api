const Cheerio = require("cheerio");
const request = require("requests");
const express = require("express");
const app = express.Router();



app.get("/api/search",(req,res)=>{
    let keyword = req.query['q'];
    const dataarr = []
    let page_number = req.query['page']
    request(`https://www.gamulator.com/search.php?currentpage=${page_number}&search_term_string=${keyword}`).on('data',(data)=>{
       const $ = Cheerio.load(data);
       $('img.img-fluid').each(function(i){
           dataarr.push({

              img: 'https://www.gamulator.com'+$(this).attr('src')  ,
              title:$('h5.card-title').eq(i).text(),
              url:$('div.card > a').eq(i).attr('href'),
	      rating:$('div.opis').eq(i).text(),
	      console_name:$('div.hideOverflow > a').eq(0).text()
            })
       })
       res.send(dataarr);
    })
})

app.get("/api/download",(req,res)=>{
    let url = req.query['url'];
    request("https://www.gamulator.com"+url+"/download/fast").on('data',(data)=>{
        const $ = Cheerio.load(data);
        res.send($('a.download_link').attr("href"))
    })


})

app.get("/api/details",(req,res)=>{
    let url = req.query.url;
    let dataarr = {};
    const details = [];
    request("https://www.gamulator.com"+url).on('data',data=>{
        const $ = Cheerio.load(data);
        $("table.table > tbody > tr").each(function(i){
          details.push($("table.table > tbody > tr").eq(i).text())
        })
        dataarr = {
          title:$('div.naslov > h1').text(),
          image:$("img.img-fluid").attr("src"),
          desc:$("div.desc > p").text(),
          details:details
        }
        res.send(dataarr);
    })

})

app.get("/api/homepage/:page",(req,res)=>{
    let page = req.params.page;
    const dataarr = [];
    request('https://www.gamulator.com/roms/psp?currentpage='+page).on('data',data=>{
        const $ = Cheerio.load(data);
        $('img.img-fluid').each(function(i){
            dataarr.push({
               img: 'https://www.gamulator.com'+$(this).attr('src')  ,
               title:$('h5.card-title').eq(i).text(),
               url:$('div.card > a').eq(i).attr('href'),
	           rating:$('div.opis').eq(i).text(),
               console_name:$('div.hideOverflow > a').eq(0).text()
             })
        })
        res.send(dataarr);

    })
})

app.get("/api/consoles",(req,res)=>{
  request("https://www.gamulator.com/roms").on("data",data=>{
    const $ = Cheerio.load(data);
    const dataarr = [];
    $("div.thumbnail-home").each(function(i){
      dataarr.push({
        image:$("div.thumbnail-home > a > img").eq(i).attr("src"),
        name:$("div.thumbnail-home > div > a > h3.centarce").eq(i).text()
      })
    })
    res.send(dataarr);
  })
})
const romsScraper = app;
module.exports = romsScraper;
