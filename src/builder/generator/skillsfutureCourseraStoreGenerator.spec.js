import fs from 'fs-extra';

import generateSkillsfutureCourseraStore from './skillsfutureCourseraStoreGenerator';

describe('#skillsfutureCourseraStoreGenerator', () => {
  const courseraStorePath = 'coursera-store-path';
  const skillsfutureStorePath = 'skillsfuture-store-path';
  const skillsfutureCourseraStorePath = 'skillsfuture-coursera-store-path';

  const sampleCourseraStore = {
    courses: [],
    specializations: [
      {
        courseIds: ['id1', 'id2'],
        partnerIds: ['11'],
        launchedAt: 'total-trash',
      },
      {
        courseIds: ['id1', 'id3'],
        partnerIds: ['11'],
        launchedAt: 'total-trash',
      },
      {
        courseIds: ['id3'],
        partnerIds: ['11', '22'],
        launchedAt: 'total-trash',
      },
    ],
    partners: [
      { name: 'some-partner-name-1', id: '11', shortName: 'spn1' },
      { name: 'some-partner-name-2', id: '22', shortName: 'spn2' },
    ],
    individualCourses: [
      {
        'onDemandCourses.v1': {
          course_id: { id: 'id1', slug: 'slug1', name: 'slug1name' },
        },
      },
      {
        'onDemandCourses.v1': {
          course_id: { id: 'id2', slug: 'slug2', name: 'slug2name' },
        },
      },
      {
        'onDemandCourses.v1': {
          course_id: { id: 'id3', slug: 'slug3', name: 'slug3name' },
        },
      },
    ],
  };
  const sampleSkillsfutureStore = {
    courses: [],
    individualCourses: [
      {
        data: {
          courseURL: 'www.xyz.com/slug1?withsomegarbageargument=yes',
          trainingProviderAlias: 'coursera',
          courseReferenceNumber: 'some-course-ref1',
        },
      },
      {
        data: {
          courseURL: 'www.xyz.com/slug2/someoldlink',
          courseURLResolved: 'www.xyz.com/slug2/',
          trainingProviderAlias: 'coursera',
          courseReferenceNumber: 'some-course-ref2',
        },
      },
      {
        data: {
          courseURL: 'www.xyz.com/slug3',
          trainingProviderAlias: 'udemy',
          courseReferenceNumber: 'some-course-ref3',
        },
      },
    ],
  };

  let logger;

  beforeEach(() => {
    fs.readJson = jest.fn();
    fs.outputJson = jest.fn();

    logger = {
      warn: () => {},
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should generate merged store correctly and not throw errors', async () => {
    fs.readJson
      .mockReturnValueOnce(Promise.resolve(sampleCourseraStore))
      .mockReturnValueOnce(Promise.resolve(sampleSkillsfutureStore));
    Date.now = jest.genMockFunction().mockReturnValue(123);

    await generateSkillsfutureCourseraStore(
      logger,
      courseraStorePath,
      skillsfutureStorePath,
      skillsfutureCourseraStorePath,
    );

    const expectedStore = {
      specializations: [
        {
          courses: [
            {
              coursera: { id: 'id1', slug: 'slug1', name: 'slug1name' },
              skillsfuture: { courseReferenceNumber: 'some-course-ref1' },
            },
            {
              coursera: { id: 'id2', slug: 'slug2', name: 'slug2name' },
              skillsfuture: { courseReferenceNumber: 'some-course-ref2' },
            },
          ],
          partnerIds: [{ id: '11', name: 'some-partner-name-1' }],
          percentageCoveredBySkillsfuture: 1,
        },
        {
          courses: [
            {
              coursera: { id: 'id1', slug: 'slug1', name: 'slug1name' },
              skillsfuture: { courseReferenceNumber: 'some-course-ref1' },
            },
            {
              coursera: { id: 'id3', slug: 'slug3', name: 'slug3name' },
            },
          ],
          partnerIds: [{ id: '11', name: 'some-partner-name-1' }],
          percentageCoveredBySkillsfuture: 0.5,
        },
        {
          courses: [
            {
              coursera: { id: 'id3', slug: 'slug3', name: 'slug3name' },
            },
          ],
          partnerIds: [
            { id: '11', name: 'some-partner-name-1' },
            { id: '22', name: 'some-partner-name-2' },
          ],
          percentageCoveredBySkillsfuture: 0,
        },
      ],
      informationScrapeTimestamp: 123,
    };
    expect(fs.outputJson).toHaveBeenCalledWith(
      'skillsfuture-coursera-store-path',
      expectedStore,
    );
  });

  it('should exlcude specializations that have failed processing', async () => {
    const sampleCourseraStoreWithSomeMissingIndividualCourses = {
      ...sampleCourseraStore,
      individualCourses: [
        {
          'onDemandCourses.v1': {
            course_id: { id: 'id1', slug: 'slug1', name: 'slug1name' },
          },
        },
        {
          'onDemandCourses.v1': {
            course_id: { id: 'id2', slug: 'slug2', name: 'slug2name' },
          },
        },
      ],
    };

    fs.readJson
      .mockReturnValueOnce(
        Promise.resolve(sampleCourseraStoreWithSomeMissingIndividualCourses),
      )
      .mockReturnValueOnce(Promise.resolve(sampleSkillsfutureStore));
    Date.now = jest.genMockFunction().mockReturnValue(123);

    await generateSkillsfutureCourseraStore(
      logger,
      courseraStorePath,
      skillsfutureStorePath,
      skillsfutureCourseraStorePath,
    );

    const expectedStore = {
      specializations: [
        {
          courses: [
            {
              coursera: { id: 'id1', slug: 'slug1', name: 'slug1name' },
              skillsfuture: { courseReferenceNumber: 'some-course-ref1' },
            },
            {
              coursera: { id: 'id2', slug: 'slug2', name: 'slug2name' },
              skillsfuture: { courseReferenceNumber: 'some-course-ref2' },
            },
          ],
          partnerIds: [{ id: '11', name: 'some-partner-name-1' }],
          percentageCoveredBySkillsfuture: 1,
        },
      ],
      informationScrapeTimestamp: 123,
    };
    expect(fs.outputJson).toHaveBeenCalledWith(
      'skillsfuture-coursera-store-path',
      expectedStore,
    );
  });
});
