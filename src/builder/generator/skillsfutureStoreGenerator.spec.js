import fs from 'fs-extra';
import axios from 'axios';
import AxiosMocker from 'axios-mock-adapter';

import { generateSkillsfutureStore } from './skillsfutureStoreGenerator';

describe('#skillsfutureStoreGenerator', () => {
  const axiosMock = new AxiosMocker(axios);
  const logger = {
    log: jest.fn(),
  };

  beforeEach(() => {
    fs.readJson = jest.fn();
    fs.outputJson = jest.fn();
  });

  afterEach(() => {
    axiosMock.reset();
    jest.resetAllMocks();
  });

  const generateCourseBatchNestedArray = courseRefNo => ({
    doclist: { docs: [{ Course_Ref_No: courseRefNo }] },
  });
  const generateCourseBatchResponse = courseRefNos => ({
    grouped: {
      GroupID: {
        groups: courseRefNos.map(courseRefNo =>
          generateCourseBatchNestedArray(courseRefNo),
        ),
      },
    },
  });

  const sampleCoursesDump = [
    generateCourseBatchResponse(['ref1', 'ref2']),
    generateCourseBatchResponse(['ref2', 'ref3']),
  ];
  const sampleIndividualCoursesDump = [
    { name: 'course1' },
    { name: 'course2' },
  ];

  it('should extract information from dump and save to disk', async () => {
    fs.readJson
      .mockReturnValueOnce(Promise.resolve(sampleCoursesDump))
      .mockReturnValueOnce(Promise.resolve(sampleIndividualCoursesDump));

    await generateSkillsfutureStore(
      'a-path',
      'another-path',
      'store-path',
      logger,
    );

    const expectedStore = {
      courses: [
        { Course_Ref_No: 'ref1' },
        { Course_Ref_No: 'ref2' },
        { Course_Ref_No: 'ref2' },
        { Course_Ref_No: 'ref3' },
      ],
      individualCourses: [{ name: 'course1' }, { name: 'course2' }],
    };
    expect(fs.outputJson).toHaveBeenCalledWith('store-path', expectedStore);
  });

  it('should retrieve and add resolved urls to courses', async () => {
    const sampleIndividualCoursesDumpWithMoreData = [
      { name: 'course1' },
      { name: 'course2', data: {} },
      { name: 'course3', data: { courseURL: 'some-other-url' } },
      { name: 'course4', data: { courseURL: 'coursera.org' } },
    ];

    axiosMock
      .onGet('coursera.org')
      .reply(301, {}, { location: 'a-resolved-url' });

    fs.readJson
      .mockReturnValueOnce(Promise.resolve(sampleCoursesDump))
      .mockReturnValueOnce(
        Promise.resolve(sampleIndividualCoursesDumpWithMoreData),
      );

    await generateSkillsfutureStore(
      'a-path',
      'another-path',
      'store-path',
      logger,
    );

    const expectedStore = {
      courses: [
        { Course_Ref_No: 'ref1' },
        { Course_Ref_No: 'ref2' },
        { Course_Ref_No: 'ref2' },
        { Course_Ref_No: 'ref3' },
      ],
      individualCourses: [
        { name: 'course1' },
        { name: 'course2', data: {} },
        { name: 'course3', data: { courseURL: 'some-other-url' } },
        {
          name: 'course4',
          data: {
            courseURL: 'coursera.org',
            courseURLResolved: 'a-resolved-url',
          },
        },
      ],
    };
    expect(fs.outputJson).toHaveBeenCalledWith('store-path', expectedStore);
  });
});
