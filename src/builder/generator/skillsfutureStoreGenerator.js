import fs from 'fs-extra';
import _ from 'lodash';

const writeToFile = (filename, json) => fs.outputJson(filename, json);
const readFromFile = filename => fs.readJson(filename);

const extractCourses = (dump) => {
  let courses = dump
    .map(courseBatch => courseBatch.grouped.GroupID.groups)
    .reduce((groups, currentGroup) => groups.concat(currentGroup), [])
    .map(group => group.doclist.docs)
    .reduce((collect, currentCourses) => collect.concat(currentCourses), []);

  courses = _.uniqBy(courses, 'Course_Ref_No');

  return courses;
};

export const generateSkillsfutureStore = async (allCoursesDumpPath, individualCoursesDumpPath, storePath) => {
  const allCoursesDump = await readFromFile(allCoursesDumpPath);

  const courses = extractCourses(allCoursesDump);
  const store = { courses };
  writeToFile(storePath, store);
};
