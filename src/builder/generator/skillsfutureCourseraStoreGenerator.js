import fs from 'fs-extra';

const readFromFile = filename => fs.readJson(filename);
const writeToFile = (filename, json) => fs.outputJson(filename, json);

const getCourseraCourseSlugFromUrl = (courseURL) => {
  const urlWithoutArguments = courseURL.split('?').shift();
  const urlWithoutTrailingForwardSlash = urlWithoutArguments.replace(/\/$/, '');
  return urlWithoutTrailingForwardSlash.split('/').pop();
};

const getCourseraCoursesFromSkillsfutureIndividualCourses = individualCourses => individualCourses
  .filter(course => course.data)
  .filter(course => course.data.trainingProviderAlias.toLowerCase() === 'coursera')
  .reduce((courseMap, course) => {
    const courseURL = course.data.courseURLResolved
      ? course.data.courseURLResolved
      : course.data.courseURL;

    const courseSlug = getCourseraCourseSlugFromUrl(courseURL);
    return { ...courseMap, [courseSlug]: course };
  }, {});

const getCourseraIndividualCourses = courseraCourses => courseraCourses
  .filter(course => course['onDemandCourses.v1'])
  .reduce((courseMap, course) => {
    const courseId = Object.values(course['onDemandCourses.v1'])[0].id;
    return { ...courseMap, [courseId]: course };
  }, {});

const getCourseraCourseFromCourseIdMap = (courseId, courseIdMap) => {
  const courseIdMapMatch = courseIdMap[courseId];
  return Object.values(courseIdMapMatch['onDemandCourses.v1'])[0];
};

const generateSpecializationCoursesField =
  (courseIds, courseraCoursesIdMap, courseraSkillsfutureCourseMap) =>
    courseIds.map((courseraCourseId) => {
      const course = getCourseraCourseFromCourseIdMap(courseraCourseId, courseraCoursesIdMap);
      const courseraCourseSlug = course.slug;

      const specializationCourseField = {
        coursera: {
          id: courseraCourseId,
          slug: course.slug,
          name: course.name,
        },
      };

      if (courseraCourseSlug in courseraSkillsfutureCourseMap) {
        const skillsfutureCourse = courseraSkillsfutureCourseMap[courseraCourseSlug];
        specializationCourseField.skillsfuture = {
          courseReferenceNumber: skillsfutureCourse.data.courseReferenceNumber,
        };
      }

      return specializationCourseField;
    });

const getCourseraPartnersMap = courseraPartners => courseraPartners
  .reduce((partnersMap, partner) => {
    const partnerId = partner.id;
    return { ...partnersMap, [partnerId]: partner };
  }, {});

const addPartnerNamesToPartnerIds = (partnerIds, courseraPartnersMap) => partnerIds
  .map(partnerId => ({ id: partnerId, name: courseraPartnersMap[partnerId].name }));

const addPercentageCoursesCoveredBySkillsfuture = (courses) => {
  const numberOfCourses = courses.length;
  const numberOfCoursesCoveredBySkillsfuture = courses
    .filter(course => course.skillsfuture)
    .length;

  if (numberOfCoursesCoveredBySkillsfuture === 0) {
    return 0.0;
  }

  return numberOfCoursesCoveredBySkillsfuture / numberOfCourses;
};

const generateMergedMatrix
  = (
    courseraSpecializations, courseraCoursesIdMap,
    courseraSkillsfutureCourseMap, courseraPartnersMap,
  ) =>
    courseraSpecializations.map((specialization) => {
      const newSpecializationObject =
        {
          ...specialization,
          courses: generateSpecializationCoursesField(
            specialization.courseIds,
            courseraCoursesIdMap,
            courseraSkillsfutureCourseMap,
          ),
          partnerIds: addPartnerNamesToPartnerIds(specialization.partnerIds, courseraPartnersMap),
        };

      newSpecializationObject.percentageCoveredBySkillsfuture =
        addPercentageCoursesCoveredBySkillsfuture(newSpecializationObject.courses);

      delete newSpecializationObject.courseIds;
      delete newSpecializationObject.launchedAt;
      return newSpecializationObject;
    });

const generateSkillsfutureCourseraStore = async (
  logger, courseraStorePath,
  skillsfutureStorePath, skillsfutureCourseraStorePath) => {
  const informationScrapeTimestamp = Date.now();

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

  const store = { specializations: mergedSpecializationsMatrix, informationScrapeTimestamp };
  writeToFile(skillsfutureCourseraStorePath, store);
};

export default generateSkillsfutureCourseraStore;
