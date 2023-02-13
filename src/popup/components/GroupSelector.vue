<script setup lang="ts">
import Group from "./Group.vue";

const open = ref<any[]>([]);
const orgTree = ref<any[]>([
    {_id: 'CORP', orgName: 'The Corporation', subOrgs: [
    {_id: 'A', orgName: 'Synergistic analyzer', parent: 'CORP', subOrgs:[
        {_id: 'A1', orgName: 'Name 1', parent: 'A', subOrgs:[]},
        {_id: 'A2', orgName: 'Name 2', parent: 'A', subOrgs:[]},
    ]},
    {_id: 'B', orgName: 'Face to Face', parent: 'CORP', subOrgs:[
        {_id: 'B1', orgName: 'Name 1', parent: 'B', subOrgs:[]},
        {_id: 'B2', orgName: 'Name 2', parent: 'B', subOrgs:[]},
    ]},
    ]}
]);

onBeforeMount(() => {
  open.value = orgTree.value.length > 0 ? [orgTree.value[0]._id] : [];
});

function closeAllOrgs() {
  open.value = orgTree.value.length > 0 ? [orgTree.value[0]._id] : [];
}
</script>

<template>
<div>
            <div style="height: 225px; overflow-y: auto; cursor: pointer">
            <v-list :opened="open" density="compact">
                <Group :orgs="orgTree" />
            </v-list>
            </div>
  </div>
</template>
