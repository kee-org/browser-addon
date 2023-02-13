<template>
    <li>
        <div>
            <v-list-item :style="indentStyle" :active="item.selected" density="comfortable" @click="$emit('select', item)">
                <v-btn
                    v-if="hasVisibleChildren" icon size="1.5rem" color="secondary"
                    style="margin-left:0rem; margin-right: 0.5rem;" @click.stop="toggleExpand">
                    <mdi-chevron-up v-if="isExpanded" scale="150" />
                    <mdi-chevron-down v-if="!(isExpanded)" scale="150" />
                </v-btn>
                <span>{{ item.text }}</span>
            </v-list-item>
            <v-item-group v-if="hasVisibleChildren" v-model="isExpanded">
                <ul v-show="isExpanded">
                    <TreeItem
                        v-for="child in filteredChildren" :key="child.id" :item="child"
                        :indent-level="indentLevel + 1" @select="(item) => handleSelect(item)"></TreeItem>
                </ul>
            </v-item-group>
        </div>
    </li>
</template>
<script lang="ts">
export class GroupListItem {
    constructor(
        public id: string,
        public text: string,
        public children?: GroupListItem[],
        public selected?: boolean,
        public visibleChildIds: string[] = []
    ) { }
}
export default {
    name: "TreeItem",
    props: {
        item: {
            type: GroupListItem,
            required: true
        },
        indentLevel: {
            type: Number,
            default: 0
        }
    },
    emits: ["select"],

    data() {
        return {
            isExpanded: true
        };
    },
    computed: {
        hasVisibleChildren() {
            return this.item.visibleChildIds.length > 0;
        },
        indentStyle() {
            return {
                // expand/contract icon is 2rem wide
                paddingLeft: this.hasVisibleChildren ? `${(this.indentLevel) + 0.25}rem` : `${(this.indentLevel) + 2.25}rem`
            };
        },
        filteredChildren() {
            return this.item.children.filter(child => this.isChildVisible(child));
        }
    },
    methods: {
        toggleExpand() {
            this.isExpanded = !this.isExpanded;
        },
        handleSelect(item: GroupListItem) {
            this.$emit("select", item);
        },
        isChildVisible(item: GroupListItem) {
            return this.item.visibleChildIds.includes(item.id);
        }
    }
};

</script>
