import "@unocss/reset/tailwind.css";

// Importing all Vuetify styles fixes many style bugs. I think this should be unnecessary but
// some unknown tree shaking issues cause the required styles to not be all included as
// part of the uno css build.
import "vuetify/styles";

// Similarly, this suffers from unknown tree shaking issues so the pencil icon and others
// that aren't referenced via custom icon components never get included in the dependency
// tree and are thus missing from the build unless we reference the entire CSS file.
import "./materialdesignicons.min.css";

// This import appears to be no longer be needed.
//import "./main.css";

// This is the main css file built from the imports across the project and component-scoped styles.
import "uno.css";
