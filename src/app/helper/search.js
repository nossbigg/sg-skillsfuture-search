import lunr from 'lunr';

class Search {
  constructor(specializations) {
    this.specializations = specializations;
    this.indexedSpecializations = this.createIndexedSpecializationsStore(specializations);
    this.indexer = this.createIndexer(this.specializations);
  }

  search(rawSearchTerm) {
    const cleanedSearchTerm = rawSearchTerm.replace(/[^a-zA-Z0-9 ]/g, '');

    if (this.isEmptySearchTerm(cleanedSearchTerm)) {
      return this.specializations;
    }

    const searchQuery = `name:${cleanedSearchTerm}^5 description:${cleanedSearchTerm}`;

    const searchResults = this.indexer.search(searchQuery);
    const matchedSpecializations = searchResults
      .map(match => match.ref)
      .map(specializationId => this.indexedSpecializations[specializationId]);

    return matchedSpecializations;
  }

  createIndexer(specializations) {
    const indexer = lunr(function () {
      this.ref('id');
      this.field('name');
      this.field('description');

      specializations.forEach(specialization => this.add(specialization));
    });

    return indexer;
  }

  createIndexedSpecializationsStore(specializations) {
    return specializations.reduce(
      (specializationMap, specialization) =>
        ({ ...specializationMap, [specialization.id]: specialization }),
      {},
    );
  }

  isEmptySearchTerm(searchTerm) {
    return searchTerm.trim().length === 0;
  }
}

export default Search;
