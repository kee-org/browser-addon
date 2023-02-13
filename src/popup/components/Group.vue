<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  orgs: {
    type: Array as PropType<Array<any>>,
    default: () => {
      return [];
    },
  },
});

</script>

<template>
  <template v-for="org in orgs" :key="org._id">
    <v-list-item v-if="org.subOrgs.length === 0" style="margin-right: 50px">
        <div>{{ org._id }} - {{ org.orgName }}</div>
    </v-list-item>
    <template v-else>
      <v-list-group :value="org._id">
          <v-list-item>
            <div>{{ org._id }} - {{ org.orgName }}</div>
        <template #activator="{ props }">
            <span  v-bind="props">test</span>
        </template>
          </v-list-item>
        <!-- RECURSION call the same compoent to create sub orgs in the tree -->
        <Group :orgs="org.subOrgs" />
      </v-list-group>
    </template>
  </template>
</template>
