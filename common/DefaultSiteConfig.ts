import { SiteConfigIndex, SiteConfigLookup } from "./config";

export const defaultSiteConfig = new SiteConfigIndex();
defaultSiteConfig.pageRegex = new SiteConfigLookup();

defaultSiteConfig.pageRegex["^.*$"] =
    {
        config: {
            /* TODO:4: ? In future we can give finer control of form rescanning behaviour from here
            rescanDOMevents:
            [{

                // /html/body/div[3]/div/h1/small

                type: "click" | "mutation" | "hover" | etc,
                xpath: "/html/body/div[3]/div/h1/small", // we should do a sanity check on returned items and limit to max of ~a hundred DOM nodes
                id: "someID",
                //something else to limit mutation events to create one (e.g. creation of new child item matching certain xpath? etc.)
            }],
            */

            preventSaveNotification: false,

            /*
                Forms will be scanned iff they have a password (type) field
                UNLESS one of the interestingForms arrays matches the form in question.
                All (w)hitelists will force the form to be scanned for matching passwords.
                (b)lacklists will prevent the form being scanned.
                (b)lacklists have priority over whitelists of the same type but the priorities
                of different types of check are undefined here - you'll have to look at the
                behaviour of the form matching code which is subject to change.
                */
            blackList: {
                form: { names: ["search"], ids: ["search"]},
                fields: { names: ["search", "q", "query"], ids: ["search", "q"]}
            },
            whiteList: {
                form: { names: ["login"], ids: ["login"]},
                fields: { names: ["username", "j_username", "user_name", "user", "user-name",
                    "login", "vb_login_username", "name", "user name", "user id",
                    "user-id", "userid", "email", "e-mail", "id", "form_loginname",
                    "wpname", "mail", "loginid", "login id", "login_name",
                    "openid_identifier", "authentication_email", "openid",
                    "auth_email", "auth_id", "authentication_identifier",
                    "authentication_id", "customer_number", "customernumber", "onlineid"],
                ids: ["username", "j_username", "user_name", "user", "user-name",
                    "login", "vb_login_username", "name", "user-id", "userid", "email",
                    "e-mail", "id", "form_loginname", "wpname", "mail", "loginid",
                    "login_name", "openid_identifier", "authentication_email", "openid",
                    "auth_email", "auth_id", "authentication_identifier", "authentication_id",
                    "customer_number", "customernumber", "onlineid"]}
            }
        },
        matchWeight: 0,
        source: "Default"
    };
