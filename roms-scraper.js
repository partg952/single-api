const Cheerio = require("cheerio");
const request = require("requests");
const express = require("express");
const app = express.Router();



app.get("/api/search",(req,res)=>{
    let keyword = req.query['q'];
    let dataarr = []
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
    let dataarr = [];
    request("https://www.gamulator.com"+url).on('data',data=>{
        const $ = Cheerio.load(data);
        dataarr.push($('img.img-fluid').attr("src"))
        dataarr.push($('div.naslov > h1').text())
        $('table.table > tbody > tr').each(function(i){
            dataarr.push($(this).text())
        })
    })
    res.send(dataarr);
})

app.get("/api/homepage/:page",(req,res)=>{
    let page = req.params.page;
    let dataarr = [];
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
const romsScraper = app;
module.exports = romsScraper;
