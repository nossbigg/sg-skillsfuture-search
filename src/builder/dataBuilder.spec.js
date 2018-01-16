/* eslint-disable prefer-promise-reject-errors */
import fs from 'fs-extra';
import build from './dataBuilder';

import * as courseraExtractor from './extractor/courseraExtractor';
import * as skillsfutureExtractor from './extractor/skillsfutureExtractor';
import * as courseraStoreGenerator from './generator/courseraStoreGenerator';
import * as skillsfutureStoreGenerator from './generator/skillsfutureStoreGenerator';
import * as generateMergedStore from './generator/skillsfutureCourseraStoreGenerator';

describe('#build', () => {
  let logger;

  beforeEach(() => {
    logger = {
      log: jest.fn(),
    };

    fs.outputJson = jest.fn().mockReturnValue(Promise.resolve());
    courseraExtractor.extractFromCoursera = jest.fn();
    skillsfutureExtractor.extractFromSkillsfuture = jest.fn();
    courseraStoreGenerator.generateCourseraStore = jest.fn();
    skillsfutureStoreGenerator.generateSkillsfutureStore = jest.fn();
    generateMergedStore.default = jest.fn();

    courseraExtractor.extractFromCoursera
      .mockReturnValue(Promise.resolve({
        allCourses: {}, individualCourses: {},
      }));
    skillsfutureExtractor.extractFromSkillsfuture
      .mockReturnValue(Promise.resolve({
        allCourses: {}, individualCourses: {},
      }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('runs without errors', async () => {
    await build(logger);

    expect(logger.log).toHaveBeenCalledWith('Done!');
  });

  it('prints errors thrown by skillsfuture extractor ', async () => {
    skillsfutureExtractor.extractFromSkillsfuture
      .mockReturnValue(Promise.reject());

    await build(logger);

    expect(logger.log)
      .toHaveBeenCalledWith('Build failed with error: Error: Error occurred while downloading from Skillsfuture site');
  });

  it('prints errors thrown by coursera extractor ', async () => {
    courseraExtractor.extractFromCoursera
      .mockReturnValue(Promise.reject());

    await build(logger);

    expect(logger.log)
      .toHaveBeenCalledWith('Build failed with error: Error: Error occurred while downloading from Coursera site');
  });

  it('prints errors thrown by coursera store generator ', async () => {
    courseraStoreGenerator.generateCourseraStore
      .mockReturnValue(Promise.reject('some-error'));

    await build(logger);

    expect(logger.log)
      .toHaveBeenCalledWith('Build failed with error: some-error');
  });

  it('prints errors thrown by skillsfuture store generator ', async () => {
    skillsfutureStoreGenerator.generateSkillsfutureStore
      .mockReturnValue(Promise.reject('some-error'));

    await build(logger);

    expect(logger.log)
      .toHaveBeenCalledWith('Build failed with error: some-error');
  });

  it('prints errors thrown by merged store generator ', async () => {
    generateMergedStore.default
      .mockReturnValue(Promise.reject('some-error'));

    await build(logger);

    expect(logger.log)
      .toHaveBeenCalledWith('Build failed with error: some-error');
  });
});
