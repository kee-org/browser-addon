// This class is a simple data structure to represent transient
// system notification popups (sometimes known as growls)
// For notifications displayed within the Kee browser action popup
// look at the common/KeeNotification class

export class NativeNotification {
    constructor (
        public title: string,
        public message: string
    ) {}
}
