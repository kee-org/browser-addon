class KeeFoxFieldIcon {

    private fieldsWithIcons: keeFoxLoginField[] = [];

    public removeKeeFoxIconFromAllFields () {
        for (const field of this.fieldsWithIcons) {
            const element: HTMLElement = field.DOMInputElement;
            element.removeEventListener("mousemove", this.hoverOverInput);
            element.style.backgroundImage = "";
            element.style.backgroundRepeat = "";
            element.style.backgroundAttachment = "";
            element.style.backgroundSize = "";
            element.style.backgroundPosition = "";
        }
        this.fieldsWithIcons = [];
    }

    public addKeeFoxIconToFields (passwordFields: keeFoxLoginField[], otherFields: keeFoxLoginField[], matchTotal: number) {

        //TODO:c: tell user how many matches there were
        //const image = matchTotal > 1 ? this.getLabelledIcon(matchTotal.toString()) : this.KEEFOX_ICON_16;
        const image = this.KEEFOX_ICON_16;

        for (const field of passwordFields.concat(otherFields)) {
            if (field.type != "password" && field.type != "text") continue;

            this.fieldsWithIcons.push(field);

            const element: HTMLElement = field.DOMInputElement;
            element.addEventListener("mousemove", this.hoverOverInput);

            element.style.backgroundImage = "url('" + image + "')";
            element.style.backgroundRepeat = "no-repeat";
            element.style.backgroundAttachment = "scroll";
            element.style.backgroundSize = "16px 18px";
            element.style.backgroundPosition = "98% 50%";
        }
    }

    private hoverOverInput (e) {
        if ((e.clientX - e.target.offsetLeft) > (parseInt(document.defaultView.getComputedStyle(e.target).width) - 16)) {
            e.target.style.cursor = "pointer";
            return;
        }
        e.target.style.cursor = "auto";
    }

    private getLabelledIcon (text: string) {
        //TODO:c: caching image output
        //TODO:c: This doesn't work at all yet
        const canvas = document.createElement("canvas");
        const img = document.createElement("img");
        img.src = this.KEEFOX_ICON_16;

        const context = canvas.getContext("2d");
        context.drawImage(img, 0, 2);
        context.fillStyle = "rgba(255,0,0,1)";
        context.fillRect(5, 10, 10, 6);
        context.fillStyle = "red";
        context.font = "8px Arial";
        context.fillText(text, 0, 0);

        return canvas.toDataURL();
    }

    /* tslint:disable */
    readonly KEEFOX_ICON_32 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB9kLEBQODrw4iuwAAAdqSURBVFhH7ZZ7jFXFHcc/M3POuffu3de9y7LLvtxdrIIvUHRRJIVQH0VXqbaixVqbmGgfNtUmNljSp/WR/qE2VoOhtbQmRNQqNsRWlDYgUVxUHu6yYaWwbxb3effeu+eex5zpHwu+ItCk//QPPskk58ycfL+/mfnN7wyc5jQnYdHT75zqk/8Z62SD7YOTt13xh12tden4eefNTla9uWeiMOoGH7b3DG9L5zLrDz1xa/c5rQ+yf/Oak8mcFPHpl6YH3+Dwmiso+cXrv2qpL/v54sYUSgozqyImUqU2eVfTfcTFBAFb/vUBba/vemuGO7lqqPPpnhMZnAp1/GHGLU9RM7O0MrtwVdei5vR1F9YU44caL9TCiIiYYwi0pm+kgF8oUFdqYXleXUdb171O+YWDOr/v/ZMZnQgFcOMTWxg92FNxqHd0MPSDMuko0TcVkjOanYcnqa116MkUaPv3GG09OTwC9u7r5uiH/aKsroKmhXOv+/I9qzMdL/9p53HhGxfMo/PIUQDqS780J1Ve42TyH2U/H4AEeOmHV9F8TsO+oKffuvLyM8T44QEqEwH1lYplF5bg6oD324cIdciylhRNjcWcOa+Gj4bG6N11gIH9PcjQPPa13/1j6XHhl94zqfsWl2/auKrcPLdyuPPxlu6B1eeXZpsTxTcAZJ77JXAsB1p/vekhK+ncn0glETFFZjxLZX0KowRSSYRS9O7p4u2X3qOQyVF/XgNLvv0VjnT0UhiforiilKKSYhPmvMKm+64tOsNJzX/sVrF76WzHTAxEwghJbGYM30uYzFEtqhKJbUierHli3wvitlvWyZEzyrVdFscuiWElbFTcRsUUwpYIS1IbdLPinyvpzTh0jSXoHC1l2G6AOYuIyuuIVdZjF6XRky6Znv5HfpD/yerLa6U50KZFeXoGlWmLWIODEAqZj/AnAqNsKZg9Z73Vl7DusN0A4SiEkh+fC4NBRQoTCebv3UgqKKUiBRdXgZ2YxIl14MTbGc749Bz06RsX9AfVBJ5YvewSy+z8e1Z0jTimMUiIWVUh4UCASkKQ88mlq8Wyh7ff2m8+2GCFWW85AiOUFEIc2xQDSkcYx0I4hm0dBQYPTtGUsmlOK+JxwZQFkSWQjk1j3Ka5QeAU51BCMrhfi/3dvvnLpH/k93OtPinChZEURFMhQknkjFpTpFhKyAbLGy9cYAwCMT11Y8CEEVHCRgYR0gvonbuCddsDigZz2O4QTeIoZyVyNJcrmsptmtMWtWWSoEQwEiYYGcyyb0oLp6jse3Oa/Et0xEIlDUKCjjCH9xwQ8WRckcljuaP5hDmeusZgdIQJIiJfIxyFdBR2RQPzv34jbZvfhNLzGbYTvOsPEJ8YQvUNUVOVws4NMVsMct9llTQ2FzGxK8uP3u7fGj3VMs8U6TX7uxPf/WgwqK+pyIm6K+cf8J7b2/HCo49j+WOuEUJgjMFoQ+RrIk+jEhYyZiEtSagkxjdMT6EAQQ7cCdxAkqqeT/Wi5XhZn8721yi2d1FWkebM6jiv3X1Nxe3bOh+AprK1K8TNixuP1m9/M2f27H1RXPXVS5+/6cf3oFKi5Vs6jGYRGaLIgDZEoSYKIiIvxAQRuhDSd7CHTGZyeqWkgrFBjOdSnqqhyJmBN5YnyBaYG+zgrNYVVHbvNVu7Bhcrir2Hrvf/dlF1YfbBd/N0jmq2ZuXuze2HngRQafvyCwoZ9+JIG4GOiMJo2tzXEML+3e3EpUNv/yBB4B/bKwG5UWLKpq6+hXAywBt38cfj9IzsZl6hDyvyxMqLY7V3LlE3VAVRct+OvOgaCsyrBfSSK5df1JQq9Tv6BxGXnP2byyZGcm8VMgVETOKUxbGTDqrIJhfm6R46BDqCmgbQPkThdBvt5uyqBYjQIch6+JkCwghTknbfb/TWLbi2XJoiiQi1YHJKc6AQ8U6o8kpZcxLJ4v4dQyOfVMKW8x/pzo/nG9wJVwSFAGyJk4zRzQAaPV2wi+NgJaabUIj8MLVjDsKLIyJwimMkyhLMqitf6A/8tntsdOKZNPpaScRoaIaEsp7ZPemuWdpQw7a+I8fTHtF69VrGJt0FIjLvuhkXL+fh5zx8N6AgPOJRjCMlY/hJjR3aCGNA2QgrTsVQlpLiapxkjFhJzMSL46/u2Hlv64r55/LKng4+z7nA53s/vg9c3bruocAN7vdyBQI3wHd9tB8S+hoTRmijkUYipETZEstWqLiNnbBxko6xi5zxxZeeNfOVTW167wc/5b/lMxeS67/57NooCO/yp3wTFEKhvZAwCDHaYMx0tRBSIC2Jsi2smIUdt42VsCeqZ5ac/eGBo8Pb3/j+FxqdiE8CqLgfRh/mpjufvx3Deh2EaE+jA00URcdKJCAlypIoWxkrZgmh5JaMp68h7+ktf/3OCY1OxGdW4DhLblrvVFckHxBC3I2gCPPJ2LFfBUKIrVFkfrZx7TfevmrVs2zZcNsXSZ2SLwzg06y868VmIbggCHRZLGaF2bx3cPOfV70DcMMdG3n5jzefSuI0p/n/5j8ayXIX5q0OrAAAAABJRU5ErkJggg==";
    readonly KEEFOX_ICON_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAAuIwAALiMBeKU/dgAAAAd0SU1FB9kJGBUqMtwJBnUAAAKLSURBVDjL3dLPS1MBAAfw7/u5vffc3C/b/DHQNtRccwYx0kNk2SGkMEgII8mKDuG5k1BQ/gEeokOXCuoQodghikIPzrA0M2zLnC2Hbm019/Z7773tvXWL/oOgz9/wAf41AsYuQFMBkmpp6Ts+0Xuy/1S722FbXd/NLs3MzovBlUmACA11svCzMUy9T+PmmA3lVBWjXi9oaCpAcQOW4fHnx84c5cysCksjBzdv50mFHlmUhJGiGLwEVXyoqkAZIEuKBlWraQBAUXVNrYfOXVl0tDZzYGTorDrMza0h8jUCSc9DyhPwnB4cokMLr/rbsmOXj3DTZpW6IYkM42trCNONrp4JV5dXz1gokAYeXCqOqdh1RJMKMs5u5Po6sJnLwHSAX2jXKjRyzXD7OEgO7U4wrTpoA9d8Ir+Thk7Wg1WAvWIO914z8FhJeEof4RTe4oINUG0m+tYT6cvoQK2oJpXDBc6E8QfLAVpJyub89z1UJQGVggLeakVg/1U8iqSB7SgaOQoeC43bzlUQRnk5xvKTZEVYyWz/MrS5nQk6t5vMshVTvZA1Qm/jIVI/UYolgbp6EOkqDHYvIjkj1rLfcNFXGP6U2HAJVdJw910pYPd3ByimvsknFB09hbiIXCqHz6EPKJMV4KAHgs4MYUMBigTm4zth+Ud4T0mj6+mWPJOo4XwsmpQIwtjh6nafDellGysmUpCqEmSdDMZsB00SaFBZyHwG65HZ3tby1hKDKk0TqJJ/Ihk6QdPMoN8/PO2wtLNSoQxVVkFSBPR1HJKZLSyvPLtWqVbuu5UIuJqM2l8TKej3QdO08E507XE6v2uiBdIBrsJm5bgY3HzzciM0P6LV8AIEAYsqgoGK/8xvGJ0XB+MG7a4AAAAASUVORK5CYII=";
    /* tslint:enable */

}
