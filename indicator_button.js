const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const St = imports.gi.St;
const Shell = imports.gi.Shell;
const Clutter = imports.gi.Clutter;
const Signals = imports.signals;
const Slider = imports.ui.slider;
const Gio = imports.gi.Gio;

const ExtensionSystem = imports.ui.extensionSystem;

const ShellVersion = imports.misc.config.PACKAGE_VERSION.split('.');
let ExtensionPath;
if (ShellVersion[1] === 2) {
    ExtensionPath = ExtensionSystem.extensionMeta['panelSettings@eddiefullmetal.gr'].path;
} else {
    ExtensionPath = imports.misc.extensionUtils.getCurrentExtension().path;
}
const IndicatorButton = new Lang.Class({
    Name: "IndicatorButton",
    Extends: PanelMenu.Button,



    _init: function(overlayToggle, setOverlayColor, colors) {
        this.colors=colors;
        this.parent(St.Align.START, _("Desktop Tint"), false);

        this._setOverlayColor = setOverlayColor;
        this._overlayToggle = overlayToggle;

        this._label = new St.Label({text: "Tint",
                                track_hover: true });

        let arrow = PopupMenu.arrowIcon(St.Side.BOTTOM);

        this.hbox = new St.BoxLayout();

        this.hbox.add_actor(this._label);
        this.hbox.add_actor(arrow);

        this.actor.add_actor(this.hbox);

        this._createMenu();
        this._updateOverlay();
    },

    _createMenu: function() {
        colors = this.colors;
        this._displayToggle = new PopupMenu.PopupSwitchMenuItem("Tint", true);
        this._displayToggle.connect('toggled', Lang.bind(this,
                    function() {
                        this._overlayToggle();
                    }));
        this.menu.addMenuItem(this._displayToggle);

        // Red
        this._redSlider = new Slider.Slider(colors["red"] / 255);
        this._redSlider.connect('value-changed', Lang.bind(this,this._updateOverlay));
        let _redLabel = new St.Label({text: "Red  "});
        this._redSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._redSliderContainer.actor.add(_redLabel);
        this._redSliderContainer.actor.add(this._redSlider.actor, {expand: true});
        this.menu.addMenuItem(this._redSliderContainer);

        // green
        this._greenSlider = new Slider.Slider(colors["green"] / 255);
        this._greenSlider.connect('value-changed', Lang.bind(this,this._updateOverlay));
        let _greenLabel = new St.Label({text: "Green"});
        this._greenSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._greenSliderContainer.actor.add(_greenLabel);
        this._greenSliderContainer.actor.add(this._greenSlider.actor, {expand: true});
        this.menu.addMenuItem(this._greenSliderContainer);

        // blue
        global.log("Setting slider blue");
        this._blueSlider = new Slider.Slider(colors["blue"] / 255);
        this._blueSlider.connect('value-changed', Lang.bind(this,this._updateOverlay));
        let _blueLabel = new St.Label({text: "Blue "});
        this._blueSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._blueSliderContainer.actor.add(_blueLabel);
        this._blueSliderContainer.actor.add(this._blueSlider.actor, {expand: true});
        this.menu.addMenuItem(this._blueSliderContainer);
        global.log("slider blue set");
        // alpha
        this._alphaSlider = new Slider.Slider(colors["alpha"] / 255);
        this._alphaSlider.connect('value-changed', Lang.bind(this,this._updateOverlay));
        let _alphaLabel = new St.Label({text: "Alpha"});
        this._alphaSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._alphaSliderContainer.actor.add(_alphaLabel);
        this._alphaSliderContainer.actor.add(this._alphaSlider.actor, {expand: true});
        this.menu.addMenuItem(this._alphaSliderContainer);


    },

    _updateOverlay: function () {
        colors = this.colors;
        colors["red"] = 255 * this._redSlider._getCurrentValue();
        colors["green"] = 255 * this._greenSlider._getCurrentValue();
        colors["blue"] = 255 * this._blueSlider._getCurrentValue();
        colors["alpha"] = 255 * this._alphaSlider._getCurrentValue();


        this._setOverlayColor(colors["red"],
            colors["green"],
                colors["blue"],
                colors["alpha"]);



        // save as json



       this._file = Gio.file_new_for_path(ExtensionPath + '/settings.json');
       this._file.replace_contents(JSON.stringify(colors), null, false, 0, null);
    }
});
