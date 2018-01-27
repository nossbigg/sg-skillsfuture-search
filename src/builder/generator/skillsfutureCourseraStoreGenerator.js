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

const getCourseraPartnersMap = courseraPartners => courseraPartners
  .reduce((partnersMap, partner) => {
    const partnerId = partner.id;
    return { ...partnersMap, [partnerId]: partner };
  }, {});

const addPartnerNamesToPartnerIds = (partnerIds, courseraPartnersMap) => partnerIds
  .map(partnerId => ({ id: partnerId, name: courseraPartnersMap[partnerId].name }));

const generateMergedMatrix
  = (
    courseraSpecializations, courseraCoursesIdMap,
    courseraSkillsfutureCourseMap, courseraPartnersMap,
  ) =>
    courseraSpecializations.map(specialization => ({
      ...specialization,
      coursesFoundInSkillsfuture: getCoursesFoundInSkillsfuture(
        specialization,
        courseraCoursesIdMap,
        courseraSkillsfutureCourseMap,
      ),
      partnerIds: addPartnerNamesToPartnerIds(specialization.partnerIds, courseraPartnersMap),
    }));

const generateSkillsfutureCourseraStore = async (
  logger, courseraStorePath,
  skillsfutureStorePath, skillsfutureCourseraStorePath) => {
  const {
    specializations: courseraSpecializations,
    partners: courseraPartners,
    individualCourses: courseraIndividualCourses,
  } = await readFromFile(courseraStorePath);
  const {
    individualCourses: skillsfutureIndividualCourses,
  } = await readFromFile(skillsfutureStorePath);

  const courseraCoursesIdMap = getCourseraIndividualCourses(courseraIndividualCourses);
  const courseraSkillsfutureCourseMap
    = getCourseraCoursesFromSkillsfutureIndividualCourses(skillsfutureIndividualCourses);
  const courseraPartnersMap = getCourseraPartnersMap(courseraPartners);

  const mergedSpecializationsMatrix =
    generateMergedMatrix(
      courseraSpecializations,
      courseraCoursesIdMap,
      courseraSkillsfutureCourseMap,
      courseraPartnersMap,
    );

  const store = { specializations: mergedSpecializationsMatrix };
  writeToFile(skillsfutureCourseraStorePath, store);
};

export default generateSkillsfutureCourseraStore;
