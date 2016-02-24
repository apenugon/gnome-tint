const St = imports.gi.St;
const Main = imports.ui.main;
const Lang = imports.lang;
const Tweener = imports.ui.tweener;
const Clutter = imports.gi.Clutter;
const PopupMenu = imports.ui.popupMenu;

const Extension = imports.misc.extensionUtils.getCurrentExtension();

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
                    alpha: 255
                });
        text.set_background_color(color);

        text.opacity = max_opacity + 30;

        text.set_position(monitor.x,
                          monitor.y);
        // Arbitrary z position above everything else
        text.set_z_position(650);

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
        Main.panel._rightBox.insert_child_at_index(button, 0);
    },

    disable: function() {
        Main.panel._rightBox.remove_child(button);
        Main.uiGroup.remove_actor(text);
        text = null;
    },

    _init: function() {
        button = new St.Bin({ style_class: 'panel-button',
                              reactive: true,
                              can_focus: true,
                              x_fill: true,
                              y_fill: false,
                              track_hover: true });
        let icon = new St.Icon({ icon_name: 'system-run-symbolic',
                                 style_class: 'system-status-icon' });

        button.set_child(icon);
        button.connect('button-press-event', this.toggleOverlay);
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
