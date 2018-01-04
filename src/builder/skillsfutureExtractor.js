import axios from 'axios';

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

const generateBatchIndexes = (numberOfCourses) => {
  const indexes = [];

  for (let startIndex = 0; startIndex <= numberOfCourses; startIndex += API_BATCH_WINDOW_SIZE) {
    indexes.push(startIndex);
  }

  return indexes;
};

const getCourseIdsFromAllCourses = allCourses => allCourses
  .map(courseBatch => courseBatch.grouped.GroupID.groups)
  .reduce((courses, currentCourses) => courses.concat(currentCourses), [])
  .map(course => course.doclist.docs[0].Course_Ref_No);

export const getAllCourses = async () => {
  const numberOfCourses = await getNumberOfCourses();

  const batchIndexes = generateBatchIndexes(numberOfCourses);
  return Promise.all(batchIndexes.map(startIndex =>
    getCoursesByBatch(startIndex)));
};

export const getInvididualCourses = async courseIds =>
  Promise.all(courseIds.map(courseId =>
    getIndividualCourse(courseId)));

export const extractFromSkillsfuture = async () => {
  const allCourses = await getAllCourses();

  const allCourseIds = getCourseIdsFromAllCourses(allCourses);
  const individualCourses = await getInvididualCourses(allCourseIds);

  return { allCourses, individualCourses };
};
