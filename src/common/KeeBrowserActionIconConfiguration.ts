export class KeeBrowserActionIconConfiguration {
    constructor(
        public saveAvailable?: boolean,
        public notificationAvailable?: boolean,
        public connectionAvailable?: boolean,
        public dbAvailable?: boolean,
        public matchedEntries?: number
    ) {}
}
