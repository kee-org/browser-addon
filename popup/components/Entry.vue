<template>
  <v-hover>
    <v-card
      ref="card"
      slot-scope="{ hover }"
      :tabindex="`${tabindex}`"
      :elevation="`${hover ? 12 : 3}`"
      class="my-2"
      @focusin="focusin"
      @focusout="focusout"
      @keyup.context-menu.stop.prevent="showFullDetails"
      @keyup.arrow-down.stop.prevent="nextInList"
      @keyup.arrow-up.stop.prevent="prevInList"
      @keyup.arrow-right.stop.prevent="showFullDetails"
      @keyup.arrow-left.stop.prevent="hideFullDetails"
      @keyup.escape.stop.prevent="exitList"
      @keyup.enter.self.stop.prevent="primaryClickAction"
      @keyup.enter.ctrl.self.stop.prevent="loadInNewTab"
    >
      <v-container
        class="ma-0 pa-0 my-2"
        :style="titleStyle"
      >
        <v-row
          class="mr-3 ml-12"
          :style="`${hover ? 'cursor: pointer' : ''}`"
          @click.left.exact="primaryClickAction"
          @click.middle.exact="loadInNewTab"
          @click.left.ctrl="loadInNewTab"
          @click.middle.ctrl="primaryClickAction"
          @click.right.stop.prevent="showFullDetails"
        >
          <v-col class="text-truncate">
            <v-hover>
              <v-container
                fluid
                class="ma-0 pa-0"
              >
                <v-row no-gutters>
                  <v-col class="text-truncate">
                    {{ entry.title }}
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col
                    :style="`${expanded ? 'visibility:hidden' : ''}`"
                    class="text-truncate caption"
                  >
                    {{ usernameDisplayValue }}
                  </v-col>
                </v-row>
              </v-container>
              <!-- <v-card-title
                :class="`pl-12 ml-2 py-0 mt-4 ${expanded ? 'mb-0' : 'mb-4'} subtitle-1`"
                :style="titleStyle"
              >
                <v-row>
                  <v-col class="text-truncate">
                    {{ entry.title }}
                  </v-col>
                  <v-col
                    :style="`${expanded ? 'visibility:hidden' : ''}`"
                    class="text-truncate caption pr-2 pt-1 py-1"
                  >
                    {{ usernameDisplayValue }}
                  </v-col>
                </v-row>
              </v-card-title> -->
            </v-hover>
          </v-col>
          <v-col
            v-if="hover || focussed"
            cols="2"
            class="mr-3 align-self-center"
          >
            <v-btn
              icon
              @click.stop.prevent="toggleFullDetails"
            >
              <v-icon>{{ expanded ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-card-text class="py-0 text-truncate">
        <v-slide-y-transition>
          <v-container
            v-if="expanded && !!entry.fullDetails"
            class="my-0 pa-0 mx-2"
          >
            <!-- TODO: show a loading screen and also allow initial rendering to be expanded -->
            <Field
              v-for="f of allFields"
              :key="f.value"
              :field="f"
            />
            <!-- TODO new uuids for keys? -->
            <v-row
              justify="space-between"
              align="center"
            >
              <v-col class="text-truncate">
                <v-tooltip
                  top
                  :disabled="!entryPathIsLong"
                >
                  <template v-slot:activator="{ on }">
                    <v-row
                      class="justify-left text-truncate flex-nowrap"
                      align="center"
                      v-on="on"
                    >
                      <v-icon
                        small
                        class="py-1 pl-0 pr-2"
                      >mdi-folder</v-icon>
                      <span class="text-truncate caption py-1">{{ entryPath }}</span>
                    </v-row>
                  </template>
                  <span>{{ fullEntryPath }}</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-row
                      class="justify-left text-truncate flex-nowrap"
                      align="center"
                      v-on="on"
                    >
                      <v-icon
                        small
                        class="py-1 pl-0 pr-2"
                      >mdi-cloud</v-icon>
                      <span class="text-truncate caption py-1">{{ entryDomain }}</span>
                    </v-row>
                  </template>
                  <span>{{ entry.url }}</span>
                </v-tooltip>
              </v-col>

              <v-col class="ma-2 shrink">
                <v-btn
                  fab
                  small
                  left
                  @click="editEntry"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-slide-y-transition>
      </v-card-text>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import Field from "./Field.vue";
import { AddonMessage } from "../../common/AddonMessage";
import { Port } from "../../common/port";
import { mapActions } from "vuex";
import { names as actionNames } from "../../store/action-names";
import { keeLoginInfo } from "../../common/kfDataModel";
import { KeeURL } from "../../common/KeeURL";
import { Action } from "../../common/Action";

export default {
    components: { Field },
    mixins: [Port.mixin],
    props: ["entry","index","loginIndex","frameId"], //TODO: make index optional for when we're not part of a list
    data: () => ({
        expanded: false,
        focussed: false
    }),
    computed: {
        titleStyle: function (this: any) {
            return (
                "background-position:24px calc(50% - 10px); background-image:url(data:image/png;base64," +
        this.entry.iconImageData +
        ")"
            );
        },
        usernameDisplayValue: function (this: any) {
            const e = this.entry;
            return e && e.usernameValue
                ? e.usernameValue
                : "[" + $STR("noUsername_partial_tip") + "]";
        },
        tabindex: function (this: any) {
            return this.index === 0 ? "0" : "-1";
        },
        allFields: function (this: any) {
            const e = this.entry.fullDetails as keeLoginInfo;
            return e.otherFields.concat(e.passwords);
        },
        entryDomain: function (this: any) {
            const urlStr = this.entry.url;
            if (!urlStr || urlStr.length < 4) return "<unknown>";
            const kurl = KeeURL.fromString(urlStr);
            if (!kurl) {
                return "<error>";
            }
            return kurl.domainWithPort || kurl.url.host;
        },
        entryPath: function (this: any) {
            if (!this.entryPathIsLong) {
                return this.fullEntryPath;
            }
            const e = this.entry.fullDetails as keeLoginInfo;
            return "... > " + e.parentGroup.path;
        },
        entryPathIsLong: function (this: any) {
            return this.fullEntryPath.length > 35;
        },
        fullEntryPath: function (this: any) {
            const e = this.entry.fullDetails as keeLoginInfo;
            return e.database.name + " > " + e.parentGroup.path;
        }
    },
    methods: {
        ...mapActions(actionNames),
        toggleFullDetails (this: any) {
            if (!this.expanded) {
                this.showFullDetails();
            } else {
                this.hideFullDetails();
            }
        },
        showFullDetails (this: any) {
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
        hideFullDetails (this: any) {
            this.expanded = false;
        },
        editEntry (this: any) {
            Port.postMessage({
                loginEditor: {
                    uniqueID: this.entry.uniqueID,
                    DBfilename: this.entry.dbFileName
                }
            } as AddonMessage);
            window.close();
        },
        focusin: function (this: any, e) {
            if (!(this.$refs.card as any).$el.contains(e.relatedTarget)) {
                this.focussed = true;
            }
        },
        focusout: function (this: any, e) {
            if (!(this.$refs.card as any).$el.contains(e.relatedTarget)) {
                this.focussed = false;
            }
        },
        async primaryClickAction (this: any) {
            if (this.loginIndex !== undefined) {
            // We are expected to fill an already discovered entry
                this.manualFill();
            } else {
                // Overwriting the Kee Vault tab causes much confusion so prevent that from happening
                const currentTab = await browser.tabs.query({
                    currentWindow: true,
                    active: true,
                    url: ["https://keevault.pm/*", "https://app-beta.kee.pm/*", "https://app-dev.kee.pm/*"]});
                if (currentTab && currentTab.length > 0) {
                    this.loadInNewTab();
                } else {
                    this.loadInSameTab();
                }
            }
        },
        loadInSameTab (this: any) {
            browser.tabs.update({url: this.entry.url});
            window.close();
        },
        loadInNewTab (this: any) {
            browser.tabs.create({url: this.entry.url});
            window.close();
        },
        manualFill (this: any) {
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
    }
};
</script>
