var Trasys;
(function (Trasys) {
    (function (Signals) {
        var Slot = (function () {
            function Slot(signal, listener, scope, isOnce) {
                if (typeof isOnce === "undefined") { isOnce = false; }
                this.signal = signal;
                this.listener = listener;
                this.scope = scope;
                this.isOnce = isOnce;
            }
            Slot.prototype.execute = function (arg) {
                this.listener.call(this.scope, arg);
            };

            Slot.prototype.equals = function (listener, scope) {
                return this.listener === listener && this.scope === scope;
            };

            Slot.prototype.destroy = function () {
            };
            return Slot;
        })();
        Signals.Slot = Slot;
    })(Trasys.Signals || (Trasys.Signals = {}));
    var Signals = Trasys.Signals;
})(Trasys || (Trasys = {}));
var Trasys;
(function (Trasys) {
    (function (Signals) {
        var TypeSignal = (function () {
            function TypeSignal() {
                this.slots = [];
            }
            TypeSignal.prototype.add = function (listener, scope) {
                if (!this.hasSlot(listener, scope))
                    this.slots.push(new Signals.Slot(this, listener, scope));
                return this;
            };

            TypeSignal.prototype.once = function (listener, scope) {
                if (!this.hasSlot(listener, scope))
                    this.slots.push(new Signals.Slot(this, listener, scope, true));
                return this;
            };

            TypeSignal.prototype.remove = function (listener, scope) {
                return this;
            };

            TypeSignal.prototype.removeAll = function () {
                return this;
            };

            TypeSignal.prototype.fire = function (arg) {
                this.slots.forEach(function (slot) {
                    slot.execute(arg);
                });
                return this;
            };

            TypeSignal.prototype.hasSlot = function (listener, scope) {
                return this.slots.some(function (slot) {
                    return slot.equals(listener, scope);
                });
            };
            return TypeSignal;
        })();
        Signals.TypeSignal = TypeSignal;
    })(Trasys.Signals || (Trasys.Signals = {}));
    var Signals = Trasys.Signals;
})(Trasys || (Trasys = {}));
var Trasys;
(function (Trasys) {
    (function (Signals) {
        var Signal = (function () {
            function Signal() {
                this.wrapped = new Signals.TypeSignal();
            }
            Signal.prototype.add = function (listener, scope) {
                this.wrapped.add(listener, scope);
                return this;
            };

            Signal.prototype.once = function (listener, scope) {
                this.wrapped.once(listener, scope);
                return this;
            };

            Signal.prototype.remove = function (listener, scope) {
                this.wrapped.remove(listener, scope);
                return this;
            };

            Signal.prototype.removeAll = function () {
                this.wrapped.removeAll();
                return this;
            };

            Signal.prototype.fire = function () {
                this.wrapped.fire(true);
                return this;
            };
            return Signal;
        })();
        Signals.Signal = Signal;
    })(Trasys.Signals || (Trasys.Signals = {}));
    var Signals = Trasys.Signals;
})(Trasys || (Trasys = {}));
