### Suggest name for kids base on some web
The project using package `cheerio` scrape some webs about suggest new born baby like:<br/>
https://xemtencon.com<br/>
https://tenchocon.vn<br/>

### Prerequisite
~~~
npm i
~~~
### Process internal data

* Filter raw data fields (first, mid, last) from folder `name-raw` to folder `name-final`
~~~
node app/internal/filter-raw.js
~~~

* Generate full name by input first-name and last-name and save as to file `data/name-temp.txt`
~~~
node app/internal/generate-full-name.js [first-name] [last-name]
~~~

### Scrape
Scrape some webs, data base from file `data/name-temp.txt` has from above step and result is text in folder `data`
~~~
node app/scrape/tenchocon.js
node app/scrape/xemtencon.js
~~~
