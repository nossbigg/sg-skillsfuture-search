import fs from 'fs-extra';

const readFromFile = filename => fs.readJson(filename);
const writeToFile = (filename, json) => fs.outputJson(filename, json);

const getCourseraCourseSlugFromUrl = courseURL => courseURL.split('?')[0].split('/').pop();

const getCourseraCoursesFromSkillsfutureIndividualCourses = individualCourses => individualCourses
  .filter(course => course.data)
  .filter(course => course.data.trainingProviderAlias.toLowerCase() === 'coursera')
  .reduce((courseMap, course) => {
    const courseSlug = getCourseraCourseSlugFromUrl(course.data.courseURL);
    return { ...courseMap, [courseSlug]: course };
  }, {});

const getCourseraIndividualCourses = courseraCourses => courseraCourses
  .filter(course => course['onDemandCourses.v1'])
  .reduce((courseMap, course) => {
    const courseId = Object.values(course['onDemandCourses.v1'])[0].id;
    return { ...courseMap, [courseId]: course };
  }, {});

const getCourseraCourseSlugFromIndividualCourse = courseData =>
  Object.values(courseData['onDemandCourses.v1'])[0].slug;

const getCoursesFoundInSkillsfuture
  = (specialization, courseraCoursesIdMap, courseraSkillsfutureCourseMap) =>
    specialization.courseIds
      .filter((courseId) => {
        const course = courseraCoursesIdMap[courseId];
        return getCourseraCourseSlugFromIndividualCourse(course)
        in courseraSkillsfutureCourseMap;
      });

const generateMergedMatrix
  = (courseraSpecializations, courseraCoursesIdMap, courseraSkillsfutureCourseMap) =>
    courseraSpecializations.map(specialization => ({
      ...specialization,
      coursesFoundInSkillsfuture: getCoursesFoundInSkillsfuture(
        specialization,
        courseraCoursesIdMap,
        courseraSkillsfutureCourseMap,
      ),
    }));

const generateSkillsfutureCourseraStore = async (
  logger, courseraStorePath,
  skillsfutureStorePath, skillsfutureCourseraStorePath) => {
  const {
    specializations: courseraSpecializations,
    individualCourses: courseraIndividualCourses,
  } = await readFromFile(courseraStorePath);
  const {
    individualCourses: skillsfutureIndividualCourses,
  } = await readFromFile(skillsfutureStorePath);

  const courseraCoursesIdMap = getCourseraIndividualCourses(courseraIndividualCourses);
  const courseraSkillsfutureCourseMap
    = getCourseraCoursesFromSkillsfutureIndividualCourses(skillsfutureIndividualCourses);
  const mergedSpecializationsMatrix =
    generateMergedMatrix(
      courseraSpecializations,
      courseraCoursesIdMap,
      courseraSkillsfutureCourseMap,
    );

  const store = { specializations: mergedSpecializationsMatrix };
  writeToFile(skillsfutureCourseraStorePath, store);
};

export default generateSkillsfutureCourseraStore;
