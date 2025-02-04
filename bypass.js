/* 
* This file is part of mathsolver.ext
* Copyright (C) 2025 debxylen
* Licensed under the AGPLv3 License.
*/

(function() {
    const originalStop = Event.prototype.stopImmediatePropagation;

    Event.prototype.stopImmediatePropagation = function() {
        if (this.type === "copy") {
            return;
        }
        originalStop.apply(this, arguments);
    };
})();