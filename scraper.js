import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

async function scrapeStory(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'load' });

        const title = await page.$eval('h1', element => element.textContent.trim());
        const author = await page.$eval('h2', element => element.textContent.trim());
        const genre = await page.$$eval('.genres span', elements => elements.map(span => span.textContent.trim()));
        const story = await page.$$eval('.story_text p', paragraphs => paragraphs.map(p => p.textContent.trim()));

        const data = { title, author, genre, story };
        const file_name = title.split(' ').join('_') + '.json';
        const directory = 'stories';


        const json_data = JSON.stringify(data, null, 2);
        const file_path = path.join(directory, file_name);

        fs.writeFileSync(file_path, json_data);
        console.log(`Story data for '${title}' has been successfully scraped and stored in '${file_name}'`);

        await browser.close();
    } catch (error) {
        console.error('Error scraping story:', error);
    }
}

const urls = [
    'https://www.libraryofshortstories.com/onlinereader/there-will-come-soft-rains',
    'https://www.libraryofshortstories.com/onlinereader/the-veldt'
];

urls.forEach(url => {
    scrapeStory(url);
});
