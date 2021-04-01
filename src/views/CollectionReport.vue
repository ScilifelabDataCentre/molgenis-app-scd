<template>
  <div class="container mg-collection-report-card">
    <loading :active="isLoading" loader="dots" :is-full-page="true" color="var(--secondary)" background-color="var(--light)"></loading>
    <div class="container-fluid">
      <!-- Back to previous page buttons -->
      <button class="btn btn-link pl-0 back-text" @click="back"><i class="fa fa-angle-left" aria-hidden="true"></i> Back</button>

      <div class="row" v-if="this.collection && !this.isLoading">
        <div class="col">
          <report-title type="Collection" :name="collection.name"></report-title>
          <div class="container p-0">
            <div class="row">
              <div class="col ml-0">
                <report-description :description="collection.description" :maxLength="500"></report-description>
                <div class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Biobank:</div><div class="col pl-0">{{ info.biobank.name }}</div></div>
                <div v-if="collection.acronym" class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Acronym:</div><div class="col pl-0">{{ collection.acronym }}</div></div>
                <div class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Local collection ID (within the biobank):</div><div class="col pl-0">{{ collection.local_id }}</div></div>

                <!-- General information -->
                <div class="row ml-0 mt-3"><h4>General information</h4></div>
                <div class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Collection size:</div><div class="col pl-0">{{ collection.order_of_magnitude.size }} (as of {{ collection.timestamp | formatDate }})</div></div>
                <report-list-row :data="mainContent.Type">Type:</report-list-row>
                <report-list-row :data="mainContent.Data">Data:</report-list-row>
                <div class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Start date of sampling:</div><div class="col pl-0">{{ collection.sampling_startdate | formatDate}}</div></div>
                <div v-if="collection.sampling_enddate" class="row ml-0"><div class="col-auto pl-0 font-weight-bold">End date of sampling:</div><div class="col pl-0">{{ collection.sampling_enddate | formatDate }}</div></div>
                <div class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Collection preserved at least until:</div><div class="col pl-0">{{ collection.storage_duration | formatDate }}</div></div>
                <div class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Ethical approval number:</div><div class="col pl-0">{{ collection.ethics_id }}</div></div>

                <!-- Donor information -->
                <div v-if="mainContent.Diagnosis.value.length>0 || collection.order_of_magnitude_donors || collection.autopsy || collection.minors || collection.inclusion_criteria || collection.exclusion_criteria" class="row ml-0 mt-3"><h4>Donor information</h4></div>
                <report-list-row :data="mainContent.Diagnosis">Diagnosis:</report-list-row>
                <div v-if="collection.order_of_magnitude_donors" class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Number of donors:</div><div class="col pl-0">{{ collection.order_of_magnitude_donors.size }}</div></div>
                <div v-if="collection.autopsy" class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Samples from deceased (autopsy):</div><div class="col pl-0">yes</div></div>
                <div v-else-if="collection.autopsy===false" class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Samples from deceased (autopsy):</div><div class="col pl-0">no</div></div>
                <div v-if="collection.minors" class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Samples from minors (&lt;18 years old):</div><div class="col pl-0">yes</div></div>
                <div v-else-if="collection.minors===false" class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Samples from minors (&lt;18 years old):</div><div class="col pl-0">no</div></div>
                <div v-if="collection.inclusion_criteria" class="row ml-0"><div class="col pl-0 font-weight-bold">Inclusion criteria:</div></div>
                <div v-if="collection.inclusion_criteria" class="row ml-0"><div class="col pl-0">{{ collection.inclusion_criteria }}</div></div>
                <div v-if="collection.exclusion_criteria" class="row ml-0"><div class="col pl-0 font-weight-bold">Exclusion criteria:</div></div>
                <div v-if="collection.exclusion_criteria" class="row ml-0"><div class="col pl-0">{{ collection.exclusion_criteria }}</div></div>

                <!-- Sample information -->
                <div v-if="mainContent.Materials.value.length>0 || mainContent.Storage.value.length>0 || collection.sample_access_fee == false || collection.sample_access_fee == true || collection.sample_access_joint_project == false || collection.sample_access_joint_project == true" class="row ml-0 mt-3"><h4>Sample information</h4></div>
                <report-list-row :data="mainContent.Materials">Materials:</report-list-row>
                <report-list-row :data="mainContent.Storage">Storage temperatures:</report-list-row>
                <div v-if="collection.sample_access_fee == false || collection.sample_access_fee == true" class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Sample access in exchange for a fee:</div><div class="col pl-0"><span v-if="collection.sample_access_fee">Yes</span><span v-else>No</span></div></div>
                <div v-if="collection.sample_access_joint_project == false || collection.sample_access_joint_project == true" class="row ml-0"><div class="col-auto pl-0 font-weight-bold">Sample access on the basis of a joint project:</div><div class="col pl-0"><span v-if="collection.sample_access_joint_project">Yes</span><span v-else>No</span></div></div>

                <!-- Recursive set of subcollections -->
                <div v-if="collection.sub_collections && collection.sub_collections.length" class="mt-2">
                  <h5>Sub collections</h5>
                  <report-sub-collection v-for="subCollection in subCollections" :collection="subCollection" :key="subCollection.id" :level="1"></report-sub-collection>
                </div>

                <!-- Publications information -->
                <div v-if="collection.publications_list" class="row ml-0 mt-3"><h4>Publications based on the collection</h4></div>
                <div v-if="collection.publications_list" class="row ml-0 mb-3"><div class="col pl-0">{{ collection.publications_list }}</div></div>
              </div>

              <!-- Right side card -->
              <collection-report-info-card :info="info"></collection-report-info-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import { GET_COLLECTION_REPORT } from '@/store/actions'
import ReportDescription from '@/components/report-components/ReportDescription'
import ReportTitle from '@/components/report-components/ReportTitle'
import ReportListRow from '@/components/report-components/ReportListRow'
import ReportSubCollection from '@/components/report-components/ReportSubCollection'
import CollectionReportInfoCard from '@/components/cards/CollectionReportInfoCard'

import { mapDetailsTableContent, mapCollectionsData, collectionReportInformation } from '@/utils/templateMapper'

export default {
  name: 'CollectionReport',
  components: {
    ReportListRow,
    ReportTitle,
    ReportDescription,
    ReportSubCollection,
    CollectionReportInfoCard,
    Loading
  },
  methods: {
    ...mapActions({
      getCollectionReport: GET_COLLECTION_REPORT
    }),
    back () {
      this.$router.go(-1)
    }
  },
  computed: {
    ...mapState({ collection: 'collectionReport', isLoading: 'isLoading' }),
    mainContent () {
      return this.collection ? mapDetailsTableContent(this.collection) : {}
    },
    info () {
      return collectionReportInformation(this.collection)
    },
    subCollections () {
      return this.collection && this.collection.sub_collections && this.collection.sub_collections.length ? mapCollectionsData(this.collection.sub_collections) : []
    },
    collectionId () {
      const splittedUrl = this.$route.fullPath.split('/')
      return splittedUrl[splittedUrl.length - 1]
    }
  },
  // needed because if we route back the component is not destroyed but its props are updated for other collection
  watch: {
    $route (to, from) {
      if (from.name.indexOf('collection') >= 0) {
        location.reload()
      }
    }
  },
  mounted () {
    this.getCollectionReport([this.collectionId])
  },
  filters: {
    formatDate (date) {
      return date.substring(0, 10)
    }
  }
}
</script>

<style scoped>
>>> .mg-report-details-list th {
  vertical-align: top;
}
</style>
