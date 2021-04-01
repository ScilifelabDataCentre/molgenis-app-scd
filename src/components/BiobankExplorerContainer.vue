<template>
  <div class="row biobank-explorer-container">
    <div class="col-md-3">
      <filter-container></filter-container>
    </div>

    <div class="col-md-9">
      <div class="row">
        <div class="col-md-12" v-if="!loading">
          <result-header></result-header>
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <biobank-cards-container></biobank-cards-container>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.biobank-explorer-container {
  padding-top: 0rem;
}
</style>
<script>
// import { CartSelectionToast } from '@molgenis-ui/components-library'
import BiobankCardsContainer from './cards/BiobankCardsContainer'
import FilterContainer from './filters/FilterContainer'
import ResultHeader from './ResultHeader'
import { mapGetters, mapActions } from 'vuex'
import { GET_COLLECTION_INFO, GET_BIOBANK_IDS } from '../store/actions'

export default {
  name: 'biobank-explorer-container',
  components: {
    BiobankCardsContainer,
    FilterContainer,
    ResultHeader
    // ,CartSelectionToast
  },
  data: () => {
    return {
      request: false,
      requestButtonTitle: 'Send to the negotiator'
    }
  },
  computed: {
    ...mapGetters(['rsql', 'biobankRsql', 'loading', 'foundBiobanks', 'foundCollectionIds']),

    hasSelection () {
      if ((this.rsql && this.rsql !== '') || (this.biobankRsql && this.biobankRsql !== '')) return true

      return false
    }
  },
  watch: {
    rsql: {
      immediate: true,
      handler: 'getCollectionInfo'
    },
    biobankRsql: {
      immediate: true,
      handler: 'getBiobankIds'
    }
  },
  methods: {
    ...mapActions({
      getCollectionInfo: GET_COLLECTION_INFO,
      getBiobankIds: GET_BIOBANK_IDS
    }),
    done () {
      this.request = false
    }
  }
}
</script>
