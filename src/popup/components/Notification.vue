<template>
    <v-card color="yellow-lighten-3">
        <div style="float: right">
            <v-btn variant="text" class="ml-4 mr-2 px-2 text-primary" @click="closeNotification(notification.id)">
                {{ $i18n("close") }}
                <mdi-close />
            </v-btn>
        </div>

        <v-card-text class="text-primary">
            <p v-for="(msg, index) of notification.messages" :key="index">
                {{ msg }}
            </p>
        </v-card-text>
        <v-card-actions>
            <v-row justify="center" align="end" class="mb-1 mt-1">
                <v-col>
                    <v-row align="end" class="ml-2 justify-left my-0">
                        <v-btn
v-for="(but, index) of notification.buttons" :id="but.id" :key="index" class="mr-4 my-2"
                            @click="
                                dispatchActionResponse(
                                    notification.id,
                                    but.action,
                                    but.values
                                )
                            ">
                            <v-tooltip location="top" :disabled="!but.tooltip" :open-delay="tooltipDelay"> <span>{{
                                but.tooltip
                            }}</span>
                            </v-tooltip>
                            {{ but.label }}
                        </v-btn>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { ButtonAction } from "../../common/Button";
import { configManager } from "../../common/ConfigManager";
import { AddonMessage } from "../../common/AddonMessage";
import { Port } from "../../common/port";
import { tooltipDelay } from "../../common/Timings";
//import useStore from "../../store";

export default {
    props: ["notification"],
    // setup () {
    //     const { updateSaveState } = useStore();
    //     return { updateSaveState };
    // },
    data: () => ({
        tooltipDelay
    }),
    methods: {
        dispatchActionResponse(id: string, action: ButtonAction, data: { [id: string]: string }) {
            const pm = Port.postMessage;
            switch (action) {
                case "enableHighSecurityKPRPCConnection":
                    configManager.current.connSLClient = 3;
                    configManager.save();
                    break;
                case "loadUrlUpgradeKee":
                    pm({ loadUrlUpgradeKee: true });
                    break;
                case "disableNotifyWhenEntryUpdated":
                    configManager.current.notifyWhenEntryUpdated = false;
                    configManager.save();
                    break;
                case "launchLoginEditorFromNotification":
                    pm({
                        loginEditor: {
                            uuid: data.uuid,
                            DBfilename: data.fileName
                        }
                    } as AddonMessage);
                    break;
            }
            pm({ removeNotification: id } as AddonMessage);
        },
        closeNotification(id: string) {
            const pm = Port.postMessage;
            pm({ removeNotification: id } as AddonMessage);
        }
    }
};
</script>
