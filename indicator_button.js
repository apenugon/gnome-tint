const Lang = imports.lang;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const St = imports.gi.St;
const Shell = imports.gi.Shell;
const Clutter = imports.gi.Clutter;
const Signals = imports.signals;
const Slider = imports.ui.slider;

const Menu = new Lang.Class({
    Name: 'DesktopTintMenu',
    Extends: PopupMenu.PopupMenu,

    _init: function(button, overlayToggle) {
        this.parent(button.actor, St.Align.START, St.Side.TOP);

    }
});

const IndicatorButton = new Lang.Class({
    Name: "IndicatorButton",
    Extends: PanelMenu.Button,

    _init: function(overlayToggle, setOverlayColor) {
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
    },

    _createMenu: function() {
        this._displayToggle = new PopupMenu.PopupSwitchMenuItem("Tint", true);
        this._displayToggle.connect('toggled', Lang.bind(this,
                    function() {
                        this._overlayToggle();
                    }));
        this.menu.addMenuItem(this._displayToggle);

        // Red
        this._redSlider = new Slider.Slider(1);
        this._redSlider.connect('value-changed', Lang.bind(this,this._updateOverlay));
        let _redLabel = new St.Label({text: "Red  "});
        this._redSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._redSliderContainer.actor.add(_redLabel);
        this._redSliderContainer.actor.add(this._redSlider.actor, {expand: true});
        this.menu.addMenuItem(this._redSliderContainer);

        // green
        this._greenSlider = new Slider.Slider(0.4);
        this._greenSlider.connect('value-changed', Lang.bind(this,this._updateOverlay));
        let _greenLabel = new St.Label({text: "Green"});
        this._greenSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._greenSliderContainer.actor.add(_greenLabel);
        this._greenSliderContainer.actor.add(this._greenSlider.actor, {expand: true});
        this.menu.addMenuItem(this._greenSliderContainer);

        // blue
        this._blueSlider = new Slider.Slider(0);
        this._blueSlider.connect('value-changed', Lang.bind(this,this._updateOverlay));
        let _blueLabel = new St.Label({text: "Blue "});
        this._blueSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._blueSliderContainer.actor.add(_blueLabel);
        this._blueSliderContainer.actor.add(this._blueSlider.actor, {expand: true});
        this.menu.addMenuItem(this._blueSliderContainer);

        // alpha
        this._alphaSlider = new Slider.Slider(0.5);
        this._alphaSlider.connect('value-changed', Lang.bind(this,this._updateOverlay));
        let _alphaLabel = new St.Label({text: "Alpha"});
        this._alphaSliderContainer = new PopupMenu.PopupBaseMenuItem({activate: false});
        this._alphaSliderContainer.actor.add(_alphaLabel);
        this._alphaSliderContainer.actor.add(this._alphaSlider.actor, {expand: true});
        this.menu.addMenuItem(this._alphaSliderContainer);

        this._updateOverlay();
    },

    _updateOverlay: function () {
        this._setOverlayColor(255 * this._redSlider._getCurrentValue(),
                255 * this._greenSlider._getCurrentValue(),
                255 * this._blueSlider._getCurrentValue(),
                255 * this._alphaSlider._getCurrentValue());
    }
});
