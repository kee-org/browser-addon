let defaultSiteConfig = [
    {
        url: "*",
        config: {
            rescanFormDelay: -1, // to +INTMAX, // if old "rescan forms" set to true - configure to whatever that default was (5 seconds?)
            /* TODO:2: ? (Might be redundant since changes for e10s). In future we can give finer control of form rescanning behaviour from here
            rescanDOMevents:
            [{

                // /html/body/div[3]/div/h1/small

                type: "click" | "mutation" | "hover" | etc,
                xpath: "/html/body/div[3]/div/h1/small", // we should do a sanity check on returned items and limit to max of ~a hundred DOM nodes
                id: "someID",
                //something else to limit mutation events to create one (e.g. creation of new child item matching certain xpath? etc.)
            }],
            */
            interestingForms: {
                /*
                Forms will be scanned iff they have a password (type) field
                UNLESS one of the interestingForms arrays matches the form in question.
                All (w)hitelists will force the form to be scanned for matching passwords.
                (b)lacklists will prevent the form being scanned.
                (b)lacklists have priority over whitelists of the same type but the priorities
                of different types of check are undefined here - you'll have to look at the
                behaviour of the form matching code which is subject to change.
                */
                name_w: ["login"],
                name_b: ["search"],
                id_w: ["login"],
                id_b: ["search"],
                //f_type_w: ["password"],
                //f_type_b: [],
                f_name_w: ["username", "j_username", "user_name", "user", "user-name",
                 "login", "vb_login_username", "name", "user name", "user id",
                  "user-id", "userid", "email", "e-mail", "id", "form_loginname",
                   "wpname", "mail", "loginid", "login id", "login_name",
                    "openid_identifier", "authentication_email", "openid",
                     "auth_email", "auth_id", "authentication_identifier",
                      "authentication_id", "customer_number", "customernumber", "onlineid"],
                f_name_b: ["search", "q", "query"],
                f_id_w: ["username", "j_username", "user_name", "user", "user-name",
                 "login", "vb_login_username", "name", "user-id", "userid", "email",
                  "e-mail", "id", "form_loginname", "wpname", "mail", "loginid",
                   "login_name", "openid_identifier", "authentication_email", "openid",
                    "auth_email", "auth_id", "authentication_identifier", "authentication_id",
                     "customer_number", "customernumber", "onlineid"],
                f_id_b: ["search", "q"],

                // simple string comparisons won't work here becuase multiple
                // xpaths could lead to the same element. Each xpath listed here
                // will have to be found and any discovered element's parent
                // form then compared against the potentially interesting form
                xpath_w: [],
                xpath_b: [],
                f_xpath_w: [],
                f_xpath_b: []
            },
            preventSaveNotification: false
        }
    },
    {
        url: "http://www.bild.de",
        config: {
            rescanFormDelay: 2500
        }
    },
    {
        url: "https://www.bild.de",
        config: {
            rescanFormDelay: 2500
        }
    },
    {
        url: "https://login.live.com",
        config: {
            rescanFormDelay: 2500
        }
    },
    {
        url: "https://login.microsoftonline.com",
        config: {
            rescanFormDelay: 2500
        }
    }

    /*,
    {
        url:"http://domain.name/page.html?...",
        config:{
            ...
        }
    }
    */
];
