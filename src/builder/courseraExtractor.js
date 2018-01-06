import axios from 'axios';
import queue from 'async/queue';
import _ from 'lodash';

const ALL_COURSE_SEARCH_URL =
  'https://www.coursera.org/api/catalogResults.v2';
const INDIVIDUAL_COURSE_SEARCH_URL = courseSlug =>
  `https://www.coursera.org/learn/${courseSlug}`;
const API_BATCH_WINDOW_SIZE = 100;

const getNumberOfCourses = async () => {
  const response = await axios.get(ALL_COURSE_SEARCH_URL, {
    params: {
      q: 'search',
      query: ' ',
    },
  });
  return response.data.paging.total;
};

const getCoursesByBatch = async (startIndex) => {
  const response = await axios.get(ALL_COURSE_SEARCH_URL, {
    params: {
      q: 'search',
      query: ' ',
      start: startIndex,
      limit: API_BATCH_WINDOW_SIZE,
      debug: false,
      fields: 'debug,executedQuery,courseId,domainId,onDemandSpecializationId,relatedQueries,specializationId,subdomainId,suggestions,courses.v1(courseStatus,name,photoUrl,primaryLanguages,slug,partnerIds),onDemandSpecializations.v1(courseIds,launchedAt,logo,name,slug,partnerIds,primaryCourseIds),specializations.v1(name,shortName,logo,courseIds,display,partnerIds,primaryCourseIds),partners.v1(name)',
      includes: 'courseId,domainId,onDemandSpecializationId,relatedQueries,specializationId,subdomainId,suggestions,courses.v1(partnerIds),onDemandSpecializations.v1(partnerIds,primaryCourseIds),specializations.v1(partnerIds,primaryCourseIds)',
    },
  });
  return response.data;
};

const getIndividualCourse = async (courseSlug) => {
  const response = await axios.get(INDIVIDUAL_COURSE_SEARCH_URL(courseSlug));
  const htmlResponse = response.data;

  const courseInfoMatcher = 'window.App={.*?};';
  let courseInfo = htmlResponse.match(courseInfoMatcher)[0];
  courseInfo = courseInfo.substring(11).slice(0, -1);
  return JSON.parse(courseInfo);
};

const getCourseSlugsFromAllCourses = allCourses => allCourses
  .map(courseBatch => courseBatch.linked['courses.v1'])
  .reduce((courses, currentCourses) => courses.concat(currentCourses), [])
  .map(course => course.slug);

export const getAllCourses = async () => {
  const numberOfCourses = await getNumberOfCourses();
  console.log(`Number of Courses: ${numberOfCourses}`);

  const allCourses = [];
  const taskQueue = queue(async (task, callback) => {
    await new Promise(resolve => setTimeout(() => resolve(), 100));
    const result = await task();
    allCourses.push(result);
    callback();
  }, 20);

  const batchIndexes = _.range(0, numberOfCourses, API_BATCH_WINDOW_SIZE);

  return new Promise((resolve) => {
    batchIndexes.forEach(startIndex =>
      taskQueue.push(() => getCoursesByBatch(startIndex), () => {}));
    taskQueue.drain = () => resolve(allCourses);
  });
};

export const getInvididualCourses = async (courseSlugs) => {
  const allIndividualCourses = [];
  const taskQueue = queue(async (task, callback) => {
    await new Promise(resolve => setTimeout(() => resolve(), 100));
    const result = await task();
    allIndividualCourses.push(result);
    callback();
  }, 20);

  return new Promise((resolve) => {
    courseSlugs.forEach(courseSlug =>
      taskQueue.push(() => getIndividualCourse(courseSlug), () => {}));
    taskQueue.drain = () => resolve(allIndividualCourses);
  });
};

export const extractFromCoursera = async () => {
  const allCourses = await getAllCourses();

  const allCourseSlugs = getCourseSlugsFromAllCourses(allCourses);
  const individualCourses = await getInvididualCourses(allCourseSlugs);

  return { allCourses, individualCourses };
};
