import React from 'react';
import { shallow } from 'enzyme';

import axios from 'axios';
import AxiosMocker from 'axios-mock-adapter';
import App from './App';

import * as Search from './helper/search';
import Specializations from './ui/Specializations';

describe('#App', () => {
  const axiosMock = new AxiosMocker(axios);
  let searchMock;

  const MERGED_STORE_URL = `${process.env.PUBLIC_URL}/data/mergedStore.json`;
  const dummySpecializations = [
    { id: 1, name: 'spec1', percentageCoveredBySkillsfuture: 0.5 },
    { id: 2, name: 'spec2', percentageCoveredBySkillsfuture: 1 },
    { id: 3, name: 'spec3', percentageCoveredBySkillsfuture: 0.7 },
  ];
  const dummyDatastore = {
    specializations: dummySpecializations,
    informationScrapeTimestamp: 1517051587042,
  };

  const createSearchMock = searchResult =>
    jest.fn(() => ({ search: () => searchResult }));

  beforeEach(() => {
    axiosMock.onGet(MERGED_STORE_URL)
      .reply(200, dummyDatastore);

    searchMock = createSearchMock(dummySpecializations);
    Search.default = searchMock;
  });

  afterEach(() => {
    axiosMock.reset();
  });

  it('displays no specializations upon starting of App', async () => {
    const wrapper = shallow(<App />);
    await new Promise(resolve => setTimeout(resolve, 5));

    const specializationsComponent = wrapper.find(Specializations);
    expect(specializationsComponent.props().specializations).toEqual([]);
  });

  it('creates an indexer based on requested data', async () => {
    shallow(<App />);
    await new Promise(resolve => setTimeout(resolve, 5));

    const expectedSpecializations = [
      { id: 1, name: 'spec1', percentageCoveredBySkillsfuture: 0.5 },
      { id: 2, name: 'spec2', percentageCoveredBySkillsfuture: 1 },
      { id: 3, name: 'spec3', percentageCoveredBySkillsfuture: 0.7 },
    ];
    expect(searchMock).toBeCalledWith(expectedSpecializations);
  });

  it('displays specializations from search result', async () => {
    const wrapper = shallow(<App />);
    await new Promise(resolve => setTimeout(resolve, 5));

    const expectedOrderedSpecializations = [
      { id: 2, name: 'spec2', percentageCoveredBySkillsfuture: 1 },
      { id: 3, name: 'spec3', percentageCoveredBySkillsfuture: 0.7 },
      { id: 1, name: 'spec1', percentageCoveredBySkillsfuture: 0.5 },
    ];
    const specializationsComponent = wrapper.update().find(Specializations);
    expect(specializationsComponent.props().specializations)
      .toEqual(expectedOrderedSpecializations);
  });

  it('displays scrape date information', async () => {
    const wrapper = shallow(<App />);
    await new Promise(resolve => setTimeout(resolve, 5));

    const timestampSpan = wrapper.update().find(".informationScrapeTimestamp");
    expect(timestampSpan.text()).toEqual('Information accurate as of 27 Jan 2018');
  });
});
