import fs from 'fs-extra';

import generateSkillsfutureCourseraStore from './skillsfutureCourseraStoreGenerator';

describe('#skillsfutureCourseraStoreGenerator', () => {
  const courseraStorePath = 'coursera-store-path';
  const skillsfutureStorePath = 'skillsfuture-store-path';
  const skillsfutureCourseraStorePath = 'skillsfuture-coursera-store-path';

  const sampleCourseraStore = {
    courses: [],
    specializations: [
      { courseIds: ['id1', 'id2'], partnerIds: ['11'], launchedAt: 'total-trash' },
      { courseIds: ['id3'], partnerIds: ['11', '22'], launchedAt: 'total-trash' },
    ],
    partners: [
      { name: 'some-partner-name-1', id: '11', shortName: 'spn1' },
      { name: 'some-partner-name-2', id: '22', shortName: 'spn2' },
    ],
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
        {
          courseIds: ['id1', 'id2'],
          coursesFoundInSkillsfuture: ['id1', 'id2'],
          partnerIds: [
            { id: '11', name: 'some-partner-name-1' },
          ],
        },
        {
          courseIds: ['id3'],
          coursesFoundInSkillsfuture: [],
          partnerIds: [
            { id: '11', name: 'some-partner-name-1' },
            { id: '22', name: 'some-partner-name-2' },
          ],
        },
      ],
    };
    expect(fs.outputJson).toHaveBeenCalledWith('skillsfuture-coursera-store-path', expectedStore);
  });
});
