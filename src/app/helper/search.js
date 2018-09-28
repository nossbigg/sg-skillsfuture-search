import lunr from 'lunr';

const NAME_BOOST_VALUE = 5;
const EDIT_DISTANCE = 1;

class Search {
  constructor(specializations) {
    this.specializations = specializations;

    this.indexedSpecializations = this.createIndexedSpecializationsStore(
      this.specializations,
    );
    this.indexer = this.createIndexer(this.specializations);
  }

  search(rawSearchTerm) {
    const cleanedSearchTerm = rawSearchTerm.replace(/[^a-zA-Z0-9 ]/g, '');

    if (this.isEmptySearchTerm(cleanedSearchTerm)) {
      return this.specializations;
    }

    const searchQuery = `
      name:${cleanedSearchTerm}^${NAME_BOOST_VALUE}~${EDIT_DISTANCE} 
      description:${cleanedSearchTerm}~${EDIT_DISTANCE}
    `;

    const searchResults = this.indexer.search(searchQuery);
    return searchResults
      .map(match => match.ref)
      .map(specializationId => this.indexedSpecializations[specializationId]);
  }

  // eslint-disable-next-line class-methods-use-this
  createIndexer(specializations) {
    // eslint-disable-next-line func-names
    return lunr(function() {
      this.ref('id');
      this.field('name');
      this.field('description');

      specializations.forEach(specialization => this.add(specialization));
    });
  }

  // eslint-disable-next-line class-methods-use-this
  createIndexedSpecializationsStore(specializations) {
    return specializations.reduce(
      (specializationMap, specialization) => ({
        ...specializationMap,
        [specialization.id]: specialization,
      }),
      {},
    );
  }

  // eslint-disable-next-line class-methods-use-this
  isEmptySearchTerm(searchTerm) {
    return searchTerm.trim().length === 0;
  }
}

export default Search;
