Editor.registerWidget( 'editor-prop', {
    is: 'editor-prop',

    behaviors: [EditorUI.focusable],

    listeners: {
        'focus': '_onFocus',
        'blur': '_onBlur',
        'focusin': '_onFocusIn',
        'focusout': '_onFocusOut',
        'mousedown': '_onMouseDown',
        'keydown': '_onKeyDown',
        'disabled-changed': '_onDisabledChanged',
    },

    properties: {
        name: {
            type: String,
            value: '',
        },

        attrs: {
            type: Object,
            value: function () { return {}; },
        },

        value: {
            value: null,
            notify: true,
        },

        slidable: {
            type: Boolean,
            value: false,
            observer: '_slidableChanged',
            reflectToAttribute: true,
        },
    },

    ready: function () {
        this._initFocusable(this);
    },

    _nameText: function ( name, attrs ) {
        if ( attrs && attrs.displayName ) {
            return attrs.displayName;
        }
        else if ( name ) {
            return EditorUI.toHumanText(name);
        }

        return '(Anonymous)';
    },

    _nameClass: function ( name, attrs ) {
        if ( attrs && attrs.displayName ) {
            return 'name flex-1';
        }
        else if ( name ) {
            return 'name flex-1';
        }

        return 'name anonymous flex-1';
    },

    _onFocusIn: function ( event ) {
        this._setFocused(true);
        this.$.field.editing = true;
    },

    _onFocusOut: function ( event ) {
        this._setFocused(false);
        this.$.field.editing = false;
    },

    _onMouseDown: function ( event ) {
        event.preventDefault();
        event.stopPropagation();

        var el = EditorUI.getFirstFocusableChild( this.$.field );
        if ( el )
            el.focus();

        if (typeof(this.value) === 'number' && this.slidable === true) {
            var input = document.getElementsByTagName('editor-unit-input')[0];
            var lastValue = this.value;
            EditorUI.startDrag('ew-resize', event,function (event, dx, dy, offsetx, offsety) {
                this.value = Math.clamp(lastValue + offsetx * input.step,input.min,input.max);
            }.bind(this),null);
        }
    },

    _onFieldMouseDown: function ( event ) {
        event.stopPropagation();
        // don't do any propagation if we mouse down on field
    },

    _onKeyDown: function (event) {
        // enter
        if (event.keyCode === 13) {
            event.preventDefault();
            event.stopPropagation();

            var el = EditorUI.getFirstFocusableChild( this.$.field );
            if ( el )
                el.focus();
        }
    },

    _onDisabledChanged: function ( event ) {
        var children = Polymer.dom(this.$.field).children;
        for ( var i = 0; i < children.length; ++i ) {
            var childEL = children[i];
            if ( childEL.disabled !== undefined ) {
                childEL.disabled = event.detail.value;
            }
        }
    },

    _slidableChanged: function () {
        if ( typeof(this.value) !== 'number' || this.slidable !== true) {
            this.slidable = false;
        }
    },
});
