<template>
  <div class="col-md-4">
    <div class="card">
      <div class="card-body">
        <div class="card-text">
          <template v-if="info.contact.display_collection_contact">
            <h5>Collection contact information</h5>
            <ul class="right-content-list">
              <template v-if="info.head">
                <li><span class="font-weight-bold mr-1">Collection head:</span></li>
                <li><span>{{ info.head }}</span></li>
              </template>
              <li v-if="info.contact.name">
                <span class="font-weight-bold mr-1">Collection contact:</span>
              </li>
              <li><span>{{ info.contact.name }}</span></li>
              <li v-if="info.contact.email">
                <span class="fa fa-fw fa-envelope mr-2" aria-hidden="true"></span>
                <span>{{ info.contact.email }}</span>
                <div v-if="info.contact.phone">
                  <span class="fa fa-fw fa-phone mr-1" aria-hidden="true"></span>
                  <span> {{ info.contact.phone }}</span>
                </div>
                <div v-if="info.contact.website">
                  <span class="fa fa-fw fa-globe mr-2" aria-hidden="true"></span>
                  <a :href="info.contact.website" target="_blank" rel="noopener noreferrer">
                    <span>Collection homepage</span>
                  </a></div>
              </li>
            </ul>
          </template>
          <template v-if="info.biobank">
            <h5>Biobank contact information</h5>
            <ul class="right-content-list">
              <li>{{ info.biobank.name }}</li>
              <li>Registration number at IVO: {{ info.biobank.ivo_regnum }}</li>
              <li>
              <div v-if="info.biobank.email">
                <span class="fa fa-fw fa-envelope mr-2" aria-hidden="true"></span>
                  <span>{{ info.biobank.email }}</span>
              </div>
                <div v-if="info.biobank.website">
                  <span class="fa fa-fw fa-globe mr-2" aria-hidden="true"></span>
                  <a :href="info.biobank.website" target="_blank" rel="noopener noreferrer">
                    <span>Biobank homepage</span>
                  </a>
                </div>
                </li>
                <li v-if="info.biobank.report"><div>
                  <router-link :to="info.biobank.report">
                    <span>All collections of {{ info.biobank.name }}</span> <span class="fa fa-fw fa-arrow-circle-right" aria-hidden="true"></span>
                  </router-link>
                </div></li>
              <!-- <li>
                <div class="container p-0">
                  <div class="row">
                    <div class="col pr-0">
                      <span class="font-weight-bold">Partner charter:</span>
                    </div>
                    <div class="col p-0">
                      <span class="badge badge-info"> {{ info.biobank.partnerCharter }}</span>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <span class="font-weight-bold mr-2">Biobank id:</span>
                <span class="biobank-id">{{ info.biobank.id }}</span>
              </li> -->
            </ul>
          </template>
          <!-- <template v-if="info.networks && info.networks.length > 0">
            <h5>Networks</h5>
            <ul class="right-content-list">
              <li>
                <div class="info-list" v-for="(network, index) in info.networks" :key="`${network.name}-${index}`">
                  <span class="font-weight-bold mr-2">Name:</span>
                  <span>{{ network.name }}</span>
                  <div>
                    <span class="fa fa-fw fa-address-card mr-2" aria-hidden="true"></span>
                    <router-link :to="network.report">
                      <span>View {{ network.name }} network</span>
                    </router-link>
                  </div>
                </div>
              </li>
            </ul>
          </template> -->
          <template v-if="info.certifications && info.certifications.length > 0">
            <h5>Quality</h5>
            <ul class="right-content-list">
              <li>
                <span class="font-weight-bold mr-2">Certification(s):</span>
                <span v-for="(cert, index) in info.certifications" :key="`${cert}-${index}`">
                  <span class="cert-badge badge badge-success">
                    {{ cert }}
                  </span>
                </span>
              </li>
            </ul>
          </template>
          <template v-if="info.collaboration.length > 0">
            <h5>Collaboration</h5>
            <div class="container p-0">
              <div class="row" v-for="(collab, index) in info.collaboration" :key="`${collab.name}-${index}`">
                <div class="col pr-0">
                  <span class="font-weight-bold">{{ collab.name }}:</span>
                </div>
                <div class="col p-0">
                  <span class="badge badge-info">{{ collab.value }}</span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectionReportInfoCard',
  props: {
    info: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.biobank-id {
  word-break: break-all;
}

.right-content-list {
  list-style-type: none;
  margin-left: -2.5rem;
}
.right-content-list:not(:last-child) {
  margin-bottom: 1.5rem;
}

.right-content-list li {
  margin-bottom: 0.5rem;
}

.info-list {
  margin-bottom: 1rem;
}

.cert-badge:not(:last-child) {
  margin-right: 1rem;
}
</style>
