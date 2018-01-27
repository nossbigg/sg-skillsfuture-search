import Search from './search';

describe('#search', () => {
  let indexer;

  const data = [
    { id: 1, name: 'data science', description: 'data science in python' },
    { id: 2, name: 'machine learning', description: 'machine learning in python' },
    { id: 3, name: 'data analytics', description: 'data analytics in r' },
  ];

  beforeEach(() => {
    indexer = new Search(data);
  });

  it('returns all documents on empty query', () => {
    const expectedDocuments = [
      { id: 1, name: 'data science', description: 'data science in python' },
      { id: 2, name: 'machine learning', description: 'machine learning in python' },
      { id: 3, name: 'data analytics', description: 'data analytics in r' },
    ];

    const results = indexer.search('');
    expect(results).toEqual(expectedDocuments);
  });

  it('returns all documents on query matching all documents', () => {
    const expectedDocuments = [
      { id: 2, name: 'machine learning', description: 'machine learning in python' },
      { id: 1, name: 'data science', description: 'data science in python' },
      { id: 3, name: 'data analytics', description: 'data analytics in r' },
    ];

    const results = indexer.search('data machine');
    expect(results).toEqual(expectedDocuments);
  });

  it('returns only documents containing \'python\'', () => {
    const expectedDocuments = [
      { id: 1, name: 'data science', description: 'data science in python' },
      { id: 3, name: 'data analytics', description: 'data analytics in r' },
    ];

    const results = indexer.search('data');
    expect(results).toEqual(expectedDocuments);
  });

  it('should sanitize user inputs', () => {
    const expectedDocuments = [
      { id: 1, name: 'data science', description: 'data science in python' },
      { id: 2, name: 'machine learning', description: 'machine learning in python' },
      { id: 3, name: 'data analytics', description: 'data analytics in r' },
    ];

    const results = indexer.search('^--');
    expect(results).toEqual(expectedDocuments);
  });
});
