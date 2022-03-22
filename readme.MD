This assignment was written in next.js framework, while using mongoDB, The data are a fit to NoSql sice it data that not going to change or annelize on runtime.

Mongo Shema - 2 collection
    - clients
    - transaction

To start this prject you nedd to run docker-comp[ose up from root dir and open the web browser in http://localhost:3000

I tried to write most of code "in house" with few depencies.

To see the project or reset data please run http://localhost:3000/api/seed, to view the source code ./nextJs/src/pages/api/seed.ts

Thanks and hope you'll enjoy

@TODO
    - GUI for CUD new clients
    - add react router to allow paganation, currently it can be done via url or browser GUI, it should be done smart to allow bookmarking
    