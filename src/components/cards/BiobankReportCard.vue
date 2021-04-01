<template>
  <div class="mg-biobank-card container">
    <loading
      :active="isLoading"
      loader="dots"
      color="var(--secondary)"
      background-color="var(--light)"
    ></loading>
    <div class="container-fluid">
      <div class="row pl-0">
        <div class="col pl-0">
          <!-- Back to previous page buttons -->
          <button class="btn back-text" @click="back">
            <i class="fa fa-angle-left" aria-hidden="true"></i> Back
          </button>
        </div>
      </div>

      <div class="row" v-if="biobankDataAvailable && !this.isLoading">
        <div class="col">
          <div class="row mr-1"><div class="col-auto"><report-title type="Biobank" :name="biobank.name"></report-title></div><div class="col d-flex justify-content-end"><img style="height: 80px" v-bind:src="biobank.logoURL" v-bind:rel="biobank.name"></div></div>
          <div class="container">
            <div class="row pl-0">
              <div class="col-md-8 pl-0">
                <report-description :description="biobank.description" :maxLength="500"></report-description>
                <div v-if="biobank.acronym" class="row"><div class="col-auto font-weight-bold">Acronym:</div><div class="col pl-0">{{ biobank.acronym }}</div></div>
                <div class="row"><div class="col-auto font-weight-bold">Juridical person:</div><div class="col pl-0">{{ biobank.juridical_person }}</div></div>
                <div v-if="biobank.ivo_regnum" class="row"><div class="col-auto font-weight-bold">Biobank registration number at IVO:</div><div class="col pl-0">{{ biobank.ivo_regnum }}</div></div>
                <!--- <div class="row"><div class="col-auto font-weight-bold">Biobank ID in the COVID-19 Biobank Registry:</div><div class="col pl-0">{{ biobank.id }}</div></div> --->

                <h4 class="mt-3">Collections</h4>
                <div class="pl-0" v-for="(collection, index) in collectionsData" :key="collection.id">
                  <hr v-if="index"/>
                  <report-collection :collection="collection"></report-collection>
                </div>
              </div>
              <!-- Right side card -->
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <div class="card-text">
                      <h5>Contact Information</h5>
                      <!-- <report-details-list :reportDetails="contact"></report-details-list> -->
                      <div v-if="biobank.address" class="row mb-2"><div class="col">
                        <span> {{ biobank.address }}, {{ biobank.country.name }}</span>
                      </div></div>
                      <div class="row"><div class="col">
                        <span class="fa fa-fw fa-envelope mr-1" aria-hidden="true"></span>
                        <span> {{ contact.email.value }}</span>
                      </div></div>
                      <div v-if="biobank.url" class="row"><div class="col">
                        <span class="fa fa-fw fa-globe mr-2" aria-hidden="true"></span>
                        <a :href="biobank.url" target="_blank" rel="noopener noreferrer">Biobank homepage</a>
                      </div></div>
                      <div v-if="biobank.biobank_sverige" class="mt-2"><b>Part of:</b><br><a href="https://biobanksverige.se/"><img style="height: 60px" src="https://biobanksverige.se/wp-content/themes/nbr/img/biobanksverige-logo.jpg" rel="Part of Biobank Sverige"></a></div>
                      <h5 v-if="networks && networks.length > 0">Networks</h5>
                      <report-details-list :reportDetails="network" v-for="network in networks"
                                           :key="network.id"></report-details-list>
                      <h5 v-if="quality && quality.Certification && quality.Certification.value.length > 0">Quality</h5>
                      <report-details-list :reportDetails="quality"></report-details-list>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { GET_BIOBANK_REPORT } from '../../store/actions'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import ReportDescription from '../report-components/ReportDescription.vue'
import ReportTitle from '../report-components/ReportTitle.vue'
import ReportDetailsList from '../report-components/ReportDetailsList.vue'
import ReportCollection from '../report-components/ReportCollection.vue'
import {
  mapContactInfo,
  mapCollectionsData,
  mapNetworkInfo,
  mapObjArrayToStringArrayIfExists
} from '../../utils/templateMapper'

export default {
  name: 'biobank-report-card',
  components: {
    ReportTitle,
    ReportDescription,
    ReportDetailsList,
    ReportCollection,
    Loading
  },
  data () {
    return {
      collapsed: true
    }
  },
  computed: {
    ...mapState({
      biobank: 'biobankReport',
      isLoading: 'isLoading'
    }),
    biobankDataAvailable () {
      return this.biobank && this.biobank
    },
    query () {
      return this.$route.query
    },
    networks () {
      return this.biobankDataAvailable && this.biobank.network ? mapNetworkInfo(this.biobank) : []
    },
    contact () {
      return this.biobankDataAvailable && this.biobank.contact ? mapContactInfo(this.biobank) : {}
    },
    collectionsData () {
      return this.biobankDataAvailable && this.biobank.collections ? mapCollectionsData(this.biobank.collections).filter(it => !it.parentCollection) : []
    },
    quality () {
      return { Certification: { value: mapObjArrayToStringArrayIfExists(this.biobank.quality), type: 'list' } }
    },
    availableCovidTypes () {
      if (
        this.biobank.covid19biobank &&
          this.biobank.covid19biobank.length > 0
      ) {
        return {
          Covid19: {
            badgeColor: 'warning',
            type: 'list',
            value: this.biobank.covid19biobank
              .map(covidItem => covidItem.label || covidItem.name)
          }
        }
      } else return ''
    }
  },
  methods: {
    ...mapActions({
      getBiobankReport: GET_BIOBANK_REPORT
    }),
    back () {
      this.$router.go(-1)
    }
  },
  mounted () {
    this.getBiobankReport(this.$store.state.route.params.id)
  }
}
</script>
