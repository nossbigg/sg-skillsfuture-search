import fs from 'fs-extra';

import { generateCourseraStore } from './courseraStoreGenerator';

describe('#courseraStoreGenerator', () => {
  beforeEach(() => {
    fs.readJson = jest.fn();
    fs.outputJson = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const sampleCoursesResponse = {
    linked: {
      'onDemandSpecializations.v1': [{ id: 'spec1' }, { id: 'spec2' }],
      'partners.v1': [{ id: 'partner1' }, { id: 'partner2' }],
      'courses.v1': ['course1', 'course2'],
    },
  };
  const sampleCoursesDump = [sampleCoursesResponse, sampleCoursesResponse];

  const sampleIndividualCourseResponse = {
    context: { dispatcher: { stores: { NaptimeStore: { data: ['course1', 'course2'] } } } },
  };
  const sampleIndividualCoursesDump =
    [sampleIndividualCourseResponse, sampleIndividualCourseResponse];

  it('should extract information from dump and save to disk', async () => {
    fs.readJson
      .mockReturnValueOnce(Promise.resolve(sampleCoursesDump))
      .mockReturnValueOnce(Promise.resolve(sampleIndividualCoursesDump));

    await generateCourseraStore('a-path', 'another-path', 'store-path');

    const expectedStore = {
      courses: ['course1', 'course2', 'course1', 'course2'],
      specializations: [{ id: 'spec1' }, { id: 'spec2' }],
      partners: [{ id: 'partner1' }, { id: 'partner2' }],
      individualCourses: ['course1', 'course2', 'course1', 'course2'],
    };
    expect(fs.outputJson).toHaveBeenCalledWith('store-path', expectedStore);
  });
});
