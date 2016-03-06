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

let overlay;
let overlayOn = false;

const DesktopTintExtension = new Lang.Class({
    Name: 'DesktopTintExtension',

    createOverlay: function() {
        let monitor = Main.layoutManager.primaryMonitor;
        overlay = new St.Bin({ reactive: false, x_fill: true, y_fill: true });

        overlay.set_size(monitor.width, monitor.height);


        var color = new Clutter.Color(
                {
                    red: 255,
                    green: 100,
                    blue: 0,
                    alpha: 120
                });
        overlay.set_background_color(color);

        overlay.opacity = 255;

        overlay.set_position(monitor.x,
                          monitor.y);
        // Arbitrary z position above everything else
        overlay.set_z_position(650);

    },

    setOverlayColor: function(red, green, blue, alpha) {
        var color = new Clutter.Color(
                {
                    red: red,
                    green: green,
                    blue: blue,
                    alpha: alpha
                });
        overlay.set_background_color(color);
    },

    toggleOverlay: function(actor, event) {
        if (overlayOn) {
            Main.uiGroup.remove_actor(overlay);
            overlayOn = false;
        } else {
            Main.uiGroup.add_actor(overlay);
            overlayOn = true;
        }
    },

    enable: function() {
        this.createOverlay();
        Main.uiGroup.add_actor(overlay);
        overlayOn = true;
        this.indicator = new IndicatorButton.IndicatorButton(this.toggleOverlay, this.setOverlayColor, overlay);
        Main.panel.addToStatusArea("ChatStatus", this.indicator, 0, "right");
    },

    disable: function() {
        Main.uiGroup.remove_actor(overlay);
        overlay = null;
        overlayOn = false;
        if (this.indicator) this.indicator.destroy();

        this.indicator = null;
    },

    _init: function() {

    }


});

function init() {

}

function enable() {
    extension = new DesktopTintExtension();
    extension.enable();
}

function disable() {
    extension.disable();
    extension = null;
}
