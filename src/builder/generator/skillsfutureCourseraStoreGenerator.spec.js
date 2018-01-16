import fs from 'fs-extra';

import generateSkillsfutureCourseraStore from './skillsfutureCourseraStoreGenerator';

describe('#skillsfutureCourseraStoreGenerator', () => {
  const courseraStorePath = 'coursera-store-path';
  const skillsfutureStorePath = 'skillsfuture-store-path';
  const skillsfutureCourseraStorePath = 'skillsfuture-coursera-store-path';

  const sampleCourseraStore = {
    courses: [],
    specializations: [
      { courseIds: ['id1', 'id2'] },
      { courseIds: ['id3'] },
    ],
    partners: [],
    individualCourses: [
      { 'onDemandCourses.v1': { course_id: { id: 'id1', slug: 'slug1' } } },
      { 'onDemandCourses.v1': { course_id: { id: 'id2', slug: 'slug2' } } },
      { 'onDemandCourses.v1': { course_id: { id: 'id3', slug: 'slug3' } } },
    ],
  };
  const sampleSkillsfutureStore = {
    courses: [],
    individualCourses: [
      { data: { courseURL: 'www.xyz.com/slug1', trainingProviderAlias: 'coursera' } },
      { data: { courseURL: 'www.xyz.com/slug2', trainingProviderAlias: 'coursera' } },
      { data: { courseURL: 'www.xyz.com/slug3', trainingProviderAlias: 'udemy' } },
    ],
  };

  let logger;

  beforeEach(() => {
    fs.readJson = jest.fn();
    fs.outputJson = jest.fn();

    logger = { };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should generate merged store correctly and not throw errors', async () => {
    fs.readJson
      .mockReturnValueOnce(Promise.resolve(sampleCourseraStore))
      .mockReturnValueOnce(Promise.resolve(sampleSkillsfutureStore));

    await generateSkillsfutureCourseraStore(
      logger, courseraStorePath,
      skillsfutureStorePath, skillsfutureCourseraStorePath,
    );

    const expectedStore = {
      specializations: [
        { courseIds: ['id1', 'id2'], coursesFoundInSkillsfuture: ['id1', 'id2'] },
        { courseIds: ['id3'], coursesFoundInSkillsfuture: [] },
      ],
    };
    expect(fs.outputJson).toHaveBeenCalledWith('skillsfuture-coursera-store-path', expectedStore);
  });
});
