import fs from 'fs-extra';

import { generateSkillsfutureStore } from './skillsfutureStoreGenerator';

describe('#skillsfutureStoreGenerator', () => {
  beforeEach(() => {
    fs.readJson = jest.fn();
    fs.outputJson = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const generateCourseBatchNestedArray = courseRefNo => (
    { doclist: { docs: [{ Course_Ref_No: courseRefNo }] } }
  );
  const generateCourseBatchResponse = courseRefNos => (
    {
      grouped: {
        GroupID: {
          groups:
            courseRefNos.map(courseRefNo =>
              generateCourseBatchNestedArray(courseRefNo)),
        },
      },
    }
  );

  const sampleCoursesDump = [
    generateCourseBatchResponse(['ref1', 'ref2']),
    generateCourseBatchResponse(['ref2', 'ref3']),
  ];
  const sampleIndividualCoursesDump = ['course1', 'course2'];

  it('should extract information from dump and save to disk', async () => {
    fs.readJson
      .mockReturnValueOnce(Promise.resolve(sampleCoursesDump))
      .mockReturnValueOnce(Promise.resolve(sampleIndividualCoursesDump));

    await generateSkillsfutureStore('a-path', 'another-path', 'store-path');

    const expectedStore = {
      courses: [
        { Course_Ref_No: 'ref1' },
        { Course_Ref_No: 'ref2' },
        { Course_Ref_No: 'ref2' },
        { Course_Ref_No: 'ref3' },
      ],
      individualCourses: [
        'course1',
        'course2',
      ],
    };
    expect(fs.outputJson).toHaveBeenCalledWith('store-path', expectedStore);
  });
});
