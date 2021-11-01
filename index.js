const axios = require('axios')
const cheerio = require('cheerio');
const { response } = require('express');
const express = require('express')
const PORT = 3000;
const app = express();

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'Guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },
    {
        name: 'BBC',
        address: 'https://www.bbc.com/news/science-environment-56837908',
        base: 'https://www.bbc.com'
    },
    {
        name: 'CNN',
        address: 'https://edition.cnn.com/specials/world/cnn-climate',
        base: 'https://edition.cnn.com'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        $('a:contains("climate")', html).each(function() {
            const title = $(this).text();
            const url = $(this).attr("href");

            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
              });
        })
    })
})

app.get("/", function (req, res) {
    res.json("Welcome to my Web Scraping tool");
})

app.get("/news", function (req, res) {
    res.json(articles);
});


app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));