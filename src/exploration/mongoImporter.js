import fs from 'fs-extra';
import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'coursera_skillsfuture_search';

const SKILLSFUTURE_ALL_COURSES_DUMP_FILE = './datadumps/skillsfuture-allCourses.json';
const SKILLSFUTURE_INDIVIDUAL_COURSES_DUMP_FILE = './datadumps/skillsfuture-individualCourses.json';
const COURSERA_ALL_COURSES_DUMP_FILE = './datadumps/courseraExtractor-allCourses.json';
const COURSERA_INDIVIDUAL_COURSES_DUMP_FILE = './datadumps/courseraExtractor-individualCourses.json';

const readFromFile = filename => fs.readJson(filename);

const addCollectionToDb = (db, collectionName, data) =>
  db.collection(collectionName).insertMany(data);

const importToMongo = (logger) => {
  logger.log('Starting import...');

  MongoClient.connect(url, async (err, client) => {
    logger.log('Connected successfully to server');

    const db = client.db(dbName);

    await Promise.all([
      addCollectionToDb(db, 'skillsfuture_all_courses', await readFromFile(SKILLSFUTURE_ALL_COURSES_DUMP_FILE)),
      addCollectionToDb(db, 'skillsfuture_individual_courses', await readFromFile(SKILLSFUTURE_INDIVIDUAL_COURSES_DUMP_FILE)),
      addCollectionToDb(db, 'coursera_all_courses', await readFromFile(COURSERA_ALL_COURSES_DUMP_FILE)),
      addCollectionToDb(db, 'coursera_individual_courses', await readFromFile(COURSERA_INDIVIDUAL_COURSES_DUMP_FILE)),
    ]);

    client.close();
  });

  logger.log('Import complete!');
};

export default importToMongo;
