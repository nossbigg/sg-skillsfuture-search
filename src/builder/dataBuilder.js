import fs from 'fs-extra';
import { extractFromSkillsfuture } from './extractor/skillsfutureExtractor';
import { extractFromCoursera } from './extractor/courseraExtractor';
import { generateCourseraStore } from './generator/courseraStoreGenerator';
import { generateSkillsfutureStore } from './generator/skillsfutureStoreGenerator';
import generateMergedStore from './generator/skillsfutureCourseraStoreGenerator';

const SKILLSFUTURE_ALL_COURSES_DUMP_FILE = './datadumps/skillsfuture-allCourses.json';
const SKILLSFUTURE_INDIVIDUAL_COURSES_DUMP_FILE = './datadumps/skillsfuture-individualCourses.json';
const COURSERA_ALL_COURSES_DUMP_FILE = './datadumps/courseraExtractor-allCourses.json';
const COURSERA_INDIVIDUAL_COURSES_DUMP_FILE = './datadumps/courseraExtractor-individualCourses.json';

const COURSERA_STORE_FILE = './datastores/courseraExtractor.json';
const SKILLSFUTURE_STORE_FILE = './datastores/skillsfutureExtractor.json';
const MERGED_STORE_FILE = './datastores/mergedStore.json';

const writeToFile = (filename, json) => fs.outputJson(filename, json);

const readAndStoreFromSkillsfutureSite = async (logger) => {
  let allCourses = {};
  let individualCourses = {};

  try {
    const results = await extractFromSkillsfuture(logger);
    // eslint-disable-next-line prefer-destructuring
    allCourses = results.allCourses;
    // eslint-disable-next-line prefer-destructuring
    individualCourses = results.individualCourses;
  } catch (err) {
    throw new Error('Error occurred while downloading from Skillsfuture site');
  }

  try {
    await writeToFile(SKILLSFUTURE_ALL_COURSES_DUMP_FILE, allCourses);
    await writeToFile(SKILLSFUTURE_INDIVIDUAL_COURSES_DUMP_FILE, individualCourses);
  } catch (err) {
    throw new Error('Error saving Skillsfuture data');
  }
};

const readAndStoreFromCourseraSite = async (logger) => {
  let allCourses = {};
  let individualCourses = {};

  try {
    const results = await extractFromCoursera(logger);
    // eslint-disable-next-line prefer-destructuring
    allCourses = results.allCourses;
    // eslint-disable-next-line prefer-destructuring
    individualCourses = results.individualCourses;
  } catch (err) {
    throw new Error('Error occurred while downloading from Coursera site');
  }

  try {
    await writeToFile(COURSERA_ALL_COURSES_DUMP_FILE, allCourses);
    await writeToFile(COURSERA_INDIVIDUAL_COURSES_DUMP_FILE, individualCourses);
  } catch (err) {
    throw new Error('Error saving Coursera data');
  }
};

const build = async (logger) => {
  try {
    logger.log('Pulling data from SkillsFuture and Coursera...');
    await Promise.all([
      readAndStoreFromSkillsfutureSite(logger),
      readAndStoreFromCourseraSite(logger),
    ]);

    logger.log('Generating course stores from dumps...');
    await generateCourseraStore(
      COURSERA_ALL_COURSES_DUMP_FILE,
      COURSERA_INDIVIDUAL_COURSES_DUMP_FILE,
      COURSERA_STORE_FILE,
    );
    await generateSkillsfutureStore(
      SKILLSFUTURE_ALL_COURSES_DUMP_FILE,
      SKILLSFUTURE_INDIVIDUAL_COURSES_DUMP_FILE,
      SKILLSFUTURE_STORE_FILE,
      logger,
    );

    logger.log('Generating final merged store...');
    await generateMergedStore(
      logger,
      COURSERA_STORE_FILE,
      SKILLSFUTURE_STORE_FILE,
      MERGED_STORE_FILE,
    );

    logger.log('Done!');
  } catch (err) {
    logger.log(`Build failed with error: ${err}`);
  }
};

export default build;
