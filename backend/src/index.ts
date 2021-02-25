import express from 'express';
import router from './modules/app';
import knex from './database/knex';
import { Model } from 'objection';

Model.knex(knex);

export const app = express();

app.set("PORT", process.env.PORT || 3000);

if(process.env.NODE_ENV == 'development'){
    const morgan = require('morgan');
    app.use(morgan('dev'));
}

app.use(express.json());
app.use('/', router);

export const server = app.listen(app.get('PORT'), () => {
    console.log(`app running on port ${app.get('PORT')}`);
});