export class Icon {

    version: number = 1;

    // A base64 encoding of the icon for this entry. It will always be a
    // PNG when populated from KeePass but could be other formats when first
    // loading a favicon from a website. (Hopefully this will be an easy exception
    // to deal with but if not we can add a mime type field to this object too)
    iconImageData: string;
}
