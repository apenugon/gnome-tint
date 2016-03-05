const St = imports.gi.St;
const Main = imports.ui.main;
const Lang = imports.lang;
const Tweener = imports.ui.tweener;
const Clutter = imports.gi.Clutter;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;

const Extension = imports.misc.extensionUtils.getCurrentExtension();
const IndicatorButton = Extension.imports.indicator_button;

let button;
let extension = null;
let max_opacity = 30 * 255/100;

let text;

const DesktopTintExtension = new Lang.Class({
    Name: 'DesktopTintExtension',

    createOverlay: function() {
        let monitor = Main.layoutManager.primaryMonitor;
        text = new St.Bin({ reactive: false, x_fill: true, y_fill: true });

        text.set_size(monitor.width, monitor.height);


        var color = new Clutter.Color(
                {
                    red: 255,
                    green: 100,
                    blue: 0,
                    alpha: 120
                });
        text.set_background_color(color);

        text.opacity = 255;

        text.set_position(monitor.x,
                          monitor.y);
        // Arbitrary z position above everything else
        text.set_z_position(650);

    },

    setOverlayColor: function(red, green, blue, alpha, overlay) {
        var color = new Clutter.Color(
                {
                    red: red,
                    green: green,
                    blue: blue,
                    alpha: alpha
                });
        text.set_background_color(color);
    },

    toggleOverlay: function(actor, event) {
        if (text.opacity === 0)
            text.opacity = max_opacity;
        else
            text.opacity = 0;
    },

    enable: function() {
        this.createOverlay();
        Main.uiGroup.add_actor(text);
        this.indicator = new IndicatorButton.IndicatorButton(this.toggleOverlay, this.setOverlayColor, text);
        Main.panel.addToStatusArea("ChatStatus", this.indicator, 0, "right");
    },

    disable: function() {
        Main.uiGroup.remove_actor(text);
        text = null;
        if (this.indicator) this.indicator.destroy();

        this.indicator = null;
    },

    _init: function() {

    }


});

function init() {
    extension = new DesktopTintExtension();

}

function enable() {
    extension.enable();
}

function disable() {
    extension.disable();
}
