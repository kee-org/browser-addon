<template>
  <v-hover>
    <v-card
      :tabindex="`${tabindex}`"
      slot-scope="{ hover }"
      :elevation="`${hover ? 12 : 3}`"
      class="my-2"
      @focusin="focusin"
      @focusout="focusout"
      ref="card"
      @keyup.context-menu.stop.prevent="showFullDetails"
      @keyup.arrow-down.stop.prevent="nextInList"
      @keyup.arrow-up.stop.prevent="prevInList"
      @keyup.arrow-right.stop.prevent="showFullDetails"
      @keyup.arrow-left.stop.prevent="hideFullDetails"
      @keyup.escape.stop.prevent="exitList"
      @keyup.enter.self.stop.prevent="primaryClickAction"
      @keyup.enter.ctrl.self.stop.prevent="loadInNewTab"
    >
      <v-layout
        row
        justify-center
        align-center
        :style="`${hover ? 'cursor: pointer' : ''}`"
        @click.left.exact="primaryClickAction"
        @click.middle.exact="loadInNewTab"
        @click.left.ctrl="loadInNewTab"
        @click.middle.ctrl="primaryClickAction"
        @click.right.stop.prevent="showFullDetails"
      >
        <v-flex class="text-truncate">
          <v-hover>
            <v-card-title :class="`pl-5 ml-2 py-0 mt-3 ${expanded ? 'mb-0' : 'mb-3'} subheading`" :style="titleStyle">
              <v-layout column>
                <v-flex class="text-truncate">{{entry.title}}</v-flex>
                <v-flex
                    :style="`${expanded ? 'visibility:hidden' : ''}`"
                    class="text-truncate caption pr-2 pt-1 py-1"
                >{{usernameDisplayValue}}</v-flex>
              </v-layout>
            </v-card-title>
          </v-hover>
        </v-flex>
        <v-flex shrink class="my-0" v-if="hover || focussed">
          <v-btn icon @click.stop.prevent="toggleFullDetails">
            <v-icon>{{ expanded ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
      <v-card-text class="py-0 text-truncate">
        <v-slide-y-transition>
          <div v-if="expanded && !!entry.fullDetails">
            <!-- TODO: show a loading screen and also allow initial rendering to be expanded -->
            <Field v-for="f of allFields" :key="f.value" :field="f"/>
            <!-- TODO new uuids for keys? -->
            <v-layout row justify-space-between align-center>
              <v-flex class="text-truncate">
                <v-tooltip top :disabled="!entryPathIsLong">
                  <v-layout row justify-left align-center slot="activator">
                    <v-icon small class="py-1 pl-0 pr-2">folder</v-icon>
                    <span class="text-truncate caption py-1">{{entryPath}}</span>
                  </v-layout>
                  <span>{{fullEntryPath}}</span>
                </v-tooltip>
                <v-tooltip top>
                  <v-layout row justify-left align-center slot="activator">
                    <v-icon small class="py-1 pl-0 pr-2">cloud</v-icon>
                    <span class="text-truncate caption py-1">{{entryDomain}}</span>
                  </v-layout>
                  <span>{{entry.url}}</span>
                </v-tooltip>
              </v-flex>

              <v-flex shrink class="ma-2">
                <v-btn fab small left @click="editEntry">
                  <v-icon>edit</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </div>
        </v-slide-y-transition>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import Field from "./Field.vue";
import { AddonMessage } from "../../common/AddonMessage";
import { Port } from "../../common/port";
import { mapActions } from 'vuex';
import { names as actionNames } from '../../store/action-names';
import { keeLoginInfo } from '../../common/kfDataModel';
import { KeeURL } from '../../common/KeeURL';
import { Action } from '../../common/Action';

export default {
  props: ["entry",'index',"loginIndex","frameId"], //TODO: make index optional for when we're not part of a list

  computed: {
    titleStyle: function(this: any) {
      return (
        "background-position:16px calc(50% - 1px); background-image:url(data:image/png;base64," +
        this.entry.iconImageData +
        ")"
      );
    },
    usernameDisplayValue: function(this: any) {
      const e = this.entry;
      return e && e.usernameValue
        ? e.usernameValue
        : "[" + $STR("noUsername_partial_tip") + "]";
    },
    tabindex: function(this: any) {
      return this.index === 0 ? "0" : "-1";
    },
    allFields: function(this: any) {
        const e = this.entry.fullDetails as keeLoginInfo;
        return e.otherFields.concat(e.passwords);
    },
    entryDomain: function(this: any) {
        let urlStr = this.entry.url;
        if (!urlStr || urlStr.length < 4) return "<unknown>";
        const kurl = KeeURL.fromString(urlStr);
        if (!kurl) {
            return "<error>";
        }
        return kurl.domainWithPort || kurl.url.host;
    },
    entryPath: function(this: any) {
        if (!this.entryPathIsLong) {
            return this.fullEntryPath;
        }
        const e = this.entry.fullDetails as keeLoginInfo;
        return "... > " + e.parentGroup.path;
    },
    entryPathIsLong: function(this: any) {
        return this.fullEntryPath.length > 35;
    },
    fullEntryPath: function (this: any) {
        const e = this.entry.fullDetails as keeLoginInfo;
        return e.database.name + " > " + e.parentGroup.path;
    }
  },
  components: { Field },
  methods: {
    ...mapActions(actionNames),
    toggleFullDetails(this: any) {
      if (!this.expanded) {
          this.showFullDetails();
      } else {
        this.hideFullDetails();
      }
    },
    showFullDetails(this: any) {
      if (!this.expanded && !this.entry.fullDetails) {
          Port.postMessage({
            findMatches: {
            uuid: this.entry.uniqueID,
            DBfilename: this.entry.dbFileName
            }
        } as AddonMessage);
      }
      this.expanded = true;
    },
    hideFullDetails(this: any) {
      this.expanded = false;
    },
    editEntry(this: any) {
      Port.postMessage({
        loginEditor: {
            uniqueID: this.entry.uniqueID,
            DBfilename: this.entry.dbFileName
            }
        } as AddonMessage);
        window.close();
    },
    focusin: function(this: any, e) {
      if (!(this.$refs.card as any).$el.contains(e.relatedTarget)) {
        this.focussed = true;
      }
    },
    focusout: function(this: any, e) {
      if (!(this.$refs.card as any).$el.contains(e.relatedTarget)) {
        this.focussed = false;
      }
    },
    primaryClickAction(this: any) {
        if (this.loginIndex !== undefined) {
            // We are expected to fill an already discovered entry
            this.manualFill();
        } else {
            this.loadInSameTab();
        }
    },
    loadInSameTab(this: any) {
        browser.tabs.update({url: this.entry.url});
        window.close();
    },
    loadInNewTab(this: any) {
        browser.tabs.create({url: this.entry.url});
    },
    manualFill(this: any) {
        Port.postMessage({
            action: Action.ManualFill,
            selectedLoginIndex: this.loginIndex,
            frameId: this.frameId });
        window.close();
    },
    nextInList (this: any, event: Event) {
        const target = event.target as HTMLLIElement;
        if (target.nextElementSibling) {
            (target.nextElementSibling as HTMLLIElement).focus();
        }
    },
    prevInList (this: any, event: Event) {
        const target = event.target as HTMLLIElement;
        if (target.previousElementSibling) {
            (target.previousElementSibling as HTMLLIElement).focus();
        } else {
            //TODO: generalise for more than just search result items
            (document.getElementById("searchBox") as HTMLInputElement).focus();
        }
    },
    exitList (this: any, event: Event) {
        //TODO: generalise for more than just search result items
        (document.getElementById("searchBox") as HTMLInputElement).focus();
    }
  },
  data: () => ({
    expanded: false,
    focussed: false
  }),
  mixins: [Port.mixin]
};
</script>