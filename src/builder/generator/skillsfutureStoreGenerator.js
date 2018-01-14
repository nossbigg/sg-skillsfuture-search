import fs from 'fs-extra';

const writeToFile = (filename, json) => fs.outputJson(filename, json);
const readFromFile = filename => fs.readJson(filename);

const extractCoursesFromAllCoursesDump = (dump) => {
  const courses = dump
    .map(courseBatch => courseBatch.grouped.GroupID.groups)
    .reduce((groups, currentGroup) => groups.concat(currentGroup), [])
    .map(group => group.doclist.docs)
    .reduce((collect, currentCourses) => collect.concat(currentCourses), []);

  return courses;
};

export const generateSkillsfutureStore =
  async (allCoursesDumpPath, individualCoursesDumpPath, storePath) => {
    const coursesDump = await readFromFile(allCoursesDumpPath);
    const individualCoursesDump = await readFromFile(individualCoursesDumpPath);

    const courses = extractCoursesFromAllCoursesDump(coursesDump);

    const store = { courses, individualCourses: individualCoursesDump };
    writeToFile(storePath, store);
  };
