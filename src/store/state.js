import { covid19BiobankNetworkSelectionId, covid19CollectionNetworkSelectionId } from './helpers/covid19Helper'
export const INITIAL_STATE = window.__INITIAL_STATE__ || {}

// Create an object type AppConfigurationException
function AppConfigurationException (message) {
  this.message = message
  this.name = 'ConfigurationException'
}

if (window.__INITIAL_STATE__ && window.__INITIAL_STATE__.showCountryFacet === false && !window.__INITIAL_STATE__.preConfiguredCountyCode) {
  throw new AppConfigurationException('You have to specify a preconfigured country code in your app-configuration.')
}

export default {
  isLoading: false,
  error: null,
  showCountryFacet: INITIAL_STATE.hasOwnProperty('showCountryFacet') ? INITIAL_STATE.showCountryFacet : true,
  preConfiguredCountyCode: INITIAL_STATE.preConfiguredCountyCode,
  // Map ID to biobank
  biobanks: {},
  // IDs of biobanks matching the biobank filters
  biobankIds: undefined,
  // IDs of collections matching the collection filters
  collectionIds: undefined,
  /* A single biobank object which is fetched by ID for showing the BiobankReportCard component */
  biobankReport: undefined,
  collectionReport: undefined,
  networkReport: {
    network: undefined,
    collections: undefined,
    biobanks: undefined
  },
  search: '',
  /* Randomly generated 32 character token provided by the Negotiator
  when they want to edit an existing query */
  nToken: null,
  country: {
    filters: [],
    options: []
  },
  materials: {
    filters: [],
    options: []
  },
  collection_quality: {
    filters: [],
    options: [],
    collections: []
  },
  covid19: {
    filters: [],
    options: []
  },
  covid19network: {
    filters: [],
    options: [
      { id: covid19BiobankNetworkSelectionId, label: 'Biobanks providing COVID-19 services' },
      { id: covid19CollectionNetworkSelectionId, label: 'Collections with COVID-19 samples' }
    ]
  },
  // this is a shadow facet, used to filter out biobanks on network id for covid19.
  biobank_network: {
    filters: []
  },
  // this is a shadow facet, used to filter out collections on network id for covid19.
  collection_network: {
    filters: []
  },
  biobank_quality: {
    filters: [],
    options: [],
    biobanks: []
  },
  diagnosis_available: {
    filters: [],
    options: []
  },
  type: {
    filters: [],
    options: []
  },
  dataType: {
    filters: [],
    options: []
  }
}
