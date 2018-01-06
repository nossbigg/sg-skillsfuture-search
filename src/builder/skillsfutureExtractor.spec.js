import axios from 'axios';
import AxiosMocker from 'axios-mock-adapter';
import { extractFromSkillsfuture, getAllCourses, getInvididualCourses } from './skillsfutureExtractor';

describe('#skillsfutureExtractor', () => {
  const axiosMock = new AxiosMocker(axios);

  const ALL_COURSE_SEARCH_URL =
    'https://www.myskillsfuture.sg/services/tex/individual/course-search';
  const INDIVIDUAL_COURSE_SEARCH_URL =
    'https://www.myskillsfuture.sg/services/tex/individual/course-detail';

  const generateNumberOfCoursesResponse = matches => (
    { grouped: { GroupID: { matches } } }
  );
  const generateCourseBatchNestedArray = courseRefNo => (
    { doclist: { docs: [{ Course_Ref_No: courseRefNo }] } }
  );
  const generateCourseBatchResponse = courseRefNos => (
    {
      grouped: {
        GroupID: {
          groups:
      courseRefNos.map(courseRefNo => generateCourseBatchNestedArray(courseRefNo)),
        },
      },
    }
  );

  afterEach(() => {
    axiosMock.reset();
  });

  it('should get all courses', async () => {
    axiosMock.onGet(ALL_COURSE_SEARCH_URL)
      .reply((config) => {
        if (!config.params || Object.keys(config.params).length === 0) {
          return ['200', generateNumberOfCoursesResponse(2)];
        }

        return ['200', generateCourseBatchResponse([1, 2])];
      });

    const expected = [{
      grouped: {
        GroupID: {
          groups: [
            { doclist: { docs: [{ Course_Ref_No: 1 }] } },
            { doclist: { docs: [{ Course_Ref_No: 2 }] } }],
        },
      },
    }];

    const result = await getAllCourses();
    expect(result).toEqual(expected);
  });

  it('should get individual courses', async () => {
    axiosMock.onGet(INDIVIDUAL_COURSE_SEARCH_URL)
      .reply(200, { some_key: 'some_value' });

    const expected = [
      { some_key: 'some_value' },
      { some_key: 'some_value' },
    ];

    const result = await getInvididualCourses([1, 2]);
    expect(result).toEqual(expected);
  });

  it('should perform complete extraction', async () => {
    axiosMock.onGet(ALL_COURSE_SEARCH_URL)
      .reply((config) => {
        if (!config.params || Object.keys(config.params).length === 0) {
          return ['200', generateNumberOfCoursesResponse(2)];
        }

        return ['200', generateCourseBatchResponse([1, 2, 3])];
      });

    axiosMock.onGet(INDIVIDUAL_COURSE_SEARCH_URL)
      .reply(200, { some_key: 'some_value' });

    const expectedAllCourses = [{
      grouped: {
        GroupID: {
          groups: [
            { doclist: { docs: [{ Course_Ref_No: 1 }] } },
            { doclist: { docs: [{ Course_Ref_No: 2 }] } },
            { doclist: { docs: [{ Course_Ref_No: 3 }] } }],
        },
      },
    }];
    const expectedIndividualCourses = [
      { some_key: 'some_value' },
      { some_key: 'some_value' },
      { some_key: 'some_value' },
    ];

    const result = await extractFromSkillsfuture();
    expect(result).toEqual({
      allCourses: expectedAllCourses,
      individualCourses: expectedIndividualCourses,
    });
  });
});

