const cheerio = require("cheerio");
const requests = require("requests");
const express = require("express");
const app = express.Router();


app.get('/home',(req,res)=>{

  requests("https://moviestars.to/").on('data',data=>{
      const $ = cheerio.load(data);
      const arr = [];
      $("div.flw-item").each(function(i){
          arr.push({
            img:$("div.flw-item > div.film-poster > img").eq(i).attr("data-src"),
            title:$("div.flw-item > div.film-detail > h3.film-name > a").eq(i).attr("title"),
            url:$("div.flw-item > div.film-detail > h3.film-name > a").eq(i).attr("href"),
          })
        })
        res.send(arr);
  })


})
app.get("/watch",(req,res)=>{
    let id = req.query['id'];
    res.send(`https://123movieshd.stream/m_applet.php?q=mv&id=${id}&server=2`)
})
app.post('/info',(req,res)=>{
    let arr = [];
    let desc_arr = [];
    let url = req.body.url;
    requests(url).on("data",data=>{
        const $ = cheerio.load(data);
        $("div.row-line").each(function(i){
            desc_arr.push($(this).text().trim());
        })
        arr.push({
            poster:$("img.film-poster-img").attr("src"),
            id:$("div.detail_page-watch").attr("data-id"),
            title:$("h2.heading-name").text(),
            desc:desc_arr,
            summary:$("div.description").text().trim(),
            cover:$("div.cover_follow").css("background-image")

        })
        res.send(arr);
    })
})

app.get("/search",(req,res)=>{
    let keyword = req.query['q'];
    let arr = [];
    requests("https://moviestars.to/search/"+keyword.replace(" ","-")).on("data",data=>{
        const $ = cheerio.load(data);
        $("div.flw-item").each(function(i){
            arr.push({
            img:$("div.flw-item > div.film-poster > img").eq(i).attr("data-src"),
            title:$("div.flw-item > div.film-detail > h3.film-name > a").eq(i).attr("title"),
            url:$("div.flw-item > div.film-detail > h3.film-name > a").eq(i).attr("href"),
            })
        })
        res.send(arr);
    })
})
const movieRouter = app;
module.exports = movieRouter;
