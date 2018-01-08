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

  const sampleSingleResponse = {
    linked: {
      'onDemandSpecializations.v1': [{ id: 'spec1' }, { id: 'spec2' }],
      'partners.v1': [{ id: 'partner1' }, { id: 'partner2' }],
      'courses.v1': ['course1', 'course2'],
    },
  };
  const sampleDump = [sampleSingleResponse, sampleSingleResponse];

  it('should extract information from dump and save to disk', async () => {
    fs.readJson.mockReturnValue(Promise.resolve(sampleDump));

    await generateCourseraStore('a-path', 'another-path', 'store-path');

    const expectedStore = {
      courses: ['course1', 'course2', 'course1', 'course2'],
      specializations: [{ id: 'spec1' }, { id: 'spec2' }],
      partners: [{ id: 'partner1' }, { id: 'partner2' }],
    };
    expect(fs.outputJson).toHaveBeenCalledWith('store-path', expectedStore);
  });
});
