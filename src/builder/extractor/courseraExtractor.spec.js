import axios from 'axios';
import AxiosMocker from 'axios-mock-adapter';
import {
  extractFromCoursera,
  getAllCourses,
  getInvididualCourses,
} from './courseraExtractor';

describe('#courseraExtractor', () => {
  const axiosMock = new AxiosMocker(axios);
  let logger = {};

  const ALL_COURSE_SEARCH_URL =
    'https://www.coursera.org/api/catalogResults.v2';
  const INDIVIDUAL_COURSE_SEARCH_URL = courseSlug =>
    `https://www.coursera.org/learn/${courseSlug}`;

  const generateNumberOfCoursesResponse = matches => ({
    paging: { total: matches },
  });
  const generateCourseBatchResponse = courseSlugs => ({
    linked: {
      'courses.v1': courseSlugs.map(courseSlug => ({ slug: courseSlug })),
    },
  });
  const generateIndividualCourseHTMLResponse = () =>
    'some-html window.App={"some_key":"some_value"}; some-other-html';

  beforeEach(() => {
    logger = {
      log: jest.fn(),
    };
  });

  afterEach(() => {
    axiosMock.reset();
  });

  it('should get all courses', async () => {
    axiosMock.onGet(ALL_COURSE_SEARCH_URL).reply(config => {
      if (!config.params.fields) {
        return ['200', generateNumberOfCoursesResponse(2)];
      }

      return ['200', generateCourseBatchResponse(['slug1', 'slug2'])];
    });

    const expected = [
      {
        linked: {
          'courses.v1': [{ slug: 'slug1' }, { slug: 'slug2' }],
        },
      },
    ];

    const result = await getAllCourses(logger);
    expect(result).toEqual(expected);
  });

  it('should get individual courses', async () => {
    axiosMock
      .onGet(INDIVIDUAL_COURSE_SEARCH_URL('slug1'))
      .reply(200, generateIndividualCourseHTMLResponse());
    axiosMock
      .onGet(INDIVIDUAL_COURSE_SEARCH_URL('slug2'))
      .reply(200, generateIndividualCourseHTMLResponse());

    const expected = [{ some_key: 'some_value' }, { some_key: 'some_value' }];

    const result = await getInvididualCourses(['slug1', 'slug2']);
    expect(result).toEqual(expected);
  });

  it('should perform complete extraction', async () => {
    axiosMock.onGet(ALL_COURSE_SEARCH_URL).reply(config => {
      if (!config.params.fields) {
        return ['200', generateNumberOfCoursesResponse(2)];
      }

      return ['200', generateCourseBatchResponse(['slug1', 'slug2', 'slug3'])];
    });

    axiosMock
      .onGet(INDIVIDUAL_COURSE_SEARCH_URL('slug1'))
      .reply(200, generateIndividualCourseHTMLResponse());
    axiosMock
      .onGet(INDIVIDUAL_COURSE_SEARCH_URL('slug2'))
      .reply(200, generateIndividualCourseHTMLResponse());
    axiosMock
      .onGet(INDIVIDUAL_COURSE_SEARCH_URL('slug3'))
      .reply(200, generateIndividualCourseHTMLResponse());

    const expectedAllCourses = [
      {
        linked: {
          'courses.v1': [
            { slug: 'slug1' },
            { slug: 'slug2' },
            { slug: 'slug3' },
          ],
        },
      },
    ];

    const expectedIndividualCourses = [
      { some_key: 'some_value' },
      { some_key: 'some_value' },
      { some_key: 'some_value' },
    ];

    const result = await extractFromCoursera(logger);
    expect(result).toEqual({
      allCourses: expectedAllCourses,
      individualCourses: expectedIndividualCourses,
    });
  });
});
