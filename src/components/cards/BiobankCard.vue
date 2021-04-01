<template>
  <div class="card biobank-card">
    <div class="card-header biobank-card-header" @click.prevent="collapsed = !collapsed">
      <div class="row">
        <div class="col-md-5" v-if="!loading">
          <h5>
            <router-link :to="'/biobank/' + biobank.id">
              <span class="fa fa-table mr-2 icon-alignment" aria-hidden="true" aria-labelledby="biobank-name"></span>
            </router-link>
            <span id="biobank-name">{{ biobank.acronym }}</span>
          </h5>
        </div>
        <div class="col-md-7" v-if="!loading">
          <p>
            <small class="mr-2">
              <span class="font-weight-bold">Sample collection types:</span>
            </small>
            <small>{{ sampleCollectionType }}</small>
            <br />
            <small class="mr-2">
              <span class="font-weight-bold">Juridical person:</span>
            </small>
            <small>{{ biobank['juridical_person'] }}</small>
            <template v-if="availableCovidTypes">
              <br />
              <small class="mr-2">
                <span class="font-weight-bold">Covid-19:</span>
              </small>
              <small :key="type + index" v-for="(type, index) of availableCovidTypes">{{type}}</small>
            </template>
          </p>
        </div>
        <div v-else class="col-md-12 text-center">
          <span class="fa fa-spinner fa-spin" aria-hidden="true"></span>
        </div>
      </div>
    </div>

    <div class="card-body table-card" v-if="!collapsed && !loading">
   <collections-table v-if="biobank.collections.length > 0" :collections="sortedCollections"></collections-table>
    </div>
  </div>
</template>

<script>
import CollectionsTable from '../tables/CollectionsTable.vue'
import utils from '../../utils'
import { sortCollectionsByName } from '../../utils/sorting'
import 'array-flat-polyfill'

export default {
  name: 'biobank-card',
  props: {
    biobank: {
      type: [Object, String]
    },
    initCollapsed: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      collapsed: this.initCollapsed
    }
  },
  computed: {
    sortedCollections () {
      return sortCollectionsByName(this.biobank.collections)
    },
    loading () {
      return typeof this.biobank === 'string'
    },
    sampleCollectionType () {
      const getSubCollections = collection => [
        collection,
        ...collection.sub_collections.flatMap(getSubCollections)
      ]
      const types = this.biobank.collections
        .flatMap(getSubCollections)
        .flatMap(collection => collection.scollection_type)
        .map(type => type.label)
      return utils.getUniqueIdArray(types).join(', ')
    },
    availableCovidTypes () {
      if (
        this.biobank.covid19biobank &&
        this.biobank.covid19biobank.length > 0
      ) {
        return this.biobank.covid19biobank
          .map(covidItem => covidItem.label || covidItem.name)
          .join(', ')
      } else return ''
    }
  },
  components: {
    CollectionsTable
  }
}
</script>

<style>
  .table-card {
    padding: 0.1rem;
  }

  .biobank-card {
    margin-bottom: 1em;
  }

  .biobank-card-header {
    background-color: #f5f5f5;
  }

  .biobank-card-header:hover {
    cursor: pointer;
    background-color: #e4e4e4;
  }
  .biobank-icon:hover {
    cursor: pointer;
  }

  .covid-icon {
    height: 1.5rem;
    width: auto;
  }

  .icon-alignment{
    position: relative;
    top:1px;
  }
</style>
