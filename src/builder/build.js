import fs from 'fs-extra';
import { extractFromSkillsfuture } from './skillsfutureExtractor';
import { extractFromCoursera } from './courseraExtractor';

const SKILLSFUTURE_ALL_COURSES_DUMP_FILE = './datadumps/skillsfuture-allCourses.json';
const SKILLSFUTURE_INDIVIDUAL_COURSES_DUMP_FILE = './datadumps/skillsfuture-individualCourses.json';
const COURSERA_ALL_COURSES_DUMP_FILE = './datadumps/coursera-allCourses.json';
const COURSERA_INDIVIDUAL_COURSES_DUMP_FILE = './datadumps/coursera-individualCourses.json';

const writeToFile = (filename, json) => fs.outputJson(filename, json);
const readFromFile = filename => fs.readJson(filename);

const readAndStoreFromSkillsfuture = async () => {
  let allCourses = {};
  let individualCourses = {};

  // const { allCourses, individualCourses } = { allCourses: 3, individualCourses: 4 };

  try {
    const results = await extractFromSkillsfuture();
    // eslint-disable-next-line prefer-destructuring
    allCourses = results.allCourses;
    // eslint-disable-next-line prefer-destructuring
    individualCourses = results.individualCourses;
  } catch (err) {
    throw new Error('Error occured while downloading from Skillsfuture site');
  }

  try {
    await writeToFile(SKILLSFUTURE_ALL_COURSES_DUMP_FILE, allCourses);
    await writeToFile(SKILLSFUTURE_INDIVIDUAL_COURSES_DUMP_FILE, individualCourses);
  } catch (err) {
    throw new Error('Error saving Skillsfuture data');
  }
};

const readAndStoreFromCoursera = async () => {
  let allCourses = {};
  let individualCourses = {};

  try {
    const results = await extractFromCoursera();
    // eslint-disable-next-line prefer-destructuring
    allCourses = results.allCourses;
    // eslint-disable-next-line prefer-destructuring
    individualCourses = results.individualCourses;
  } catch (err) {
    console.log(err);
    throw new Error('Error occured while downloading from Coursera site');
  }

  try {
    await writeToFile(COURSERA_ALL_COURSES_DUMP_FILE, allCourses);
    await writeToFile(COURSERA_INDIVIDUAL_COURSES_DUMP_FILE, individualCourses);
  } catch (err) {
    throw new Error('Error saving Coursera data');
  }
};

const build = async () => {
  try {
    console.log('Pulling data from SkillsFuture and Coursera...');
    await Promise.all([
      readAndStoreFromSkillsfuture(),
      readAndStoreFromCoursera(),
    ]);
  } catch (err) {
    console.log(`Build failed with error: ${err}`);
  }
};

export default build;

build();
