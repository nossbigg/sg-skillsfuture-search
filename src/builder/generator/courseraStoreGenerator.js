import fs from 'fs-extra';
import _ from 'lodash';

const readFromFile = filename => fs.readJson(filename);
const writeToFile = (filename, json) => fs.outputJson(filename, json);

const extractSpecializations = (dump) => {
  let specializations = dump
    .map(root => root.linked['onDemandSpecializations.v1'])
    .reduce((specs, currentSpecs) => specs.concat(currentSpecs), []);

  specializations = _.uniqBy(specializations, 'id');

  return specializations;
};

const extractPartners = (dump) => {
  let partners = dump
    .map(root => root.linked['partners.v1'])
    .reduce((collect, currentPartners) => collect.concat(currentPartners), []);

  partners = _.uniqBy(partners, 'id');

  return partners;
};

const extractCourses = dump => dump
  .map(root => root.linked['courses.v1'])
  .reduce((courses, currentCourses) => courses.concat(currentCourses), []);

const extractIndividualCourses = dump => dump
  .map(request => request.context.dispatcher.stores.NaptimeStore.data)
  .reduce((courses, currentCourses) => courses.concat(currentCourses), []);

export const generateCourseraStore =
  async (allCoursesDumpPath, individualCoursesDumpPath, storePath) => {
    const allCoursesDump = await readFromFile(allCoursesDumpPath);
    const individualCoursesDump = await readFromFile(individualCoursesDumpPath);

    const courses = extractCourses(allCoursesDump);
    const specializations = extractSpecializations(allCoursesDump);
    const partners = extractPartners(allCoursesDump);
    const individualCourses = extractIndividualCourses(individualCoursesDump);

    const store = {
      courses, specializations, partners, individualCourses,
    };
    writeToFile(storePath, store);
  };
