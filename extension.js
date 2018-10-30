const St = imports.gi.St;
const Main = imports.ui.main;
const Lang = imports.lang;
const Tweener = imports.ui.tweener;
const Clutter = imports.gi.Clutter;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;

const Extension = imports.misc.extensionUtils.getCurrentExtension();
const IndicatorButton = Extension.imports.indicator_button;

const Gio = imports.gi.Gio;

const ExtensionSystem = imports.ui.extensionSystem;

const ShellVersion = imports.misc.config.PACKAGE_VERSION.split('.');
let ExtensionPath;
if (ShellVersion[1] === 2) {
    ExtensionPath = ExtensionSystem.extensionMeta['panelSettings@eddiefullmetal.gr'].path;
} else {
    ExtensionPath = imports.misc.extensionUtils.getCurrentExtension().path;
}


let button;
let extension = null;

let overlay;
let overlayOn = false;

var colors = {
    red: 20,
    green: 20,
    blue: 20,
    alpha: 20,

};

const DesktopTintExtension = new Lang.Class({
    Name: 'DesktopTintExtension',

    createOverlay: function() {
        global.log("createoverlay");
        let monitor = Main.layoutManager.primaryMonitor;
        overlay = new St.Bin({ reactive: false, x_fill: true, y_fill: true });

        overlay.set_size(monitor.width, monitor.height);

// Load last from json

       this._file = Gio.file_new_for_path(ExtensionPath + '/settings.json');
        if(this._file.query_exists(null)) {
            [flag, data] = this._file.load_contents(null);

            if(flag){
                colors = JSON.parse(data);
            }
        }
        global.log("Setting clutter color")
        var color = new Clutter.Color(
                {
                    red: colors["red"],
                    green: colors["green"],
                    blue: colors["blue"],
                    alpha: colors["alpha"]
                });
        global.log("clutter color set ")
        overlay.set_background_color(color);

        overlay.opacity = 255;

        overlay.set_position(monitor.x,
                          monitor.y);
        // Arbitrary z position above everything else
        overlay.set_z_position(650);


    },

    setOverlayColor: function(red, green, blue, alpha) {
        global.log("setoverlaycolor");
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
        this.indicator = new IndicatorButton.IndicatorButton(this.toggleOverlay, this.setOverlayColor, colors, overlay);
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
