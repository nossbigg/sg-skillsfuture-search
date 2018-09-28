import fs from 'fs-extra';
import axios from 'axios';
import queue from 'async/queue';

const writeToFile = (filename, json) => fs.outputJson(filename, json);
const readFromFile = filename => fs.readJson(filename);

const extractCoursesFromAllCoursesDump = dump =>
  dump
    .map(courseBatch => courseBatch.grouped.GroupID.groups)
    .reduce((groups, currentGroup) => groups.concat(currentGroup), [])
    .map(group => group.doclist.docs)
    .reduce((collect, currentCourses) => collect.concat(currentCourses), []);

const isCourseraURL = courseURL => courseURL.includes('coursera');

const getResolvedUrlFromCourseraCourse = async course => {
  if (!course.data || !course.data.courseURL) {
    return {};
  }

  // eslint-disable-next-line prefer-destructuring
  const courseURL = course.data.courseURL;
  if (!isCourseraURL(courseURL)) {
    return {};
  }

  let response;
  try {
    response = await axios.get(courseURL, { maxRedirects: 0 });
    return {};
  } catch (e) {
    // eslint-disable-next-line prefer-destructuring
    response = e.response;
  }

  if (response.status !== 301) {
    return {};
  }

  return { from: courseURL, to: response.headers.location };
};

const addResolvedUrlsToCourseraCourses = async individualCourses => {
  const urlMapObjects = [];
  const taskQueue = queue(async (task, callback) => {
    await new Promise(resolve => setTimeout(() => resolve(), 100));
    const result = await task();
    urlMapObjects.push(result);
    callback();
  }, 20);

  await new Promise(resolve => {
    individualCourses.forEach(course => {
      taskQueue.push(() => getResolvedUrlFromCourseraCourse(course), () => {});
    });
    taskQueue.drain = () => resolve();
  });

  const urlMap = urlMapObjects.reduce(
    (map, url) => ({ ...map, [url.from]: url.to }),
    {},
  );

  return individualCourses.map(course => {
    if (!course.data || !course.data.courseURL) {
      return course;
    }

    // eslint-disable-next-line prefer-destructuring
    const courseURL = course.data.courseURL;
    if (!(courseURL in urlMap)) {
      return course;
    }

    const resolvedURL = urlMap[courseURL];
    return {
      ...course,
      data: {
        ...course.data,
        courseURLResolved: resolvedURL,
      },
    };
  });
};

const addInformationToIndividualCourses = async dump => {
  let coursesWithAddedInformation = dump;

  coursesWithAddedInformation = await addResolvedUrlsToCourseraCourses(
    coursesWithAddedInformation,
  );
  return coursesWithAddedInformation;
};

// eslint-disable-next-line import/prefer-default-export
export const generateSkillsfutureStore = async (
  allCoursesDumpPath,
  individualCoursesDumpPath,
  storePath,
) => {
  const coursesDump = await readFromFile(allCoursesDumpPath);
  const individualCoursesDump = await readFromFile(individualCoursesDumpPath);

  const courses = extractCoursesFromAllCoursesDump(coursesDump);
  const individualCourses = await addInformationToIndividualCourses(
    individualCoursesDump,
  );

  const store = { courses, individualCourses };
  writeToFile(storePath, store);
};
