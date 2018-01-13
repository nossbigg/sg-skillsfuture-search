import axios from 'axios';
import queue from 'async/queue';
import _ from 'lodash';

const ALL_COURSE_SEARCH_URL =
  'https://www.myskillsfuture.sg/services/tex/individual/course-search';
const INDIVIDUAL_COURSE_SEARCH_URL =
  'https://www.myskillsfuture.sg/services/tex/individual/course-detail';
const API_BATCH_WINDOW_SIZE = 24;

const getNumberOfCourses = async () => {
  const response = await axios.get(ALL_COURSE_SEARCH_URL);
  return response.data.grouped.GroupID.matches;
};

const getCoursesByBatch = async (startIndex) => {
  const response = await axios.get(ALL_COURSE_SEARCH_URL, {
    params: { start: startIndex },
  });
  return response.data;
};

const getIndividualCourse = async (courseId) => {
  const response = await axios.get(INDIVIDUAL_COURSE_SEARCH_URL, {
    params: { action: 'get-course-by-ref-number', refNumber: courseId },
  });
  return response.data;
};

const getCourseIdsFromAllCourses = allCourses => allCourses
  .map(courseBatch => courseBatch.grouped.GroupID.groups)
  .reduce((groups, currentGroup) => groups.concat(currentGroup), [])
  .map(group => group.doclist.docs)
  .reduce((collect, currentCourses) => collect.concat(currentCourses), [])
  .map(course => course.Course_Ref_No);

export const getAllCourses = async (logger) => {
  const numberOfCourses = await getNumberOfCourses();
  logger.log(`Number of Courses: ${numberOfCourses}`);

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

export const getInvididualCourses = async (courseIds) => {
  const allIndividualCourses = [];
  const taskQueue = queue(async (task, callback) => {
    await new Promise(resolve => setTimeout(() => resolve(), 100));
    const result = await task();
    allIndividualCourses.push(result);
    callback();
  }, 20);

  return new Promise((resolve) => {
    courseIds.forEach(courseId =>
      taskQueue.push(() => getIndividualCourse(courseId), () => {}));
    taskQueue.drain = () => resolve(allIndividualCourses);
  });
};

export const extractFromSkillsfuture = async (logger) => {
  const allCourses = await getAllCourses(logger);

  const allCourseIds = getCourseIdsFromAllCourses(allCourses);
  const individualCourses = await getInvididualCourses(allCourseIds);

  return { allCourses, individualCourses };
};
