<template>
    <div>
        <ul>
            <TreeItem
                v-for="item in filteredItems" :key="item.id" :item="item" :indent-level="0"
                @select="(item: GroupListItem) => handleSelect(item)">
            </TreeItem>
        </ul>
    </div>
</template>

<script lang="ts">
import TreeItem, { GroupListItem } from "./TreeItem.vue";
export default {
    name: "GroupSelectorTree",
    components: {
        TreeItem
    },
    props: {
        items: {
            type: Array<GroupListItem>,
            required: true
        },
        filterText: {
            type: String,
            required: true
        }
    },
    emits: ["setGroup"],
    computed: {
        filteredItems() {
            const lowercaseFilterText = this.filterText ? this.filterText.toLowerCase() : "";

            const traverseTree = (node: GroupListItem): boolean => {
                const filteredChildren = node.children?.filter(child => traverseTree(child)) ?? Array<GroupListItem>();
                node.visibleChildIds = filteredChildren.map(child => child.id);
                return node.text.toLowerCase().includes(lowercaseFilterText) || filteredChildren.length > 0;
            };

            this.items.map(item => traverseTree(item));
            return this.items;
        }
    },
    methods: {
        handleSelect(item: GroupListItem) {
            this.$emit("setGroup", item);
        }
    }
};
</script>
