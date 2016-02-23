
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Clutter = imports.gi.Clutter;

let text, button, stage, hello_text, monitor;
let max_opacity = 30 * 255/100;

function _createOverlay() {
    if (!text) {
        text = new St.Bin({ reactive: false, x_fill: true, y_fill: true });

        text.set_size(monitor.width, monitor.height);
        Main.uiGroup.add_actor(text);
    }

    var color = new Clutter.Color(
            {
                red: 120,
                green: 100,
                blue: 50,
                alpha: 255
            });
    text.set_background_color(color);

    text.opacity = max_opacity;

    text.set_position(monitor.x,
                      monitor.y);

}

function _toggleOverlay() {
    if (text.opacity === 0)
        text.opacity = max_opacity;
    else
        text.opacity = 0;
}

function init() {
    Clutter.init(null);
    monitor = Main.layoutManager.primaryMonitor;
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    let icon = new St.Icon({ icon_name: 'system-run-symbolic',
                             style_class: 'system-status-icon' });

    button.set_child(icon);
    _createOverlay();
    button.connect('button-press-event', _toggleOverlay);

}

function enable() {
    _createOverlay();
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
    Main.uiGroup.remove_actor(text);
    text = null;
}
